"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  X, 
  HelpCircle, 
  Upload,
  GripVertical,
  Check,
  ExternalLink,
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { cn } from '@/lib/utils';
import { createClient } from '@/supabase/client';
import type { Tour, Destination, PricePackage } from '@/types/database';

type LocalPackage = PricePackage & {
  label?: string;
  adultSingleSupplement?: number;
  childPrice?: number;
  infantPrice?: number;
  infantAgeMax?: number;
  details?: string;
};

// Types
interface GeneralFormData {
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  tour_label: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string[];
  imageUrl?: string;
}


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

// Constants
const defaultDestinations = ['Suramérica', 'Europa', 'Asia', 'África', 'Norteamérica', 'Oceanía'];
const defaultActivities = ['Cultural', 'Aventura', 'Naturaleza', 'Playa', 'Historia', 'Gastronomía'];
const defaultDifficultyLevels = ['Facil', 'Moderado', 'Difícil', 'Intenso'];
const priceCategories = ['Adulto', 'Niño', 'Infante'];
const repeatPatterns = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
];

const predefinedIncludes = [
  'Alojamiento',
  'Desayunos diarios',
  'Traslados aeropuerto-hotel-aeropuerto',
  'Tours con guía bilingüe',
  'Entradas a atracciones',
  'Seguro de viaje',
  'Asistencia 24/7',
];

const predefinedExcludes = [
  'Vuelos internacionales',
  'Comidas no mencionadas',
  'Propinas',
  'Gastos personales',
  'Bebidas alcohólicas',
  'Actividades opcionales',
];

const defaultPackage = {
  tour_id: '',
  name: '',
  description: null,
  is_default: false,
  is_active: true,
  sort_order: 0,
  // Adult pricing
  adult_price: 0,
  adult_crossed_price: null,
  adult_min_pax: 1,
  adult_max_pax: null,
  // Child pricing
  child_price: 0,
  child_crossed_price: null,
  child_min_pax: 0,
  child_max_pax: null,
  child_age_min: 3,
  child_age_max: 11,
  // Group discount
  group_discount_enabled: false,
  group_discount_percentage: null,
  group_discount_min_pax: null,
  created_at: '',
  updated_at: '',
};

export default function UnifiedTourEditorPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.tourId as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // General section state
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [customDestinations, setCustomDestinations] = useState<string[]>([]);
  const [customActivities, setCustomActivities] = useState<string[]>([]);
  const [customDifficultyLevels, setCustomDifficultyLevels] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [tourType, setTourType] = useState<'activity' | 'multiday'>('multiday');
  const [durationDays, setDurationDays] = useState(1);
  const [ageRange, setAgeRange] = useState<[number, number]>([10, 70]);

  // Itinerary state
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

  // Price state
  const [packageType, setPackageType] = useState<'single' | 'multiple'>('single');
  const [primaryCategory, setPrimaryCategory] = useState('Adult');
  const [packages, setPackages] = useState<LocalPackage[]>([]);
  const [expandedPackages, setExpandedPackages] = useState<string[]>([]);
  const [activePackageTab, setActivePackageTab] = useState<Record<string, string>>({});
  const [startingPriceFrom, setStartingPriceFrom] = useState<number | null>(null);

  // Dates state
  const [dates, setDates] = useState<LocalTourDate[]>([]);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);
  const [activeDateTab, setActiveDateTab] = useState<Record<string, string>>({});
  const [deletingDate, setDeletingDate] = useState<LocalTourDate | null>(null);

  // Includes/Excludes state
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<GeneralFormData>();
  const title = watch('title');
  const slug = watch('slug');

  // Generate slug from title
  useEffect(() => {
    if (title && tour && !tour.slug) {
      const newSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', newSlug);
    }
  }, [title, tour, setValue]);

  // Load all data
  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      const [tourResult, destResult] = await Promise.all([
        supabase
          .from('tours')
          .select(`*, destination:destinations(*)`)
          .eq('id', tourId)
          .single(),
        supabase
          .from('destinations')
          .select('*')
          .order('name')
      ]);

      if (tourResult.error || !tourResult.data) {
        setLoading(false);
        return;
      }

      const tourData = tourResult.data;
      setTour(tourData);
      setDestinations(destResult.data || []);
      
      // General
      setGalleryImages(tourData.gallery_image_urls || []);
      setDurationDays(tourData.duration_days || 1);
      setTourType(tourData.duration_days > 1 ? 'multiday' : 'activity');
      setAgeRange([tourData.age_min || 10, tourData.age_max || 70]);
      setSelectedDifficulty(tourData.difficulty_level || '');
      
      if (tourData.destination_name) {
        setSelectedDestinations(tourData.destination_name.split(',').map((s: string) => s.trim()).filter(Boolean));
      }
      if (tourData.activities_label) {
        setSelectedActivities(tourData.activities_label.split(',').map((s: string) => s.trim()).filter(Boolean));
      }
      
      reset({
        title: tourData.title,
        slug: tourData.slug,
        short_description: tourData.short_description || '',
        long_description: tourData.long_description || '',
        tour_label: tourData.tour_label || '',
      });

      // Itinerary
      setItinerary(tourData.itinerary || []);

      // Prices
      const savedPackages = tourData.price_packages as LocalPackage[] | null;
      if (savedPackages && savedPackages.length > 0) {
        setPackages(savedPackages);
        setPackageType(savedPackages.length > 1 ? 'multiple' : 'single');
        setExpandedPackages([savedPackages[0].id]);
      } else {
        const defaultPkg: LocalPackage = {
          ...defaultPackage,
          id: crypto.randomUUID(),
          name: 'Habitación Doble',
          is_default: true,
          adult_price: tourData.price_usd || 0,
        };
        setPackages([defaultPkg]);
        setExpandedPackages([defaultPkg.id]);
      }
      setPackageType(tourData.package_type || 'single');
      setPrimaryCategory(tourData.primary_price_category || 'Adulto');
      setStartingPriceFrom(tourData.starting_price_from ?? null);

      // Dates
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
        .order('starting_date', { ascending: true });

      if (datesData) {
        const tourPackages = savedPackages || [];
        const formattedDates: LocalTourDate[] = datesData.map((d: any) => ({
          id: d.id,
          starting_date: d.starting_date,
          cutoff_days: d.cutoff_days || 0,
          max_pax: d.max_pax,
          repeat_enabled: d.repeat_enabled || false,
          repeat_pattern: d.repeat_pattern,
          repeat_until: d.repeat_until,
          package_overrides: tourPackages.map((pkg: LocalPackage) => {
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

      // Includes/Excludes
      setIncludes(tourData.includes || []);
      setExcludes(tourData.excludes || []);
      
      setLoading(false);
    }

    loadData();
  }, [tourId, router, reset]);

  // Save all data
  const onSubmitAll = async (data: GeneralFormData) => {
    setIsSaving(true);
    try {
      const supabase = createClient();

      // Calculate main price from default package
      const defaultPkg = packages.find(p => p.is_default) || packages[0];
      const mainPrice = defaultPkg?.adult_price || 0;

      // Update tour
      const { error: tourError } = await supabase
        .from('tours')
        .update({
          // General
          title: data.title,
          slug: data.slug,
          short_description: data.short_description || null,
          long_description: data.long_description || null,
          duration_days: tourType === 'activity' ? 1 : durationDays,
          difficulty_level: selectedDifficulty || null,
          destination_name: selectedDestinations.join(', ') || null,
          activities_label: selectedActivities.join(', ') || null,
          age_min: ageRange[0],
          age_max: ageRange[1],
          tour_label: data.tour_label || null,
          gallery_image_urls: galleryImages,
          // Itinerary
          itinerary: itinerary,
          // Price
          price_usd: mainPrice,
          starting_price_from: startingPriceFrom,
          package_type: packageType,
          primary_price_category: primaryCategory,
          price_packages: packages,
          // Includes
          includes: includes,
          excludes: excludes,
        })
        .eq('id', tourId);

      if (tourError) throw tourError;

      // Save dates
      for (const date of dates) {
        const { data: savedDate, error: dateError } = await supabase
          .from('tour_dates')
          .upsert({
            id: date.isNew ? undefined : date.id,
            tour_id: tourId,
            starting_date: date.starting_date,
            cutoff_days: date.cutoff_days,
            max_pax: date.max_pax,
            repeat_enabled: date.repeat_enabled,
            repeat_pattern: date.repeat_enabled ? date.repeat_pattern : null,
            repeat_until: date.repeat_enabled ? date.repeat_until : null,
          }, { onConflict: 'id' })
          .select()
          .single();

        if (dateError || !savedDate) continue;

        await supabase
          .from('tour_date_packages')
          .delete()
          .eq('tour_date_id', savedDate.id);

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

          if (poError || !savedPo) continue;

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

      // Refresh data
      const { data: updatedTour } = await supabase
        .from('tours')
        .select(`*, destination:destinations(*)`)
        .eq('id', tourId)
        .single();
      
      if (updatedTour) {
        setTour(updatedTour);
      }

      alert('Tour guardado exitosamente');
    } catch (error) {
      console.error('Error saving tour:', error);
      alert('Error al guardar el tour');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper functions remain the same as before...
  const addGalleryImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) setGalleryImages([...galleryImages, url]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const allDestinations = Array.from(new Set([...defaultDestinations, ...customDestinations]));
  const allActivities = Array.from(new Set([...defaultActivities, ...customActivities]));
  const allDifficultyLevels = Array.from(new Set([...defaultDifficultyLevels, ...customDifficultyLevels]));

  const addNewDestination = () => {
    const newDest = prompt('Ingresa el nombre del nuevo destino:');
    if (newDest && !allDestinations.includes(newDest)) {
      setCustomDestinations([...customDestinations, newDest]);
      setSelectedDestinations([...selectedDestinations, newDest]);
    }
  };

  const addNewActivity = () => {
    const newAct = prompt('Ingresa el nombre de la nueva actividad:');
    if (newAct && !allActivities.includes(newAct)) {
      setCustomActivities([...customActivities, newAct]);
      setSelectedActivities([...selectedActivities, newAct]);
    }
  };

  const addNewDifficulty = () => {
    const newDiff = prompt('Ingresa el nuevo nivel de dificultad:');
    if (newDiff && !allDifficultyLevels.includes(newDiff)) {
      setCustomDifficultyLevels([...customDifficultyLevels, newDiff]);
      setSelectedDifficulty(newDiff);
    }
  };

  const toggleDestination = (dest: string) => {
    setSelectedDestinations(prev => 
      prev.includes(dest) ? prev.filter(d => d !== dest) : [...prev, dest]
    );
  };

  const toggleActivity = (act: string) => {
    setSelectedActivities(prev => 
      prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]
    );
  };

  // Itinerary functions
  const addDay = () => {
    setItinerary([
      ...itinerary,
      {
        day: itinerary.length + 1,
        title: '',
        description: '',
        accommodation: '',
        meals: [],
        imageUrl: '',
      },
    ]);
  };

  const updateDay = (index: number, field: string, value: any) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const removeDay = (index: number) => {
    setItinerary(
      itinerary
        .filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day: i + 1 }))
    );
  };

  // Price functions
  const addPackage = () => {
    const newPkg: LocalPackage = {
      ...defaultPackage,
      id: crypto.randomUUID(),
      name: `Package ${packages.length + 1}`,
    };
    setPackages([...packages, newPkg]);
    setExpandedPackages([...expandedPackages, newPkg.id]);
    setActivePackageTab({ ...activePackageTab, [newPkg.id]: 'general' });
  };

  const removePackage = (id: string) => {
    if (packages.length <= 1) return;
    const updatedPackages = packages.filter(p => p.id !== id);
    if (packages.find(p => p.id === id)?.is_default && updatedPackages.length > 0) {
      updatedPackages[0].is_default = true;
    }
    setPackages(updatedPackages);
    setExpandedPackages(expandedPackages.filter(eid => eid !== id));
  };

  const updatePackage = (id: string, field: keyof LocalPackage, value: any) => {
    setPackages(packages.map(pkg => {
      if (pkg.id === id) {
        if (field === 'is_default' && value === true) {
          return { ...pkg, is_default: true };
        }
        return { ...pkg, [field]: value };
      }
      if (field === 'is_default' && value === true) {
        return { ...pkg, is_default: false };
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

  // Date functions
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
    setActiveDateTab({ ...activeDateTab, [newId]: 'general' });
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
    if (!activeDateTab[id]) {
      setActiveDateTab({ ...activeDateTab, [id]: 'general' });
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

  // Includes/Excludes functions
  const togglePredefinedInclude = (item: string) => {
    if (includes.includes(item)) {
      setIncludes(includes.filter(i => i !== item));
    } else {
      setIncludes([...includes, item]);
    }
  };

  const togglePredefinedExclude = (item: string) => {
    if (excludes.includes(item)) {
      setExcludes(excludes.filter(i => i !== item));
    } else {
      setExcludes([...excludes, item]);
    }
  };

  const addCustomInclude = () => {
    if (newInclude.trim() && !includes.includes(newInclude.trim())) {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude('');
    }
  };

  const addCustomExclude = () => {
    if (newExclude.trim() && !excludes.includes(newExclude.trim())) {
      setExcludes([...excludes, newExclude.trim()]);
      setNewExclude('');
    }
  };

  const removeInclude = (item: string) => {
    setIncludes(includes.filter(i => i !== item));
  };

  const removeExclude = (item: string) => {
    setExcludes(excludes.filter(i => i !== item));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#3546A6]" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">No se pudo cargar el tour</h2>
          <p className="mt-2 text-sm text-slate-600">
            Vuelve a intentarlo o regresa a la lista de tours.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" onClick={() => router.push('/admin')}>Volver</Button>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </div>
      </div>
    );
  }

  const tourUrl = slug ? `https://travelcore.ontripcart.com/tour/${slug}/` : '';

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit(onSubmitAll)} className="max-w-5xl mx-auto p-8 space-y-12">
        {/* Sticky Save Button */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 -mx-8 -mt-8 px-8 py-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#3546A6]">{tour?.title || 'Editar Tour'}</h1>
              <p className="text-sm text-slate-500">Toda la configuración del tour en una sola página</p>
            </div>
            <Button 
              type="submit" 
              disabled={isSaving}
              className="bg-gradient-to-r from-[#3546A6] to-[#9996DB] hover:opacity-90 text-white px-8"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar Todo
            </Button>
          </div>
        </div>

        {/* SECTION 1: GENERAL */}
        <section id="general">
          <h2 className="text-2xl font-semibold text-[#3546A6] mb-6">General</h2>
          
          <div className="flex gap-8">
            <div className="flex-1 space-y-6">
              {/* Tour Name */}
              <div>
                <Label>Nombre del tour</Label>
                <Input
                  {...register('title', { required: 'El título es requerido' })}
                  className="mt-2"
                  placeholder="Nombre del tour"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              {/* Link */}
              <div>
                <Label>Enlace</Label>
                <Input
                  {...register('slug', { required: 'El slug es requerido' })}
                  className="mt-2"
                  placeholder="nombre-del-tour"
                />
                {tourUrl && (
                  <a 
                    href={tourUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 text-[#3B82F6] text-sm flex items-center gap-1 hover:underline"
                  >
                    {tourUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Tour Type */}
              <div>
                <Label>Tipo de tour</Label>
                <div className="mt-2 flex rounded-lg border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    className={cn(
                      "flex-1 py-3 text-sm font-medium transition-colors",
                      tourType === 'activity'
                        ? "bg-white text-slate-800 border-r border-slate-200"
                        : "bg-slate-50 text-slate-500"
                    )}
                    onClick={() => setTourType('activity')}
                  >
                    Actividad/Un día
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex-1 py-3 text-sm font-medium transition-colors",
                      tourType === 'multiday'
                        ? "bg-white text-[#3B82F6]"
                        : "bg-slate-50 text-slate-500"
                    )}
                    onClick={() => setTourType('multiday')}
                  >
                    Varios días
                  </button>
                </div>
              </div>

              {/* Duration */}
              {tourType === 'multiday' && (
                <div>
                  <Label>Duración</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-20 text-center"
                      min="1"
                    />
                    <span className="px-4 py-3 bg-slate-100 rounded-lg text-slate-600 text-sm">Día(s)</span>
                  </div>
                </div>
              )}

              {/* Age Range */}
              <div>
                <Label>Rango de edad</Label>
                <div className="mt-4 flex items-center gap-4">
                  <Input
                    type="number"
                    value={ageRange[0]}
                    onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
                    className="w-16 text-center"
                    min="0"
                    max="100"
                  />
                  <div className="flex-1">
                    <Slider
                      value={ageRange}
                      onValueChange={(value) => setAgeRange(value as [number, number])}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                  <Input
                    type="number"
                    value={ageRange[1]}
                    onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
                    className="w-16 text-center"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <Label>Destino</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {selectedDestinations.length > 0 ? (
                        selectedDestinations.map((dest) => (
                          <Badge 
                            key={dest} 
                            variant="secondary" 
                            className="bg-[#3B82F6]/10 text-[#3B82F6]"
                          >
                            {dest}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDestination(dest);
                              }}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-slate-400">Seleccionar destino</span>
                      )}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {allDestinations.map((dest) => (
                      <SelectItem 
                        key={dest} 
                        value={dest}
                        onClick={() => toggleDestination(dest)}
                        className={cn(
                          selectedDestinations.includes(dest) && "bg-[#3B82F6]/10"
                        )}
                      >
                        {dest}
                      </SelectItem>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={addNewDestination}
                        className="w-full px-2 py-2 text-left text-sm text-[#3B82F6] hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Añadir nuevo destino
                      </button>
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* Activities */}
              <div>
                <Label>Actividades</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <span className="text-slate-400">
                      {selectedActivities.length > 0 ? selectedActivities.join(', ') : 'buscar'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {allActivities.map((act) => (
                      <SelectItem 
                        key={act} 
                        value={act}
                        onClick={() => toggleActivity(act)}
                        className={cn(
                          selectedActivities.includes(act) && "bg-[#3B82F6]/10"
                        )}
                      >
                        {act}
                      </SelectItem>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={addNewActivity}
                        className="w-full px-2 py-2 text-left text-sm text-[#3B82F6] hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Añadir nueva actividad
                      </button>
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div>
                <Label>Nivel de dificultad</Label>
                <Select 
                  value={selectedDifficulty} 
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {allDifficultyLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={addNewDifficulty}
                        className="w-full px-2 py-2 text-left text-sm text-[#3B82F6] hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Añadir nuevo nivel
                      </button>
                    </div>
                  </SelectContent>
                </Select>
                {selectedDifficulty && (
                  <div className="mt-2">
                    <Badge variant="secondary">
                      {selectedDifficulty}
                      <button
                        type="button"
                        onClick={() => setSelectedDifficulty('')}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Tour Label */}
              <div>
                <Label className="flex items-center gap-1">
                  Etiqueta del tour
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Etiqueta especial que aparece en la tarjeta del tour</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  {...register('tour_label')}
                  className="mt-2"
                  placeholder="Etiqueta del tour"
                />
              </div>

              {/* Excerpt */}
              <div>
                <Label>Resumen</Label>
                <Textarea
                  {...register('short_description')}
                  className="mt-2"
                  placeholder="Ingresa un resumen del tour"
                  rows={2}
                />
              </div>

              {/* Description */}
              <div>
                <Label>Descripción</Label>
                <Textarea
                  {...register('long_description')}
                  className="mt-2 min-h-[120px]"
                  placeholder="Descripción detallada del tour"
                />
              </div>
            </div>

            {/* Gallery */}
            <div className="w-72">
              <Label>Agregar galería</Label>
              <button
                type="button"
                onClick={addGalleryImage}
                className="mt-2 w-full h-32 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-[#3B82F6] hover:border-[#3B82F6] hover:bg-[#3B82F6]/5 transition-colors"
              >
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Abrir galería de imágenes</span>
              </button>
              
              {galleryImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {galleryImages.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img 
                        src={url} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-white/80 text-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-500 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <Separator />

        {/* SECTION 2: ITINERARY */}
        <section id="itinerary">
          <h2 className="text-2xl font-semibold text-[#3546A6] mb-6">Itinerario</h2>
          
          {itinerary.length > 0 ? (
            <Accordion type="multiple" className="space-y-4">
              {itinerary.map((day, index) => (
                <AccordionItem 
                  key={index} 
                  value={`day-${index}`}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-[#3546A6]">Día {day.day}</span>
                      {day.title && (
                        <span className="text-slate-600">- {day.title}</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 pt-2">
                      <div>
                        <Label>Título del día</Label>
                        <Input
                          value={day.title}
                          onChange={(e) => updateDay(index, 'title', e.target.value)}
                          className="mt-1.5"
                          placeholder="Ej: Llegada a Cusco"
                        />
                      </div>

                      <div>
                        <Label>Descripción</Label>
                        <Textarea
                          value={day.description}
                          onChange={(e) => updateDay(index, 'description', e.target.value)}
                          className="mt-1.5"
                          placeholder="Describe las actividades del día..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label>Alojamiento</Label>
                        <Input
                          value={day.accommodation || ''}
                          onChange={(e) => updateDay(index, 'accommodation', e.target.value)}
                          className="mt-1.5"
                          placeholder="Ej: Hotel Marriott Cusco"
                        />
                      </div>

                      <div>
                        <Label>URL de imagen del día</Label>
                        <Input
                          value={day.imageUrl || ''}
                          onChange={(e) => updateDay(index, 'imageUrl', e.target.value)}
                          className="mt-1.5"
                          placeholder="https://..."
                        />
                        {day.imageUrl && (
                          <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden">
                            <img 
                              src={day.imageUrl} 
                              alt={`Day ${day.day}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDay(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar día
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p className="mb-4">No hay días en el itinerario</p>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={addDay}
            className="w-full mt-4 border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar día
          </Button>
        </section>

        <Separator />

        {/* SECTION 3: PRECIO */}
        <section id="price">
          <h2 className="text-2xl font-semibold text-[#3546A6] mb-6">Precio</h2>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Label className="flex items-center gap-1">
                    Tipo de paquete
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Individual: Un solo tipo de precio. Múltiple: Varios paquetes con diferentes precios</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      type="button"
                      className={cn(
                        "px-6 py-2 text-sm font-medium transition-colors",
                        packageType === 'single' 
                          ? "bg-[#3546A6] text-white" 
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      )}
                      onClick={() => setPackageType('single')}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "px-6 py-2 text-sm font-medium transition-colors",
                        packageType === 'multiple' 
                          ? "bg-[#3546A6] text-white" 
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      )}
                      onClick={() => setPackageType('multiple')}
                    >
                      Múltiple
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Label>Categoría Principal</Label>
                  <Select value={primaryCategory} onValueChange={setPrimaryCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPackage}
                    className="border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Paquete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {packages.map((pkg) => (
              <Collapsible 
                key={pkg.id}
                open={expandedPackages.includes(pkg.id)}
                onOpenChange={() => togglePackageExpand(pkg.id)}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-800">
                          {pkg.name || 'Sin nombre'}
                        </span>
                        {pkg.is_default && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-500"
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
                        <TabsList className="bg-slate-100">
                          <TabsTrigger value="general">General</TabsTrigger>
                          <TabsTrigger value="adult">Adulto</TabsTrigger>
                          <TabsTrigger value="child">Niño</TabsTrigger>
                          <TabsTrigger value="details">Detalles</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="mt-4 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Nombre del Paquete</Label>
                              <Input
                                value={pkg.name}
                                onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                                className="mt-1.5"
                                placeholder="Habitación Doble"
                              />
                            </div>
                            <div>
                              <Label>Etiqueta</Label>
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
                              checked={pkg.is_default}
                              onCheckedChange={(checked) => updatePackage(pkg.id, 'is_default', checked)}
                            />
                            <label 
                              htmlFor={`default-${pkg.id}`}
                              className="text-sm font-medium text-slate-700 cursor-pointer"
                            >
                              Hacer este paquete predeterminado
                            </label>
                          </div>
                        </TabsContent>

                        <TabsContent value="adult" className="mt-4 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Precio Adulto (USD)</Label>
                              <Input
                                type="number"
                                value={pkg.adult_price}
                                onChange={(e) => updatePackage(pkg.id, 'adult_price', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="0"
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>Suplemento Individual</Label>
                              <Input
                                type="number"
                                value={pkg.adultSingleSupplement}
                                onChange={(e) => updatePackage(pkg.id, 'adultSingleSupplement', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="0"
                                min="0"
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="child" className="mt-4 space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label>Precio Niño (USD)</Label>
                              <Input
                                type="number"
                                value={pkg.childPrice}
                                onChange={(e) => updatePackage(pkg.id, 'childPrice', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="0"
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>Edad Mínima</Label>
                              <Input
                                type="number"
                                value={pkg.child_age_min ?? ''}
                                onChange={(e) => updatePackage(pkg.id, 'child_age_min', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="3"
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>Edad Máxima</Label>
                              <Input
                                type="number"
                                value={pkg.child_age_max ?? ''}
                                onChange={(e) => updatePackage(pkg.id, 'child_age_max', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="11"
                                min="0"
                              />
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
                        </TabsContent>

                        <TabsContent value="details" className="mt-4">
                          <div>
                            <Label>Detalles Adicionales</Label>
                            <Textarea
                              value={pkg.details}
                              onChange={(e) => updatePackage(pkg.id, 'details', e.target.value)}
                              className="mt-1.5 min-h-[120px]"
                              placeholder="Notas adicionales sobre este paquete"
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>

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
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* SECTION 4: FECHAS */}
        <section id="dates">
          <h2 className="text-2xl font-semibold text-[#3546A6] mb-6">Fechas</h2>
          
          {packages.length === 0 && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <p className="text-amber-700">
                  No hay paquetes configurados. Configura paquetes en la sección de Precio antes de agregar fechas.
                </p>
              </CardContent>
            </Card>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={addDate}
            className="mb-4 border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Fecha
          </Button>

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
                        {date.isNew && (
                          <Badge className="bg-green-100 text-green-700 text-xs">Nueva</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
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
                        value={activeDateTab[date.id] || 'general'} 
                        onValueChange={(val) => setActiveDateTab({ ...activeDateTab, [date.id]: val })}
                        className="mt-4"
                      >
                        <TabsList className="bg-slate-100">
                          <TabsTrigger value="general">General</TabsTrigger>
                          <TabsTrigger value="packages">Paquetes</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="mt-4 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Fecha de inicio</Label>
                              <Input
                                type="date"
                                value={date.starting_date}
                                onChange={(e) => updateDate(date.id, 'starting_date', e.target.value)}
                                className="mt-1.5"
                              />
                            </div>
                            <div>
                              <Label>Tiempo de cierre (Días)</Label>
                              <Input
                                type="number"
                                value={date.cutoff_days}
                                onChange={(e) => updateDate(date.id, 'cutoff_days', Number(e.target.value))}
                                className="mt-1.5"
                                min="0"
                                placeholder="7"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Número de Pax (Cupos)</Label>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Input
                                type="number"
                                value={date.max_pax ?? ''}
                                onChange={(e) => updateDate(date.id, 'max_pax', e.target.value ? Number(e.target.value) : null)}
                                className="flex-1"
                                min="0"
                                placeholder="Ilimitado"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateDate(date.id, 'max_pax', null)}
                              >
                                ∞ Ilimitado
                              </Button>
                            </div>
                          </div>

                          <div className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <Label>Repetir fecha</Label>
                              <Switch
                                checked={date.repeat_enabled}
                                onCheckedChange={(checked) => updateDate(date.id, 'repeat_enabled', checked)}
                              />
                            </div>

                            {date.repeat_enabled && (
                              <>
                                <div>
                                  <Label>Patrón de repetición</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {repeatPatterns.map((pattern) => (
                                      <Button
                                        key={pattern.value}
                                        type="button"
                                        variant={date.repeat_pattern === pattern.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => updateDate(date.id, 'repeat_pattern', pattern.value)}
                                      >
                                        {pattern.label}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <Label>Repetir hasta</Label>
                                  <Input
                                    type="date"
                                    value={date.repeat_until || ''}
                                    onChange={(e) => updateDate(date.id, 'repeat_until', e.target.value || null)}
                                    className="mt-1.5"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="packages" className="mt-4">
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
                                  <Card key={pkg.id} className="border-slate-200">
                                    <div className="p-3">
                                      <div className="flex items-center gap-3">
                                        <Checkbox
                                          checked={override.enabled}
                                          onCheckedChange={(checked) => 
                                            updatePackageOverride(date.id, pkg.id, 'enabled', checked)
                                          }
                                        />
                                        <span className={cn(
                                          "font-medium",
                                          override.enabled ? "text-slate-800" : "text-slate-400 line-through"
                                        )}>
                                          {pkg.name}
                                        </span>
                                      </div>
                                      
                                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                          <Label className="text-xs">Sobrescribir precio (USD)</Label>
                                          <Input
                                            type="number"
                                            value={override.price_override ?? ''}
                                            onChange={(e) => updatePackageOverride(
                                              date.id, 
                                              pkg.id, 
                                              'price_override', 
                                              e.target.value ? Number(e.target.value) : null
                                            )}
                                            className="mt-1"
                                            placeholder={`Predeterminado: $${pkg.adult_price}`}
                                            min="0"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs">Sobrescribir Max Pax</Label>
                                          <Input
                                            type="number"
                                            value={override.max_pax_override ?? ''}
                                            onChange={(e) => updatePackageOverride(
                                              date.id, 
                                              pkg.id, 
                                              'max_pax_override', 
                                              e.target.value ? Number(e.target.value) : null
                                            )}
                                            className="mt-1"
                                            placeholder="Heredar de fecha"
                                            min="0"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
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
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <Separator />

        {/* SECTION 5: INCLUYE / NO INCLUYE */}
        <section id="includes">
          <h2 className="text-2xl font-semibold text-[#3546A6] mb-6">Incluye / No incluye</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Includes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Check className="w-5 h-5" />
                  Incluye
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-500">Opciones rápidas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {predefinedIncludes.map((item) => (
                      <Badge
                        key={item}
                        variant={includes.includes(item) ? 'default' : 'outline'}
                        className={`cursor-pointer ${
                          includes.includes(item) 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'hover:bg-slate-100'
                        }`}
                        onClick={() => togglePredefinedInclude(item)}
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-slate-500">Agregar personalizado</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newInclude}
                      onChange={(e) => setNewInclude(e.target.value)}
                      placeholder="Nuevo item..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInclude())}
                    />
                    <Button type="button" variant="outline" onClick={addCustomInclude}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-slate-500">Lista actual ({includes.length})</Label>
                  <div className="mt-2 space-y-2">
                    {includes.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                      >
                        <span className="text-sm text-green-800 flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          {item}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInclude(item)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {includes.length === 0 && (
                      <p className="text-sm text-slate-400 text-center py-4">
                        No hay items agregados
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Excludes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <X className="w-5 h-5" />
                  No incluye
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-500">Opciones rápidas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {predefinedExcludes.map((item) => (
                      <Badge
                        key={item}
                        variant={excludes.includes(item) ? 'default' : 'outline'}
                        className={`cursor-pointer ${
                          excludes.includes(item) 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'hover:bg-slate-100'
                        }`}
                        onClick={() => togglePredefinedExclude(item)}
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-slate-500">Agregar personalizado</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newExclude}
                      onChange={(e) => setNewExclude(e.target.value)}
                      placeholder="Nuevo item..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomExclude())}
                    />
                    <Button type="button" variant="outline" onClick={addCustomExclude}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-slate-500">Lista actual ({excludes.length})</Label>
                  <div className="mt-2 space-y-2">
                    {excludes.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2 bg-red-50 rounded-lg"
                      >
                        <span className="text-sm text-red-800 flex items-center gap-2">
                          <X className="w-4 h-4" />
                          {item}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExclude(item)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {excludes.length === 0 && (
                      <p className="text-sm text-slate-400 text-center py-4">
                        No hay items agregados
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-6 pb-12">
          <Button 
            type="submit" 
            disabled={isSaving}
            size="lg"
            className="bg-gradient-to-r from-[#3546A6] to-[#9996DB] hover:opacity-90 text-white px-12"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Guardar Todo
          </Button>
        </div>

        {/* Delete Date Dialog */}
        <AlertDialog open={!!deletingDate} onOpenChange={() => setDeletingDate(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar fecha?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará la fecha {deletingDate && formatDate(deletingDate.starting_date)} y todos sus overrides.
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
      </form>
    </TooltipProvider>
  );
}
