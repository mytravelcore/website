-- Migration: Add GCS image support to tours, destinations, and activities tables
-- This migration adds columns to store GCS image URLs and paths

-- Tours table
ALTER TABLE IF EXISTS public.tours
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS gallery_image_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gallery_image_storage_paths TEXT[] DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN public.tours.hero_image_url IS 'Public GCS URL for tour hero/banner image';
COMMENT ON COLUMN public.tours.hero_image_storage_path IS 'Internal GCS storage path: /tour/{id}/{uuid}.ext';
COMMENT ON COLUMN public.tours.gallery_image_urls IS 'Array of public GCS URLs for gallery images';
COMMENT ON COLUMN public.tours.gallery_image_storage_paths IS 'Array of internal GCS storage paths';

-- Destinations table
ALTER TABLE IF EXISTS public.destinations
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS gallery_image_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gallery_image_storage_paths TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.destinations.image_url IS 'Public GCS URL for destination main image';
COMMENT ON COLUMN public.destinations.image_storage_path IS 'Internal GCS storage path: /destination/{id}/{uuid}.ext';
COMMENT ON COLUMN public.destinations.gallery_image_urls IS 'Array of public GCS URLs for gallery images';
COMMENT ON COLUMN public.destinations.gallery_image_storage_paths IS 'Array of internal GCS storage paths';

-- Activities table (if exists)
ALTER TABLE IF EXISTS public.activities
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS gallery_image_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gallery_image_storage_paths TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.activities.image_url IS 'Public GCS URL for activity main image';
COMMENT ON COLUMN public.activities.image_storage_path IS 'Internal GCS storage path: /activity/{id}/{uuid}.ext';
COMMENT ON COLUMN public.activities.gallery_image_urls IS 'Array of public GCS URLs for gallery images';
COMMENT ON COLUMN public.activities.gallery_image_storage_paths IS 'Array of internal GCS storage paths';
