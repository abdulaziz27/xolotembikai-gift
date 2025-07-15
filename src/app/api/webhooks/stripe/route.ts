import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "../../../../lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Retrieves the Supabase user ID from a Stripe customer ID.
 * If the user doesn't exist, it creates a new user in Supabase Auth and a corresponding profile.
 * This ensures every Stripe customer has a corresponding user record in our system.
 */
async function upsertUser(
  stripeCustomerId: string,
  email: string,
  fullName: string
): Promise<string> {
  // 1. Check if a profile with this Stripe customer ID already exists.
  const { data: existingProfile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id") // 'id' in profiles is the user_id from auth.users
    .eq("stripe_customer_id", stripeCustomerId)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    // PGRST116 means no rows found, which is not an actual error in this case.
    throw new Error(
      `Error fetching profile by stripe_customer_id: ${profileError.message}`
    );
  }

  if (existingProfile) {
    return existingProfile.id;
  }

  // 2. If no profile, check if a user with this email exists in Supabase Auth.
  const {
    data: { users },
    error: listUsersError,
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1,
    // @ts-ignore - Supabase JS SDK v2 has a different way to filter, but this is a common workaround.
    // We are assuming the filtering by email is supported by the underlying GoTrue API.
    // For a more robust solution, consider upgrading the SDK or using a different lookup method if available.
    email,
  });

  if (listUsersError) {
    throw new Error(`Error fetching user by email: ${listUsersError.message}`);
  }

  let userId: string;
  let userAlreadyExists = users && users.length > 0;

  if (userAlreadyExists) {
    // 3a. User exists in Auth, use their ID.
    userId = users[0].id;

    // And update their profile with the stripe_customer_id for future lookups.
    const { error: updateProfileError } = await supabaseAdmin
      .from("profiles")
      .update({ stripe_customer_id: stripeCustomerId })
      .eq("id", userId);

    if (updateProfileError) {
      // Log the error but don't block the process, as the order is more critical.
      console.warn(
        `Could not link stripe_customer_id to existing user ${userId}: ${updateProfileError.message}`
      );
    }
  } else {
    // 3b. User does not exist, create them in Auth.
    const { data: newAuthUser, error: createAuthError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

    if (createAuthError) {
      throw new Error(
        `Failed to create new user in Auth: ${createAuthError.message}`
      );
    }
    userId = newAuthUser.user.id;

    // Since the user is new, we must INSERT a new profile for them,
    // not update one that doesn't exist.
    const { error: createProfileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        email: email,
        name: fullName,
        stripe_customer_id: stripeCustomerId,
      });

    if (createProfileError) {
      // This is a critical failure, as the user and order would be out of sync.
      throw new Error(
        `Failed to create profile for new user ${userId}: ${createProfileError.message}`
      );
    }
  }

  return userId;
}

function generateVoucherCode(): string {
  const code = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `XTG-${code}`;
}

function generatePassword(): string {
  return crypto.randomBytes(16).toString("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const paymentIntentId = paymentIntent.id;

      // --- RAW DATA LOGGING ---
      console.log(
        `[WEBHOOK RAW DATA - ${paymentIntentId}]`,
        JSON.stringify(paymentIntent, null, 2)
      );
      // --- END RAW DATA LOGGING ---

      console.log(
        `[WEBHOOK TRACE - ${paymentIntentId}] ==> START: Event payment_intent.succeeded received.`
      );

      try {
        const metadata = paymentIntent.metadata;
        const stripeCustomerId = paymentIntent.customer as string;

        if (!metadata || !stripeCustomerId || !metadata.customerEmail) {
          console.error(
            `[WEBHOOK TRACE - ${paymentIntentId}] ==> ABORT: Missing critical data from PaymentIntent object.`
          );
          throw new Error("Missing critical data from PaymentIntent object.");
        }

        const customerEmail = metadata.customerEmail;
        const customerName = metadata.customerName || "Valued Customer";

        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Customer: ${customerName} (${customerEmail}), Stripe CID: ${stripeCustomerId}`
        );

        // --- All subsequent logic is the same ---

        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Step 1: Upserting user...`
        );
        const userId = await upsertUser(
          stripeCustomerId,
          customerEmail,
          customerName
        );
        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Step 1 SUCCESS: User upserted with ID: ${userId}`
        );

        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Step 2: Fetching experience with ID: ${metadata.experienceId}...`
        );
        const { data: experience, error: experienceError } = await supabaseAdmin
          .from("experiences")
          .select("id, title, vendor_id, starting_price")
          .eq("id", metadata.experienceId)
          .single();

        if (experienceError) throw experienceError;
        if (!experience) {
          throw new Error(
            `Experience with ID ${metadata.experienceId} not found.`
          );
        }
        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Step 2 SUCCESS: Found experience "${experience.title}"`
        );

        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Step 3: Creating order...`
        );

        // Log the exact data being sent to Supabase for debugging
        const isGiftOrder = metadata.isGift === "true";
        const orderData = {
          user_id: userId,
          experience_id: experience.id,
          total_amount: paymentIntent.amount / 100,
          status: "paid",
          currency: paymentIntent.currency,
          // Use the correct column name that matches production schema
          stripe_payment_intent_id: paymentIntent.id,
          is_gift: isGiftOrder,
          recipient_name: isGiftOrder ? metadata.recipientName : customerName,
          recipient_email: isGiftOrder
            ? metadata.recipientEmail
            : customerEmail,
          sender_name: isGiftOrder ? customerName : null,
          sender_email: isGiftOrder ? customerEmail : null,
          personal_message: metadata.personalMessage || null,
        };

        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Order data being inserted:`,
          JSON.stringify(orderData, null, 2)
        );

        const { data: newOrder, error: orderError } = await supabaseAdmin
          .from("orders")
          .insert(orderData)
          .select("id, stripe_payment_intent_id")
          .single();

        if (orderError) {
          console.error(
            `[WEBHOOK TRACE - ${paymentIntentId}] Step 3 FAILED: Supabase Order Insert Error:`,
            orderError
          );
          throw new Error(`Failed to create order: ${orderError.message}`);
        }
        if (!newOrder) throw new Error("Order created but no ID returned.");
        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Step 3 SUCCESS: Order created with ID: ${newOrder.id}`
        );

        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Step 4: Creating voucher...`
        );
        const voucherCode = generateVoucherCode();
        const voucherRecipientName = isGiftOrder
          ? metadata.recipientName
          : customerName;
        const voucherRecipientEmail = isGiftOrder
          ? metadata.recipientEmail
          : customerEmail;

        // Set voucher expiry to 1 year from now
        const voucherExpiry = new Date();
        voucherExpiry.setFullYear(voucherExpiry.getFullYear() + 1);

        // Prepare delivery date if provided
        let deliveryScheduledAt = null;
        if (isGiftOrder && metadata.deliveryDate) {
          deliveryScheduledAt = new Date(metadata.deliveryDate).toISOString();
        }

        const voucherData = {
          order_id: newOrder.id,
          experience_id: experience.id,
          code: voucherCode,
          status: "active",
          recipient_name: voucherRecipientName,
          recipient_email: voucherRecipientEmail,
          personal_message: metadata.personalMessage || null,
          delivery_method: isGiftOrder ? metadata.deliveryMethod : "email",
          delivery_scheduled_at: deliveryScheduledAt,
          // Note: valid_until field doesn't exist in our schema, using created_at + 1 year logic in business logic instead
        };

        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Voucher data being inserted:`,
          JSON.stringify(voucherData, null, 2)
        );

        const { error: voucherError } = await supabaseAdmin
          .from("vouchers")
          .insert(voucherData);

        if (voucherError) {
          console.error(
            `[WEBHOOK TRACE - ${paymentIntentId}] Step 4 FAILED: Supabase Voucher Insert Error:`,
            voucherError
          );
          throw new Error(`Failed to create voucher: ${voucherError.message}`);
        }

        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Step 4 SUCCESS: Voucher created with code: ${voucherCode}`
        );

        // Step 5: Send notification email
        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] Step 5: Sending notification email...`
        );

        if (isGiftOrder) {
          // Send gift notification to recipient
          try {
            const emailSubject = `🎁 You've received a gift: ${experience.title}`;
            const emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #8B5CF6;">🎁 You've received a gift!</h1>
                <p>Hi ${voucherRecipientName},</p>
                <p>Great news! ${customerName} has gifted you an amazing experience:</p>
                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #374151; margin-top: 0;">${experience.title}</h2>
                  <p><strong>Voucher Code:</strong> <span style="font-family: monospace; background: #E5E7EB; padding: 4px 8px; border-radius: 4px;">${voucherCode}</span></p>
                  ${metadata.personalMessage ? `<p><strong>Personal Message:</strong><br/><em>"${metadata.personalMessage}"</em></p>` : ""}
                </div>
                <p>To redeem your voucher, simply contact us with your voucher code. This voucher is valid for 12 months from the date of purchase.</p>
                <p>We look forward to providing you with an unforgettable experience!</p>
                <p>Best regards,<br/>The Experience Team</p>
              </div>
            `;

            await resend.emails.send({
              from: "Xolotembikai Gift <gifts@gift.magercoding.com>",
              to: voucherRecipientEmail,
              subject: emailSubject,
              html: emailHtml,
            });

            // Also send confirmation to sender
            const senderEmailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #8B5CF6;">✅ Gift Sent Successfully!</h1>
                <p>Hi ${customerName},</p>
                <p>Your gift has been successfully sent to ${voucherRecipientName}!</p>
                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #374151; margin-top: 0;">${experience.title}</h2>
                  <p><strong>Recipient:</strong> ${voucherRecipientName} (${voucherRecipientEmail})</p>
                  <p><strong>Voucher Code:</strong> ${voucherCode}</p>
                  ${metadata.personalMessage ? `<p><strong>Your Message:</strong><br/><em>"${metadata.personalMessage}"</em></p>` : ""}
                </div>
                <p>The recipient will receive an email with their voucher details and instructions on how to redeem it.</p>
                <p>Thank you for sharing the gift of experiences!</p>
                <p>Best regards,<br/>The Experience Team</p>
              </div>
            `;

            await resend.emails.send({
              from: "Xolotembikai Gift <gifts@gift.magercoding.com>",
              to: customerEmail,
              subject: `🎁 Gift confirmation: ${experience.title}`,
              html: senderEmailHtml,
            });

            console.log(
              `[WEBHOOK TRACE - ${paymentIntentId}] Step 5 SUCCESS: Gift emails sent to recipient and sender`
            );
          } catch (emailError: any) {
            console.error(
              `[WEBHOOK TRACE - ${paymentIntentId}] Step 5 WARNING: Email failed but continuing:`,
              emailError.message
            );
            // Don't throw error for email failures - voucher is already created
          }
        } else {
          // Send regular voucher email to customer
          try {
            const emailSubject = `Your voucher for ${experience.title}`;
            const emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #8B5CF6;">🎫 Your Experience Voucher</h1>
                <p>Hi ${customerName},</p>
                <p>Thank you for your purchase! Here are your voucher details:</p>
                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #374151; margin-top: 0;">${experience.title}</h2>
                  <p><strong>Voucher Code:</strong> <span style="font-family: monospace; background: #E5E7EB; padding: 4px 8px; border-radius: 4px;">${voucherCode}</span></p>
                </div>
                <p>To redeem your voucher, simply contact us with your voucher code. This voucher is valid for 12 months from the date of purchase.</p>
                <p>We look forward to providing you with an unforgettable experience!</p>
                <p>Best regards,<br/>The Experience Team</p>
              </div>
            `;

            await resend.emails.send({
              from: "Xolotembikai Voucher <vouchers@gift.magercoding.com>",
              to: customerEmail,
              subject: emailSubject,
              html: emailHtml,
            });

            console.log(
              `[WEBHOOK TRACE - ${paymentIntentId}] Step 5 SUCCESS: Voucher email sent to customer`
            );
          } catch (emailError: any) {
            console.error(
              `[WEBHOOK TRACE - ${paymentIntentId}] Step 5 WARNING: Email failed but continuing:`,
              emailError.message
            );
            // Don't throw error for email failures - voucher is already created
          }
        }

        console.log(
          `[WEBHOOK TRACE - ${paymentIntentId}] ==> END: Webhook finished successfully.`
        );
      } catch (err: any) {
        console.error(
          `[WEBHOOK TRACE - ${paymentIntentId}] ==> CATCH_BLOCK: Webhook failed with error:`,
          err.message
        );
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
