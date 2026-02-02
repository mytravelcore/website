import { createClient } from "@/supabase/server";
import { notFound } from "next/navigation";
import TourEditPage from "./tour-edit-page";

export async function generateMetadata({ params }: { params: { tourId: string } }) {
  const supabase = await createClient();
  const { data: tour } = await supabase
    .from('tours')
    .select('title')
    .eq('id', params.tourId)
    .single();

  return {
    title: tour ? `Editar: ${tour.title} | Admin` : 'Editar Tour | Admin',
  };
}

export default async function EditTourPage({ params }: { params: { tourId: string } }) {
  const supabase = await createClient();
  
  const { data: tour, error } = await supabase
    .from('tours')
    .select(`
      *,
      destination:destinations(*)
    `)
    .eq('id', params.tourId)
    .single();

  if (error || !tour) {
    notFound();
  }

  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .order('name');

  return <TourEditPage initialTour={tour} destinations={destinations || []} />;
}
