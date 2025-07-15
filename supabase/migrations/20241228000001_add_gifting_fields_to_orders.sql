-- Add columns to the orders table to store gifting information directly.
-- This simplifies queries and aligns with the data available at the time of order creation.

ALTER TABLE public.orders
ADD COLUMN recipient_name TEXT,
ADD COLUMN recipient_email TEXT,
ADD COLUMN sender_name TEXT,
ADD COLUMN sender_email TEXT,
ADD COLUMN personal_message TEXT; 