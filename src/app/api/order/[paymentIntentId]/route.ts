import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// This is the canonical, documented way to get route params in the App Router.
// The { params } object is destructured from the second argument.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentIntentId: string }> }
) {
  const { paymentIntentId } = await params;

  // Add clean logging to prove the ID is received correctly.
  console.log(
    `[API GET ORDER] Received request for paymentIntentId: ${paymentIntentId}`
  );

  if (!paymentIntentId) {
    console.error(
      "[API GET ORDER] Aborting: No Payment Intent ID found in params."
    );
    return NextResponse.json(
      { error: "Payment Intent ID is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        created_at,
        total_amount,
        currency,
        status,
        recipient_name,
        recipient_email,
        sender_name,
        sender_email,
        personal_message,
        experiences (
          title,
          description,
          featured_image
        ),
        vouchers (
          code,
          valid_until
        )
      `
      )
      .eq("stripe_payment_intent_id", paymentIntentId)
      .single();

    if (error) {
      console.error(
        `[API GET ORDER] Supabase error for PI_ID ${paymentIntentId}:`,
        error
      );
      return NextResponse.json(
        { message: error.message, details: error.details },
        { status: 500 }
      );
    }

    if (!data) {
      console.error(
        `[API GET ORDER] Order not found in DB for PI_ID ${paymentIntentId}`
      );
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log(
      `[API GET ORDER] Successfully fetched order for PI_ID ${paymentIntentId}`
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      `[API GET ORDER] CATCH BLOCK: Unhandled error for PI_ID ${paymentIntentId}:`,
      error
    );
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
