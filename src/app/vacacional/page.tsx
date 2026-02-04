import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import SearchSection from "@/components/travelcore/search-section";
import ValueProps from "@/components/travelcore/value-props";
import NewsletterBar from "@/components/travelcore/newsletter-bar";
import FeaturedTours from "@/components/travelcore/featured-tours";
import DestinationsShowcase from "@/components/travelcore/destinations-showcase";
import Testimonials from "@/components/travelcore/testimonials";
import FAQSection from "@/components/travelcore/faq-section";
import CTASection from "@/components/travelcore/cta-section";
import ThreeCardsBanner from "@/components/travelcore/sports-banner";
import { createClient } from "@/supabase/server";

export default async function VacacionalPage() {
  const supabase = await createClient();
  
  // Fetch featured tours with destinations
  const { data: tours } = await supabase
    .from('tours')
    .select(`
      *,
      destination:destinations(*)
    `)
    .eq('featured', true)
    .limit(4);

  // Fetch destinations with tour counts - only featured ones
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_featured', true)
    .limit(8);

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

  // Fetch testimonials
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .limit(3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SearchSection />
      <ValueProps />
      <NewsletterBar />
      <FeaturedTours tours={tours || []} />
      <DestinationsShowcase destinations={destinationsWithCounts} />
      <ThreeCardsBanner />
      <Testimonials testimonials={testimonials || []} />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
