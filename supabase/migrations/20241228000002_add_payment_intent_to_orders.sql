-- Add the missing payment_intent_id column to the orders table.
-- This column is essential for linking a successful payment via Stripe Elements
-- back to the order record in our database.

ALTER TABLE public.orders
ADD COLUMN payment_intent_id TEXT UNIQUE;

-- We can also add an index to speed up lookups by payment_intent_id.
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON public.orders(payment_intent_id); 