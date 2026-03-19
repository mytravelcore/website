"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Award,
  BarChart3,
  CreditCard,
  Car,
  Smartphone,
  LayoutDashboard,
  Hotel,
  Database,
  Plane,
  Zap,
  MonitorPlay,
  Calendar,
  ShoppingBag,
  ChevronDown,
  MessageCircle,
  CheckCircle,
  Shield,
  Cpu,
  Users,
  Building2,
} from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/50688888888?text=Hola%2C%20quiero%20conocer%20las%20soluciones%20corporativas%20TravelCore%20%C3%97%20Copastur";

const stats = [
  { value: "+49", label: "Años en el mercado" },
  { value: "+20", label: "Países LATAM" },
  { value: "150+", label: "Países" },
  { value: "500+", label: "Ciudades" },
  { value: "24/7", label: "Soporte" },
];

const tools = [
  {
    icon: BarChart3,
    title: "Travel Analytics",
    category: "Datos & Reportes",
    description:
      "Ecosistema de datos e información. Dashboards personalizables con info de viajes, expenses, control de SLA, pasajes no utilizados, NPS. Automatización de reportes. Versión web y móvil.",
  },
  {
    icon: CreditCard,
    title: "Expense Management",
    category: "Control Financiero",
    description:
      "Control de gastos corporativos. Monitoreo de costos, gestión de tarjeta corporativa, anticipo y rendición de cuentas automatizada. Integrado con Travel Analytics para análisis end-to-end del costo por colaborador.",
  },
  {
    icon: Car,
    title: "Movilidad",
    category: "Transporte",
    description:
      "Plataforma que conecta múltiples proveedores de movilidad (Uber, 99 Taxi, cooperativas locales) en una sola herramienta. Integración con OBTs y ERP Connect.",
  },
  {
    icon: Smartphone,
    title: "On the Go (App Móvil)",
    category: "App iOS & Android",
    description:
      "App para iOS y Android. Itinerario, estado de vuelos, lugares cercanos, ubicación del hotel, guía de viaje, realidad aumentada. Para la empresa: tracking de pasajeros, risk manager, notificaciones en tiempo real, monitoreo global (ESOS).",
  },
  {
    icon: LayoutDashboard,
    title: "Travel Hub",
    category: "Portal Unificado",
    description:
      "Portal web que unifica todas las herramientas en un solo lugar. Información del mercado en tiempo real, contactos rápidos, portal de ocio, calendario de eventos, hoteles preferentes, benchmarks.",
  },
  {
    icon: Hotel,
    title: "Sourcing de Hoteles",
    category: "Gestión de Acuerdos",
    description:
      "Gestión completa de acuerdos con hoteles: creación, monitoreo, registro, datos y alertas para verificar cumplimiento de proveedores. Consultoría especializada incluida.",
  },
  {
    icon: Database,
    title: "ERP Connect",
    category: "Integración ERP",
    description:
      "Integración de datos con el ERP del cliente. Flujo de información automatizado respetando LGPD y protección de datos.",
  },
  {
    icon: Plane,
    title: "Gestión de Millas",
    category: "Optimización de Costos",
    description:
      "Reducción de hasta 10% en costos de viajes aéreos corporativos. Gestión segura de millas corporativas con integración automática al OBT.",
  },
  {
    icon: Zap,
    title: "Energy (Offshore)",
    category: "Sector Energético",
    description:
      "Herramienta especializada para el sector energético. Gestión de transporte de tripulaciones offshore, integración con sistemas existentes, operación 24/7.",
  },
  {
    icon: Plane,
    title: "Middle Air",
    category: "Aviación Corporativa",
    description:
      "Gestión de aeronaves corporativas propias. Optimización de rutas, gestión de asientos, check-in, tarjetas de embarque y control de equipajes.",
  },
  {
    icon: MonitorPlay,
    title: "Connect Copastur",
    category: "Eventos Virtuales",
    description:
      "Entorno 3D personalizable para eventos online inmersivos. Eventos híbridos con identidad visual completa, ponencias, chat, exposición de marcas.",
  },
  {
    icon: Calendar,
    title: "Calendario de Eventos",
    category: "Planificación",
    description:
      "Calendario interactivo de eventos que pueden impactar viajes corporativos. Actualización bimestral, integración con Google Maps.",
  },
  {
    icon: ShoppingBag,
    title: "Portal de Ocio",
    category: "Beneficios para Colaboradores",
    description:
      "Extensión de beneficios corporativos a viajes personales de colaboradores. Tienda personalizada, pago con tarjeta personal, asesoría de expertos.",
  },
];

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

const differentiators = [
  {
    icon: Users,
    title: "Consultoría",
    description:
      "Asesoría dedicada, exclusividad en atención y soporte personalizado para tu empresa.",
    gradient: "from-[#3546A6] to-[#4a5bbf]",
  },
  {
    icon: Award,
    title: "Credibilidad",
    description:
      "+49 años en el mercado garantizan seguridad, confianza y trayectoria probada.",
    gradient: "from-[#9996DB] to-[#DBBADD]",
  },
  {
    icon: Cpu,
    title: "Tecnología",
    description:
      "Todo el ecosistema tecnológico de Copastur Labs integrado a tu servicio de viajes.",
    gradient: "from-[#FFA03B] to-[#FFD491]",
  },
];

export default function CopasturCorporativoContent() {
  const [openTool, setOpenTool] = useState<number | null>(null);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0a0a0f]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1800&q=80"
            alt="Viajes corporativos"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-[#3546A6]/40" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-4 lg:px-20 relative z-10 pt-24 pb-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                <Image
                  src="https://www.copastur.co/wp-content/uploads/2023/01/copastur-logo.png"
                  alt="Copastur"
                  width={80}
                  height={22}
                  className="h-5 w-auto brightness-0 invert"
                />
                <span className="text-white/60 text-sm font-medium">
                  Alianza Corporativa
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
              <span className="bg-gradient-to-r from-[#9996DB] via-[#DBBADD] to-[#FFE79E] bg-clip-text text-transparent">
                Gestión Corporativa Inteligente
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed mb-10"
            >
              Lleva los viajes de negocios de tu empresa al siguiente nivel con
              la tecnología, escala y experiencia de Copastur, la TMC líder de
              Latinoamérica.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-10"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center"
                >
                  <div className="text-xl md:text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="#contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFA03B] to-[#FFD491] text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-[#FFA03B]/20 text-base"
                >
                  Solicitar Demo <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-full text-base"
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
                TMC + Travel Tech + Global
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3546A6] mb-6 leading-tight">
                ¿Quién es Copastur?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                Copastur es una{" "}
                <strong className="text-[#3546A6]">
                  TMC + Travel Tech + Global
                </strong>{" "}
                con +49 años de experiencia. Especializada en gestión de viajes
                corporativos, eventos, atención offshore y soluciones
                tecnológicas integradas.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Presencia en +20 países de Latinoamérica con un modelo de
                gestión integrada que forma parte de la{" "}
                <strong className="text-[#3546A6]">Biósfera Copastur</strong>:
                un ecosistema de marcas y soluciones que integra viajes
                corporativos, movilidad, control financiero, eventos, incentivos
                y más.
              </p>
              <div className="space-y-3">
                {[
                  "Gestión de viajes corporativos de extremo a extremo",
                  "Tecnología propia desarrollada por Copastur Labs",
                  "Soporte 24/7 en todos los mercados de LATAM",
                  "Integración con ERPs y plataformas corporativas",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#3546A6] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{point}</span>
                  </div>
                ))}
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
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
                  alt="Gestión corporativa"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3546A6]/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl border border-[#9996DB]/20 p-5 max-w-[200px]">
                <div className="text-3xl font-bold text-[#3546A6]">+49</div>
                <div className="text-gray-500 text-sm mt-1">
                  Años liderando viajes corporativos en LATAM
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* La Alianza Corporativa */}
      <section className="py-24 bg-gradient-to-br from-[#f8f8ff] to-[#f0f0fa]">
        <div className="container mx-auto px-4 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#FFA03B] font-semibold text-sm uppercase tracking-wider mb-3 block">
              Un socio estratégico en la región
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3546A6] mb-4">
              La Alianza Corporativa
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              TravelCore es el brazo operativo de Copastur en Centroamérica y
              Caribe para viajes corporativos.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Socio Único Regional",
                description:
                  "Las empresas de la región obtienen un único socio estratégico para coordinar operaciones de viajes en toda Latinoamérica.",
                gradient: "from-[#3546A6] to-[#4a5bbf]",
              },
              {
                icon: Globe,
                title: "Visibilidad Total",
                description:
                  "Control financiero completo y cumplimiento de políticas corporativas en todos los mercados con reportes en tiempo real.",
                gradient: "from-[#9996DB] to-[#DBBADD]",
              },
              {
                icon: Shield,
                title: "Atención Humanizada",
                description:
                  "Combinamos la eficiencia de la tecnología con atención personalizada de expertos que conocen tu empresa y sus necesidades.",
                gradient: "from-[#FFA03B] to-[#FFD491]",
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
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6`}
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

      {/* Tecnología e Innovación */}
      <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9996DB]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#FFD491] font-semibold text-sm uppercase tracking-wider mb-3 block">
              Copastur Labs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
              Tecnología que Transforma tus Viajes de Negocios
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Copastur desarrolla tecnología propia a través de Copastur Labs,
              un hub de innovación colaborativa que conecta clientes, aliados y
              proveedores en la construcción de soluciones para el mercado de
              viajes corporativos.
            </p>
          </motion.div>

          {/* Tools accordion */}
          <div className="space-y-3 max-w-4xl mx-auto">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              const isOpen = openTool === i;
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-[#9996DB]/40 bg-white/[0.06]"
                      : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left"
                    onClick={() => setOpenTool(isOpen ? null : i)}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen
                          ? "bg-gradient-to-br from-[#9996DB] to-[#DBBADD]"
                          : "bg-white/10"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isOpen ? "text-white" : "text-[#9996DB]"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-white font-semibold">
                          {tool.title}
                        </span>
                        <span className="text-xs bg-white/10 text-white/50 rounded-full px-2.5 py-0.5">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pl-[4.25rem]">
                          <p className="text-white/60 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Copastur Labs */}
      <section className="py-24 bg-gradient-to-br from-[#3546A6] to-[#4a5bbf] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFD491]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-20 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-[#FFD491] font-semibold text-sm uppercase tracking-wider mb-3 block">
                Innovación
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Copastur Labs
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Hub de innovación colaborativa que acelera la evolución del
                concepto Travel Tech conectando clientes, aliados, proveedores y
                empresas.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Cualquier empresa puede utilizar Copastur Labs para desarrollar
                y probar proyectos utilizando tecnologías de vanguardia como Big
                Data, realidad aumentada, inteligencia artificial, metaverso,
                cloud computing y blockchain.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Big Data",
                  "Inteligencia Artificial",
                  "Realidad Aumentada",
                  "Metaverso",
                  "Cloud Computing",
                  "Blockchain",
                ].map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFD491]" />
                    <span className="text-white/80 text-sm font-medium">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                Contribución Social
              </h3>
              <p className="text-white/70 leading-relaxed mb-8">
                Copastur Labs forma nuevos profesionales de tecnología a través
                de alianzas con instituciones educativas y ONGs, creando un
                impacto positivo en la sociedad.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: Cpu,
                    text: "Formación de nuevos profesionales de tecnología",
                  },
                  {
                    icon: Users,
                    text: "Alianzas con instituciones educativas y ONGs",
                  },
                  {
                    icon: Globe,
                    text: "Proyectos de impacto social en toda LATAM",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#FFD491]" />
                      </div>
                      <span className="text-white/80">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Presencia LATAM */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#FFA03B] font-semibold text-sm uppercase tracking-wider mb-3 block">
              Cobertura Regional
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3546A6] mb-4">
              Presencia en Latinoamérica
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Un único socio para gestionar los viajes corporativos de tu
              empresa en toda la región.
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
                    ? "bg-gradient-to-br from-[#3546A6]/5 to-[#9996DB]/10 border-[#9996DB]/40 shadow-md"
                    : "bg-gray-50 border-gray-100 hover:border-[#9996DB]/30 hover:bg-white hover:shadow-sm"
                }`}
              >
                <span className="text-3xl">{country.flag}</span>
                <div>
                  <div
                    className={`font-bold ${country.highlight ? "text-[#3546A6]" : "text-gray-800"}`}
                  >
                    {country.name}{" "}
                    {country.highlight && (
                      <span className="text-xs bg-[#3546A6]/10 text-[#3546A6] rounded-full px-2 py-0.5 ml-1">
                        TravelCore
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm">{country.cities}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciadores */}
      <section className="py-24 bg-gradient-to-br from-[#f8f8ff] to-[#f0f0fa]">
        <div className="container mx-auto px-4 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#FFA03B] font-semibold text-sm uppercase tracking-wider mb-3 block">
              Por qué elegirnos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3546A6] mb-4">
              Nuestros Diferenciadores
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {differentiators.map((diff, i) => {
              const Icon = diff.icon;
              return (
                <motion.div
                  key={diff.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white rounded-3xl p-8 text-center shadow-md border border-[#9996DB]/10 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${diff.gradient} flex items-center justify-center mx-auto mb-6`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#3546A6] mb-3">
                    {diff.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {diff.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Biósfera Copastur */}
      <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3546A6]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="text-[#FFD491] font-semibold text-sm uppercase tracking-wider mb-3 block">
              Ecosistema
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
              Biósfera Copastur
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Un ecosistema de marcas y soluciones que integra viajes
              corporativos, movilidad, control financiero, eventos, incentivos y
              experiencias. Centraliza la gestión de movilidad corporativa con
              eficiencia, seguridad y visibilidad.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Viajes Corporativos", icon: Plane },
              { label: "Movilidad", icon: Car },
              { label: "Control Financiero", icon: CreditCard },
              { label: "Eventos & Incentivos", icon: Award },
              { label: "Experiencias Premium", icon: Award },
              { label: "Travel Tech", icon: Cpu },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.07] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9996DB]/20 to-[#DBBADD]/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#9996DB]" />
                  </div>
                  <span className="text-white/80 font-medium">{item.label}</span>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/40 mt-10 text-sm max-w-xl mx-auto"
          >
            La Biósfera Copastur transforma los viajes en un activo estratégico
            para las operaciones de tu empresa.
          </motion.p>
        </div>
      </section>

      {/* CTA Final */}
      <section
        id="contact"
        className="py-24 bg-gradient-to-br from-[#3546A6] via-[#4a5bbf] to-[#9996DB] relative overflow-hidden"
      >
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
              Transforma los viajes de tu empresa
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-10">
              Con TravelCore y Copastur, tu empresa obtiene tecnología de punta,
              cobertura regional y atención personalizada en un solo socio
              estratégico.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/corporativo#contact-form">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFA03B] to-[#FFD491] text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-[#FFA03B]/30 text-base"
                >
                  Solicitar Demo <ArrowRight className="w-5 h-5" />
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
