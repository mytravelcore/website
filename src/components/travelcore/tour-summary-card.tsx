"use client";

import { User, Footprints, UsersRound, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Tour } from '@/types/database';

interface TourSummaryCardProps {
  tour: Tour;
  variant?: 'sidebar' | 'full';
}

interface InfoItem {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
  hasTooltip?: boolean;
}

const difficultyTooltips: Record<string, string> = {
  'Fácil': 'Ideal para la mayoría de personas, caminatas ligeras.',
  'Moderado': 'Requiere condición física básica, caminatas medias.',
  'Difícil': 'Requiere buena condición física, actividad intensa.',
};

export default function TourSummaryCard({ tour, variant = 'sidebar' }: TourSummaryCardProps) {
  // Format age range
  const formatAgeRange = () => {
    if (tour.age_min && tour.age_max) return `${tour.age_min}-${tour.age_max} años`;
    if (tour.age_min) return `${tour.age_min}+ años`;
    if (tour.age_range) return tour.age_range;
    return null;
  };

  // Format group size
  const formatGroupSize = () => {
    if (tour.group_size_min && tour.group_size_max) return `${tour.group_size_min}-${tour.group_size_max} personas`;
    if (tour.group_size_min) return `${tour.group_size_min}+ personas`;
    if (tour.group_size_label) return tour.group_size_label;
    return null;
  };

  // Solo mostramos 3 campos DIFERENTES a los de la tarjeta de precio
  // La tarjeta de precio ya tiene: Duración, Dificultad, Destino
  // Aquí mostramos: Rango de Edad, Actividades, Tamaño del Grupo
  const items: InfoItem[] = [
    { 
      icon: User, 
      label: 'Rango de Edad', 
      value: formatAgeRange()
    },
    { 
      icon: Footprints, 
      label: 'Actividades', 
      value: tour.activities_label 
    },
    { 
      icon: UsersRound, 
      label: 'Tamaño del Grupo', 
      value: formatGroupSize()
    },
  ];

  const visibleItems = items.filter(item => item.value);

  if (visibleItems.length === 0) return null;

  // Full-width variant for main content area
  if (variant === 'full') {
    return (
      <TooltipProvider>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
          {visibleItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-tc-purple-deep/60" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </TooltipProvider>
    );
  }

  // Sidebar variant - card with border, grid 3 columns, icons small on left
  return (
    <TooltipProvider>
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
        <h3 className="font-display text-base font-bold text-tc-purple-deep px-4 pt-4 pb-1">
          Detalles del tour
        </h3>
        <div className="px-4 pb-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3">
            {visibleItems.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-tc-purple-deep/60" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
