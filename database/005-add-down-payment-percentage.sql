-- Migration: Add down_payment_percentage to profiles table
-- Description: Adds configurable down payment percentage field (FASE 2)
-- Date: 2024-12-12

-- Add down_payment_percentage column with constraint (10-50%)
ALTER TABLE profiles 
ADD COLUMN down_payment_percentage INTEGER DEFAULT 30 
CHECK (down_payment_percentage >= 10 AND down_payment_percentage <= 50);

-- Update existing profiles to have default 30%
UPDATE profiles 
SET down_payment_percentage = 30 
WHERE down_payment_percentage IS NULL;

-- Make column NOT NULL after populating existing rows
ALTER TABLE profiles 
ALTER COLUMN down_payment_percentage SET NOT NULL;

-- Verify the changes
SELECT id, email, full_name, down_payment_percentage 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;
