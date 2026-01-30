import Link from "next/link";
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a95f18f2837ef8f7fbd4aa.jpeg')`
        }}
      />
      
      {/* Dark Gradient Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      
      <div className="relative container mx-auto px-4 lg:px-20 pt-32 pb-48">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-up">
            <span className="w-2 h-2 bg-tc-orange rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">+15 años diseñando experiencias</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-up drop-shadow-lg" style={{ animationDelay: '100ms' }}>
            La aventura <span className="text-tc-yellow">comienza</span> aquí
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed animate-fade-up drop-shadow-md" style={{ animationDelay: '200ms' }}>
            Diseñamos experiencias memorables. Nosotros planeamos, tú disfrutas. 
            Menos estrés, más destinos.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up mb-16" style={{ animationDelay: '300ms' }}>
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
              href="https://wa.me/1234567890?text=Hola,%20quiero%20información%20sobre%20tours"
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
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
