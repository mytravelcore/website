-- Add missing columns to tours table needed by admin panel
-- These columns were in earlier migrations but not in the clean schema

-- Pricing columns
ALTER TABLE tours ADD COLUMN IF NOT EXISTS package_type text DEFAULT 'single';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS primary_price_category text DEFAULT 'Adult';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS price_packages jsonb DEFAULT '[]'::jsonb;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS starting_price_from numeric(10,2);

-- Additional label columns
ALTER TABLE tours ADD COLUMN IF NOT EXISTS destination_name text;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS destination_label text;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS difficulty_label text;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS activities_label text;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS group_size_label text;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS tour_label text;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS age_range text;

-- Accommodation columns
ALTER TABLE tours ADD COLUMN IF NOT EXISTS accommodation jsonb DEFAULT '[]'::jsonb;

-- Addons/Extras columns
ALTER TABLE tours ADD COLUMN IF NOT EXISTS addons jsonb DEFAULT '[]'::jsonb;

-- Reviews columns (for testimonials specific to tour)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS reviews jsonb DEFAULT '[]'::jsonb;

-- Map coordinates
ALTER TABLE tours ADD COLUMN IF NOT EXISTS map_latitude numeric(10,7);
ALTER TABLE tours ADD COLUMN IF NOT EXISTS map_longitude numeric(10,7);
ALTER TABLE tours ADD COLUMN IF NOT EXISTS map_zoom integer DEFAULT 10;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS map_markers jsonb DEFAULT '[]'::jsonb;
