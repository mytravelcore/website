-- Add missing tables for tour dates (tour_date_packages and tour_date_blocked_dates)
-- These were referenced in code but dropped in 20240301_clean_schema.sql
-- IMPORTANT: This migration is non-destructive and adds only missing tables

-- ============================================
-- TOUR DATE PACKAGES TABLE (junction between dates and packages)
-- ============================================
CREATE TABLE IF NOT EXISTS public.tour_date_packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_date_id uuid REFERENCES public.tour_dates(id) ON DELETE CASCADE NOT NULL,
    package_id text NOT NULL,
    enabled boolean DEFAULT true,
    price_override numeric(10,2),
    max_pax_override integer,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TOUR DATE BLOCKED DATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tour_date_blocked_dates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_date_package_id uuid REFERENCES public.tour_date_packages(id) ON DELETE CASCADE NOT NULL,
    blocked_date date NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tour_date_packages_tour_date_id ON public.tour_date_packages(tour_date_id);
CREATE INDEX IF NOT EXISTS idx_tour_date_packages_package_id ON public.tour_date_packages(package_id);
CREATE INDEX IF NOT EXISTS idx_tour_date_blocked_dates_package_id ON public.tour_date_blocked_dates(tour_date_package_id);

-- ============================================
-- ENABLE RLS (matching the pattern in clean_schema)
-- ============================================
ALTER TABLE public.tour_date_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_date_blocked_dates ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - Public read, authenticated write
-- ============================================
DROP POLICY IF EXISTS "Tour date packages are viewable by everyone" ON public.tour_date_packages;
CREATE POLICY "Tour date packages are viewable by everyone" ON public.tour_date_packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Tour date packages are insertable by authenticated users" ON public.tour_date_packages;
CREATE POLICY "Tour date packages are insertable by authenticated users" ON public.tour_date_packages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Tour date packages are updatable by authenticated users" ON public.tour_date_packages;
CREATE POLICY "Tour date packages are updatable by authenticated users" ON public.tour_date_packages FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Tour date packages are deletable by authenticated users" ON public.tour_date_packages;
CREATE POLICY "Tour date packages are deletable by authenticated users" ON public.tour_date_packages FOR DELETE USING (true);

DROP POLICY IF EXISTS "Tour date blocked dates are viewable by everyone" ON public.tour_date_blocked_dates;
CREATE POLICY "Tour date blocked dates are viewable by everyone" ON public.tour_date_blocked_dates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Tour date blocked dates are insertable by authenticated users" ON public.tour_date_blocked_dates;
CREATE POLICY "Tour date blocked dates are insertable by authenticated users" ON public.tour_date_blocked_dates FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Tour date blocked dates are updatable by authenticated users" ON public.tour_date_blocked_dates;
CREATE POLICY "Tour date blocked dates are updatable by authenticated users" ON public.tour_date_blocked_dates FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Tour date blocked dates are deletable by authenticated users" ON public.tour_date_blocked_dates;
CREATE POLICY "Tour date blocked dates are deletable by authenticated users" ON public.tour_date_blocked_dates FOR DELETE USING (true);
