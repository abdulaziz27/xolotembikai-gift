-- Enable Row Level Security (RLS) on the orders and vouchers tables.
-- This fixes the issue where the success page cannot find newly created orders.
-- IMPORTANT: We need to allow access via payment_intent_id for guest checkouts.

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.orders FORCE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers FORCE ROW LEVEL SECURITY;

-- Drop existing policies to replace them with more comprehensive ones
DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
DROP POLICY IF EXISTS "Users can view vouchers from their own orders." ON public.vouchers;

-- Create new RLS policies for orders that allow both authenticated and payment_intent access
CREATE POLICY "Allow order access via payment_intent_id or user ownership"
ON public.orders FOR SELECT
USING (
  -- Allow if user owns the order (authenticated access)
  auth.uid() = user_id 
  OR 
  -- Allow if payment_intent_id is provided (for success page access)
  (payment_intent_id IS NOT NULL AND payment_intent_id != '')
);

-- Create RLS policy for vouchers that allows access via order relationship
CREATE POLICY "Allow voucher access via order relationship"
ON public.vouchers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = vouchers.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR 
      (orders.payment_intent_id IS NOT NULL AND orders.payment_intent_id != '')
    )
  )
);

-- Allow admins to access everything (using the existing is_admin_from_auth function)
CREATE POLICY "Admins can manage all orders"
ON public.orders FOR ALL
USING (is_admin_from_auth());

CREATE POLICY "Admins can manage all vouchers"
ON public.vouchers FOR ALL
USING (is_admin_from_auth()); 