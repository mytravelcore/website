import { notFound } from 'next/navigation';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TourDetail from "./tour-detail";
import { createClient } from "@/supabase/server";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: tour } = await supabase
    .from('tours')
    .select('title, short_description')
    .eq('slug', params.slug)
    .single();

  if (!tour) {
    return { title: 'Tour no encontrado | TravelCore' };
  }

  return {
    title: `${tour.title} | TravelCore`,
    description: tour.short_description,
  };
}

export default async function TourPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  // Fetch tour with all related data
  const { data: tour, error } = await supabase
    .from('tours')
    .select(`
      *,
      destination:destinations(*)
    `)
    .eq('slug', params.slug)
    .single();

  if (error || !tour) {
    notFound();
  }

  // Fetch pricing packages for this tour
  const { data: packages } = await supabase
    .from('price_packages')
    .select('*')
    .eq('tour_id', tour.id)
    .eq('is_active', true)
    .order('sort_order');

  // Fetch available tour dates with their package mappings
  const { data: tourDates } = await supabase
    .from('tour_dates')
    .select(`
      *,
      date_packages:tour_date_packages(*)
    `)
    .eq('tour_id', tour.id)
    .eq('is_available', true)
    .gte('start_date', new Date().toISOString().split('T')[0])
    .order('start_date');

  // Fetch related tours from same destination
  // Note: filter by status if the column exists, otherwise get all
  const { data: relatedTours } = await supabase
    .from('tours')
    .select(`
      *,
      destination:destinations(*)
    `)
    .eq('destination_id', tour.destination_id)
    .neq('id', tour.id)
    .or('status.is.null,status.eq.published')
    .limit(3);

  // Fetch "También te podría interesar" tours from OTHER destinations
  const { data: suggestedTours } = await supabase
    .from('tours')
    .select(`
      *,
      destination:destinations(*)
    `)
    .neq('destination_id', tour.destination_id)
    .neq('id', tour.id)
    .or('status.is.null,status.eq.published')
    .order('featured', { ascending: false })
    .limit(4);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <TourDetail 
        tour={tour} 
        relatedTours={relatedTours || []} 
        suggestedTours={suggestedTours || []}
        packages={packages || []}
        tourDates={tourDates || []}
      />
      <Footer />
    </div>
  );
}
