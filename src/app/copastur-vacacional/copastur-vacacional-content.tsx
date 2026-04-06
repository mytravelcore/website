"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Award,
  Star,
  Heart,
  Users,
  Leaf,
  Handshake,
  MapPin,
  MessageCircle,
  CheckCircle,
  Plane,
  Gift,
  Monitor,
} from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/50688888888?text=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20la%20alianza%20Copastur";

const countries = [
  {
    flag: "🇧🇷",
    name: "Brasil",
    cities: "São Paulo, Río de Janeiro, Brasilia, Porto Alegre",
    highlight: false,
  },
  {
    flag: "🇦🇷",
    name: "Argentina",
    cities: "Buenos Aires",
    highlight: false,
  },
  {
    flag: "🇨🇱",
    name: "Chile",
    cities: "Las Condes, Santiago",
    highlight: false,
  },
  {
    flag: "🇨🇴",
    name: "Colombia",
    cities: "Bogotá, Medellín",
    highlight: false,
  },
  {
    flag: "🇲🇽",
    name: "México",
    cities: "Ciudad de México",
    highlight: false,
  },
  { flag: "🇵🇪", name: "Perú", cities: "Lima", highlight: false },
  { flag: "🇺🇾", name: "Uruguay", cities: "Montevideo", highlight: false },
  { flag: "🇵🇾", name: "Paraguay", cities: "Asunción", highlight: false },
  {
    flag: "🇨🇷",
    name: "Costa Rica",
    cities: "Representado por TravelCore",
    highlight: true,
  },
];

const services = [
  {
    icon: Plane,
    title: "Viajes de Placer",
    description:
      "Experiencias de viaje personalizadas con condiciones especiales en aerolíneas, hoteles y más. Acceso a una red global de proveedores premium.",
  },
  {
    icon: Star,
    title: "Goya by Copastur",
    description:
      "Experiencias de lujo curadas para viajeros exigentes. Hoteles boutique, vuelos en clase ejecutiva y atención VIP en cada destino.",
  },
  {
    icon: Gift,
    title: "Viajes de Incentivo",
    description:
      "Programas de viaje diseñados como incentivo para equipos y colaboradores. Motiva a tu equipo con experiencias inolvidables.",
  },
  {
    icon: Monitor,
    title: "Portal de Ocio",
    description:
      "Plataforma donde colaboradores de empresas aliadas acceden a condiciones especiales para viajes personales, con pago a plazos y asesoría experta.",
  },
];

const values = [
  {
    icon: Award,
    title: "Ética",
    description:
      "Integridad, honestidad y transparencia en todos los negocios.",
    color: "from-[#3546A6]/10 to-[#9996DB]/10",
    iconColor: "text-[#3546A6]",
  },
  {
    icon: Star,
    title: "Excelencia",
    description: "Mejores prácticas e innovación constante en cada servicio.",
    color: "from-[#9996DB]/10 to-[#DBBADD]/10",
    iconColor: "text-[#9996DB]",
  },
  {
    icon: Heart,
    title: "Enfoque en el cliente",
    description: "Confianza y respeto del cliente como prioridad absoluta.",
    color: "from-[#DBBADD]/20 to-[#FFE79E]/20",
    iconColor: "text-[#FFA03B]",
  },
  {
    icon: Handshake,
    title: "Alianza",
    description:
      "Valoración de colaboradores y proveedores con política de crecimiento mutuo.",
    color: "from-[#FFE79E]/20 to-[#FFD491]/20",
    iconColor: "text-[#FFA03B]",
  },
  {
    icon: Leaf,
    title: "Sostenibilidad",
    description:
      "Compromiso con recursos naturales, inclusión social y crecimiento sostenible.",
    color: "from-[#3546A6]/10 to-[#9996DB]/10",
    iconColor: "text-[#3546A6]",
  },
];

const stats = [
  { value: "+49", label: "Años de experiencia" },
  { value: "+20", label: "Países LATAM" },
  { value: "150+", label: "Países de cobertura" },
  { value: "500+", label: "Ciudades" },
];

export default function CopasturVacacionalContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=80"
            alt="Viaje de lujo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3546A6]/90 via-[#3546A6]/70 to-[#9996DB]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3546A6]/60 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 lg:px-20 relative z-10 pt-24 pb-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Image
                  src="https://www.copastur.co/wp-content/uploads/2023/01/copastur-logo.png"
                  alt="Copastur"
                  width={80}
                  height={22}
                  className="h-5 w-auto brightness-0 invert"
                />
                <span className="text-white/80 text-sm font-medium">
                  Alianza Oficial
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]"
            >
              TravelCore × Copastur
              <br />
              <span className="text-[#FFD491]">
                Experiencias de Viaje de Clase Mundial
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed mb-10"
            >
              La unión de la atención personalizada de TravelCore con el
              respaldo, la experiencia y la red global de Copastur, líder en
              turismo en Latinoamérica.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/tours">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFA03B] to-[#FFD491] text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-[#FFA03B]/30 text-base"
                >
                  Explorar Tours <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-base"
                >
                  <MessageCircle className="w-5 h-5" /> Hablar con un Asesor
                </motion.button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ¿Quién es Copastur? */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-[#FFA03B] font-semibold text-sm uppercase tracking-wider mb-3 block">
                Nuestro socio estratégico
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3546A6] mb-6 leading-tight">
                ¿Quién es Copastur?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Copastur es una de las agencias de turismo más grandes de
                Latinoamérica con más de{" "}
                <strong className="text-[#3546A6]">49 años en el mercado</strong>
                . Se define como{" "}
                <strong className="text-[#3546A6]">
                  TMC + Travel Tech + Global
                </strong>
                : combina gestión de viajes con innovación tecnológica a escala
                global.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Comprometida con la excelencia y 100% enfocada en innovación,
                Copastur proporciona experiencias únicas e inolvidables para
                viajeros de negocios y placer en toda Latinoamérica.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#3546A6] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    <strong>Misión:</strong> Actuar con excelencia en el
                    servicio de agencia de viajes de negocios y placer,
                    garantizando la creación de valor para clientes, personal y
                    sociedad.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#3546A6] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    <strong>Visión:</strong> Ser la mejor empresa con mayor
                    eficiencia en el segmento de turismo, proporcionando
                    experiencias únicas.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80"
                  alt="Viajes de lujo"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3546A6]/40 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-[#9996DB]/20 p-5 max-w-[200px]">
                <div className="text-3xl font-bold text-[#3546A6]">+49</div>
                <div className="text-gray-500 text-sm mt-1">
                  Años transformando el turismo en LATAM
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* La Alianza */}
      <section className="py-24 bg-gradient-to-br from-[#f8f8ff] to-[#f0f0fa]">
        <div className="container mx-auto px-4 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#FFA03B] font-semibold text-sm uppercase tracking-wider mb-3 block">
              La Unión
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3546A6] mb-4">
              ¿Por qué TravelCore + Copastur?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              TravelCore es el representante oficial de Copastur en
              Centroamérica y el Caribe. Una alianza que combina lo mejor de
              ambos mundos.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Red Global",
                description:
                  "Acceso a una red global de proveedores premium: aerolíneas, hoteles y operadores locales con estándares internacionales.",
                icon: Globe,
                bg: "from-[#3546A6] to-[#4a5bbf]",
              },
              {
                title: "Atención Local",
                description:
                  "La calidez y personalización de un equipo local costarricense que conoce las necesidades del viajero centroamericano.",
                icon: Heart,
                bg: "from-[#9996DB] to-[#DBBADD]",
              },
              {
                title: "Modelo LATAM",
                description:
                  "Socios locales que comparten estándares de servicio y valores, garantizando experiencias consistentes en toda la región.",
                icon: Users,
                bg: "from-[#FFA03B] to-[#FFD491]",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white rounded-3xl p-8 shadow-md border border-[#9996DB]/10 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#3546A6] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Presencia LATAM */}
      <section className="py-24 bg-[#3546A6] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9996DB]/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#FFD491] font-semibold text-sm uppercase tracking-wider mb-3 block">
              Cobertura Regional
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Presencia en Latinoamérica
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              Con +20 países de cobertura, Copastur garantiza una experiencia
              de calidad en cada destino de la región.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((country, i) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`flex items-center gap-4 rounded-2xl p-4 border transition-all ${
                  country.highlight
                    ? "bg-[#FFD491]/20 border-[#FFD491]/50 shadow-lg"
                    : "bg-white/10 border-white/15 hover:bg-white/15"
                }`}
              >
                <span className="text-3xl">{country.flag}</span>
                <div>
                  <div
                    className={`font-bold ${country.highlight ? "text-[#FFD491]" : "text-white"}`}
                  >
                    {country.name}{" "}
                    {country.highlight && (
                      <span className="text-xs bg-[#FFD491]/30 text-[#FFD491] rounded-full px-2 py-0.5 ml-1">
                        TravelCore
                      </span>
                    )}
                  </div>
                  <div className="text-white/60 text-sm">{country.cities}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#FFA03B] font-semibold text-sm uppercase tracking-wider mb-3 block">
              Lo que ofrecemos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3546A6] mb-4">
              Servicios de Viaje de Placer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              A través de la alianza TravelCore × Copastur, tienes acceso a una
              cartera completa de servicios de viaje premium.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-8 rounded-3xl bg-gradient-to-br from-[#f8f8ff] to-white border border-[#9996DB]/15 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3546A6] to-[#9996DB] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#3546A6] mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 bg-gradient-to-br from-[#f8f8ff] to-[#f0f0fa]">
        <div className="container mx-auto px-4 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#FFA03B] font-semibold text-sm uppercase tracking-wider mb-3 block">
              Valores compartidos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3546A6] mb-4">
              Lo que nos une
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              Los valores de Copastur son el fundamento de nuestra alianza y de
              cada experiencia que diseñamos.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-br ${val.color} rounded-3xl p-6 border border-[#9996DB]/15 hover:shadow-md transition-all text-center`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                    <Icon className={`w-6 h-6 ${val.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-[#3546A6] mb-2">{val.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-[#3546A6] via-[#4a5bbf] to-[#9996DB] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFD491]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex justify-center items-center gap-6 mb-8">
              <Image
                src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a383bbc1a0521588f80864.png"
                alt="TravelCore"
                width={120}
                height={34}
                className="h-8 w-auto brightness-0 invert"
              />
              <span className="text-white/40 text-2xl font-bold">×</span>
              <Image
                src="https://www.copastur.co/wp-content/uploads/2023/01/copastur-logo.png"
                alt="Copastur"
                width={120}
                height={34}
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
              ¿Listo para viajar con respaldo mundial?
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-10">
              Combina la cercanía de TravelCore con la potencia global de
              Copastur. Diseñamos tu experiencia perfecta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tours">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFA03B] to-[#FFD491] text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-[#FFA03B]/30 text-base"
                >
                  Explorar Tours <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-base"
                >
                  <MessageCircle className="w-5 h-5" /> Hablar con un Asesor
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
