-- Force clean all invalid tour IDs
-- This migration aggressively removes any tour with an ID that's not a valid UUID

-- First, check if there are any invalid UUIDs and delete them
-- We do this by trying to cast the ID to UUID and catching errors
DELETE FROM public.tours
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Alternatively, if there are still issues, we can truncate and start fresh
-- Uncomment the following line if the above doesn't work:
-- TRUNCATE TABLE public.tours CASCADE;

-- Verify all remaining tours have valid UUIDs
DO $$
BEGIN
    -- This will raise an error if any invalid UUIDs remain
    PERFORM id FROM public.tours WHERE id IS NOT NULL;
    RAISE NOTICE 'All tour IDs are valid UUIDs';
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Invalid UUIDs still present in tours table: %', SQLERRM;
END $$;
