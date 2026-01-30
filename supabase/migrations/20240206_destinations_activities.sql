-- Add additional fields to destinations table
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.destinations(id) ON DELETE SET NULL;
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS long_description text;

-- Create unique index for slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug) WHERE slug IS NOT NULL;

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text UNIQUE,
    description text,
    icon text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create junction table for tours and destinations (many-to-many)
CREATE TABLE IF NOT EXISTS public.tour_destinations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE,
    destination_id uuid REFERENCES public.destinations(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(tour_id, destination_id)
);

-- Create junction table for tours and activities (many-to-many)
CREATE TABLE IF NOT EXISTS public.tour_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE,
    activity_id uuid REFERENCES public.activities(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(tour_id, activity_id)
);

-- Create indexes for junction tables
CREATE INDEX IF NOT EXISTS idx_tour_destinations_tour ON public.tour_destinations(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_destinations_destination ON public.tour_destinations(destination_id);
CREATE INDEX IF NOT EXISTS idx_tour_activities_tour ON public.tour_activities(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_activities_activity ON public.tour_activities(activity_id);

-- Insert sample activities
INSERT INTO public.activities (name, slug, description, icon) VALUES
('Cultural', 'cultural', 'Tours enfocados en historia, arte y tradiciones locales', 'landmark'),
('Aventura', 'aventura', 'Actividades emocionantes y deportes extremos', 'mountain'),
('Naturaleza', 'naturaleza', 'Exploración de paisajes naturales y vida silvestre', 'trees'),
('Playa', 'playa', 'Destinos costeros y actividades acuáticas', 'umbrella-beach'),
('Historia', 'historia', 'Sitios históricos y arqueológicos', 'scroll'),
('Gastronomía', 'gastronomia', 'Experiencias culinarias y tours de comida', 'utensils'),
('Bienestar', 'bienestar', 'Spa, yoga y retiros de relajación', 'spa'),
('Fotografía', 'fotografia', 'Tours especializados para fotógrafos', 'camera')
ON CONFLICT (name) DO NOTHING;

-- Update existing destinations with slugs
UPDATE public.destinations SET slug = 'madrid' WHERE name = 'Madrid' AND slug IS NULL;
UPDATE public.destinations SET slug = 'paris' WHERE name = 'París' AND slug IS NULL;
UPDATE public.destinations SET slug = 'bogota' WHERE name = 'Bogotá' AND slug IS NULL;
UPDATE public.destinations SET slug = 'galapagos' WHERE name = 'Galápagos' AND slug IS NULL;
UPDATE public.destinations SET slug = 'cusco' WHERE name = 'Cusco' AND slug IS NULL;
UPDATE public.destinations SET slug = 'cancun' WHERE name = 'Cancún' AND slug IS NULL;
UPDATE public.destinations SET slug = 'roma' WHERE name = 'Roma' AND slug IS NULL;
UPDATE public.destinations SET slug = 'orlando' WHERE name = 'Orlando' AND slug IS NULL;
