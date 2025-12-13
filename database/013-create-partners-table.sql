-- FASE 5: Create partners table for partnership management
-- Partners (Parceiros) are professionals who collaborate on appointments
-- Each partner tracks their repayment history for financial analysis

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Required fields
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty TEXT NOT NULL, -- e.g., "Maquiagem", "Sobrancelha", "Limpeza de Pele", etc
  
  -- Optional fields (same as clients for flexibility)
  email TEXT,
  address TEXT,
  instagram TEXT,
  notes TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own partners
CREATE POLICY "partners_user_isolation" ON partners
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "partners_insert_own" ON partners
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "partners_update_own" ON partners
FOR UPDATE USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "partners_delete_own" ON partners
FOR DELETE USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_partners_is_active ON partners(user_id, is_active);
CREATE INDEX idx_partners_created_at ON partners(user_id, created_at DESC);

-- Verification query
SELECT 'Partners table created successfully' as status;
SELECT COUNT(*) as partners_count FROM partners;
