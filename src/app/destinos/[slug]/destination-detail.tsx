"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowLeft, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TourCard from '@/components/travelcore/tour-card';
import type { Tour, Destination } from '@/types/database';

interface DestinationDetailProps {
  destination: Destination;
  tours: Tour[];
}

export default function DestinationDetail({ destination, tours }: DestinationDetailProps) {
  return (
    <>
      {/* Hero Section with Destination Image */}
      <section className="relative min-h-[60vh] flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={destination.hero_image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80'}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-tc-purple-deep via-tc-purple-deep/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-20 relative pb-16 pt-32">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link 
              href="/destinos" 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a destinos
            </Link>
          </motion.div>

          {/* Location Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-white/80 mb-4"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{destination.country}</span>
            {destination.region && (
              <>
                <span className="text-white/50">•</span>
                <span className="text-lg">{destination.region}</span>
              </>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6"
          >
            {destination.name}
          </motion.h1>

          {/* Description */}
          {destination.short_description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-white/90 max-w-3xl mb-8"
            >
              {destination.short_description}
            </motion.p>
          )}

          {/* Long Description */}
          {destination.long_description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg text-white/80 max-w-4xl"
            >
              {destination.long_description}
            </motion.p>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-6 mt-8"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <div className="flex items-center gap-2 text-tc-yellow">
                <Calendar className="w-5 h-5" />
                <span className="text-2xl font-bold">{tours.length}</span>
              </div>
              <p className="text-white/70 text-sm mt-1">
                {tours.length === 1 ? 'Tour disponible' : 'Tours disponibles'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tours Section */}
      <section className="py-16 bg-gradient-to-b from-white to-tc-lilac/10">
        <div className="container mx-auto px-4 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-tc-purple-deep mb-4">
              Tours en {destination.name}
            </h2>
            <p className="text-tc-purple-deep/60 text-lg">
              Explora nuestras experiencias cuidadosamente seleccionadas para este destino
            </p>
          </motion.div>

          {tours.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-20 bg-white rounded-2xl border border-tc-purple-light/20"
            >
              <p className="text-tc-purple-deep/60 text-lg mb-6">
                No hay tours disponibles en este destino en este momento.
              </p>
              <Link href="/tours">
                <Button className="gradient-orange text-white rounded-full">
                  Ver todos los tours
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-purple">
        <div className="container mx-auto px-4 lg:px-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-white mb-4"
          >
            ¿No encuentras lo que buscas?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg mb-8 max-w-2xl mx-auto"
          >
            Contáctanos y diseñaremos un tour personalizado para ti en {destination.name}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/contacto">
              <Button className="gradient-orange text-white rounded-full px-8 py-6 text-lg">
                Solicitar tour personalizado
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
