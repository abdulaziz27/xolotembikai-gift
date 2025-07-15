import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

// This API now ONLY creates a PaymentIntent with the amount.
// It does not need customer details at this stage.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { experienceId, isGift, giftData } = body;

    if (!experienceId) {
      return NextResponse.json(
        { error: "Missing required information: experienceId." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: experience, error: experienceError } = await supabase
      .from("experiences")
      .select("starting_price, currency")
      .eq("id", experienceId)
      .single();

    if (experienceError || !experience) {
      return NextResponse.json(
        { error: "Experience not found." },
        { status: 404 }
      );
    }

    const { starting_price: amount, currency } = experience;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid price for the experience" },
        { status: 400 }
      );
    }

    // Prepare metadata for PaymentIntent
    const metadata: any = {
      experienceId,
      isGift: isGift ? "true" : "false",
    };

    // Add gift-specific metadata if this is a gift purchase
    if (isGift && giftData) {
      metadata.recipientName = giftData.recipientName || "";
      metadata.recipientEmail = giftData.recipientEmail || "";
      metadata.recipientPhone = giftData.recipientPhone || "";
      metadata.personalMessage = giftData.personalMessage || "";
      metadata.deliveryMethod = giftData.deliveryMethod || "";
      metadata.deliveryDate = giftData.deliveryDate || "";
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || "myr",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id, // Also return the ID for the update step
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
