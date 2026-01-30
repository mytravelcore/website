"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Target,
  Eye,
  Heart,
  CheckCircle,
  Globe,
  Headphones,
  User,
  ChevronLeft,
  Zap,
  Shield,
  Award,
  ArrowRight,
} from "lucide-react";
import Footer from "@/components/footer";

// Leadership team members (bigger display)
const leadershipTeam = [
  {
    name: "William Jiménez",
    role: "Gerente General",
    description:
      "Lidera la empresa con pasión, visión estratégica y compromiso con la excelencia en el servicio.",
    image:
      "https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/697abd9a3f6f18d9819440ed.png",
  },
  {
    name: "Adrián Rodríguez",
    role: "Gerente Financiero",
    description:
      "Responsable de la gestión financiera, con liderazgo dedicado y enfoque en el crecimiento",
    image:
      "https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/697abd783f6f18c4b7943e4d.png",
  },
];

// Team members with photos
const teamWithPhotos = [
  {
    name: "Verónica Quesada",
    role: "Supervisora Dpto Vacacional",
    image:
      "https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/697abd78e1783c3747386126.png",
  },
  {
    name: "Daniela Arias",
    role: "Dpto Vacacional",
    image:
      "https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/697abd78266d73acba0f7da9.png",
  },
  {
    name: "Brigette Barboza",
    role: "Dpto Contabilidad",
    image:
      "https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/697abd78e1783c4669386125.png",
  },
  {
    name: "Josué Calderón",
    role: "Dpto Administrativo",
    image:
      "https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/697abd78f215da36bc627aa2.png",
  },
  {
    name: "Gabriela Rivas",
    role: "Servicios Generales",
    image:
      "https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/697abd781fd82760027bc3d3.png",
  },
];

// Team members without photos (placeholders)
const teamWithoutPhotos = [
  {
    name: "Beatriz Urrutia",
    role: "Supervisora Dpto Corporativo",
    placeholder: true,
  },
  {
    name: "Evelyn Padilla",
    role: "Dpto Ventas corporativo",
    placeholder: true,
  },
  {
    name: "María José Delgado",
    role: "Dpto Ventas corporativo",
    placeholder: true,
  },
  {
    name: "María José Fuentes",
    role: "Dpto Postventa",
    placeholder: true,
  },
  {
    name: "Alvaro Calderón",
    role: "Dpto Postventa",
    placeholder: true,
  },
  {
    name: "Ronald Flores",
    role: "T.I",
    placeholder: true,
  },
];

const values = [
  {
    icon: Zap,
    title: "Innovación continua",
    description:
      "Aprovechamos la tecnología para mejorar cada etapa del viaje.",
  },
  {
    icon: Heart,
    title: "Personalización real",
    description: "Diseñamos soluciones a la medida de cada viajero.",
  },
  {
    icon: Shield,
    title: "Confianza y transparencia",
    description: "Operamos con ética y compromiso absoluto.",
  },
  {
    icon: Award,
    title: "Excelencia en el servicio",
    description: "Atención humana + herramientas inteligentes.",
  },
  {
    icon: Globe,
    title: "Sostenibilidad",
    description: "Turismo consciente y responsable.",
  },
];

const services = [
  "Viajes corporativos y de negocios",
  "Viajes de incentivo",
  "Viajes vacacionales",
  "Viajes totalmente a la medida",
  "Organización de eventos corporativos",
  "Emisión de boletos aéreos",
  "Reservas de hoteles y renta de autos",
  "Traslados y logística terrestre",
  "Tarjetas de asistencia y seguros de viaje",
  "Excursiones y tours nacionales e internacionales",
  "Elaboración de políticas de viaje corporativas",
  "Asesoría y trámite de visas",
];

export default function AboutUsSection() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Dark Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#1a1a28]" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-[#9996DB]/10 blur-[200px] pointer-events-none"
          style={{ top: "-20%", right: "-10%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-[#DBBADD]/10 blur-[150px] pointer-events-none"
          style={{ bottom: "-10%", left: "-5%" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-30 p-6">
          <div className="container mx-auto flex items-center justify-between">
            <Link
              href="/portal"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Volver al portal</span>
            </Link>
            <Image
              src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a3842c2e34b77b4a61cef6.png"
              alt="TravelCore"
              width={120}
              height={32}
              className="opacity-80 h-[25px] w-[180px]"
            />
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-20 pt-32">
          <div className="max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-medium tracking-wider uppercase mb-8"
            >
              Nuestra Historia
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]"
            >
              Más de{" "}
              <span className="bg-gradient-to-r from-[#9996DB] via-[#DBBADD] to-[#FFE79E] bg-clip-text text-transparent">
                18 años
              </span>{" "}
              transformando viajes
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/60 leading-relaxed max-w-2xl mb-10"
            >
              En TravelCore diseñamos experiencias de viaje que van más allá de
              una simple reserva. Combinamos experiencia humana con inteligencia
              artificial para ofrecer soluciones personalizadas y confiables.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-12"
            >
              <div>
                <div className="text-4xl font-bold text-white">2006</div>
                <div className="text-sm text-white/40">Fundación</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">150+</div>
                <div className="text-sm text-white/40">Países</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/40">Soporte</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">1000+</div>
                <div className="text-sm text-white/40">Clientes felices</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* History Section */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                De NWQ Travel a{" "}
                <span className="bg-gradient-to-r from-[#9996DB] to-[#DBBADD] bg-clip-text text-transparent">
                  TravelCore
                </span>
              </h2>

              <div className="space-y-6 text-white/60 leading-relaxed">
                <p>
                  Nacimos en{" "}
                  <span className="text-white font-semibold">2006</span> bajo el
                  nombre de <span className="text-white">NWQ Travel</span>,
                  estableciendo nuestra operación en San José, Costa Rica, y
                  consolidándonos como una agencia especializada en viajes
                  corporativos.
                </p>
                <p>
                  A lo largo de nuestra trayectoria hemos acompañado a empresas
                  en la planificación, emisión y control de sus viajes,
                  integrándonos con sus políticas internas y sistemas de
                  gestión.
                </p>
                <p>
                  Hoy evolucionamos como{" "}
                  <span className="text-white font-semibold">TravelCore</span>,
                  una marca que mantiene la esencia del servicio humano
                  personalizado, pero incorpora{" "}
                  <span className="bg-gradient-to-r from-[#9996DB] to-[#FFE79E] bg-clip-text text-transparent font-semibold">
                    tecnología e inteligencia artificial
                  </span>{" "}
                  para elevar la experiencia del cliente.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Timeline visual */}
              <div className="relative">
                {/* Glowing border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9996DB] via-[#DBBADD] to-[#FFE79E] rounded-3xl blur opacity-30" />

                <div className="relative bg-[#12121a] rounded-3xl p-8 border border-white/10">
                  <div className="space-y-6">
                    {[
                      { year: "2006", event: "Fundación como NWQ Travel" },
                      {
                        year: "2010",
                        event: "Expansión a viajes corporativos",
                      },
                      {
                        year: "2015",
                        event: "Cobertura regional Centroamérica",
                      },
                      { year: "2020", event: "Transformación digital" },
                      {
                        year: "2024",
                        event: "Evolución a TravelCore con IA",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.year}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9996DB]/20 to-[#DBBADD]/20 flex items-center justify-center border border-white/10">
                          <span className="text-white font-bold">
                            {item.year}
                          </span>
                        </div>
                        <span className="text-white/70">{item.event}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Gradient Cards */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#9996DB] to-[#a855f7] rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-[#12121a] rounded-3xl p-8 border border-white/10 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9996DB] to-[#a855f7] flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Nuestra Misión
                </h3>
                <p className="text-white/60 leading-relaxed">
                  Diseñamos experiencias de viaje únicas y memorables,
                  combinando el conocimiento humano con el poder de la
                  inteligencia artificial, para brindar a cada cliente
                  soluciones personalizadas, eficientes y accesibles, con un
                  acompañamiento cercano antes, durante y después del viaje.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFA03B] to-[#FFD491] rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-[#12121a] rounded-3xl p-8 border border-white/10 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFA03B] to-[#FFD491] flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Nuestra Visión
                </h3>
                <p className="text-white/60 leading-relaxed">
                  Ser la agencia de viajes líder en Latinoamérica en el uso de
                  inteligencia artificial, transformando la manera en que las
                  personas y las empresas planifican, reservan y disfrutan sus
                  viajes, sin perder el valor del servicio humano y la atención
                  personalizada.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Background gradient orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-[#9996DB]/5 blur-[150px] pointer-events-none"
          style={{ top: "20%", left: "-10%" }}
        />

        <div className="container mx-auto px-6 lg:px-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nuestros Valores
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              En TravelCore cada decisión está guiada por principios claros
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#9996DB]/30 hover:bg-white/[0.04] transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9996DB]/20 to-[#DBBADD]/20 flex items-center justify-center mx-auto mb-4 group-hover:from-[#9996DB]/30 group-hover:to-[#DBBADD]/30 transition-all">
                    <Icon className="w-6 h-6 text-[#9996DB]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Differentiator highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9996DB]/20 via-[#DBBADD]/20 to-[#FFE79E]/20 rounded-2xl blur" />
            <div className="relative bg-[#12121a] rounded-2xl p-6 border border-white/10 text-center">
              <p className="text-white/70 leading-relaxed">
                <span className="text-white font-semibold">
                  Nuestro principal diferenciador
                </span>{" "}
                siempre ha sido la calidad del servicio personalizado de nuestro
                equipo. La incorporación de{" "}
                <span className="bg-gradient-to-r from-[#9996DB] to-[#FFE79E] bg-clip-text text-transparent font-semibold">
                  inteligencia artificial
                </span>{" "}
                potencia ese valor, permitiéndonos ser más eficientes sin perder
                el trato humano.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container mx-auto px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Qué Hacemos
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Ofrecemos una gestión integral de viajes, adaptada a distintos
              perfiles y necesidades
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#9996DB]/20 transition-all"
              >
                <CheckCircle className="w-5 h-5 text-[#9996DB] shrink-0" />
                <span className="text-white/70 text-sm">{service}</span>
              </motion.div>
            ))}
          </div>

          {/* Call center highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#9996DB]/10 to-[#DBBADD]/10 border border-[#9996DB]/20"
          >
            <Headphones className="w-8 h-8 text-[#9996DB]" />
            <p className="text-white/80">
              Contamos con un{" "}
              <span className="text-white font-semibold">
                call center propio
              </span>
              , un gestor interno de solicitudes y{" "}
              <span className="text-white font-semibold">
                servicio de emergencias 24/7
              </span>
              , garantizando acompañamiento constante sin importar el destino.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reach & Technology */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Regional Reach */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05]"
            >
              <Globe className="w-10 h-10 text-[#9996DB] mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">
                Alcance Regional
              </h3>
              <p className="text-white/60 leading-relaxed mb-6">
                Trabajamos con agencias consolidadoras en{" "}
                <span className="text-white">
                  Estados Unidos, Panamá y El Salvador
                </span>
                , lo que nos permite cotizar, emitir boletos y facturar a nivel
                regional.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "USA",
                  "Panamá",
                  "El Salvador",
                  "Costa Rica",
                  "Guatemala",
                ].map((country) => (
                  <span
                    key={country}
                    className="px-3 py-1 rounded-full bg-[#9996DB]/10 text-[#9996DB] text-xs font-medium"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Tech with Human Touch */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-[#9996DB]/10 to-[#DBBADD]/5 border border-[#9996DB]/20"
            >
              <Sparkles className="w-10 h-10 text-[#FFE79E] mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">
                Tecnología con Enfoque Humano
              </h3>
              <p className="text-white/60 leading-relaxed mb-6">
                Creemos que la tecnología no reemplaza al servicio humano, sino
                que lo potencia. Utilizamos herramientas digitales e IA para
                gestionar información, preferencias e historial de viajes.
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/80 text-sm italic">
                  &quot;Nuestro objetivo es simple: que cada viaje sea una
                  experiencia bien planificada, segura y memorable.&quot;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Background gradient */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-[#DBBADD]/5 blur-[200px] pointer-events-none"
          style={{ bottom: "-20%", right: "-10%" }}
        />

        <div className="container mx-auto px-6 lg:px-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Profesionales apasionados comprometidos con hacer realidad tus
              sueños de viaje
            </p>
          </motion.div>

          {/* Leadership Team - Bigger display */}
          <div className="flex flex-wrap justify-center gap-12 mb-16">
            {leadershipTeam.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group text-center"
              >
                {/* Circular photo with animated glow */}
                <div className="relative mx-auto mb-6 w-40 h-40">
                  {/* Animated outer glow */}
                  <motion.div
                    className="absolute -inset-3 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#9996DB] rounded-full blur-xl opacity-50 pointer-events-none"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Inner glowing ring */}
                  <motion.div
                    className="absolute -inset-1.5 bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#c4b5fd] rounded-full opacity-80 pointer-events-none"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Image container */}
                  <div className="absolute inset-0 rounded-full overflow-hidden bg-[#12121a]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                <h4 className="font-semibold text-white text-lg mb-1">
                  {member.name}
                </h4>
                <p className="text-[#9996DB] text-sm font-medium mb-2">
                  {member.role}
                </p>
                {member.description && (
                  <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                    {member.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Team with Photos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            {teamWithPhotos.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group text-center"
              >
                {/* Circular photo with animated glow */}
                <div className="relative mx-auto mb-4 w-28 h-28">
                  {/* Animated outer glow */}
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#9996DB] rounded-full blur-lg opacity-40 pointer-events-none"
                    animate={{
                      opacity: [0.25, 0.5, 0.25],
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                  />

                  {/* Inner glowing ring */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#c4b5fd] rounded-full opacity-70 pointer-events-none"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Image container */}
                  <div className="absolute inset-0 rounded-full overflow-hidden bg-[#12121a]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                <h4 className="font-semibold text-white text-sm mb-1">
                  {member.name}
                </h4>
                <p className="text-[#9996DB] text-xs font-medium">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Team without Photos - Placeholders */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {teamWithoutPhotos.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group text-center"
              >
                {/* Circular placeholder with subtle glow */}
                <div className="relative mx-auto mb-4 w-24 h-24">
                  {/* Subtle glow for placeholders */}
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-[#9996DB]/30 via-[#DBBADD]/30 to-[#9996DB]/30 rounded-full blur-md opacity-40 pointer-events-none" />

                  {/* Image container */}
                  <div className="absolute inset-0 rounded-full overflow-hidden bg-[#12121a] border border-white/5">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#9996DB]/20 to-[#DBBADD]/20">
                      <User className="w-8 h-8 text-[#9996DB]/60" />
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-white/70 text-sm mb-1">
                  {member.name}
                </h4>
                <p className="text-[#9996DB]/70 text-xs font-medium">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container mx-auto px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glowing background */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#9996DB] via-[#DBBADD] to-[#FFE79E] rounded-3xl blur-xl opacity-20" />

            <div className="relative bg-[#12121a] rounded-3xl p-12 border border-white/10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Listo para tu próxima aventura?
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto mb-8">
                Déjanos ayudarte a planificar el viaje de tus sueños. Nuestro
                equipo está listo para atenderte.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/vacacional"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FFA03B] to-[#FFD491] rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Explorar tours
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/corporativo"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Viajes corporativos
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
