"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, TrendingUp, Calendar, Check, X, 
  ChevronDown, ChevronUp, MessageCircle, ArrowRight,
  Share2, Heart, CheckCircle, Zap, Shield, ChevronRight, PhoneCall
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TourCard from '@/components/travelcore/tour-card';
import PackageSelector from '@/components/travelcore/package-selector';
import AvailabilityCalendar from '@/components/travelcore/availability-calendar';
import TourSummaryCard from '@/components/travelcore/tour-summary-card';
import SupportWidget from '@/components/travelcore/support-widget';
import BookingModal from '@/components/travelcore/booking-modal';
import type { Tour, ItineraryDay, PricingPackage, TourDate } from '@/types/database';
import { createClient } from '@/supabase/client';

interface TourDetailProps {
  tour: Tour;
  relatedTours: Tour[];
  suggestedTours: Tour[];
  packages: PricingPackage[];
  tourDates: TourDate[];
}

const difficultyColors: Record<string, string> = {
  'Fácil': 'bg-green-100 text-green-700',
  'Moderado': 'bg-yellow-100 text-yellow-700',
  'Intenso': 'bg-red-100 text-red-700',
};

// Cache constants
const CACHE_PREFIX = 'travelcore_tour_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper functions for localStorage caching
function getCachedTourData(tourId: string) {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${tourId}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
      // Cache expired, remove it
      localStorage.removeItem(`${CACHE_PREFIX}${tourId}`);
    }
  } catch (e) {
    console.warn('Error reading from cache:', e);
  }
  return null;
}

function setCachedTourData(tourId: string, data: { packages: PricingPackage[]; tourDates: TourDate[] }) {
  if (typeof window === 'undefined') return;
  try {
    // Clean up old cache entries to prevent storage overflow
    cleanupOldCache();
    localStorage.setItem(`${CACHE_PREFIX}${tourId}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.warn('Error writing to cache:', e);
    // If storage is full, clear all tour cache
    clearTourCache();
  }
}

function cleanupOldCache() {
  if (typeof window === 'undefined') return;
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    // Keep max 20 cached tours
    if (keys.length > 20) {
      const entries = keys.map(k => ({
        key: k,
        timestamp: JSON.parse(localStorage.getItem(k) || '{}').timestamp || 0
      })).sort((a, b) => a.timestamp - b.timestamp);
      
      // Remove oldest entries
      entries.slice(0, keys.length - 15).forEach(e => localStorage.removeItem(e.key));
    }
  } catch (e) {
    console.warn('Error cleaning cache:', e);
  }
}

function clearTourCache() {
  if (typeof window === 'undefined') return;
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Error clearing cache:', e);
  }
}

export default function TourDetail({ tour, relatedTours, suggestedTours, packages: initialPackages, tourDates: initialDates }: TourDetailProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([0]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
  const [packages, setPackages] = useState(initialPackages);
  const [tourDates, setTourDates] = useState(initialDates);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Load calendar script when modal opens
  useEffect(() => {
    if (showCalendarModal) {
      const script = document.createElement('script');
      script.src = 'https://link.bralto.io/js/form_embed.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showCalendarModal]);

  // Initialize from localStorage cache on mount
  useEffect(() => {
    const cachedData = getCachedTourData(tour.id);
    if (cachedData) {
      // Use cached data if available (for faster initial render)
      if (cachedData.packages?.length > 0 && initialPackages.length === 0) {
        setPackages(cachedData.packages);
      }
      if (cachedData.tourDates?.length > 0 && initialDates.length === 0) {
        setTourDates(cachedData.tourDates);
      }
    }
  }, [tour.id]);

  // Cache data when packages or tourDates change
  useEffect(() => {
    if (packages.length > 0 || tourDates.length > 0) {
      setCachedTourData(tour.id, { packages, tourDates });
    }
  }, [packages, tourDates, tour.id]);

  // Real-time updates
  useEffect(() => {
    const supabase = createClient();

    // Subscribe to package changes
    const packagesChannel = supabase
      .channel('packages-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'price_packages', filter: `tour_id=eq.${tour.id}` },
        async () => {
          const { data } = await supabase
            .from('price_packages')
            .select('*')
            .eq('tour_id', tour.id)
            .eq('is_active', true)
            .order('sort_order');
          if (data) setPackages(data);
        }
      )
      .subscribe();

    // Subscribe to date changes
    const datesChannel = supabase
      .channel('dates-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tour_dates', filter: `tour_id=eq.${tour.id}` },
        async () => {
          const { data } = await supabase
            .from('tour_dates')
            .select('*, date_packages:tour_date_packages(*)')
            .eq('tour_id', tour.id)
            .eq('is_available', true)
            .gte('start_date', new Date().toISOString().split('T')[0])
            .order('start_date');
          if (data) setTourDates(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(packagesChannel);
      supabase.removeChannel(datesChannel);
    };
  }, [tour.id]);

  const toggleDay = (index: number) => {
    setExpandedDays(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const expandAll = () => {
    setExpandedDays(itinerary.map((_, i) => i));
  };

  const collapseAll = () => {
    setExpandedDays([]);
  };

  const itinerary = (tour.itinerary || []) as ItineraryDay[];
  const includes = (tour.includes || []) as string[];
  const excludes = (tour.excludes || []) as string[];
  const galleryImages = [tour.hero_image_url, ...(tour.gallery_image_urls || [])].filter(Boolean) as string[];

  // Calculate starting price
  const startingPrice = useMemo(() => {
    if (tour.starting_price_from) return tour.starting_price_from;
    if (packages.length > 0) {
      return Math.min(...packages.map(p => p.adultPrice));
    }
    return tour.price_usd;
  }, [tour.starting_price_from, tour.price_usd, packages]);

  // Handle booking
  const handleBook = () => {
    const selectedPackage = packages.find(p => p.id === selectedPackageId);
    const selectedDate = tourDates.find(d => d.id === selectedDateId);
    
    if (!selectedPackage || !selectedDate) return;
    
    // Open booking modal instead of WhatsApp
    setShowBookingModal(true);
  };

  // Get formatted booking data for the modal
  const getBookingData = () => {
    const selectedPackage = packages.find(p => p.id === selectedPackageId);
    const selectedDate = tourDates.find(d => d.id === selectedDateId);
    
    const formatDateRange = () => {
      if (!selectedDate) return '';
      // Parse date strings and add timezone offset to avoid off-by-one errors
      const parseDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
        return new Date(year, month - 1, day);
      };
      
      const startDateObj = parseDate(selectedDate.start_date);
      const startDate = startDateObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      if (selectedDate.end_date) {
        const endDateObj = parseDate(selectedDate.end_date);
        const endDate = endDateObj.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        return `${startDate} - ${endDate}`;
      }
      return startDate;
    };

    return {
      tourName: tour.title,
      roomType: selectedPackage?.name || '',
      dateRange: formatDateRange()
    };
  };

  // Scroll to reserva section
  const scrollToReserva = () => {
    document.getElementById('reserva-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section - More Compact */}
      <section className="relative">
        <div className="relative h-[60vh] min-h-[400px] max-h-[600px]">
          {/* Main Hero Image */}
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={galleryImages[selectedImage] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80'}
              alt={tour.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-tc-purple-deep/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-tc-purple-deep/50 via-transparent to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 lg:px-16 pb-12 lg:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-3xl"
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.category && (
                    <Badge className="bg-gradient-to-r from-tc-orange to-[#FFD491] text-white border-0 px-3 py-1 text-xs font-semibold shadow-md">
                      {tour.category}
                    </Badge>
                  )}
                  {tour.difficulty && (
                    <Badge className={`${difficultyColors[tour.difficulty]} px-3 py-1 text-xs font-semibold shadow-md`}>
                      {tour.difficulty}
                    </Badge>
                  )}
                  {tour.featured && (
                    <Badge className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 text-xs font-semibold shadow-md">
                      ⭐ Destacado
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                  {tour.title}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-white/95 text-sm mb-6">
                  {tour.destination && (
                    <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{tour.destination.name}, {tour.destination.country}</span>
                    </div>
                  )}
                  {tour.duration_days && (
                    <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{tour.duration_days} días</span>
                    </div>
                  )}
                </div>

                {/* Quick CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={scrollToReserva}
                    size="default"
                    className="gradient-orange text-white border-0 rounded-full px-6 py-2 text-sm font-bold hover:scale-105 transition-transform shadow-lg"
                  >
                    <Calendar className="mr-2 w-4 h-4" />
                    Reservar Ahora
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="default"
                    className="border-2 border-white text-white hover:bg-white hover:text-tc-purple-deep rounded-full px-6 py-2 text-sm font-bold backdrop-blur-md bg-white/10 transition-all"
                  >
                    <MessageCircle className="mr-2 w-4 h-4" />
                    Más Info
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails - Compact */}
        {galleryImages.length > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="container mx-auto px-4 lg:px-16 -mt-12 relative z-10"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-3 border border-tc-purple-light/20">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {galleryImages.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex-shrink-0 relative ${
                      selectedImage === index ? 'ring-2 ring-tc-orange' : 'ring-1 ring-transparent hover:ring-tc-purple-light/50'
                    } rounded-lg overflow-hidden transition-all`}
                  >
                    <div className="w-20 h-14 relative">
                      <Image
                        src={img}
                        alt={`${tour.title} - ${index + 1}`}
                        fill
                        className={`object-cover transition-all ${
                          selectedImage === index ? '' : 'grayscale-[30%] hover:grayscale-0'
                        }`}
                      />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Main Content - Compact Layout */}
      <section className="py-12 bg-gradient-to-b from-white via-tc-lilac/5 to-white">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column - Content */}
            <div className="flex-1 space-y-10">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">
                  <span className="inline-block text-xs font-bold tracking-widest text-tc-orange uppercase mb-2">
                    La Experiencia
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-tc-purple-deep leading-tight">
                    Sobre este tour
                  </h2>
                </div>
                <div className="prose prose-sm prose-purple max-w-none">
                  <p className="text-tc-purple-deep/80 leading-relaxed text-base">
                    {tour.long_description || tour.short_description}
                  </p>
                </div>
              </motion.div>

              {/* Tour Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-tc-purple-light/30 shadow-lg p-5">
                  <span className="inline-block text-xs font-bold tracking-widest text-tc-purple-deep/60 uppercase mb-3">
                    Información Clave
                  </span>
                  <TourSummaryCard tour={tour} variant="full" />
                </div>
              </motion.div>

              {/* Itinerary - Compact */}
              {itinerary.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="scroll-mt-16"
                  id="itinerario"
                >
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <span className="inline-block text-xs font-bold tracking-widest text-tc-orange uppercase mb-2">
                        Día a Día
                      </span>
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-tc-purple-deep">
                        Itinerario
                      </h2>
                    </div>
                    <div className="hidden md:flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={expandAll}
                        className="text-tc-purple-deep/60 hover:text-tc-purple-deep hover:bg-tc-purple-deep/5 text-xs"
                      >
                        Expandir todo
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={collapseAll}
                        className="text-tc-purple-deep/60 hover:text-tc-purple-deep hover:bg-tc-purple-deep/5 text-xs"
                      >
                        Colapsar todo
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {itinerary.map((day, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.03 }}
                        className="group"
                      >
                        <div className="bg-white rounded-lg border border-tc-purple-light/20 overflow-hidden hover:border-tc-purple-light/40 hover:shadow-md transition-all duration-200">
                          <button
                            onClick={() => toggleDay(index)}
                            className="w-full flex items-center justify-between p-3 lg:p-4 bg-gradient-to-r from-tc-lilac/5 to-transparent hover:from-tc-lilac/10 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg gradient-purple flex items-center justify-center text-white font-display font-bold text-sm shadow">
                                {day.day}
                              </div>
                              <span className="font-display font-semibold text-sm text-tc-purple-deep">
                                {day.title}
                              </span>
                            </div>
                            <motion.div
                              animate={{ rotate: expandedDays.includes(index) ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4 text-tc-purple-deep group-hover:text-tc-orange transition-colors" />
                            </motion.div>
                          </button>
                          <motion.div
                            initial={false}
                            animate={{ 
                              height: expandedDays.includes(index) ? 'auto' : 0,
                              opacity: expandedDays.includes(index) ? 1 : 0
                            }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-1 border-t border-tc-purple-light/10">
                              <p className="text-tc-purple-deep/70 leading-relaxed text-sm">
                                {day.description}
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Includes / Excludes - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {/* Includes */}
                {includes.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 border border-green-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-green-900">
                        Incluye
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {includes.map((item, index) => (
                        <li 
                          key={index}
                          className="flex items-start gap-2 text-green-800 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Excludes */}
                {excludes.length > 0 && (
                  <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-5 border border-red-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-red-900">
                        No incluye
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {excludes.map((item, index) => (
                        <li 
                          key={index}
                          className="flex items-start gap-2 text-red-800 text-sm"
                        >
                          <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>

              {/* Packages Selector */}
              {packages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  id="reserva-section"
                  className="scroll-mt-16"
                >
                  <div className="mb-4">
                    <span className="inline-block text-xs font-bold tracking-widest text-tc-orange uppercase mb-2">
                      Opciones de Viaje
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-tc-purple-deep">
                      Elige tu Paquete
                    </h2>
                  </div>
                  <PackageSelector
                    packages={packages}
                    selectedPackageId={selectedPackageId}
                    onSelectPackage={setSelectedPackageId}
                  />
                </motion.div>
              )}

              {/* Availability Calendar */}
              {tourDates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <AvailabilityCalendar
                    tourDates={tourDates}
                    packages={packages}
                    selectedPackageId={selectedPackageId}
                    selectedDateId={selectedDateId}
                    onSelectDate={setSelectedDateId}
                    onBook={handleBook}
                  />
                </motion.div>
              )}

              {/* No dates available message */}
              {tourDates.length === 0 && packages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative overflow-hidden rounded-xl"
                >
                  <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-tc-purple-light/30 p-8 text-center">
                    <Calendar className="w-10 h-10 text-tc-purple-deep/30 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold text-tc-purple-deep mb-2">
                      Fechas Próximamente
                    </h3>
                    <p className="text-tc-purple-deep/60 text-sm mb-4">
                      Este tour no tiene fechas disponibles por el momento.
                    </p>
                    <Link href="/contacto">
                      <Button size="sm" className="gradient-purple text-white rounded-full px-6 hover:scale-105 transition-transform shadow-lg">
                        <MessageCircle className="mr-2 w-4 h-4" />
                        Contactar
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:w-[340px]">
              <motion.div 
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 space-y-4"
              >
                {/* Price Card - Compact */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-tc-orange via-tc-purple-deep to-tc-lilac rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="relative bg-white rounded-xl border border-tc-purple-light/30 shadow-lg overflow-hidden">
                    {/* Decorative Header */}
                    <div className="h-1 bg-gradient-to-r from-tc-orange via-tc-purple-deep to-tc-lilac" />
                    
                    <div className="p-5">
                      {/* Price Section */}
                      <div className="mb-5">
                        <span className="text-xs font-semibold text-tc-purple-deep/60 tracking-wider uppercase">Precio desde</span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="font-display text-3xl font-black bg-gradient-to-r from-tc-purple-deep to-tc-orange bg-clip-text text-transparent">
                            ${startingPrice?.toLocaleString()}
                          </span>
                          <span className="text-sm text-tc-purple-deep/60">USD</span>
                        </div>
                        <p className="text-xs text-tc-purple-deep/50 mt-0.5">por persona</p>
                      </div>

                      {/* Benefits - Compact */}
                      <div className="space-y-2.5 mb-5 pb-5 border-b border-tc-purple-light/20">
                        <div className="flex items-center gap-2 text-tc-purple-deep/80">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-tc-orange to-[#FFD491] flex items-center justify-center flex-shrink-0">
                            <Zap className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm font-medium">Reserva instantánea</span>
                        </div>
                        <div className="flex items-center gap-2 text-tc-purple-deep/80">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm font-medium">Guía profesional incluido</span>
                        </div>
                        <div className="flex items-center gap-2 text-tc-purple-deep/80">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-tc-purple-deep to-tc-lilac flex items-center justify-center flex-shrink-0">
                            <Shield className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm font-medium">Garantía de satisfacción</span>
                        </div>
                      </div>

                      {/* Quick Info - Compact */}
                      <div className="space-y-3 mb-5 pb-5 border-b border-tc-purple-light/20">
                        {tour.duration_days && (
                          <div className="flex items-center justify-between">
                            <span className="text-tc-purple-deep/60 flex items-center gap-1.5 text-sm">
                              <Clock className="w-4 h-4" />
                              Duración
                            </span>
                            <span className="font-bold text-tc-purple-deep text-sm">
                              {tour.duration_days} días
                            </span>
                          </div>
                        )}
                        {tour.difficulty && (
                          <div className="flex items-center justify-between">
                            <span className="text-tc-purple-deep/60 flex items-center gap-1.5 text-sm">
                              <TrendingUp className="w-4 h-4" />
                              Dificultad
                            </span>
                            <Badge className={`${difficultyColors[tour.difficulty]} px-2.5 py-0.5 text-xs font-bold`}>
                              {tour.difficulty}
                            </Badge>
                          </div>
                        )}
                        {tour.destination?.name && (
                          <div className="flex items-center justify-between">
                            <span className="text-tc-purple-deep/60 flex items-center gap-1.5 text-sm">
                              <MapPin className="w-4 h-4" />
                              Destino
                            </span>
                            <span className="font-bold text-tc-purple-deep text-sm">
                              {tour.destination.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CTA Buttons - Compact */}
                      <div className="space-y-2">
                        {tourDates.length > 0 ? (
                          <Button 
                            onClick={scrollToReserva}
                            className="w-full gradient-orange text-white border-0 rounded-lg py-5 text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
                          >
                            <Calendar className="mr-2 w-4 h-4" />
                            Elige tu fecha
                            <ChevronRight className="ml-2 w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => setShowCalendarModal(true)}
                            className="w-full gradient-orange text-white border-0 rounded-lg py-5 text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
                          >
                            <PhoneCall className="mr-2 w-4 h-4" />
                            Reservar Llamada
                            <ChevronRight className="ml-2 w-4 h-4" />
                          </Button>
                        )}

                      </div>

                      {/* Share & Save - Compact */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-tc-purple-light/20">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex-1 text-tc-purple-deep/60 hover:text-tc-purple-deep hover:bg-tc-purple-deep/5 rounded-lg text-xs"
                        >
                          <Share2 className="w-3.5 h-3.5 mr-1" />
                          Compartir
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex-1 text-tc-purple-deep/60 hover:text-tc-purple-deep hover:bg-tc-purple-deep/5 rounded-lg text-xs"
                        >
                          <Heart className="w-3.5 h-3.5 mr-1" />
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support Widget */}
                <SupportWidget tourTitle={tour.title} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tours - Compact */}
      {relatedTours.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-white via-tc-lilac/5 to-white">
          <div className="container mx-auto px-4 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                <div>
                  <span className="inline-block text-xs font-bold tracking-widest text-tc-orange uppercase mb-2">
                    Más Aventuras
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-tc-purple-deep">
                    Tours relacionados
                  </h2>
                </div>
                <Link href="/tours">
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="mt-4 md:mt-0 border border-tc-purple-deep text-tc-purple-deep hover:bg-tc-purple-deep hover:text-white rounded-lg font-semibold group text-sm"
                  >
                    Ver todos los tours
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedTours.map((relatedTour, index) => (
                  <motion.div
                    key={relatedTour.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                  >
                    <TourCard tour={relatedTour} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* También te podría interesar - Tours from other destinations */}
      {suggestedTours.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-tc-lilac/10 via-white to-tc-lilac/5">
          <div className="container mx-auto px-4 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                <div>
                  <span className="inline-block text-xs font-bold tracking-widest text-tc-purple-light uppercase mb-2">
                    Explora más destinos
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-tc-purple-deep">
                    También te podría interesar
                  </h2>
                  <p className="text-tc-purple-deep/60 text-sm mt-2 max-w-xl">
                    Descubre experiencias únicas en otros destinos que podrían complementar tu viaje
                  </p>
                </div>
                <Link href="/tours">
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="mt-4 md:mt-0 border border-tc-purple-light text-tc-purple-deep hover:bg-tc-purple-deep hover:text-white rounded-lg font-semibold group text-sm"
                  >
                    Explorar todos los tours
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {suggestedTours.map((suggestedTour, index) => (
                  <motion.div
                    key={suggestedTour.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="group"
                  >
                    <Link href={`/tours/${suggestedTour.slug}`} className="block">
                      <div className="bg-white rounded-xl overflow-hidden border border-tc-purple-light/10 hover:border-tc-purple-light/30 transition-all duration-300 hover:shadow-lg hover:shadow-tc-purple-light/10 hover:-translate-y-1">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={suggestedTour.hero_image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80'}
                            alt={suggestedTour.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Destination badge */}
                          {suggestedTour.destination && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-white/90 text-tc-purple-deep text-[10px] font-semibold px-2 py-0.5">
                                <MapPin className="w-3 h-3 mr-1" />
                                {suggestedTour.destination.name}
                              </Badge>
                            </div>
                          )}
                          
                          {/* Price badge */}
                          {suggestedTour.price_usd && (
                            <div className="absolute bottom-3 right-3">
                              <Badge className="bg-tc-orange text-white text-xs font-bold px-2 py-1">
                                ${suggestedTour.price_usd.toLocaleString()} USD
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-display text-sm font-bold text-tc-purple-deep line-clamp-2 group-hover:text-tc-purple-light transition-colors">
                            {suggestedTour.title}
                          </h3>
                          
                          <div className="flex items-center gap-3 mt-2 text-xs text-tc-purple-deep/60">
                            {suggestedTour.duration_days && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {suggestedTour.duration_days} días
                              </span>
                            )}
                            {suggestedTour.difficulty && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${difficultyColors[suggestedTour.difficulty]}`}>
                                {suggestedTour.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Calendar Modal */}
      <Dialog open={showCalendarModal} onOpenChange={setShowCalendarModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#3546A6]">
              Agenda tu Llamada de Asesoría
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600">
              Reserva una llamada de 15 minutos con nuestro equipo para entender mejor tus requerimientos de viaje y personalizar tu experiencia.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <iframe 
              src="https://link.bralto.io/widget/booking/U2s8b4hu4zabQXWU2Jc6" 
              style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '600px' }} 
              scrolling="no" 
              id="U2s8b4hu4zabQXWU2Jc6_1769543562160"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Modal with Summary */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        tourName={getBookingData().tourName}
        roomType={getBookingData().roomType}
        dateRange={getBookingData().dateRange}
      />
    </>
  );
}
