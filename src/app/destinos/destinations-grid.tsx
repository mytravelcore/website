"use client";

import { motion } from 'framer-motion';
import DestinationCard from '@/components/travelcore/destination-card';
import type { Destination } from '@/types/database';

interface DestinationsGridProps {
  destinations: (Destination & { tour_count?: number })[];
}

export default function DestinationsGrid({ destinations }: DestinationsGridProps) {
  // Group destinations by region
  const groupedDestinations = destinations.reduce((acc, dest) => {
    const region = dest.region || 'Otros';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(dest);
    return acc;
  }, {} as Record<string, typeof destinations>);

  const regions = Object.keys(groupedDestinations).sort();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-20">
        {regions.map((region, regionIndex) => (
          <div key={region} className="mb-16 last:mb-0">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl font-bold text-tc-purple-deep mb-8"
            >
              {region}
            </motion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {groupedDestinations[region].map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DestinationCard 
                    destination={destination} 
                    tourCount={destination.tour_count || 0}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {destinations.length === 0 && (
          <div className="text-center py-20">
            <p className="text-tc-purple-deep/60 text-lg">
              No hay destinos disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
