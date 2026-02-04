"use client";

import { motion } from 'framer-motion';
import { Trophy, Music2, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThreeCardsBanner() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-8 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Deportes Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
          >
            <div className="absolute inset-0">
              <img
                src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/6982f79d99f1bfd52d9c8e43.jpg"
                alt="Deportes"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-tc-purple-deep/70 to-tc-purple/90" />
            </div>
            <div className="relative z-10 p-8 h-[400px] flex flex-col justify-end text-white">
              <Trophy className="w-10 h-10 mb-4 text-tc-accent-orange" />
              <h3 className="font-display text-3xl font-bold mb-3">Deportes</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Vive la pasión de los eventos deportivos más emocionantes del mundo con acceso VIP.
              </p>
              <Button
                asChild
                className="bg-white text-tc-purple-deep hover:bg-white/90 w-fit"
              >
                <a 
                  href="https://xportstravel.com/es/agency/XperienceMyTravelCore/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver Más
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Eventos Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"
                alt="Eventos"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-tc-purple-deep/70 to-tc-purple/90" />
            </div>
            <div className="relative z-10 p-8 h-[400px] flex flex-col justify-end text-white">
              <Music2 className="w-10 h-10 mb-4 text-tc-accent-pink" />
              <h3 className="font-display text-3xl font-bold mb-3">Eventos</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Disfruta de conciertos, festivales y experiencias culturales exclusivas alrededor del mundo.
              </p>
              <Button
                asChild
                className="bg-white text-tc-purple-deep hover:bg-white/90 w-fit"
              >
                <a 
                  href="https://travelinconcert.com/es/agency/XperienceMyTravelCore/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver Más
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Circuitos Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80"
                alt="Circuitos por Europa y Asia"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-tc-purple-deep/70 to-tc-purple/90" />
            </div>
            <div className="relative z-10 p-8 h-[400px] flex flex-col justify-end text-white">
              <Globe2 className="w-10 h-10 mb-4 text-tc-accent-yellow" />
              <h3 className="font-display text-3xl font-bold mb-3">Circuitos por Europa y Asia</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Explora destinos increíbles con nuestros circuitos premium guiados por expertos.
              </p>
              <Button
                asChild
                className="bg-white text-tc-purple-deep hover:bg-white/90 w-fit"
              >
                <a 
                  href="https://www.specialtours.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver Más
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
