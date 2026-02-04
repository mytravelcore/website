import Link from "next/link";
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image - Desktop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{
          backgroundImage: `url('https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a95f18f2837ef8f7fbd4aa.jpeg')`
        }}
      />
      {/* Mobile Background Image - Full screen */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{
          backgroundImage: `url('https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/698317274599861b0837f8c3.jpg')`,
          minHeight: '100vh',
          minWidth: '100vw'
        }}
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 md:bg-gradient-to-r md:from-black/60 md:via-black/40 md:to-transparent" />
      
      {/* Desktop Layout */}
      <div className="relative container mx-auto px-4 lg:px-20 pt-32 pb-48 hidden md:block">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-up">
            <span className="w-2 h-2 bg-tc-orange rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">+15 años diseñando experiencias</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-up drop-shadow-lg" style={{ animationDelay: '100ms' }}>
            La aventura <span className="text-tc-yellow">comienza</span> aquí
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed animate-fade-up drop-shadow-md" style={{ animationDelay: '200ms' }}>
            Diseñamos experiencias memorables. Nosotros planeamos, tú disfrutas. 
            Menos estrés, más destinos.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-row gap-4 animate-fade-up mb-16" style={{ animationDelay: '300ms' }}>
            <Link href="/tours">
              <Button 
                size="lg" 
                className="gradient-orange text-white border-0 rounded-full px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-tc-orange/30"
              >
                Ver Tours
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Link 
              href="https://wa.me/50670281812?text=Hola,%20quiero%20información%20sobre%20tours"
              target="_blank"
            >
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white rounded-full px-8 py-6 text-lg font-semibold hover:bg-white/20 transition-all"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Hablar con un Asesor
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-8 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg drop-shadow-md">50+</p>
                <p className="text-white/80 text-sm">Destinos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl">✈️</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg drop-shadow-md">10,000+</p>
                <p className="text-white/80 text-sm">Viajeros felices</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg drop-shadow-md">4.9/5</p>
                <p className="text-white/80 text-sm">Calificación</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout - Clean centered design */}
      <div className="relative w-full h-screen flex flex-col md:hidden">
        
        {/* Top spacer */}
        <div className="h-20" />
        
        {/* Centered Title Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-display text-4xl font-bold text-white mb-4 leading-tight animate-fade-up drop-shadow-lg" style={{ animationDelay: '100ms' }}>
            La aventura <span className="text-tc-yellow">comienza</span> aquí
          </h1>
          
          <p className="text-base text-white/90 max-w-xs leading-relaxed animate-fade-up drop-shadow-md" style={{ animationDelay: '200ms' }}>
            Diseñamos experiencias memorables. Nosotros planeamos, tú disfrutas. Menos estrés, más destinos.
          </p>
        </div>
        
        {/* Bottom Actions - Compact */}
        <div className="px-4 pb-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
          {/* CTA Buttons */}
          <div className="flex gap-2 mb-4">
            <Link href="/tours" className="flex-1">
              <Button 
                className="w-full gradient-orange text-white border-0 rounded-full h-11 text-sm font-semibold shadow-lg"
              >
                Ver Tours
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
            
            <Link 
              href="https://wa.me/50670281812?text=Hola,%20quiero%20información%20sobre%20tours"
              target="_blank"
              className="flex-1"
            >
              <Button 
                variant="outline"
                className="w-full bg-white/15 backdrop-blur-sm border-white/30 text-white rounded-full h-11 text-sm font-semibold"
              >
                <MessageCircle className="mr-1 w-4 h-4" />
                WhatsApp
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators - Single compact row */}
          <div className="flex justify-center gap-4 bg-white/10 backdrop-blur-sm rounded-full py-2 px-4">
            <div className="flex items-center gap-1">
              <span className="text-sm">🌍</span>
              <span className="text-white text-xs font-medium">50+ destinos</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-1">
              <span className="text-sm">⭐</span>
              <span className="text-white text-xs font-medium">4.9/5</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-1">
              <span className="text-sm">✈️</span>
              <span className="text-white text-xs font-medium">10K+</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator - Desktop only */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
