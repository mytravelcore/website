"use client";

import { Sparkles, Globe, Headphones, Award, Plane, Shield, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Sparkles,
    title: "Viajás Premium",
    description: "Experiencias de lujo a precios accesibles. Hoteles seleccionados, traslados privados y atención personalizada."
  },
  {
    icon: Globe,
    title: "Tecnología que Simplifica",
    description: "Reserva fácil, itinerarios digitales y toda tu información de viaje en un solo lugar."
  },
  {
    icon: Headphones,
    title: "Asistencia Global 24/7",
    description: "Estamos contigo en cada paso. Soporte en español las 24 horas, los 7 días de la semana."
  },
  {
    icon: Award,
    title: "+15 Años de Experiencia",
    description: "Miles de viajeros felices respaldan nuestra trayectoria diseñando aventuras inolvidables."
  }
];

export default function ValueProps() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-tc-lilac/10">
      <div className="container mx-auto px-4 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-tc-orange font-semibold mb-4"
          >
            ¿Por qué elegirnos?
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-tc-purple-deep mb-6"
          >
            Viajar con TravelCore es diferente
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-tc-purple-deep/70 max-w-2xl mx-auto"
          >
            No se trata solo de viajar, se trata de vivir experiencias inolvidables. 
            Diseñamos el tour que sueñas, desde la idea hasta la experiencia.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 h-full border border-tc-purple-light/20 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl gradient-purple flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-tc-purple-deep mb-3">
                  {feature.title}
                </h3>
                <p className="text-tc-purple-deep/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
