"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DestinationCard from './destination-card';
import type { Destination } from '@/types/database';

interface DestinationsShowcaseProps {
  destinations: (Destination & { tour_count?: number })[];
}

export default function DestinationsShowcase({ destinations }: DestinationsShowcaseProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-tc-lilac/10 to-white">
      <div className="container mx-auto px-4 lg:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-tc-orange font-semibold mb-4"
            >
              Destinos
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-tc-purple-deep"
            >
              Nuestros destinos preferidos
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/destinos">
              <Button variant="outline" className="border-tc-purple-deep text-tc-purple-deep hover:bg-tc-purple-deep hover:text-white rounded-full px-6">
                Ver todos los destinos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Destinations Grid - Masonry Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {destinations.slice(0, 8).map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''}
            >
              <DestinationCard 
                destination={destination} 
                tourCount={destination.tour_count || 0}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
