"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Repeat,
  Users,
  Clock,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { createClient } from '@/supabase/client';
import type { Tour, PricePackage, TourDate, TourDatePackage } from '@/types/database';

interface LocalTourDate {
  id: string;
  starting_date: string;
  cutoff_days: number;
  max_pax: number | null;
  repeat_enabled: boolean;
  repeat_pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  repeat_until: string | null;
  package_overrides: LocalPackageOverride[];
  isNew?: boolean;
}

interface LocalPackageOverride {
  package_id: string;
  enabled: boolean;
  price_override: number | null;
  max_pax_override: number | null;
  notes: string;
  blocked_dates: string[];
}

const repeatPatterns = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
];

export default function DatesPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.tourId as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [packages, setPackages] = useState<PricePackage[]>([]);
  const [dates, setDates] = useState<LocalTourDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});
  const [deletingDate, setDeletingDate] = useState<LocalTourDate | null>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      // Load tour with packages
      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .select('*')
        .eq('id', tourId)
        .single();

      if (tourError || !tourData) {
        setLoading(false);
        return;
      }

      setTour(tourData);
      
      // Load packages from price_packages table first, fallback to JSONB
      const { data: dbPackages, error: packagesError } = await supabase
        .from('price_packages')
        .select('*')
        .eq('tour_id', tourId)
        .order('sort_order', { ascending: true });
      
      console.log('Packages for dates loaded from DB:', { dbPackages, packagesError });
      
      // Map snake_case DB columns to the expected PricePackage format
      let tourPackages: PricePackage[] = [];
      if (dbPackages && dbPackages.length > 0) {
        tourPackages = dbPackages.map((pkg: any) => ({
          id: pkg.id,
          tour_id: pkg.tour_id,
          name: pkg.name || 'Sin nombre',
          description: pkg.description,
          adult_price: Number(pkg.adult_price) || 0,
          adult_crossed_price: pkg.adult_crossed_price ? Number(pkg.adult_crossed_price) : null,
          adult_min_pax: pkg.adult_min_pax || 1,
          adult_max_pax: pkg.adult_max_pax || null,
          child_price: pkg.child_price ? Number(pkg.child_price) : null,
          child_crossed_price: pkg.child_crossed_price ? Number(pkg.child_crossed_price) : null,
          child_min_pax: pkg.child_min_pax || 0,
          child_max_pax: pkg.child_max_pax || null,
          child_age_min: pkg.child_age_min || null,
          child_age_max: pkg.child_age_max || null,
          group_discount_enabled: pkg.group_discount_enabled || false,
          group_discount_percentage: pkg.group_discount_percentage || null,
          group_discount_min_pax: pkg.group_discount_min_pax || null,
          is_default: pkg.is_default || false,
          is_active: pkg.is_active ?? true,
          sort_order: pkg.sort_order || 0,
          created_at: pkg.created_at,
          updated_at: pkg.updated_at,
        }));
      } else {
        // Fallback to JSONB packages
        tourPackages = (tourData.price_packages as PricePackage[]) || [];
      }
      setPackages(tourPackages);

      // Load tour dates with package overrides
      const { data: datesData, error: datesError } = await supabase
        .from('tour_dates')
        .select(`
          *,
          package_overrides:tour_date_packages(
            *,
            blocked_dates:tour_date_blocked_dates(*)
          )
        `)
        .eq('tour_id', tourId)
        .order('start_date', { ascending: true });

      console.log('Dates loaded:', { datesData, datesError, tourPackages });

      if (datesData && datesData.length > 0) {
        const formattedDates: LocalTourDate[] = datesData.map((d: any) => ({
          id: d.id,
          starting_date: d.start_date,
          cutoff_days: d.cutoff_days || 0,
          max_pax: d.max_participants,
          repeat_enabled: d.repeat_enabled || false,
          repeat_pattern: d.repeat_pattern,
          repeat_until: d.repeat_until,
          package_overrides: tourPackages.map(pkg => {
            const existing = d.package_overrides?.find((po: any) => po.package_id === pkg.id);
            return {
              package_id: pkg.id,
              enabled: existing?.enabled ?? true,
              price_override: existing?.price_override ?? null,
              max_pax_override: existing?.max_pax_override ?? null,
              notes: existing?.notes || '',
              blocked_dates: existing?.blocked_dates?.map((bd: any) => bd.blocked_date) || [],
            };
          }),
        }));
        setDates(formattedDates);
        if (formattedDates.length > 0) {
          setExpandedDates([formattedDates[0].id]);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [tourId, router]);

  const addDate = () => {
    const newId = crypto.randomUUID();
    const newDate: LocalTourDate = {
      id: newId,
      starting_date: new Date().toISOString().split('T')[0],
      cutoff_days: 7,
      max_pax: null,
      repeat_enabled: false,
      repeat_pattern: null,
      repeat_until: null,
      package_overrides: packages.map(pkg => ({
        package_id: pkg.id,
        enabled: true,
        price_override: null,
        max_pax_override: null,
        notes: '',
        blocked_dates: [],
      })),
      isNew: true,
    };
    setDates([...dates, newDate]);
    setExpandedDates([...expandedDates, newId]);
    setActiveTab({ ...activeTab, [newId]: 'general' });
  };

  const removeDate = async (dateToRemove: LocalTourDate) => {
    if (!dateToRemove.isNew) {
      const supabase = createClient();
      await supabase.from('tour_dates').delete().eq('id', dateToRemove.id);
    }
    setDates(dates.filter(d => d.id !== dateToRemove.id));
    setDeletingDate(null);
  };

  const updateDate = (id: string, field: keyof LocalTourDate, value: any) => {
    setDates(dates.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const updatePackageOverride = (dateId: string, packageId: string, field: keyof LocalPackageOverride, value: any) => {
    setDates(dates.map(d => {
      if (d.id !== dateId) return d;
      return {
        ...d,
        package_overrides: d.package_overrides.map(po => 
          po.package_id === packageId ? { ...po, [field]: value } : po
        ),
      };
    }));
  };

  const toggleBlockedDate = (dateId: string, packageId: string, blockedDate: string) => {
    setDates(dates.map(d => {
      if (d.id !== dateId) return d;
      return {
        ...d,
        package_overrides: d.package_overrides.map(po => {
          if (po.package_id !== packageId) return po;
          const exists = po.blocked_dates.includes(blockedDate);
          return {
            ...po,
            blocked_dates: exists 
              ? po.blocked_dates.filter(bd => bd !== blockedDate)
              : [...po.blocked_dates, blockedDate],
          };
        }),
      };
    }));
  };

  const toggleDateExpand = (id: string) => {
    setExpandedDates(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
    if (!activeTab[id]) {
      setActiveTab({ ...activeTab, [id]: 'general' });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();

      for (const date of dates) {
        // Upsert tour_date
        const { data: savedDate, error: dateError } = await supabase
          .from('tour_dates')
          .upsert({
            id: date.isNew ? undefined : date.id,
            tour_id: tourId,
            start_date: date.starting_date,
            max_participants: date.max_pax,
            is_available: true,
            repeat_enabled: date.repeat_enabled,
            repeat_pattern: date.repeat_enabled ? date.repeat_pattern : null,
            repeat_until: date.repeat_enabled ? date.repeat_until : null,
          }, { onConflict: 'id' })
          .select()
          .single();

        if (dateError || !savedDate) {
          console.error('Error saving date:', dateError);
          continue;
        }

        // Delete existing package overrides
        await supabase
          .from('tour_date_packages')
          .delete()
          .eq('tour_date_id', savedDate.id);

        // Save package overrides
        for (const po of date.package_overrides) {
          const { data: savedPo, error: poError } = await supabase
            .from('tour_date_packages')
            .insert({
              tour_date_id: savedDate.id,
              package_id: po.package_id,
              enabled: po.enabled,
              price_override: po.price_override,
              max_pax_override: po.max_pax_override,
              notes: po.notes || null,
            })
            .select()
            .single();

          if (poError || !savedPo) {
            console.error('Error saving package override:', poError);
            continue;
          }

          // Save blocked dates
          if (po.blocked_dates.length > 0) {
            await supabase
              .from('tour_date_blocked_dates')
              .insert(
                po.blocked_dates.map(bd => ({
                  tour_date_package_id: savedPo.id,
                  blocked_date: bd,
                }))
              );
          }
        }
      }

      // Reload data
      const { data: datesData } = await supabase
        .from('tour_dates')
        .select(`
          *,
          package_overrides:tour_date_packages(
            *,
            blocked_dates:tour_date_blocked_dates(*)
          )
        `)
        .eq('tour_id', tourId)
        .order('start_date', { ascending: true });

      console.log('Dates reloaded after save:', datesData);

      if (datesData && datesData.length > 0) {
        const formattedDates: LocalTourDate[] = datesData.map((d: any) => ({
          id: d.id,
          starting_date: d.start_date,
          cutoff_days: d.cutoff_days || 0,
          max_pax: d.max_participants,
          repeat_enabled: d.repeat_enabled || false,
          repeat_pattern: d.repeat_pattern,
          repeat_until: d.repeat_until,
          package_overrides: packages.map(pkg => {
            const existing = d.package_overrides?.find((po: any) => po.package_id === pkg.id);
            return {
              package_id: pkg.id,
              enabled: existing?.enabled ?? true,
              price_override: existing?.price_override ?? null,
              max_pax_override: existing?.max_pax_override ?? null,
              notes: existing?.notes || '',
              blocked_dates: existing?.blocked_dates?.map((bd: any) => bd.blocked_date) || [],
            };
          }),
        }));
        setDates(formattedDates);
      }

    } catch (error) {
      console.error('Error saving dates:', error);
      alert('Error al guardar las fechas');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
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
        <p className="mt-2 text-sm text-slate-600">
          Vuelve a intentarlo o regresa a la lista de tours.
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin')}>Volver</Button>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#3546A6]">Fechas</h2>
          <p className="text-slate-500">Configura disponibilidad y reglas de salida del tour</p>
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
          Guardar Fechas
        </Button>
      </div>

      {/* No packages warning */}
      {packages.length === 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <p className="text-amber-700">
              No hay paquetes configurados. Ve a la sección de Precio para crear paquetes antes de configurar fechas.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Date Button */}
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={addDate}
          className="border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Fecha
        </Button>
      </div>

      {/* Dates List */}
      <div className="space-y-4">
        {dates.map((date) => (
          <Collapsible 
            key={date.id}
            open={expandedDates.includes(date.id)}
            onOpenChange={() => toggleDateExpand(date.id)}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#3546A6]" />
                    <span className="font-medium text-slate-800">
                      {formatDate(date.starting_date)}
                    </span>
                    {date.repeat_enabled && (
                      <Badge variant="outline" className="text-xs">
                        <Repeat className="w-3 h-3 mr-1" />
                        {date.repeat_pattern}
                      </Badge>
                    )}
                    {date.max_pax && (
                      <Badge variant="outline" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {date.max_pax} pax
                      </Badge>
                    )}
                    {date.isNew && (
                      <Badge className="bg-green-100 text-green-700 text-xs">Nueva</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingDate(date);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {expandedDates.includes(date.id) ? (
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
                    value={activeTab[date.id] || 'general'} 
                    onValueChange={(val) => setActiveTab({ ...activeTab, [date.id]: val })}
                    className="mt-4"
                  >
                    <TabsList className="bg-slate-100">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="packages">Paquetes</TabsTrigger>
                    </TabsList>

                    {/* General Tab */}
                    <TabsContent value="general" className="mt-4 space-y-6">
                      {/* Cutoff Time */}
                      <div>
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Cut Off Time
                        </Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            type="number"
                            value={date.cutoff_days}
                            onChange={(e) => updateDate(date.id, 'cutoff_days', Number(e.target.value))}
                            className="w-24"
                            min="0"
                            placeholder="10"
                          />
                          <span className="text-sm text-slate-600">Day(s)</span>
                        </div>
                      </div>

                      {/* Starting Dates */}
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Starting Dates</Label>
                        <Input
                          type="date"
                          value={date.starting_date}
                          onChange={(e) => updateDate(date.id, 'starting_date', e.target.value)}
                          className="mt-2"
                        />
                      </div>

                      {/* Repeat Date Section */}
                      <div className="border border-slate-200 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-slate-700">Repeat Date</Label>
                          <Switch
                            checked={date.repeat_enabled}
                            onCheckedChange={(checked) => updateDate(date.id, 'repeat_enabled', checked)}
                          />
                        </div>

                        {date.repeat_enabled && (
                          <>
                            <div>
                              <Label className="text-sm font-medium text-slate-700 mb-3 block">Pattern</Label>
                              <div className="space-y-2">
                                {repeatPatterns.map((pattern) => (
                                  <label key={pattern.value} className="flex items-center cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`repeat-pattern-${date.id}`}
                                      value={pattern.value}
                                      checked={date.repeat_pattern === pattern.value}
                                      onChange={() => updateDate(date.id, 'repeat_pattern', pattern.value)}
                                      className="mr-3 w-4 h-4 border-slate-300 text-[#3546A6]"
                                    />
                                    <span className="text-sm text-slate-700">{pattern.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-slate-700">Repeat Until</Label>
                              <Input
                                type="date"
                                value={date.repeat_until || ''}
                                onChange={(e) => updateDate(date.id, 'repeat_until', e.target.value || null)}
                                className="mt-2"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Número de Pax */}
                      <div>
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Número de Pax (Cupos)
                        </Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            type="number"
                            value={date.max_pax ?? ''}
                            onChange={(e) => updateDate(date.id, 'max_pax', e.target.value ? Number(e.target.value) : null)}
                            className="flex-1"
                            min="0"
                            placeholder="Ilimitado"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateDate(date.id, 'max_pax', null)}
                            className="whitespace-nowrap"
                          >
                            ∞ Ilimitado
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Packages Tab */}
                    <TabsContent value="packages" className="mt-4 space-y-4">
                      {packages.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">
                          No hay paquetes configurados
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {packages.map((pkg) => {
                            const override = date.package_overrides.find(po => po.package_id === pkg.id);
                            if (!override) return null;

                            return (
                              <Collapsible key={pkg.id}>
                                <Card className="border-slate-200">
                                  <CollapsibleTrigger asChild>
                                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                                      <div className="flex items-center gap-3">
                                        <Checkbox
                                          checked={override.enabled}
                                          onCheckedChange={(checked) => 
                                            updatePackageOverride(date.id, pkg.id, 'enabled', checked)
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className={cn(
                                          "font-medium",
                                          override.enabled ? "text-slate-800" : "text-slate-400 line-through"
                                        )}>
                                          {pkg.name}
                                        </span>
                                        {pkg.is_default && (
                                          <Badge variant="outline" className="text-xs">Predeterminado</Badge>
                                        )}
                                        {override.blocked_dates.length > 0 && (
                                          <Badge variant="outline" className="text-xs text-red-600">
                                            <Ban className="w-3 h-3 mr-1" />
                                            {override.blocked_dates.length} bloqueadas
                                          </Badge>
                                        )}
                                      </div>
                                      <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </div>
                                  </CollapsibleTrigger>

                                  <CollapsibleContent>
                                    <div className="px-3 pb-3 border-t border-slate-100 pt-3 space-y-4">
                                      <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                          <Label>Sobrescribir precio (USD)</Label>
                                          <Input
                                            type="number"
                                            value={override.price_override ?? ''}
                                            onChange={(e) => updatePackageOverride(
                                              date.id, 
                                              pkg.id, 
                                              'price_override', 
                                              e.target.value ? Number(e.target.value) : null
                                            )}
                                            className="mt-1.5"
                                            placeholder={`Predeterminado: $${pkg.adult_price}`}
                                            min="0"
                                          />
                                        </div>
                                        <div>
                                          <Label>Sobrescribir Max Pax</Label>
                                          <Input
                                            type="number"
                                            value={override.max_pax_override ?? ''}
                                            onChange={(e) => updatePackageOverride(
                                              date.id, 
                                              pkg.id, 
                                              'max_pax_override', 
                                              e.target.value ? Number(e.target.value) : null
                                            )}
                                            className="mt-1.5"
                                            placeholder="Heredar de fecha"
                                            min="0"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <Label>Notas</Label>
                                        <Textarea
                                          value={override.notes}
                                          onChange={(e) => updatePackageOverride(date.id, pkg.id, 'notes', e.target.value)}
                                          className="mt-1.5"
                                          placeholder="Notas internas sobre este paquete para esta fecha..."
                                          rows={2}
                                        />
                                      </div>

                                      {/* Block Dates */}
                                      <div>
                                        <Label className="flex items-center gap-2">
                                          <Ban className="w-4 h-4 text-red-500" />
                                          Bloquear fechas
                                        </Label>
                                        <p className="text-xs text-slate-500 mb-2">
                                          Selecciona fechas no disponibles para este paquete
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <Input
                                            type="date"
                                            id={`block-date-${date.id}-${pkg.id}`}
                                            className="flex-1"
                                          />
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              const input = document.getElementById(`block-date-${date.id}-${pkg.id}`) as HTMLInputElement;
                                              if (input.value) {
                                                toggleBlockedDate(date.id, pkg.id, input.value);
                                                input.value = '';
                                              }
                                            }}
                                          >
                                            <Plus className="w-4 h-4" />
                                          </Button>
                                        </div>
                                        {override.blocked_dates.length > 0 && (
                                          <div className="flex flex-wrap gap-2 mt-2">
                                            {override.blocked_dates.map((bd) => (
                                              <Badge 
                                                key={bd} 
                                                variant="secondary"
                                                className="bg-red-50 text-red-700 cursor-pointer hover:bg-red-100"
                                                onClick={() => toggleBlockedDate(date.id, pkg.id, bd)}
                                              >
                                                {formatDate(bd)}
                                                <span className="ml-1">×</span>
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Card>
                              </Collapsible>
                            );
                          })}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}

        {dates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No hay fechas configuradas</p>
              <p className="text-sm text-slate-400 mt-1">Agrega una fecha para comenzar</p>
            </CardContent>
          </Card>
        )}
      </div>

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
          Guardar Fechas
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingDate} onOpenChange={() => setDeletingDate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar fecha?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la fecha {deletingDate && formatDate(deletingDate.starting_date)} y todos sus overrides de paquetes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingDate && removeDate(deletingDate)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
