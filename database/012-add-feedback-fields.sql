-- ============================================================================
-- MIGRATION: Add Feedback Fields to Appointments
-- Description: Permite que clientes avaliem atendimentos concluídos
-- Date: 2025-12-13
-- Version: 1.0.3
-- ============================================================================

-- Adicionar campos de feedback à tabela appointments
ALTER TABLE appointments 
  ADD COLUMN rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ADD COLUMN feedback_comment TEXT CHECK (char_length(feedback_comment) <= 500),
  ADD COLUMN feedback_submitted_at TIMESTAMPTZ,
  ADD COLUMN feedback_requested_at TIMESTAMPTZ;

-- Criar índice para buscar agendamentos com avaliação
CREATE INDEX idx_appointments_rating ON appointments(rating) 
  WHERE rating IS NOT NULL;

-- Criar índice para buscar agendamentos com feedback pendente
CREATE INDEX idx_appointments_feedback_pending ON appointments(user_id, feedback_requested_at)
  WHERE feedback_requested_at IS NOT NULL AND feedback_submitted_at IS NULL;

-- Comentários para documentação
COMMENT ON COLUMN appointments.rating IS 'Avaliação do cliente (1-5 estrelas)';
COMMENT ON COLUMN appointments.feedback_comment IS 'Comentário do cliente sobre o atendimento (max 500 caracteres)';
COMMENT ON COLUMN appointments.feedback_submitted_at IS 'Data e hora em que o cliente enviou a avaliação';
COMMENT ON COLUMN appointments.feedback_requested_at IS 'Data e hora em que a avaliação foi solicitada via WhatsApp';

-- Verificar resultado
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'appointments' 
  AND column_name IN ('rating', 'feedback_comment', 'feedback_submitted_at', 'feedback_requested_at')
ORDER BY ordinal_position;

-- ============================================================================
-- INSTRUÇÕES DE USO:
-- 1. Execute este script no Supabase SQL Editor
-- 2. Verifique se os 4 campos foram criados corretamente
-- 3. Teste inserindo uma avaliação manualmente:
--    UPDATE appointments SET rating = 5, feedback_comment = 'Teste' 
--    WHERE id = 'seu-appointment-id';
-- ============================================================================
