-- Verify down_payment_percentage field in profiles table

-- Check if column exists and its properties
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'down_payment_percentage';

-- Check table constraints
SELECT
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = connamespace
WHERE rel.relname = 'profiles'
AND con.conname LIKE '%down_payment%';

-- Check current values in the table
SELECT 
    id, 
    email, 
    full_name, 
    down_payment_percentage,
    created_at
FROM profiles 
ORDER BY created_at DESC 
LIMIT 10;
