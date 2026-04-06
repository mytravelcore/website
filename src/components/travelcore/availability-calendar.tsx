"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, ChevronRight, AlertCircle, Check, Users, User, Package, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TourDate, PricingPackage, DatePriceConfig, DatePricePackage } from '@/types/database';

// ==========================================
// Types for resolved pricing
// ==========================================
export interface ResolvedPricing {
  source: 'date_override' | 'general' | 'none';
  packageType: 'single' | 'multiple';
  packages: ResolvedPackage[];
  startingPriceFrom?: number | null;
}

export interface ResolvedPackage {
  id: string;
  name: string;
  label?: string;
  isDefault: boolean;
  adultPrice: number;
  adultCrossedPrice?: number;
  childPrice?: number;
  childCrossedPrice?: number;
  childAgeMin?: number;
  childAgeMax?: number;
  infantPrice?: number;
  infantAgeMax?: number;
  details?: string;
}

// ==========================================
// Pricing resolution utility
// ==========================================
export function resolvePricingForDate(
  date: TourDate,
  useGeneralPricing: boolean,
  generalPackageType: 'single' | 'multiple',
  generalPackages: PricingPackage[]
): ResolvedPricing {
  // Priority 1: Date has its own pricing override
  if (date.has_price_override && date.price_override_config) {
    const config = date.price_override_config as DatePriceConfig;
    const resolvedPkgs: ResolvedPackage[] = (config.packages || []).map((pkg: DatePricePackage) => ({
      id: pkg.id,
      name: pkg.name,
      label: pkg.label,
      isDefault: pkg.isDefault,
      adultPrice: pkg.adultPrice ?? 0,
      adultCrossedPrice: pkg.adultCrossedPrice,
      childPrice: pkg.childPrice,
      childCrossedPrice: pkg.childCrossedPrice,
      childAgeMin: pkg.childAgeMin,
      childAgeMax: pkg.childAgeMax,
      infantPrice: pkg.infantPrice,
      infantAgeMax: pkg.infantAgeMax,
      details: pkg.details,
    }));

    return {
      source: 'date_override',
      packageType: config.package_type || 'single',
      packages: resolvedPkgs,
      startingPriceFrom: config.starting_price_from,
    };
  }

  // Priority 2: Use general pricing (only if flag is ON)
  if (useGeneralPricing && generalPackages.length > 0) {
    const resolvedPkgs: ResolvedPackage[] = generalPackages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      label: pkg.label,
      isDefault: pkg.isDefault ?? pkg.is_default ?? false,
      adultPrice: pkg.adultPrice ?? pkg.adult_price ?? 0,
      adultCrossedPrice: undefined,
      childPrice: pkg.childPrice ?? pkg.child_price ?? undefined,
      childAgeMin: pkg.childAgeMin ?? pkg.child_age_min ?? undefined,
      childAgeMax: pkg.childAgeMax ?? pkg.child_age_max ?? undefined,
      details: pkg.details ?? pkg.description ?? undefined,
    }));

    return {
      source: 'general',
      packageType: generalPackageType,
      packages: resolvedPkgs,
    };
  }

  // Priority 3: No pricing available
  return {
    source: 'none',
    packageType: 'single',
    packages: [],
  };
}

// ==========================================
// Props
// ==========================================
interface AvailabilityCalendarProps {
  tourDates: TourDate[];
  packages: PricingPackage[];
  useGeneralPricing: boolean;
  generalPackageType: 'single' | 'multiple';
  selectedDateId: string | null;
  selectedPackageId: string | null;
  onSelectDate: (dateId: string | null) => void;
  onSelectPackage: (packageId: string | null) => void;
  onBook: () => void;
  resolvedPricing: ResolvedPricing | null;
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

// ==========================================
// Component
// ==========================================
export default function AvailabilityCalendar({ 
  tourDates, 
  packages: generalPackages,
  useGeneralPricing,
  generalPackageType,
  selectedDateId,
  selectedPackageId,
  onSelectDate,
  onSelectPackage,
  onBook,
  resolvedPricing,
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

  // BUGFIX: Reset selection state when month filter changes
  useEffect(() => {
    // Clear selection and pricing when user changes month
    onSelectDate(null);
    onSelectPackage(null);
  }, [selectedMonth, onSelectDate, onSelectPackage]); // Intentionally trigger on month change

  const currentMonthDates = useMemo(() => {
    return monthGroups.find(m => m.key === selectedMonth)?.dates || [];
  }, [monthGroups, selectedMonth]);

  // Compute quick pricing hint for each date (for display on the date row)
  const getDatePricingHint = useCallback((date: TourDate): { price: number | null; source: 'date_override' | 'general' | 'none' } => {
    const resolved = resolvePricingForDate(date, useGeneralPricing, generalPackageType, generalPackages);
    if (resolved.source === 'none' || resolved.packages.length === 0) {
      return { price: null, source: 'none' };
    }
    // Show the cheapest adult price
    const prices = resolved.packages.map(p => p.adultPrice).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    return { price: minPrice, source: resolved.source };
  }, [useGeneralPricing, generalPackageType, generalPackages]);

  // Is booking ready?
  const canBook = useMemo(() => {
    if (!selectedDateId || !resolvedPricing) return false;
    if (resolvedPricing.source === 'none') return false;
    if (resolvedPricing.packages.length === 0) return false;
    if (resolvedPricing.packageType === 'multiple' && resolvedPricing.packages.length > 1 && !selectedPackageId) return false;
    // For single or single-item multiple, we're good
    return true;
  }, [selectedDateId, resolvedPricing, selectedPackageId]);

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
      {/* Step 1: Select Date */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-tc-purple-deep text-white flex items-center justify-center text-xs font-bold">1</div>
          <h3 className="font-display text-base font-bold text-tc-purple-deep flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Elige tu fecha
          </h3>
        </div>
        <p className="text-xs text-tc-purple-deep/50 ml-8 mb-3">Selecciona una fecha disponible para ver los precios</p>
      </div>

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
          const hint = getDatePricingHint(date);
          const hasNoPricing = hint.source === 'none';
          const isDisabled = hasNoPricing; // BUGFIX: Disable dates without pricing
          
          return (
            <button
              key={date.id}
              onClick={() => {
                // BUGFIX: Prevent selection of dates without pricing
                if (!isDisabled) {
                  onSelectDate(date.id);
                }
              }}
              disabled={isDisabled}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                isSelected 
                  ? "border-tc-orange bg-tc-orange/5 ring-1 ring-tc-orange/30" 
                  : hasNoPricing
                    ? "border-tc-purple-light/10 bg-slate-50/80 opacity-50 cursor-not-allowed"
                    : "border-tc-purple-light/20 hover:border-tc-purple-light/40 bg-white cursor-pointer"
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
                {hint.price !== null && (
                  <div className="text-right">
                    <p className="text-[10px] text-tc-purple-deep/50">Desde</p>
                    <p className={cn(
                      "font-display text-sm font-bold",
                      isSelected ? "text-tc-orange" : "text-tc-purple-deep"
                    )}>
                      ${hint.price.toLocaleString()} USD
                    </p>
                    {hint.source === 'date_override' && (
                      <p className="text-[9px] text-emerald-600 font-medium">Precio especial</p>
                    )}
                  </div>
                )}
                {hasNoPricing && (
                  <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Sin precio
                  </span>
                )}
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-tc-orange flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Step 2: Pricing / Package Selection (only after date is selected) */}
      {selectedDateId && resolvedPricing && (
        <div className="mt-6">
          {resolvedPricing.source === 'none' ? (
            /* No pricing available for this date */
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-amber-700">No hay precios disponibles para esta fecha</p>
              <p className="text-xs text-amber-600 mt-1">
                Contáctanos para más información sobre disponibilidad y precios.
              </p>
            </div>
          ) : resolvedPricing.packageType === 'multiple' && resolvedPricing.packages.length > 1 ? (
            /* Multiple packages → show selector */
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-tc-purple-deep text-white flex items-center justify-center text-xs font-bold">2</div>
                <h3 className="font-display text-base font-bold text-tc-purple-deep flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Elige tu paquete
                </h3>
              </div>
              <p className="text-xs text-tc-purple-deep/50 ml-8 mb-3">
                {resolvedPricing.source === 'date_override' 
                  ? 'Precios especiales para esta fecha' 
                  : 'Selecciona un paquete para continuar'}
              </p>
              <div className="grid gap-2">
                {resolvedPricing.packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  const Icon = pkg.isDefault ? Users : User;
                  
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => onSelectPackage(pkg.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                        isSelected 
                          ? "border-tc-orange bg-tc-orange/5 ring-1 ring-tc-orange/30" 
                          : "border-tc-purple-light/20 hover:border-tc-purple-light/40 bg-white"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          isSelected ? "bg-tc-orange text-white" : "bg-tc-lilac/20 text-tc-purple-deep"
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className={cn(
                            "font-semibold text-sm",
                            isSelected ? "text-tc-orange" : "text-tc-purple-deep"
                          )}>
                            {pkg.name}
                          </p>
                          {pkg.label && (
                            <p className="text-xs text-tc-purple-deep/60">{pkg.label}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          {(pkg.adultCrossedPrice ?? 0) > 0 && (
                            <p className="text-[10px] text-slate-400 line-through">${pkg.adultCrossedPrice!.toLocaleString()}</p>
                          )}
                          <p className={cn(
                            "font-display text-base font-bold",
                            isSelected ? "text-tc-orange" : "text-tc-purple-deep"
                          )}>
                            ${pkg.adultPrice.toLocaleString()} <span className="text-xs font-normal">USD</span>
                          </p>
                          <p className="text-[10px] text-tc-purple-deep/60">por adulto</p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-tc-orange flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Single package → show price directly */
            resolvedPricing.packages[0] && (
              <div className="bg-gradient-to-r from-tc-purple-deep/5 to-tc-lilac/10 rounded-xl border border-tc-purple-light/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-tc-purple-deep/60 uppercase tracking-wider">
                      {resolvedPricing.source === 'date_override' ? 'Precio especial para esta fecha' : 'Precio por adulto'}
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      {(resolvedPricing.packages[0].adultCrossedPrice ?? 0) > 0 && (
                        <span className="text-sm text-slate-400 line-through">${resolvedPricing.packages[0].adultCrossedPrice!.toLocaleString()}</span>
                      )}
                      <span className="font-display text-2xl font-bold text-tc-purple-deep">
                        ${resolvedPricing.packages[0].adultPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-tc-purple-deep/60">USD</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-tc-orange/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-tc-orange" />
                  </div>
                </div>
                {resolvedPricing.packages[0].childPrice !== undefined && resolvedPricing.packages[0].childPrice > 0 && (
                  <p className="text-xs text-tc-purple-deep/50 mt-2">
                    Niños: ${resolvedPricing.packages[0].childPrice.toLocaleString()} USD
                    {resolvedPricing.packages[0].childAgeMin !== undefined && resolvedPricing.packages[0].childAgeMax !== undefined && (
                      <span> ({resolvedPricing.packages[0].childAgeMin}-{resolvedPricing.packages[0].childAgeMax} años)</span>
                    )}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* Book Button */}
      <Button
        onClick={onBook}
        disabled={!canBook}
        className={cn(
          "w-full py-4 rounded-lg text-sm font-semibold transition-all mt-4",
          canBook
            ? "gradient-orange text-white hover:scale-[1.02]"
            : "bg-tc-purple-light/20 text-tc-purple-deep/40 cursor-not-allowed"
        )}
      >
        {!selectedDateId 
          ? "Selecciona una fecha primero"
          : resolvedPricing?.source === 'none'
            ? "Sin precios disponibles"
            : resolvedPricing?.packageType === 'multiple' && resolvedPricing?.packages.length > 1 && !selectedPackageId
              ? "Selecciona un paquete"
              : "Reservar ahora"
        }
        {canBook && <ChevronRight className="w-4 h-4 ml-1" />}
      </Button>
    </div>
  );
}
