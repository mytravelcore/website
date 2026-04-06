"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-tc-lilac/30 via-white to-tc-yellow/20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-tc-orange/20 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-tc-purple-light/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 lg:px-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 md:p-16 shadow-xl border border-tc-purple-light/20"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-tc-orange font-semibold mb-4"
            >
              ¿Listo para la aventura?
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-tc-purple-deep mb-6"
            >
              Tu viaje perfecto,{" "}
              <span className="text-gradient-purple">diseñado por expertos</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-tc-purple-deep/70 mb-10 max-w-2xl mx-auto"
            >
              En TravelCore transformamos tus sueños en itinerarios. 
              Déjanos diseñar una experiencia única para ti. 
              ¿Listo/a para conocer y explorar el mundo?
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/tours">
                <Button 
                  size="lg" 
                  className="gradient-orange text-white border-0 rounded-full px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-tc-orange/30"
                >
                  Explorar Tours
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link href="/contacto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-tc-purple-deep text-tc-purple-deep rounded-full px-8 py-6 text-lg font-semibold hover:bg-tc-purple-deep hover:text-white transition-all"
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Contáctanos
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
