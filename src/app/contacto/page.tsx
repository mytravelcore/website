import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ContactForm from "./contact-form";
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Contacto | TravelCore',
  description: 'Contáctanos para planificar tu próximo viaje.',
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 gradient-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 lg:px-20 relative">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            ¿Listo para tu próxima aventura? Estamos aquí para ayudarte a 
            diseñar el viaje de tus sueños.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-3xl font-bold text-tc-purple-deep mb-6">
                Hablemos de tu viaje
              </h2>
              <p className="text-tc-purple-deep/70 mb-8 leading-relaxed">
                En TravelCore transformamos tus sueños en itinerarios. 
                Cuéntanos qué destino tienes en mente y diseñaremos juntos 
                una experiencia inolvidable.
              </p>

              {/* Contact Methods */}
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-tc-purple-deep mb-1">Email</h3>
                    <a href="mailto:comercial@mytravelcore.com" className="text-tc-purple-deep/70 hover:text-tc-orange transition-colors">
                      comercial@mytravelcore.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-tc-purple-deep mb-1">Teléfono</h3>
                    <a href="tel:+50640329444" className="text-tc-purple-deep/70 hover:text-tc-orange transition-colors">
                      +506 4032-9444
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-tc-purple-deep mb-1">Ubicación</h3>
                    <p className="text-tc-purple-deep/70">
                      San José, Costa Rica
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-tc-lilac/20 rounded-2xl p-6 border border-tc-purple-light/20">
                <h3 className="font-display text-xl font-bold text-tc-purple-deep mb-2">
                  ¿Prefieres WhatsApp?
                </h3>
                <p className="text-tc-purple-deep/70 mb-4">
                  Escríbenos directamente y te responderemos en minutos.
                </p>
                <Link 
                  href="https://wa.me/1234567890?text=Hola,%20quiero%20información%20sobre%20tours"
                  target="_blank"
                >
                  <Button className="gradient-orange text-white border-0 rounded-full">
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Chatear por WhatsApp
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl border border-tc-purple-light/20 shadow-xl p-8">
                <h2 className="font-display text-2xl font-bold text-tc-purple-deep mb-6">
                  Envíanos un mensaje
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
