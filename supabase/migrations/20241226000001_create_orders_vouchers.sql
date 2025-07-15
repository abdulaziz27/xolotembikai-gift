-- Create the orders table to store transaction details
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    experience_id uuid REFERENCES public.experiences(id) NOT NULL,
    total_amount numeric(10, 2) NOT NULL,
    currency character varying(3) NOT NULL,
    status text NOT NULL DEFAULT 'pending', -- e.g., pending, paid, failed, refunded
    stripe_payment_intent_id text UNIQUE, -- Can be null initially
    session_id text UNIQUE, -- To link back to Stripe Checkout Session
    is_gift boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.orders IS 'Stores order information related to a purchase.';

-- Create the vouchers table to store generated gift codes
CREATE TABLE IF NOT EXISTS public.vouchers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES public.orders(id) NOT NULL,
    experience_id uuid REFERENCES public.experiences(id) NOT NULL,
    code text UNIQUE NOT NULL,
    status text NOT NULL DEFAULT 'active', -- e.g., active, redeemed, expired
    redeemed_at timestamp with time zone,
    recipient_name text,
    recipient_email text,
    recipient_phone text,
    personal_message text,
    delivery_method text, -- e.g., email, whatsapp, sms
    delivery_scheduled_at timestamp with time zone,
    sent_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.vouchers IS 'Stores unique voucher codes generated after a successful purchase.';

-- Create an index on the voucher code for faster lookups
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON public.vouchers(code);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders."
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

-- Create RLS policies for vouchers (adjust as needed, maybe only accessible via secure functions)
CREATE POLICY "Users can view vouchers from their own orders."
ON public.vouchers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = vouchers.order_id AND orders.user_id = auth.uid()
  )
); 