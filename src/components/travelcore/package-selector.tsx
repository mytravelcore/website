"use client";

import { useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Check, Users, User } from 'lucide-react';
import type { PricingPackage } from '@/types/database';

interface PackageSelectorProps {
  packages: PricingPackage[];
  selectedPackageId: string | null;
  onSelectPackage: (packageId: string) => void;
}

// Helper to normalize package data (handles both camelCase from JSONB and snake_case from table)
function normalizePackage(pkg: PricingPackage) {
  return {
    id: pkg.id,
    name: pkg.name,
    isDefault: pkg.isDefault ?? pkg.is_default ?? false,
    adultPrice: pkg.adultPrice ?? pkg.adult_price ?? 0,
  };
}

export default function PackageSelector({ 
  packages, 
  selectedPackageId, 
  onSelectPackage 
}: PackageSelectorProps) {
  const activePackages = useMemo(() => (packages ?? []).map(normalizePackage), [packages]);

  // Auto-select if only one package
  useEffect(() => {
    if (activePackages.length === 1 && !selectedPackageId) {
      onSelectPackage(activePackages[0].id);
    }
  }, [activePackages.length, activePackages, selectedPackageId, onSelectPackage]);

  if (activePackages.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-display text-base font-bold text-tc-purple-deep flex items-center gap-2">
        <Users className="w-4 h-4" />
        Elige un paquete
      </h3>
      <div className="grid gap-2">
        {activePackages.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;
          const Icon = pkg.isDefault ? Users : User;
          
          return (
            <button
              key={pkg.id}
              onClick={() => onSelectPackage(pkg.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                isSelected 
                  ? "border-tc-orange bg-tc-orange/5" 
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
                  <p className="text-xs text-tc-purple-deep/60">
                    Por adulto
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[10px] text-tc-purple-deep/60">Desde</p>
                  <p className={cn(
                    "font-display text-base font-bold",
                    isSelected ? "text-tc-orange" : "text-tc-purple-deep"
                  )}>
                    ${pkg.adultPrice.toLocaleString()} <span className="text-xs font-normal">USD</span>
                  </p>
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
  );
}
