"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Tour } from "@/types/database";

interface TourCardProps {
  tour: Tour;
}

const difficultyColors = {
  Fácil: "bg-green-100 text-green-700",
  Moderado: "bg-yellow-100 text-yellow-700",
  Difícil: "bg-orange-100 text-orange-700",
  Intenso: "bg-red-100 text-red-700",
} as const;

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-tc-purple-light/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
          <Image
            src={
              tour.hero_image_url ||
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
            }
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {tour.featured && (
              <Badge className="bg-tc-orange text-white border-0">
                Destacado
              </Badge>
            )}
            {tour.category && (
              <Badge
                variant="secondary"
                className="bg-white/90 text-tc-purple-deep"
              >
                {tour.category}
              </Badge>
            )}
          </div>


        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Fixed height title and description area */}
          <div className="flex-grow">
            <h3 className="font-display text-xl font-bold text-tc-purple-deep mb-2 group-hover:text-tc-orange transition-colors line-clamp-2">
              {tour.title}
            </h3>

            <p className="text-tc-purple-deep/60 text-sm mb-4 line-clamp-2">
              {tour.short_description}
            </p>
          </div>

          {/* Meta Info - Fixed at bottom */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {tour.destination && (
              <div className="flex items-center gap-1.5 text-sm text-tc-purple-deep/70">
                <MapPin className="w-4 h-4 text-tc-orange" />
                <span>{tour.destination.name}</span>
              </div>
            )}
            {tour.duration_days && (
              <div className="flex items-center gap-1.5 text-sm text-tc-purple-deep/70">
                <Clock className="w-4 h-4 text-tc-orange" />
                <span>{tour.duration_days} días</span>
              </div>
            )}
            {tour.difficulty && (
              <div className="flex items-center gap-1.5 text-sm">
                <TrendingUp className="w-4 h-4 text-tc-orange" />
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[tour.difficulty]}`}
                >
                  {tour.difficulty}
                </span>
              </div>
            )}
            {/* Price */}
            </div>

          {/* Price Section - Always in same position */}
          <div className="flex items-center gap-1 text-sm mb-4">
            <span className="text-xs text-tc-purple-deep/60">Desde</span>
            <span className="text-lg font-bold text-tc-purple-deep">
              ${(tour.starting_price_from || tour.price_usd)?.toLocaleString()}
            </span>
          </div>

          {/* CTA */}
          <Button
            variant="ghost"
            className="w-full justify-between text-tc-purple-deep hover:text-tc-orange hover:bg-tc-lilac/20 group/btn"
          >
            Ver tour
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
