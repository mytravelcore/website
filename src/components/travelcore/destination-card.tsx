"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Destination } from '@/types/database';

interface DestinationCardProps {
  destination: Destination;
  tourCount?: number;
}

export default function DestinationCard({ destination, tourCount = 0 }: DestinationCardProps) {
  return (
    <Link 
      href={`/destinos/${destination.slug}`} 
      className="group block relative rounded-2xl overflow-hidden h-[400px] w-full"
    >
      {/* Background Image */}
      <Image
        src={destination.image_url || destination.hero_image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'}
        alt={destination.name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-tc-purple-deep/90 via-tc-purple-deep/30 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="transform group-hover:-translate-y-2 transition-transform duration-300">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span>{destination.country}</span>
          </div>
          
          <h3 className="font-display text-2xl font-bold text-white mb-2">
            {destination.name}
          </h3>
          
          {destination.short_description && (
            <p className="text-white/70 text-sm mb-3 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {destination.short_description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-tc-orange font-semibold">
              {tourCount} {tourCount === 1 ? 'tour' : 'tours'}
            </span>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-tc-orange transition-colors">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
