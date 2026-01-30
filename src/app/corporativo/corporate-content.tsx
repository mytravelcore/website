"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Globe,
  Shield,
  ChevronLeft,
  Volume2,
  VolumeX,
  MessageCircle,
  Play,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Gestión Centralizada",
    description:
      "Control total de los viajes corporativos desde una sola plataforma.",
  },
  {
    icon: Users,
    title: "Atención Personalizada",
    description: "Asesores dedicados para tu empresa 24/7.",
  },
  {
    icon: Globe,
    title: "Cobertura Global",
    description: "Presencia en más de 150 países y 500 ciudades.",
  },
  {
    icon: Shield,
    title: "Políticas de Viaje",
    description: "Cumplimiento automático de políticas corporativas.",
  },
];

export default function CorporateContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

  // Load Bralto form embed script on component mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.bralto.io/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  const startVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setVideoStarted(true);
    }
  };

  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setVideoEnded(false);
      setVideoStarted(true);
    }
  };

  return (
    <div className="bg-[#0a0a0f]">
      {/* Dark Hero Section with Video */}
      <section className="relative py-20">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#1a1a28] pointer-events-none" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
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
            <div className="flex items-center gap-6">
              <Link
                href="/quienes-somos"
                className="text-white/50 hover:text-white transition-colors text-sm font-medium"
              >
                Sobre nosotros
              </Link>
              <Image
                src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a3842c2e34b77b4a61cef6.png"
                alt="TravelCore"
                width={120}
                height={32}
                className="opacity-80 h-[25px] w-[180px]"
              />
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 pt-28 pb-12 flex items-center">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-center">
              {/* Left side - Text content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-medium tracking-wider uppercase mb-8">
                  Soluciones Corporativas
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
                  Viajes de negocios{" "}
                  <span className="bg-gradient-to-r from-[#9996DB] via-[#DBBADD] to-[#FFE79E] bg-clip-text text-transparent">
                    inteligentes
                  </span>
                </h1>
                <p className="text-lg text-white/50 leading-relaxed max-w-lg mb-8">
                  Lleva la gestión de viajes de tu empresa al siguiente nivel
                  con tecnología de punta y atención personalizada.
                </p>

                {/* Stats */}
                <div className="flex gap-8 mt-10">
                  <div>
                    <div className="text-3xl font-bold text-white">150+</div>
                    <div className="text-sm text-white/40">Países</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">500+</div>
                    <div className="text-sm text-white/40">Ciudades</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">24/7</div>
                    <div className="text-sm text-white/40">Soporte</div>
                  </div>
                </div>
              </motion.div>

              {/* Right side - Featured Video */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Video container with glowing purple/violet border */}
                <div className="relative group z-20">
                  {/* Animated outer glow - purple/violet */}
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#9996DB] rounded-3xl blur-xl opacity-50 pointer-events-none"
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Inner glowing border - purple/violet */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#c4b5fd] rounded-2xl opacity-80 pointer-events-none"
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

                  {/* Video wrapper */}
                  <div className="relative rounded-2xl overflow-hidden bg-[#0a0a0f]">
                    <video
                      ref={videoRef}
                      muted={isMuted}
                      playsInline
                      onEnded={handleVideoEnded}
                      className="w-full aspect-video object-cover lg:min-w-[600px] xl:min-w-[700px]"
                    >
                      <source
                        src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/6968607125c12a6ad2196b3e.mp4"
                        type="video/mp4"
                      />
                    </video>

                    {/* Play button overlay - before video starts */}
                    {!videoStarted && !videoEnded && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent cursor-pointer"
                        onClick={startVideo}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Centered container for play button and text */}
                        <div className="flex flex-col items-center justify-center">
                          {/* Animated play button */}
                          <motion.div
                            className="relative flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Pulsing ring animation */}
                            <motion.div
                              className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#a855f7]"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.6, 0, 0.6],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            <motion.div
                              className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-[#a855f7] to-[#c084fc]"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.4, 0, 0.4],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.3,
                              }}
                            />
                            {/* Main play button */}
                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] flex items-center justify-center shadow-lg shadow-purple-500/30">
                              <Play className="w-10 h-10 text-white fill-white ml-1" />
                            </div>
                          </motion.div>
                          {/* Text prompt */}
                          <motion.p
                            className="mt-6 text-white text-lg font-medium text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            Descubre nuestra historia
                          </motion.p>
                          <motion.p
                            className="text-white/60 text-sm mt-1 text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            Haz clic para reproducir
                          </motion.p>
                        </div>
                      </motion.div>
                    )}

                    {/* Video ended overlay with CTA */}
                    {videoEnded && (
                      <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.button
                          onClick={() =>
                            (window.location.href = "#contact-form")
                          }
                          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <MessageCircle className="w-5 h-5" />
                          Hablemos
                        </motion.button>
                        <button
                          onClick={replayVideo}
                          className="mt-4 text-white/60 hover:text-white text-sm underline transition-colors"
                        >
                          Ver de nuevo
                        </button>
                      </motion.div>
                    )}

                    {/* Mute/Unmute button - only visible when video is playing */}
                    {videoStarted && !videoEnded && (
                      <motion.button
                        onClick={toggleMute}
                        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-black/70 transition-colors z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white" />
                        )}
                      </motion.button>
                    )}
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    className="absolute -bottom-4 -left-4 bg-gradient-to-r from-[#9996DB] to-[#DBBADD] rounded-xl px-4 py-2 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <span className="text-sm font-semibold text-white">
                      Experiencia Premium
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Animated gradient orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-[#9996DB]/5 blur-[150px] pointer-events-none"
          style={{ top: "10%", right: "-10%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </section>
      {/* Features Section - Dark theme */}
      <section className="py-24 bg-[#0a0a0f] relative">
        {/* Subtle top border glow */}
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
              ¿Por qué elegirnos?
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Optimiza costos, ahorra tiempo y brinda la mejor experiencia a tus
              colaboradores.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9996DB]/20 to-[#DBBADD]/20 flex items-center justify-center mb-4 group-hover:from-[#9996DB]/30 group-hover:to-[#DBBADD]/30 transition-all">
                    <Icon
                      className="w-6 h-6 text-[#9996DB]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Contact Form Section - Dark theme */}
      <section id="contact-form" className="py-24 bg-[#08080c] relative">
        {/* Subtle top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Transforma tus viajes de negocios
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
                Permítenos mostrarte cómo podemos transformar tus viajes de
                negocios en una ventaja competitiva. Completa el siguiente
                formulario y uno de nuestros asesores especializados se pondrá
                en contacto para diseñar un plan a la medida de tus necesidades.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/[0.02] rounded-3xl p-8 md:p-12 border border-white/[0.05]"
            >
              <iframe
                src="https://link.bralto.io/widget/form/fiMcnYuXRuY7IpfJUNdy"
                style={{
                  width: "100%",
                  height: "796px",
                  border: "none",
                  borderRadius: "4px",
                }}
                id="inline-fiMcnYuXRuY7IpfJUNdy"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Travelcore contact form"
                data-height="796"
                data-layout-iframe-id="inline-fiMcnYuXRuY7IpfJUNdy"
                data-form-id="fiMcnYuXRuY7IpfJUNdy"
                title="Travelcore contact form"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
