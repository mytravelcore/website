"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe, Award, Star, Network } from "lucide-react";

interface CopasturBannerProps {
  variant: "vacacional" | "corporativo" | "quienes-somos";
}

const vacacionalData = {
  title: "Respaldados por Copastur",
  subtitle: "Líder en Turismo en Latinoamérica",
  description:
    "Nuestra alianza con Copastur, una de las TMCs más grandes del continente con +49 años de experiencia y presencia en +20 países, nos permite ofrecerte experiencias de viaje de clase mundial con estándares internacionales.",
  bullets: [
    { icon: Award, label: "+49 años de experiencia" },
    { icon: Globe, label: "+20 países en LATAM" },
    { icon: Star, label: "Viajes de alto estándar" },
    { icon: Network, label: "Red global de proveedores premium" },
  ],
  cta: "Conocer más sobre Copastur",
  href: "/copastur-vacacional",
};

const corporativoData = {
  title: "Potenciado por Copastur",
  subtitle: "Tecnología y Escala Global",
  description:
    "Como representantes de Copastur en Centroamérica, combinamos atención local personalizada con la infraestructura tecnológica y la red global de una de las TMCs más grandes de Latinoamérica.",
  bullets: [
    { icon: Star, label: "Tecnología Travel Tech propia" },
    { icon: Globe, label: "Presencia en +20 países" },
    { icon: Award, label: "+49 años en gestión corporativa" },
    { icon: Network, label: "Plataformas integradas de gestión" },
  ],
  cta: "Descubrir nuestras soluciones corporativas",
  href: "/copastur-corporativo",
};

const quienesSomosData = {
  title: "Respaldados por Copastur",
  subtitle: "Parte de una Red Global",
  description:
    "Nuestra alianza estratégica con Copastur, una de las TMCs más grandes de Latinoamérica con +49 años de experiencia, nos da acceso a tecnología de clase mundial, red global de proveedores y estándares internacionales de servicio.",
  bullets: [
    { icon: Award, label: "+49 años de experiencia" },
    { icon: Globe, label: "+20 países en LATAM" },
    { icon: Star, label: "Estándares internacionales" },
    { icon: Network, label: "Red global de proveedores" },
  ],
  cta: "Conocer más sobre Copastur",
  href: "/copastur-vacacional",
};

export default function CopasturBanner({ variant }: CopasturBannerProps) {
  const data =
    variant === "vacacional"
      ? vacacionalData
      : variant === "quienes-somos"
        ? quienesSomosData
        : corporativoData;

  // Dark variant for corporativo and quienes-somos pages (dark theme)
  const isDark = variant === "corporativo" || variant === "quienes-somos";

  if (isDark) {
    return (
      <section className="py-20 relative overflow-hidden">
        {/* Background — dark with subtle purple glow */}
        <div className="absolute inset-0 bg-[#0d0d18]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Subtle purple orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9996DB]/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFD491]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-20 relative">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Partner badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs font-medium tracking-wider uppercase">
                  Alianza Estratégica
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                {data.title}
              </h2>
              <p className="text-xl text-[#FFD491] font-semibold mb-5">
                {data.subtitle}
              </p>
              <p className="text-white/50 text-lg leading-relaxed max-w-2xl mb-8">
                {data.description}
              </p>

              {/* Bullets */}
              <div className="grid grid-cols-2 gap-3 mb-10">
                {data.bullets.map((bullet, i) => {
                  const Icon = bullet.icon;
                  return (
                    <motion.div
                      key={bullet.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#9996DB]/15 border border-[#9996DB]/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#FFD491]" />
                      </div>
                      <span className="text-white/70 text-sm font-medium">
                        {bullet.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <Link href={data.href}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFA03B] to-[#FFD491] text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-[#FFA03B]/20 hover:shadow-xl transition-shadow text-base"
                >
                  {data.cta}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Right — Copastur logo card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex flex-col items-center justify-center gap-6"
            >
              {/* Alliance visual */}
              <div className="relative bg-white/[0.03] backdrop-blur-sm rounded-3xl border border-white/10 p-10 flex flex-col items-center gap-6 min-w-[280px]">
                {/* Subtle glow border */}
                <div className="absolute -inset-px bg-gradient-to-b from-[#9996DB]/20 to-transparent rounded-3xl pointer-events-none" />
                {/* TravelCore logo */}
                <Image
                  src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a383bbc1a0521588f80864.png"
                  alt="TravelCore"
                  width={130}
                  height={36}
                  className="h-9 w-auto brightness-0 invert opacity-80"
                />
                {/* Divider with × */}
                <div className="flex items-center gap-4 w-full">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-white/30 font-bold text-lg">×</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                {/* Copastur logo */}
                <Image
                  src="https://www.copastur.co/wp-content/uploads/2023/01/copastur-logo.png"
                  alt="Copastur"
                  width={140}
                  height={40}
                  className="h-10 w-auto brightness-0 invert opacity-80"
                />
                {/* Tag */}
                <div className="bg-[#FFD491]/10 border border-[#FFD491]/20 rounded-full px-4 py-1.5">
                  <span className="text-[#FFD491] text-xs font-semibold tracking-wide">
                    TMC + Travel Tech + Global
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {[
                  { value: "+49", label: "Años" },
                  { value: "+20", label: "Países" },
                  { value: "150+", label: "Cobertura" },
                  { value: "500+", label: "Ciudades" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.07]"
                  >
                    <div className="text-xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-white/30 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Light/gradient variant for vacacional page
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3546A6] via-[#4a5bbf] to-[#9996DB]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFD491]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="container mx-auto px-4 lg:px-20 relative">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Partner badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-white/60 text-sm font-medium uppercase tracking-wider">
                Alianza Estratégica
              </span>
              <div className="h-px flex-1 max-w-[60px] bg-white/30" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
              {data.title}
            </h2>
            <p className="text-xl text-[#FFD491] font-semibold mb-5">
              {data.subtitle}
            </p>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-8">
              {data.description}
            </p>

            {/* Bullets */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {data.bullets.map((bullet, i) => {
                const Icon = bullet.icon;
                return (
                  <motion.div
                    key={bullet.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#FFD491]" />
                    </div>
                    <span className="text-white/90 text-sm font-medium">
                      {bullet.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <Link href={data.href}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFA03B] to-[#FFD491] text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-[#FFA03B]/30 hover:shadow-xl transition-shadow text-base"
              >
                {data.cta}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Right — Copastur logo card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex flex-col items-center justify-center gap-6"
          >
            {/* Alliance visual */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-10 flex flex-col items-center gap-6 min-w-[280px]">
              {/* TravelCore logo */}
              <Image
                src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a383bbc1a0521588f80864.png"
                alt="TravelCore"
                width={130}
                height={36}
                className="h-9 w-auto brightness-0 invert"
              />
              {/* Divider with × */}
              <div className="flex items-center gap-4 w-full">
                <div className="h-px flex-1 bg-white/30" />
                <span className="text-white/60 font-bold text-lg">×</span>
                <div className="h-px flex-1 bg-white/30" />
              </div>
              {/* Copastur logo */}
              <Image
                src="https://www.copastur.co/wp-content/uploads/2023/01/copastur-logo.png"
                alt="Copastur"
                width={140}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
              {/* Tag */}
              <div className="bg-[#FFD491]/20 border border-[#FFD491]/40 rounded-full px-4 py-1.5">
                <span className="text-[#FFD491] text-xs font-semibold tracking-wide">
                  TMC + Travel Tech + Global
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {[
                { value: "+49", label: "Años" },
                { value: "+20", label: "Países" },
                { value: "150+", label: "Cobertura" },
                { value: "500+", label: "Ciudades" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/15"
                >
                  <div className="text-xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-white/50 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
