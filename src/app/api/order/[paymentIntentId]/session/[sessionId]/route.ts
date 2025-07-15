import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  request: Request,
  {
    params,
  }: { params: Promise<{ paymentIntentId: string; sessionId: string }> }
) {
  const { paymentIntentId } = await params;

  if (!paymentIntentId) {
    return NextResponse.json(
      { error: "Payment Intent ID is required" },
      { status: 400 }
    );
  }

  try {
    // We query the orders table using the payment intent ID now
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        *,
        experiences (*),
        vouchers (*)
      `
      )
      .eq("stripe_payment_intent_id", paymentIntentId)
      .single();

    if (error) {
      console.error(
        "Supabase error fetching order by payment_intent_id:",
        error
      );
      throw error;
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error(
      `API Error fetching order for payment intent ${paymentIntentId}:`,
      error
    );
    return NextResponse.json(
      {
        error: "Failed to retrieve order details.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
