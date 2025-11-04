-- AlterTable: Remove unique constraint from categories.name
-- This allows categories to have duplicate names under different parent categories
-- Only slug needs to remain unique

-- Find and drop the unique constraint on name
-- First, check if the constraint exists (PostgreSQL automatically creates unique indexes for unique constraints)
DO $$ 
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the unique constraint/index on the name column
    SELECT indexname INTO constraint_name
    FROM pg_indexes
    WHERE tablename = 'categories' 
    AND indexdef LIKE '%UNIQUE%'
    AND indexdef LIKE '%name%'
    LIMIT 1;
    
    -- Drop the constraint if it exists
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(constraint_name);
    END IF;
END $$;
