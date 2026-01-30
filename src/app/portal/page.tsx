"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Palmtree, CalendarCheck } from "lucide-react";

const portalOptions = [
  {
    id: "corporativo",
    title: "Corporativo",
    description: "Viajes de negocios",
    icon: Building2,
    href: "/corporativo",
    gradient: "from-[#3546A6] to-[#5a6bc9]",
  },
  {
    id: "vacacional",
    title: "Vacacional",
    description: "Experiencias únicas",
    icon: Palmtree,
    href: "/vacacional",
    gradient: "from-[#9996DB] to-[#DBBADD]",
  },
  {
    id: "reservas",
    title: "Reservas",
    description: "Gestiona tu viaje",
    icon: CalendarCheck,
    href: "https://booking.mytravelcore.com",
    external: true,
    gradient: "from-[#FFA03B] to-[#FFD491]",
  },
];

// Subtle floating particles
function FloatingParticles() {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/10"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function PortalPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vibrant purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3546A6] via-[#5a4fcf] to-[#9996DB]">
        {/* Colorful mesh gradient overlay */}
        <motion.div 
          className="absolute inset-0 opacity-50"
          style={{
            background: "radial-gradient(circle at 20% 80%, #DBBADD 0%, transparent 50%), radial-gradient(circle at 80% 20%, #FFE79E 0%, transparent 35%), radial-gradient(circle at 50% 50%, #9996DB 0%, transparent 45%)",
          }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Animated purple orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-[#DBBADD]/30 blur-[100px]"
          style={{ top: "-15%", right: "-10%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-[#FFA03B]/20 blur-[80px]"
          style={{ bottom: "-10%", left: "-5%" }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Subtle floating particles */}
      <FloatingParticles />

      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* White logo - smaller */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10"
        >
          <Image
            src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a3842c2e34b77b4a61cef6.png"
            alt="TravelCore"
            width={140}
            height={38}
            className="h-8 w-auto"
            priority
          />
        </motion.div>

        {/* Minimal subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-white/50 mb-10 tracking-widest uppercase"
        >
          Selecciona tu experiencia
        </motion.p>

        {/* Portal Options - Compact aesthetic cards */}
        <div className="flex flex-col md:flex-row gap-4 max-w-3xl w-full">
          {portalOptions.map((option, index) => {
            const Icon = option.icon;
            const isExternal = option.external;
            
            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                {/* Content */}
                <div className="relative flex items-center gap-4 p-5">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  
                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-medium text-white tracking-tight">
                      {option.title}
                    </h2>
                    <p className="text-xs text-white/40">
                      {option.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <motion.div
                    className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg 
                      className="w-3 h-3 text-white/40 group-hover:text-white/60 transition-colors" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            );

            if (isExternal) {
              return (
                <a 
                  key={option.id} 
                  href={option.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  {CardContent}
                </a>
              );
            }

            return (
              <Link key={option.id} href={option.href} className="flex-1">
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* Minimal footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-xs text-white/20"
        >
          © {new Date().getFullYear()} TravelCore
        </motion.p>
      </div>
    </div>
  );
}
