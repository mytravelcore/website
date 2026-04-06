ALTER TABLE tours ADD COLUMN IF NOT EXISTS use_general_pricing boolean DEFAULT true;

ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS has_price_override boolean DEFAULT false;
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS price_override_config jsonb DEFAULT NULL;
