import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-tc-purple-deep text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Image
              src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a383bbc1a0521588f80864.png"
              alt="TravelCore"
              width={160}
              height={45}
              className="h-10 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-white/70 mb-6 leading-relaxed">
              Transformamos tus sueños en itinerarios. +15 años diseñando
              experiencias de viaje inolvidables.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/mytravelcore/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-tc-orange transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/MyTravelCore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-tc-orange transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/travelcore/?originalSubdomain=cr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-tc-orange transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Explora</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/tours"
                  className="text-white/70 hover:text-tc-orange transition-colors"
                >
                  Todos los Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/destinos"
                  className="text-white/70 hover:text-tc-orange transition-colors"
                >
                  Destinos
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=Aventura"
                  className="text-white/70 hover:text-tc-orange transition-colors"
                >
                  Tours de Aventura
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=Cultural"
                  className="text-white/70 hover:text-tc-orange transition-colors"
                >
                  Tours Culturales
                </Link>
              </li>
              <li>
                <Link
                  href="/tours?category=Playa"
                  className="text-white/70 hover:text-tc-orange transition-colors"
                >
                  Tours de Playa
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Empresa</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/quienes-somos"
                  className="text-white/70 hover:text-tc-orange transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-white/70 hover:text-tc-orange transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-white/70 hover:text-tc-orange transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-white/70 hover:text-tc-orange transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-tc-orange mt-0.5" />
                <span className="text-white/70">
                  comercial@mytravelcore.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-tc-orange mt-0.5" />
                <span className="text-white/70">+506 4032-9444</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-tc-orange mt-0.5" />
                <span className="text-white/70">San José, Costa Rica</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {currentYear} TravelCore. Todos los derechos reservados.
            </p>
            <p className="text-white/50 text-sm">De la mano con Bralto.io</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
