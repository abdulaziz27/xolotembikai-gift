-- SQL Script to add missing columns to experiences table
-- Run this in Supabase SQL Editor

-- 1. Pricing & Discounts
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS validity_period_months INTEGER DEFAULT 12;

-- 2. Contact Information  
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);

-- 3. FAQs
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]';

-- 4. Badges & Features
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS key_features JSONB DEFAULT '["Instant confirmation", "Free cancellation up to 24h", "Valid for 12 months"]';

-- 5. Gift Card Configuration
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS available_gift_amounts JSONB DEFAULT '[100, 200, 300, 750]';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS redeemable_locations JSONB DEFAULT '[]';

-- 6. Gift Card Benefits & How It Works
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS gift_benefits JSONB DEFAULT '[]';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS how_it_works JSONB DEFAULT '[]';

-- 7. Terms & Conditions
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS terms_conditions JSONB DEFAULT '[]';

-- 8. Default Tab Configuration
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS default_tab VARCHAR(50) DEFAULT 'whats-included';

-- Sample data update for existing experiences
UPDATE experiences 
SET 
  discount_percentage = 25,
  contact_phone = '+60 123 456 789',
  contact_email = 'info@vendor.com',
  faqs = '[
    {"question": "Can I reschedule my appointment?", "answer": "Yes, you can reschedule up to 24 hours before your appointment without any fees."},
    {"question": "What should I bring?", "answer": "Just bring yourself! We provide all spa amenities including robes, slippers, and towels."},
    {"question": "Is there an age restriction?", "answer": "This experience is designed for adults 18 years and older."},
    {"question": "Can I extend my gift card validity?", "answer": "Gift cards are valid for 12 months and cannot be extended beyond this period."}
  ]'::jsonb,
  badges = '[
    {"icon": "Star", "text": "Excellent Rating", "color": "text-yellow-500"},
    {"icon": "Gift", "text": "Instant Delivery", "color": "text-orange-500"},
    {"icon": "Phone", "text": "Mobile Friendly", "color": "text-blue-500"},
    {"icon": "Check", "text": "100% Satisfaction", "color": "text-pink-500"},
    {"icon": "Calendar", "text": "Valid 6-12 Months", "color": "text-red-500"}
  ]'::jsonb,
  redeemable_locations = '[
    {"name": "Spa XYZ - Downtown Plaza", "address": "123 Wellness Boulevard, Downtown"},
    {"name": "Spa XYZ - Marina Bay", "address": "456 Waterfront Drive, Marina"},
    {"name": "Spa XYZ - Orchard Central", "address": "789 Shopping Street, Orchard"},
    {"name": "Spa XYZ - Sentosa Resort", "address": "321 Beach Resort, Sentosa Island"}
  ]'::jsonb,
  terms_conditions = '[
    "Gift cards are valid for 12 months from the date of purchase and cannot be extended.",
    "Appointments must be scheduled in advance and are subject to availability.",
    "Gift cards are non-refundable and cannot be exchanged for cash.",
    "24-hour cancellation policy applies to avoid forfeiture of gift card value.",
    "Gift cards cannot be combined with other offers or promotions.",
    "Lost or stolen gift cards cannot be replaced.",
    "Service gratuities are not included and are at the discretion of the guest."
  ]'::jsonb
WHERE category = 'Wellness';

-- Calculate original_price based on starting_price + discount
UPDATE experiences 
SET original_price = ROUND(starting_price * (100.0 / (100 - COALESCE(discount_percentage, 0))), 2)
WHERE discount_percentage > 0; 