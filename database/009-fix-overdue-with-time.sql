-- ============================================================================
-- MIGRATION: 009-fix-overdue-with-time.sql
-- Purpose: Fix overdue appointments count to consider both date AND time
-- Version: 2.0.1
-- Date: 2025-12-12
-- ============================================================================
-- This migration updates the get_dashboard_metrics RPC function to properly
-- calculate overdue appointments by checking if the scheduled date + time
-- has already passed, not just the date.
-- ============================================================================

-- Drop existing function first
DROP FUNCTION IF EXISTS get_dashboard_metrics(UUID);

-- Recreate with time-aware overdue logic
CREATE OR REPLACE FUNCTION get_dashboard_metrics(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_month_start DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  v_month_end DATE := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  v_result JSONB;
BEGIN
  -- Single table scan with multiple aggregate FILTER clauses
  -- Executes in ~5-10ms vs 8 separate queries at ~50-80ms total
  SELECT jsonb_build_object(
    -- Today's appointments count
    'today_appointments_count',
    COUNT(*) FILTER (WHERE scheduled_date = v_today),
    
    -- Today's pending revenue (appointments today with pending payment)
    'today_revenue_pending',
    COALESCE(
      SUM(
        CASE 
          WHEN scheduled_date = v_today 
            AND payment_total_appointment > total_amount_paid
          THEN (payment_total_appointment - total_amount_paid)
          ELSE 0
        END
      ),
      0
    ),
    
    -- Pending appointments count (status = pending)
    'pending_appointments_count',
    COUNT(*) FILTER (WHERE status = 'pending'),
    
    -- Confirmed appointments this month
    'confirmed_appointments_month_count',
    COUNT(*) FILTER (
      WHERE status = 'confirmed' 
        AND scheduled_date >= v_month_start 
        AND scheduled_date <= v_month_end
    ),
    
    -- Completed appointments this month
    'completed_appointments_month_count',
    COUNT(*) FILTER (
      WHERE status = 'completed' 
        AND scheduled_date >= v_month_start 
        AND scheduled_date <= v_month_end
    ),
    
    -- Pending payments count (confirmed with pending payment)
    'pending_payments_count',
    COUNT(*) FILTER (
      WHERE status = 'confirmed' 
        AND payment_status = 'pending'
    ),
    
    -- Overdue appointments (scheduled in past with time passed, still pending or confirmed)
    'overdue_appointments_count',
    COUNT(*) FILTER (
      WHERE (
        (scheduled_date < v_today)
        OR (scheduled_date = v_today AND scheduled_time < CURRENT_TIME)
      )
      AND status IN ('confirmed', 'pending')
    ),
    
    -- Monthly pending revenue (all pending payments for this month's appointments)
    'monthly_revenue_pending',
    COALESCE(
      SUM(
        CASE 
          WHEN scheduled_date >= v_month_start 
            AND scheduled_date <= v_month_end
            AND payment_total_appointment > total_amount_paid
          THEN (payment_total_appointment - total_amount_paid)
          ELSE 0
        END
      ),
      0
    )
  )
  INTO v_result
  FROM appointments
  WHERE user_id = p_user_id;

  RETURN v_result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_dashboard_metrics(UUID) TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION get_dashboard_metrics IS 'Returns consolidated dashboard metrics with time-aware overdue appointments (date + time check)';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Test the function (replace with your user_id)
-- SELECT get_dashboard_metrics('your-user-id-here');

-- Check for overdue appointments manually
-- SELECT 
--   id,
--   scheduled_date,
--   scheduled_time,
--   status,
--   CASE 
--     WHEN scheduled_date < CURRENT_DATE THEN 'Overdue (past date)'
--     WHEN scheduled_date = CURRENT_DATE AND scheduled_time < CURRENT_TIME THEN 'Overdue (today, past time)'
--     ELSE 'Not overdue'
--   END as overdue_status
-- FROM appointments
-- WHERE user_id = 'your-user-id-here'
--   AND status IN ('confirmed', 'pending')
-- ORDER BY scheduled_date DESC, scheduled_time DESC;
