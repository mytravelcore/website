import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DestinationDetail from "./destination-detail";
import { createClient } from "@/supabase/server";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: destination } = await supabase
    .from('destinations')
    .select('name, short_description')
    .eq('slug', params.slug)
    .single();

  if (!destination) {
    return {
      title: 'Destino no encontrado | TravelCore',
    };
  }

  return {
    title: `${destination.name} | TravelCore`,
    description: destination.short_description || `Descubre los mejores tours en ${destination.name}`,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();
  
  // Fetch the destination by slug
  const { data: destination, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !destination) {
    notFound();
  }

  // Fetch tours for this destination
  const { data: tours } = await supabase
    .from('tours')
    .select(`
      *,
      destination:destinations(*)
    `)
    .eq('destination_id', destination.id)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <Suspense fallback={<div className="py-20 text-center">Cargando...</div>}>
        <DestinationDetail 
          destination={destination} 
          tours={tours || []} 
        />
      </Suspense>

      <Footer />
    </div>
  );
}
