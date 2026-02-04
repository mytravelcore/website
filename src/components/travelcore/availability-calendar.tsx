"use client";

import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TourDate, TourDatePackage, PricingPackage } from '@/types/database';

interface AvailabilityCalendarProps {
  tourDates: TourDate[];
  packages: PricingPackage[];
  selectedPackageId: string | null;
  selectedDateId: string | null;
  onSelectDate: (dateId: string) => void;
  onBook: () => void;
}

interface MonthGroup {
  key: string;
  label: string;
  dates: TourDate[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

const getMonthKey = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthLabel = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
};

export default function AvailabilityCalendar({ 
  tourDates, 
  packages,
  selectedPackageId, 
  selectedDateId,
  onSelectDate,
  onBook
}: AvailabilityCalendarProps) {
  // Filter available dates that are in the future
  const availableDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tourDates
      .filter(d => d.is_available && new Date(d.start_date + 'T00:00:00') >= today)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  }, [tourDates]);

  // Group dates by month
  const monthGroups = useMemo(() => {
    const groups: Record<string, MonthGroup> = {};
    
    availableDates.forEach(date => {
      const key = getMonthKey(date.start_date);
      if (!groups[key]) {
        groups[key] = {
          key,
          label: getMonthLabel(date.start_date),
          dates: []
        };
      }
      groups[key].dates.push(date);
    });
    
    return Object.values(groups).sort((a, b) => a.key.localeCompare(b.key));
  }, [availableDates]);

  const [selectedMonth, setSelectedMonth] = useState<string>(monthGroups[0]?.key || '');

  // Update selected month if current becomes invalid
  useEffect(() => {
    if (monthGroups.length > 0 && !monthGroups.find(m => m.key === selectedMonth)) {
      setSelectedMonth(monthGroups[0].key);
    }
  }, [monthGroups, selectedMonth]);

  const currentMonthDates = useMemo(() => {
    return monthGroups.find(m => m.key === selectedMonth)?.dates || [];
  }, [monthGroups, selectedMonth]);

  // Get selected package price
  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  const selectedDate = tourDates.find(d => d.id === selectedDateId);

  // Calculate price for a date (with override support)
  const getDatePrice = (date: TourDate) => {
    if (!selectedPackageId || !selectedPackage) return null;
    
    const datePackage = date.date_packages?.find(dp => dp.package_id === selectedPackageId);
    // Support both camelCase and snake_case formats
    const basePrice = selectedPackage.adultPrice ?? selectedPackage.adult_price ?? 0;
    return datePackage?.price_override || basePrice;
  };

  if (availableDates.length === 0) {
    return (
      <div className="bg-tc-lilac/10 rounded-xl p-5 text-center">
        <Calendar className="w-8 h-8 text-tc-purple-deep/30 mx-auto mb-3" />
        <p className="text-tc-purple-deep/60 text-sm">Este tour no tiene fechas disponibles por el momento.</p>
        <p className="text-xs text-tc-purple-deep/40 mt-1">Contáctanos para más información.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="reserva-section">
      <h3 className="font-display text-base font-bold text-tc-purple-deep flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Fechas disponibles
      </h3>

      {/* Month Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {monthGroups.map((month) => (
          <button
            key={month.key}
            onClick={() => setSelectedMonth(month.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              selectedMonth === month.key
                ? "bg-tc-purple-deep text-white"
                : "bg-tc-lilac/20 text-tc-purple-deep hover:bg-tc-lilac/40"
            )}
          >
            {month.label}
          </button>
        ))}
      </div>

      {/* Dates List */}
      <div className="space-y-2">
        {currentMonthDates.map((date) => {
          const isSelected = selectedDateId === date.id;
          const price = getDatePrice(date);
          
          return (
            <button
              key={date.id}
              onClick={() => onSelectDate(date.id)}
              disabled={!selectedPackageId}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                isSelected 
                  ? "border-tc-orange bg-tc-orange/5" 
                  : selectedPackageId
                    ? "border-tc-purple-light/20 hover:border-tc-purple-light/40 bg-white"
                    : "border-tc-purple-light/10 bg-tc-lilac/5 opacity-60 cursor-not-allowed"
              )}
            >
              <div className="text-left">
                <p className={cn(
                  "font-semibold capitalize text-sm",
                  isSelected ? "text-tc-orange" : "text-tc-purple-deep"
                )}>
                  {formatDate(date.start_date)}
                </p>
                {date.end_date && (
                  <p className="text-xs text-tc-purple-deep/60">
                    hasta {formatDate(date.end_date)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {price && (
                  <div className="text-right">
                    <p className={cn(
                      "font-display text-sm font-bold",
                      isSelected ? "text-tc-orange" : "text-tc-purple-deep"
                    )}>
                      ${price.toLocaleString()} USD
                    </p>
                    <p className="text-[10px] text-tc-purple-deep/60">por persona</p>
                  </div>
                )}
                {!selectedPackageId && (
                  <span className="text-[10px] text-tc-purple-deep/40">Selecciona un paquete</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Book Button */}
      <Button
        onClick={onBook}
        disabled={!selectedPackageId || !selectedDateId}
        className={cn(
          "w-full py-4 rounded-lg text-sm font-semibold transition-all",
          selectedPackageId && selectedDateId
            ? "gradient-orange text-white hover:scale-[1.02]"
            : "bg-tc-purple-light/20 text-tc-purple-deep/40 cursor-not-allowed"
        )}
      >
        {!selectedPackageId 
          ? "Selecciona un paquete primero"
          : !selectedDateId 
            ? "Selecciona una fecha"
            : "Reservar ahora"
        }
        {selectedPackageId && selectedDateId && <ChevronRight className="w-4 h-4 ml-1" />}
      </Button>
    </div>
  );
}
