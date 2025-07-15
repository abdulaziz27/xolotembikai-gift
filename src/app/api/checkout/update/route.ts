import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId, name, email, experienceId, giftData } = body;

    if (!paymentIntentId || !name || !email || !experienceId) {
      return NextResponse.json(
        { error: "Missing required fields for update." },
        { status: 400 }
      );
    }

    // Find or create a Stripe customer to attach to the payment
    let customer: Stripe.Customer;
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({ email, name });
    }

    // Prepare metadata including gift data if present
    const metadata: any = {
      customerName: name,
      customerEmail: email,
      experienceId: experienceId,
    };

    // Add gift data to metadata if provided
    if (giftData) {
      metadata.isGift = "true";
      metadata.recipientName = giftData.recipientName || "";
      metadata.recipientEmail = giftData.recipientEmail || "";
      metadata.recipientPhone = giftData.recipientPhone || "";
      metadata.personalMessage = giftData.personalMessage || "";
      metadata.deliveryMethod = giftData.deliveryMethod || "";
      metadata.deliveryDate = giftData.deliveryDate || "";
    } else {
      metadata.isGift = "false";
    }

    // Update the PaymentIntent with the final customer ID and crucial metadata
    const updatedPaymentIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      {
        customer: customer.id,
        metadata,
      }
    );

    // Diagnostic check to ensure metadata was applied
    if (updatedPaymentIntent.metadata.experienceId !== experienceId) {
      console.error("[API_UPDATE_ERROR] Metadata mismatch after update.", {
        sent: experienceId,
        received: updatedPaymentIntent.metadata.experienceId,
      });
      throw new Error("Failed to apply payment details on Stripe's end.");
    }

    console.log(
      `[API_UPDATE_SUCCESS] Successfully updated PI: ${paymentIntentId} with metadata.`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error(`[API_UPDATE_FAILED] ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
