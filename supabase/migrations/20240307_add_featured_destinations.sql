-- Add featured flag to destinations table
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for featured destinations
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON public.destinations(is_featured) WHERE is_featured = true;
