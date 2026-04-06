-- Tour Booking System Schema Extension
-- Adds packages, dates, and booking-related tables

-- Add new columns to tours table for booking info
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS subtitle text;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS age_range text;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS destination_label text;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS difficulty_label text;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS activities_label text;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS group_size_label text;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS starting_price_from numeric(10,2);
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';

-- Pricing Packages table
CREATE TABLE IF NOT EXISTS public.pricing_packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE,
    name text NOT NULL,
    package_type text CHECK (package_type IN ('single', 'multiple')),
    primary_category text CHECK (primary_category IN ('adult', 'child')),
    price numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD',
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tour Dates table
CREATE TABLE IF NOT EXISTS public.tour_dates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE,
    start_date date NOT NULL,
    end_date date,
    is_available boolean DEFAULT true,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tour Date Packages mapping table (for price overrides per date)
CREATE TABLE IF NOT EXISTS public.tour_date_packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_date_id uuid REFERENCES public.tour_dates(id) ON DELETE CASCADE,
    package_id uuid REFERENCES public.pricing_packages(id) ON DELETE CASCADE,
    override_price numeric(10,2),
    available_units integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(tour_date_id, package_id)
);

-- Tour Itinerary Items table (normalized version)
CREATE TABLE IF NOT EXISTS public.tour_itinerary_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE,
    day_number integer NOT NULL,
    title text NOT NULL,
    description text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tour Bullets table (includes/excludes)
CREATE TABLE IF NOT EXISTS public.tour_bullets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('include', 'exclude')),
    text text NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pricing_packages_tour_id ON public.pricing_packages(tour_id);
CREATE INDEX IF NOT EXISTS idx_pricing_packages_active ON public.pricing_packages(tour_id, is_active);
CREATE INDEX IF NOT EXISTS idx_tour_dates_tour_id ON public.tour_dates(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_dates_available ON public.tour_dates(tour_id, is_available, start_date);
CREATE INDEX IF NOT EXISTS idx_tour_date_packages_date ON public.tour_date_packages(tour_date_id);
CREATE INDEX IF NOT EXISTS idx_tour_date_packages_package ON public.tour_date_packages(package_id);
CREATE INDEX IF NOT EXISTS idx_tour_itinerary_items_tour ON public.tour_itinerary_items(tour_id, day_number);
CREATE INDEX IF NOT EXISTS idx_tour_bullets_tour ON public.tour_bullets(tour_id, type);

-- Insert sample pricing packages for existing tours
INSERT INTO public.pricing_packages (tour_id, name, package_type, primary_category, price, sort_order)
SELECT t.id, 'Habitación Doble', 'multiple', 'adult', t.price_usd, 1
FROM public.tours t
WHERE t.price_usd IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.pricing_packages (tour_id, name, package_type, primary_category, price, sort_order)
SELECT t.id, 'Habitación Individual', 'single', 'adult', t.price_usd * 1.3, 2
FROM public.tours t
WHERE t.price_usd IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert sample tour dates for existing tours (next 3 months)
INSERT INTO public.tour_dates (tour_id, start_date, end_date, is_available)
SELECT 
    t.id,
    (CURRENT_DATE + (n * 14))::date as start_date,
    (CURRENT_DATE + (n * 14) + t.duration_days)::date as end_date,
    true
FROM public.tours t
CROSS JOIN generate_series(1, 6) as n
WHERE t.duration_days IS NOT NULL
ON CONFLICT DO NOTHING;

-- Enable realtime for the new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.pricing_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tour_dates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tour_date_packages;
