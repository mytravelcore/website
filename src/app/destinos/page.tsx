import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DestinationsGrid from "./destinations-grid";
import { createClient } from "@/supabase/server";

export const metadata = {
  title: 'Destinos | TravelCore',
  description: 'Explora nuestros destinos y encuentra tu próxima aventura.',
};

export default async function DestinosPage() {
  const supabase = await createClient();
  
  // Fetch all destinations
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .order('name');

  // Get tour counts per destination
  const destinationsWithCounts = await Promise.all(
    (destinations || []).map(async (dest) => {
      const { count } = await supabase
        .from('tours')
        .select('*', { count: 'exact', head: true })
        .eq('destination_id', dest.id);
      return { ...dest, tour_count: count || 0 };
    })
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 gradient-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 lg:px-20 relative">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
            Nuestros Destinos
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Desde las playas del Caribe hasta las montañas de los Andes, 
            descubre los destinos más increíbles del mundo.
          </p>
        </div>
      </section>

      <DestinationsGrid destinations={destinationsWithCounts} />

      <Footer />
    </div>
  );
}
