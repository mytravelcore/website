import { Suspense } from 'react';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ToursContent from "./tours-content";
import { createClient } from "@/supabase/server";

export const metadata = {
  title: 'Tours | TravelCore',
  description: 'Explora nuestros tours y encuentra tu próxima aventura.',
};

export default async function ToursPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  
  // Fetch all destinations for filters
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .order('name');

  // Build query based on filters
  let query = supabase
    .from('tours')
    .select(`
      *,
      destination:destinations(*)
    `)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  // Apply filters
  const destinationFilter = searchParams.destination as string;
  const categoryFilter = searchParams.category as string;
  const difficultyFilter = searchParams.difficulty as string;

  if (destinationFilter) {
    query = query.eq('destination_id', destinationFilter);
  }
  if (categoryFilter) {
    query = query.eq('category', categoryFilter);
  }
  if (difficultyFilter) {
    query = query.eq('difficulty', difficultyFilter);
  }

  const { data: tours } = await query;

  // Get unique categories from tours
  const categories = Array.from(new Set((tours || []).map(t => t.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 gradient-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 lg:px-20 relative">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
            Explora Nuestros Tours
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Descubre experiencias únicas diseñadas para crear recuerdos inolvidables. 
            Desde aventuras culturales hasta escapadas de playa.
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="py-20 text-center">Cargando tours...</div>}>
        <ToursContent 
          tours={tours || []} 
          destinations={destinations || []}
          categories={categories as string[]}
          currentFilters={{
            destination: destinationFilter,
            category: categoryFilter,
            difficulty: difficultyFilter,
          }}
        />
      </Suspense>

      <Footer />
    </div>
  );
}
