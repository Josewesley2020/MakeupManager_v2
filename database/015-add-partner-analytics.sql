-- FASE 5: Create partner analytics view for financial reporting
-- Aggregates partnership repayments by partner and period
-- Used for FASE 6: Partnership reporting and history

CREATE OR REPLACE VIEW partner_repayment_summary AS
SELECT
  p.id as partner_id,
  p.name as partner_name,
  p.specialty,
  a.user_id,
  DATE_TRUNC('month', a.scheduled_date)::DATE as period,
  COUNT(*) as appointment_count,
  SUM(a.partner_repayment)::DECIMAL(10, 2) as total_repaid,
  SUM(a.payment_total_appointment - a.partner_repayment)::DECIMAL(10, 2) as professional_earning
FROM appointments a
LEFT JOIN partners p ON a.partner_id = p.id
WHERE a.is_partnership = true 
  AND a.status IN ('completed', 'cancelled')
  AND a.scheduled_date IS NOT NULL
GROUP BY p.id, p.name, p.specialty, a.user_id, DATE_TRUNC('month', a.scheduled_date)
ORDER BY a.user_id, period DESC, total_repaid DESC;

-- View for per-partner lifetime summary
CREATE OR REPLACE VIEW partner_lifetime_stats AS
SELECT
  p.id as partner_id,
  p.name as partner_name,
  p.specialty,
  p.phone,
  p.email,
  a.user_id,
  COUNT(*) as total_appointments,
  SUM(a.partner_repayment)::DECIMAL(10, 2) as lifetime_repaid,
  AVG(a.rating)::DECIMAL(3, 2) as average_rating,
  COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_count,
  MAX(a.scheduled_date) as last_appointment_date
FROM appointments a
INNER JOIN partners p ON a.partner_id = p.id
WHERE a.is_partnership = true
GROUP BY p.id, p.name, p.specialty, p.phone, p.email, a.user_id
ORDER BY a.user_id, lifetime_repaid DESC;

-- Verification query
SELECT 'Partner analytics views created successfully' as status;
