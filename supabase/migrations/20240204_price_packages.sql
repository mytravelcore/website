ALTER TABLE tours ADD COLUMN IF NOT EXISTS package_type text DEFAULT 'single';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS primary_price_category text DEFAULT 'Adult';
ALTER TABLE tours ADD COLUMN IF NOT EXISTS price_packages jsonb DEFAULT '[]'::jsonb;
