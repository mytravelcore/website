"use client";

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo funciona el proceso de reserva?",
    answer: "Es muy sencillo. Primero, explora nuestros tours y elige el que más te guste. Luego, haz clic en 'Reservar' o 'Más información' para contactarnos. Uno de nuestros asesores te guiará en todo el proceso, desde la selección de fechas hasta el pago y la confirmación."
  },
  {
    question: "¿Qué incluyen los precios de los tours?",
    answer: "Cada tour detalla específicamente qué está incluido y qué no. Generalmente incluimos alojamiento, traslados, tours guiados y algunas comidas. Los vuelos internacionales, propinas y gastos personales suelen estar excluidos, pero siempre lo especificamos claramente."
  },
  {
    question: "¿Puedo personalizar un tour?",
    answer: "¡Por supuesto! Todos nuestros tours pueden adaptarse a tus necesidades. Podemos ajustar fechas, agregar noches adicionales, cambiar categoría de hoteles o incluir actividades especiales. Contáctanos y diseñamos juntos tu viaje perfecto."
  },
  {
    question: "¿Qué pasa si necesito cancelar mi viaje?",
    answer: "Entendemos que pueden surgir imprevistos. Nuestras políticas de cancelación varían según el tour y la anticipación. Te recomendamos revisar los términos específicos de cada tour y considerar un seguro de viaje para mayor tranquilidad."
  },
  {
    question: "¿Ofrecen asistencia durante el viaje?",
    answer: "Sí, contamos con asistencia 24/7 durante todo tu viaje. Tendrás un número de emergencia y acceso a nuestro equipo en español para cualquier situación que pueda surgir. Tu seguridad y tranquilidad son nuestra prioridad."
  },
  {
    question: "¿Cuáles son las formas de pago?",
    answer: "Aceptamos múltiples formas de pago: tarjetas de crédito/débito, transferencias bancarias y pagos en cuotas según el tour. Generalmente solicitamos un depósito inicial para confirmar la reserva y el saldo se paga antes del viaje."
  }
];

export default function FAQSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-tc-orange font-semibold mb-4"
            >
              Preguntas Frecuentes
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-tc-purple-deep mb-6"
            >
              ¿Tienes dudas?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-tc-purple-deep/70"
            >
              Aquí respondemos las preguntas más comunes de nuestros viajeros.
            </motion.p>
          </div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-tc-lilac/10 rounded-xl border border-tc-purple-light/20 px-6 data-[state=open]:bg-tc-lilac/20"
                >
                  <AccordionTrigger className="text-left font-semibold text-tc-purple-deep hover:text-tc-orange hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-tc-purple-deep/70 pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
