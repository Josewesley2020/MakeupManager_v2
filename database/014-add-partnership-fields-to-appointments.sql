-- FASE 5: Add partnership fields to appointments table
-- Tracks which partner collaborated on an appointment and their financial share

ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS is_partnership BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS partner_repayment DECIMAL(10, 2) DEFAULT 0;

-- Add constraint: repayment cannot be negative
ALTER TABLE appointments
ADD CONSTRAINT check_partner_repayment_positive 
CHECK (partner_repayment >= 0);

-- Add constraint: repayment cannot exceed total appointment value
ALTER TABLE appointments
ADD CONSTRAINT check_partner_repayment_limit
CHECK (partner_repayment <= payment_total_appointment);

-- Index for partnership queries
CREATE INDEX IF NOT EXISTS idx_appointments_partner_id ON appointments(partner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_is_partnership ON appointments(user_id, is_partnership);

-- Verification queries
SELECT 'Partnership fields added to appointments' as status;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'appointments' 
AND column_name IN ('is_partnership', 'partner_id', 'partner_repayment');
