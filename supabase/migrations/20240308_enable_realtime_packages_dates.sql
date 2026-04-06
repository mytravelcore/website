-- Enable realtime for price_packages and tour_dates tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'price_packages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.price_packages;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'tour_dates'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tour_dates;
  END IF;
END $$;
