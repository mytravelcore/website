CREATE TABLE IF NOT EXISTS tour_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  starting_date date NOT NULL,
  cutoff_days int DEFAULT 0,
  max_pax int,
  repeat_enabled boolean DEFAULT false,
  repeat_pattern text,
  repeat_until date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tour_date_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_date_id uuid REFERENCES tour_dates(id) ON DELETE CASCADE NOT NULL,
  package_id text NOT NULL,
  enabled boolean DEFAULT true,
  price_override numeric,
  max_pax_override int,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tour_date_blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_date_package_id uuid REFERENCES tour_date_packages(id) ON DELETE CASCADE NOT NULL,
  blocked_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tour_dates_tour_id ON tour_dates(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_date_packages_tour_date_id ON tour_date_packages(tour_date_id);
CREATE INDEX IF NOT EXISTS idx_tour_date_blocked_dates_package_id ON tour_date_blocked_dates(tour_date_package_id);
