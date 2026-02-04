"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';
import { createClient } from '@/supabase/client';
import type { Tour } from '@/types/database';

// Package interface
interface PricePackage {
  id: string;
  name: string;
  label: string;
  isDefault: boolean;
  adultPrice: number;
  adultCrossedPrice?: number;
  adultSingleSupplement: number;
  adultMinPax: number;
  adultMaxPax: number | null;
  adultGroupDiscount: boolean;
  childPrice: number;
  childCrossedPrice?: number;
  childAgeMin: number;
  childAgeMax: number;
  childMinPax: number;
  childMaxPax: number | null;
  childGroupDiscount: boolean;
  infantPrice: number;
  infantAgeMax: number;
  details: string;
}

const priceCategories = ['Adulto', 'Niño', 'Infante'];

const defaultPackage: Omit<PricePackage, 'id'> = {
  name: '',
  label: 'Por persona',
  isDefault: false,
  adultPrice: 0,
  adultCrossedPrice: 0,
  adultSingleSupplement: 0,
  adultMinPax: 1,
  adultMaxPax: null,
  adultGroupDiscount: false,
  childPrice: 0,
  childCrossedPrice: 0,
  childAgeMin: 3,
  childAgeMax: 11,
  childMinPax: 1,
  childMaxPax: null,
  childGroupDiscount: false,
  infantPrice: 0,
  infantAgeMax: 2,
  details: '',
};

const createEmptyPackage = (name: string = 'Nuevo Paquete'): PricePackage => ({
  ...defaultPackage,
  id: crypto.randomUUID(),
  name,
});

export default function PricePage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.tourId as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Price configuration
  const [packageType, setPackageType] = useState<'single' | 'multiple'>('single');
  const [primaryCategory, setPrimaryCategory] = useState('Adult');
  const [packages, setPackages] = useState<PricePackage[]>([]);
  const [expandedPackages, setExpandedPackages] = useState<string[]>([]);
  const [activePackageTab, setActivePackageTab] = useState<Record<string, string>>({});
  
  // Legacy fields
  const [startingPriceFrom, setStartingPriceFrom] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      const { data: tourData, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', tourId)
        .single();

      if (error || !tourData) {
        setLoading(false);
        return;
      }

      setTour(tourData);
      setStartingPriceFrom(tourData.starting_price_from ?? null);
      
      // Load packages from price_packages table (snake_case) and map to camelCase for UI
      const { data: dbPackages, error: packagesError } = await supabase
        .from('price_packages')
        .select('*')
        .eq('tour_id', tourId)
        .order('sort_order', { ascending: true });

      console.log('Price packages loaded from DB:', { dbPackages, packagesError });

      if (dbPackages && dbPackages.length > 0) {
        // Map snake_case DB columns to camelCase UI format
        const mappedPackages: PricePackage[] = dbPackages.map((pkg: any) => ({
          id: pkg.id,
          name: pkg.name || 'Sin nombre',
          label: 'Por persona',
          isDefault: pkg.is_default || false,
          adultPrice: Number(pkg.adult_price) || 0,
          adultCrossedPrice: pkg.adult_crossed_price ? Number(pkg.adult_crossed_price) : undefined,
          adultSingleSupplement: 0,
          adultMinPax: pkg.adult_min_pax || 1,
          adultMaxPax: pkg.adult_max_pax || null,
          adultGroupDiscount: pkg.group_discount_enabled || false,
          childPrice: pkg.child_price ? Number(pkg.child_price) : 0,
          childCrossedPrice: pkg.child_crossed_price ? Number(pkg.child_crossed_price) : undefined,
          childAgeMin: pkg.child_age_min || 3,
          childAgeMax: pkg.child_age_max || 11,
          childMinPax: pkg.child_min_pax || 0,
          childMaxPax: pkg.child_max_pax || null,
          childGroupDiscount: pkg.group_discount_enabled || false,
          infantPrice: 0,
          infantAgeMax: 2,
          details: pkg.description || '',
        }));
        setPackages(mappedPackages);
        setPackageType(mappedPackages.length > 1 ? 'multiple' : 'single');
        setExpandedPackages([mappedPackages[0].id]);
      } else {
        // Fallback to JSONB packages if no table records found
        const savedPackages = tourData.price_packages as PricePackage[] | null;
        if (savedPackages && savedPackages.length > 0) {
          setPackages(savedPackages);
          setPackageType(savedPackages.length > 1 ? 'multiple' : 'single');
          setExpandedPackages([savedPackages[0].id]);
        } else {
          // Create default package based on current price
          const defaultPkg: PricePackage = {
            ...defaultPackage,
            id: crypto.randomUUID(),
            name: 'Habitación Doble',
            isDefault: true,
            adultPrice: tourData.base_price_usd || tourData.price_usd || 0,
          };
          setPackages([defaultPkg]);
          setExpandedPackages([defaultPkg.id]);
        }
      }
      
      setPackageType(tourData.package_type || 'single');
      setPrimaryCategory(tourData.primary_price_category || 'Adulto');
      
      setLoading(false);
    }

    loadData();
  }, [tourId, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      
      // Calculate main price from default package
      const defaultPkg = packages.find(p => p.isDefault) || packages[0];
      const mainPrice = defaultPkg?.adultPrice || 0;

      // Update tours table with JSONB packages
      const { error } = await supabase
        .from('tours')
        .update({ 
          price_usd: mainPrice,
          starting_price_from: startingPriceFrom,
          package_type: packageType,
          primary_price_category: primaryCategory,
          price_packages: packages,
        })
        .eq('id', tourId);

      if (error) throw error;

      // Also sync to price_packages table for public site
      // First delete existing packages for this tour
      await supabase
        .from('price_packages')
        .delete()
        .eq('tour_id', tourId);

      // Then insert new packages with snake_case format
      const pricePackagesData = packages.map((pkg, index) => ({
        id: pkg.id,
        tour_id: tourId,
        name: pkg.name,
        description: pkg.details || null,
        adult_price: pkg.adultPrice || 0,
        adult_crossed_price: pkg.adultCrossedPrice || null,
        adult_min_pax: pkg.adultMinPax || 1,
        adult_max_pax: pkg.adultMaxPax || null,
        child_price: pkg.childPrice || null,
        child_crossed_price: pkg.childCrossedPrice || null,
        child_min_pax: pkg.childMinPax || 0,
        child_max_pax: pkg.childMaxPax || null,
        child_age_min: pkg.childAgeMin || null,
        child_age_max: pkg.childAgeMax || null,
        group_discount_enabled: pkg.adultGroupDiscount || pkg.childGroupDiscount || false,
        group_discount_percentage: null,
        group_discount_min_pax: null,
        is_default: pkg.isDefault || false,
        is_active: true,
        sort_order: index,
      }));

      if (pricePackagesData.length > 0) {
        const { error: insertError } = await supabase
          .from('price_packages')
          .insert(pricePackagesData);
        
        if (insertError) {
          console.error('Error syncing to price_packages table:', insertError);
        }
      }
    } catch (error) {
      console.error('Error saving price:', error);
      alert('Error al guardar el precio');
    } finally {
      setIsSaving(false);
    }
  };

  const addPackage = () => {
    const newPkg = createEmptyPackage(`Package ${packages.length + 1}`);
    setPackages([...packages, newPkg]);
    setExpandedPackages([...expandedPackages, newPkg.id]);
    setActivePackageTab({ ...activePackageTab, [newPkg.id]: 'general' });
  };

  const removePackage = (id: string) => {
    if (packages.length <= 1) return;
    const updatedPackages = packages.filter(p => p.id !== id);
    // If removing the default, make the first one default
    if (packages.find(p => p.id === id)?.isDefault && updatedPackages.length > 0) {
      updatedPackages[0].isDefault = true;
    }
    setPackages(updatedPackages);
    setExpandedPackages(expandedPackages.filter(eid => eid !== id));
  };

  const updatePackage = (id: string, field: keyof PricePackage, value: any) => {
    setPackages(packages.map(pkg => {
      if (pkg.id === id) {
        // If setting as default, remove default from others
        if (field === 'isDefault' && value === true) {
          return { ...pkg, isDefault: true };
        }
        return { ...pkg, [field]: value };
      }
      // Remove default from other packages if this one is being set as default
      if (field === 'isDefault' && value === true) {
        return { ...pkg, isDefault: false };
      }
      return pkg;
    }));
  };

  const togglePackageExpand = (id: string) => {
    setExpandedPackages(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
    if (!activePackageTab[id]) {
      setActivePackageTab({ ...activePackageTab, [id]: 'general' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#3546A6]" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">No se pudo cargar el tour</h2>
        <p className="mt-2 text-sm text-slate-600">Vuelve a intentarlo o regresa a la lista de tours.</p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin')}>Volver</Button>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl">
        {/* Header with Save Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#3546A6]">Precio</h2>
            <p className="text-slate-500">Configura los precios y paquetes del tour</p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-[#3546A6] to-[#9996DB] hover:opacity-90 text-white"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar precio
          </Button>
        </div>

        {/* Package Type Selection */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Package Type Toggle */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base">
                  Tipo de Paquete
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Individual: Un solo tipo de precio. Múltiple: Varios paquetes con diferentes precios (ej: Habitación Doble, Triple, etc.)</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  <button
                    className={cn(
                      "px-24 py-2.5 text-sm font-medium transition-all",
                      packageType === 'single' 
                        ? "bg-slate-100 text-[#3546A6] border-b-2 border-[#3546A6]" 
                        : "bg-white text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={() => setPackageType('single')}
                  >
                    Single
                  </button>
                  <button
                    className={cn(
                      "px-24 py-2.5 text-sm font-medium transition-all",
                      packageType === 'multiple' 
                        ? "bg-slate-100 text-[#3546A6] border-b-2 border-[#3546A6]" 
                        : "bg-white text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={() => setPackageType('multiple')}
                  >
                    Multiple
                  </button>
                </div>
              </div>

              {/* Primary Price Category */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base">
                  Seleccionar Categoría de Precio Principal
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">La categoría principal que se mostrará en las tarjetas del tour</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select value={primaryCategory} onValueChange={setPrimaryCategory}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages List */}
        <div className="space-y-3">
          {packages.map((pkg) => (
            <Collapsible 
              key={pkg.id}
              open={expandedPackages.includes(pkg.id)}
              onOpenChange={() => togglePackageExpand(pkg.id)}
            >
              <Card className="border-slate-200 shadow-none">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900 text-base">
                        {pkg.name || 'Sin nombre'}
                      </span>
                      {pkg.isDefault && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (packages.length <= 1) {
                            alert('Debe haber al menos un paquete');
                            return;
                          }
                          removePackage(pkg.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {expandedPackages.includes(pkg.id) ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-4 pb-4 border-t border-slate-100">
                    <Tabs 
                      value={activePackageTab[pkg.id] || 'general'} 
                      onValueChange={(val) => setActivePackageTab({ ...activePackageTab, [pkg.id]: val })}
                      className="mt-4"
                    >
                      <TabsList className="bg-white border border-slate-200 p-1">
                        <TabsTrigger 
                          value="general" 
                          className="data-[state=active]:bg-[#3546A6] data-[state=active]:text-white"
                        >
                          General
                        </TabsTrigger>
                        <TabsTrigger 
                          value="adult"
                          className="data-[state=active]:bg-[#3546A6] data-[state=active]:text-white"
                        >
                          Adult
                        </TabsTrigger>
                        <TabsTrigger 
                          value="child"
                          className="data-[state=active]:bg-[#3546A6] data-[state=active]:text-white"
                        >
                          Child
                        </TabsTrigger>
                        <TabsTrigger 
                          value="details"
                          className="data-[state=active]:bg-[#3546A6] data-[state=active]:text-white"
                        >
                          Details
                        </TabsTrigger>
                      </TabsList>

                      {/* General Tab */}
                      <TabsContent value="general" className="mt-4 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="flex items-center gap-1">
                              Nombre del Paquete
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3 h-3 text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Ej: Habitación Doble, Habitación Triple</p>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <Input
                              value={pkg.name}
                              onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                              className="mt-1.5"
                              placeholder="Habitación Doble"
                            />
                          </div>
                          <div>
                            <Label className="flex items-center gap-1">
                              Etiqueta
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3 h-3 text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Texto adicional (ej: Por persona, Recommended)</p>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <Input
                              value={pkg.label}
                              onChange={(e) => updatePackage(pkg.id, 'label', e.target.value)}
                              className="mt-1.5"
                              placeholder="Por persona"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Checkbox
                            id={`default-${pkg.id}`}
                            checked={pkg.isDefault}
                            onCheckedChange={(checked) => updatePackage(pkg.id, 'isDefault', checked)}
                          />
                          <label 
                            htmlFor={`default-${pkg.id}`}
                            className="text-sm font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                          >
                            Hacer este paquete predeterminado
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 text-slate-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>El paquete por defecto se muestra primero en el sitio</p>
                              </TooltipContent>
                            </Tooltip>
                          </label>
                        </div>
                      </TabsContent>

                      {/* Adult Tab */}
                      <TabsContent value="adult" className="mt-4 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="flex items-center gap-1">
                              Precio de Venta
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3 h-3 text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Precio final por adulto</p>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm font-medium text-slate-600">
                                USD $
                              </span>
                              <Input
                                type="number"
                                value={pkg.adultPrice}
                                onChange={(e) => updatePackage(pkg.id, 'adultPrice', Number(e.target.value))}
                                placeholder="250"
                                min="0"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="flex items-center gap-1">
                              Precio Tachado
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3 h-3 text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Precio antes del descuento (opcional)</p>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm font-medium text-slate-600">
                                USD $
                              </span>
                              <Input
                                type="number"
                                value={pkg.adultCrossedPrice || ''}
                                onChange={(e) => updatePackage(pkg.id, 'adultCrossedPrice', e.target.value ? Number(e.target.value) : 0)}
                                placeholder="320"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="flex items-center gap-1 mb-3">
                            Número de Pasajeros
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 text-slate-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Cantidad mínima y máxima de adultos</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-slate-600 mb-1.5">Min Pax.</Label>
                              <Input
                                type="number"
                                value={pkg.adultMinPax}
                                onChange={(e) => updatePackage(pkg.id, 'adultMinPax', Number(e.target.value))}
                                placeholder="1"
                                min="1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-slate-600 mb-1.5">Max Pax.</Label>
                              <Input
                                type="number"
                                value={pkg.adultMaxPax || ''}
                                onChange={(e) => updatePackage(pkg.id, 'adultMaxPax', e.target.value ? Number(e.target.value) : null)}
                                placeholder="∞"
                                min="1"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <label 
                            htmlFor={`adult-group-${pkg.id}`}
                            className="text-sm font-medium text-slate-700 cursor-pointer"
                          >
                            Descuento Grupal
                          </label>
                          <Switch
                            id={`adult-group-${pkg.id}`}
                            checked={pkg.adultGroupDiscount}
                            onCheckedChange={(checked) => updatePackage(pkg.id, 'adultGroupDiscount', checked)}
                          />
                        </div>

                        <div className="border-t pt-4">
                          <Label>Suplemento Individual (USD)</Label>
                          <Input
                            type="number"
                            value={pkg.adultSingleSupplement}
                            onChange={(e) => updatePackage(pkg.id, 'adultSingleSupplement', Number(e.target.value))}
                            className="mt-1.5"
                            placeholder="0"
                            min="0"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Cargo extra para habitación individual
                          </p>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Vista previa:</strong> 
                            {pkg.adultCrossedPrice && pkg.adultCrossedPrice > 0 && (
                              <span className="line-through text-slate-500 ml-1">
                                ${pkg.adultCrossedPrice.toLocaleString()} USD
                              </span>
                            )}
                            <span className="ml-1 font-semibold">
                              ${pkg.adultPrice.toLocaleString()} USD por adulto
                            </span>
                            {pkg.adultSingleSupplement > 0 && (
                              <span className="block text-xs mt-1">
                                +${pkg.adultSingleSupplement.toLocaleString()} suplemento individual
                              </span>
                            )}
                          </p>
                        </div>
                      </TabsContent>

                      {/* Child Tab */}
                      <TabsContent value="child" className="mt-4 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="flex items-center gap-1">
                              Precio de Venta
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3 h-3 text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Precio final por niño</p>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm font-medium text-slate-600">
                                USD $
                              </span>
                              <Input
                                type="number"
                                value={pkg.childPrice}
                                onChange={(e) => updatePackage(pkg.id, 'childPrice', Number(e.target.value))}
                                placeholder="150"
                                min="0"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="flex items-center gap-1">
                              Precio Tachado
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3 h-3 text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Precio antes del descuento (opcional)</p>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm font-medium text-slate-600">
                                USD $
                              </span>
                              <Input
                                type="number"
                                value={pkg.childCrossedPrice || ''}
                                onChange={(e) => updatePackage(pkg.id, 'childCrossedPrice', e.target.value ? Number(e.target.value) : 0)}
                                placeholder="200"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="flex items-center gap-1 mb-3">
                            Número de Pasajeros
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3 h-3 text-slate-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Cantidad mínima y máxima de niños</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-slate-600 mb-1.5">Min Pax.</Label>
                              <Input
                                type="number"
                                value={pkg.childMinPax}
                                onChange={(e) => updatePackage(pkg.id, 'childMinPax', Number(e.target.value))}
                                placeholder="1"
                                min="0"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-slate-600 mb-1.5">Max Pax.</Label>
                              <Input
                                type="number"
                                value={pkg.childMaxPax || ''}
                                onChange={(e) => updatePackage(pkg.id, 'childMaxPax', e.target.value ? Number(e.target.value) : null)}
                                placeholder="∞"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <label 
                            htmlFor={`child-group-${pkg.id}`}
                            className="text-sm font-medium text-slate-700 cursor-pointer"
                          >
                            Descuento Grupal
                          </label>
                          <Switch
                            id={`child-group-${pkg.id}`}
                            checked={pkg.childGroupDiscount}
                            onCheckedChange={(checked) => updatePackage(pkg.id, 'childGroupDiscount', checked)}
                          />
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-slate-700 mb-3">Rango de Edad</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Edad Mínima</Label>
                              <Input
                                type="number"
                                value={pkg.childAgeMin}
                                onChange={(e) => updatePackage(pkg.id, 'childAgeMin', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="3"
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>Edad Máxima</Label>
                              <Input
                                type="number"
                                value={pkg.childAgeMax}
                                onChange={(e) => updatePackage(pkg.id, 'childAgeMax', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="11"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-slate-700 mb-3">Infantes</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Precio Infante (USD)</Label>
                              <Input
                                type="number"
                                value={pkg.infantPrice}
                                onChange={(e) => updatePackage(pkg.id, 'infantPrice', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="0"
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>Edad Máxima Infante</Label>
                              <Input
                                type="number"
                                value={pkg.infantAgeMax}
                                onChange={(e) => updatePackage(pkg.id, 'infantAgeMax', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="2"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">
                            <strong>Niños ({pkg.childAgeMin}-{pkg.childAgeMax} años):</strong> 
                            {pkg.childCrossedPrice && pkg.childCrossedPrice > 0 && (
                              <span className="line-through text-slate-500 ml-1">
                                ${pkg.childCrossedPrice.toLocaleString()} USD
                              </span>
                            )}
                            <span className="ml-1 font-semibold">
                              ${pkg.childPrice.toLocaleString()} USD
                            </span>
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            <strong>Infantes (0-{pkg.infantAgeMax} años):</strong> ${pkg.infantPrice.toLocaleString()} USD
                          </p>
                        </div>
                      </TabsContent>

                      {/* Details Tab */}
                      <TabsContent value="details" className="mt-4 space-y-4">
                        <div>
                          <Label>Detalles Adicionales</Label>
                          <textarea
                            value={pkg.details}
                            onChange={(e) => updatePackage(pkg.id, 'details', e.target.value)}
                            className="mt-1.5 w-full min-h-[120px] rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3546A6]"
                            placeholder="Notas adicionales sobre este paquete (ej: incluye desayuno, tipo de habitación, etc.)"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          {/* Add New Package Button */}
          <Button
            variant="outline"
            onClick={addPackage}
            className="w-full border-dashed border-2 border-slate-300 hover:border-[#3546A6] hover:bg-slate-50 h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Package
          </Button>
        </div>

        {/* Starting Price - Optional */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Precio de Referencia</CardTitle>
            <CardDescription>Se mostrará en las tarjetas del tour</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Precio "Desde" (opcional)</Label>
              <Input
                type="number"
                value={startingPriceFrom ?? ''}
                onChange={(e) => setStartingPriceFrom(e.target.value ? Number(e.target.value) : null)}
                className="mt-1.5"
                placeholder="Para mostrar 'Desde $XXX USD'"
                min="0"
              />
              <p className="text-sm text-slate-500 mt-1">
                {startingPriceFrom ? `Se mostrará como "Desde $${startingPriceFrom.toLocaleString()} USD"` : 'Se usará el precio del paquete por defecto'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-6">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-[#3546A6] to-[#9996DB] hover:opacity-90 text-white"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar precio
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
