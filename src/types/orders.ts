import type { Experience } from "./experiences";

export interface Order extends Record<string, unknown> {
  id: string;
  user_id: string;
  experience_id: string;
  total_amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  stripe_payment_intent_id: string;
  created_at: string;
  experiences?: Experience; // Relation
  vouchers?: Voucher[]; // Relation
}

export interface Voucher extends Record<string, unknown> {
  id: string;
  order_id: string;
  experience_id: string;
  code: string;
  status: "active" | "redeemed" | "expired";
  redeemed_at?: string;
  recipient_name?: string;
  recipient_email?: string;
  recipient_phone?: string;
  personal_message?: string;
  delivery_method?: "email" | "whatsapp" | "sms";
  delivery_scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

// Keep the old Order type for other parts of the app that might use it.
// We can refactor this later.
export interface SimpleOrder extends Record<string, unknown> {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  experience_title: string;
  total_amount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  order_date: string;
  experience_date?: string;
  participants: number;
}
