"use client";

import { motion } from 'framer-motion';
import DestinationCard from '@/components/travelcore/destination-card';
import type { Destination } from '@/types/database';

interface DestinationsGridProps {
  destinations: (Destination & { tour_count?: number })[];
}

export default function DestinationsGrid({ destinations }: DestinationsGridProps) {
  return (
    <section className="py-16">
      <div className="max-w-[1920px] mx-auto px-8 xl:px-16">
        {/* Simple 4-column grid without categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 8) * 0.1 }}
              className="h-full"
            >
              <DestinationCard 
                destination={destination} 
                tourCount={destination.tour_count || 0}
              />
            </motion.div>
          ))}
        </div>

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
