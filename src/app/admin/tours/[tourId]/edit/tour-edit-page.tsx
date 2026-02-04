'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { createClient } from '@/supabase/client';
import { 
  Save, Loader2, X, FileText, Image as ImageIcon, DollarSign, 
  Calendar, Map, List, Plus, Trash2, ChevronDown, ChevronUp,
  Clock, Users, Repeat, Check, HelpCircle
} from 'lucide-react';
import ImageUpload from '@/components/admin/image-upload';
import { cn } from '@/lib/utils';
import type { Tour, Destination } from '@/types/database';

// Package interface for pricing
interface LocalPricePackage {
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

// Date interfaces
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

const priceCategories = ['Adulto', 'Niño', 'Infante'];

const defaultPackage: Omit<LocalPricePackage, 'id'> = {
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

const createEmptyPackage = (name: string = 'Nuevo Paquete'): LocalPricePackage => ({
  ...defaultPackage,
  id: crypto.randomUUID(),
  name,
});

const sidebarSections = [
  { id: 'general', label: 'Información General', icon: FileText },
  { id: 'images', label: 'Imágenes', icon: ImageIcon },
  { id: 'pricing', label: 'Precios', icon: DollarSign },
  { id: 'dates', label: 'Fechas', icon: Calendar },
  { id: 'itinerary', label: 'Itinerario', icon: Map },
  { id: 'includes', label: 'Incluye/No Incluye', icon: List },
];

interface TourEditPageProps {
  initialTour: Tour;
  destinations: Destination[];
}

export default function TourEditPage({ initialTour, destinations }: TourEditPageProps) {
  const [tour, setTour] = useState<Tour>(initialTour);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [isSavingImages, setIsSavingImages] = useState(false);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [isSavingDates, setIsSavingDates] = useState(false);
  const [isSavingItinerary, setIsSavingItinerary] = useState(false);
  const [isSavingIncludes, setIsSavingIncludes] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState(initialTour.title || '');
  const [slug, setSlug] = useState(initialTour.slug || '');
  const [shortDescription, setShortDescription] = useState(initialTour.short_description || '');
  const [longDescription, setLongDescription] = useState(initialTour.long_description || '');
  const [heroImageUrl, setHeroImageUrl] = useState(initialTour.hero_image_url || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(initialTour.gallery_image_urls || []);
  const [durationDays, setDurationDays] = useState(initialTour.duration_days || 1);
  const [priceUsd, setPriceUsd] = useState(initialTour.price_usd || 0);
  const [difficultyLevel, setDifficultyLevel] = useState(initialTour.difficulty_level || '');
  const [destinationId, setDestinationId] = useState(initialTour.destination_id || '');
  const [featured, setFeatured] = useState(initialTour.featured || false);
  const [status, setStatus] = useState(initialTour.status || 'draft');
  
  // Pricing state
  const [packageType, setPackageType] = useState<'single' | 'multiple'>(
    (initialTour as any).package_type || 'single'
  );
  const [primaryCategory, setPrimaryCategory] = useState(
    (initialTour as any).primary_price_category || 'Adulto'
  );
  const [packages, setPackages] = useState<LocalPricePackage[]>(() => {
    const savedPackages = (initialTour as any).price_packages as LocalPricePackage[] | null;
    if (savedPackages && savedPackages.length > 0) {
      return savedPackages;
    }
    // Create default package based on current price
    return [{
      ...defaultPackage,
      id: crypto.randomUUID(),
      name: 'Habitación Doble',
      isDefault: true,
      adultPrice: initialTour.price_usd || 0,
    }];
  });
  const [expandedPackages, setExpandedPackages] = useState<string[]>(() => {
    const savedPackages = (initialTour as any).price_packages as LocalPricePackage[] | null;
    if (savedPackages && savedPackages.length > 0) {
      return [savedPackages[0].id];
    }
    return [];
  });
  const [activePackageTab, setActivePackageTab] = useState<Record<string, string>>({});
  const [startingPriceFrom, setStartingPriceFrom] = useState<number | null>(
    (initialTour as any).starting_price_from ?? null
  );
  
  // Dates state
  const [dates, setDates] = useState<LocalTourDate[]>([]);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);
  const [activeDateTab, setActiveDateTab] = useState<Record<string, string>>({});
  const [deletingDate, setDeletingDate] = useState<LocalTourDate | null>(null);
  const [datesLoading, setDatesLoading] = useState(true);
  
  // Itinerary
  const [itineraryDays, setItineraryDays] = useState<any[]>(initialTour.itinerary_days || []);
  
  // Includes
  const [includes, setIncludes] = useState<string[]>(initialTour.includes || []);
  const [excludes, setExcludes] = useState<string[]>(initialTour.excludes || []);
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  
  // FAQs
  const [faqs, setFaqs] = useState<{question: string; answer: string}[]>(initialTour.faqs || []);
  
  const supabase = createClient();

  // Load dates on mount
  useEffect(() => {
    async function loadDates() {
      const { data: datesData, error: datesError } = await supabase
        .from('tour_dates')
        .select(`
          *,
          package_overrides:tour_date_packages(
            *,
            blocked_dates:tour_date_blocked_dates(*)
          )
        `)
        .eq('tour_id', initialTour.id)
        .order('start_date', { ascending: true });

      console.log('Edit page dates loaded:', { datesData, datesError });

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
        if (formattedDates.length > 0) {
          setExpandedDates([formattedDates[0].id]);
        }
      }
      setDatesLoading(false);
    }
    loadDates();
  }, [initialTour.id, packages]);

  // Package helper functions
  const addPackage = () => {
    const newPkg = createEmptyPackage(`Paquete ${packages.length + 1}`);
    setPackages([...packages, newPkg]);
    setExpandedPackages([...expandedPackages, newPkg.id]);
    setActivePackageTab({ ...activePackageTab, [newPkg.id]: 'general' });
  };

  const removePackage = (id: string) => {
    if (packages.length <= 1) return;
    const updatedPackages = packages.filter(p => p.id !== id);
    if (packages.find(p => p.id === id)?.isDefault && updatedPackages.length > 0) {
      updatedPackages[0].isDefault = true;
    }
    setPackages(updatedPackages);
    setExpandedPackages(expandedPackages.filter(eid => eid !== id));
  };

  const updatePackage = (id: string, field: keyof LocalPricePackage, value: any) => {
    setPackages(packages.map(pkg => {
      if (pkg.id === id) {
        if (field === 'isDefault' && value === true) {
          return { ...pkg, isDefault: true };
        }
        return { ...pkg, [field]: value };
      }
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

  // Date helper functions
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

  const showSavedFeedback = (section: string) => {
    setSavedFeedback(section);
    setTimeout(() => setSavedFeedback(null), 2000);
  };

  // Individual save functions
  const handleSaveGeneral = async () => {
    if (!title || !slug) {
      alert('El nombre y el slug son requeridos');
      return;
    }
    setIsSavingGeneral(true);
    try {
      const { error } = await supabase
        .from('tours')
        .update({
          title,
          slug,
          short_description: shortDescription || null,
          long_description: longDescription || null,
          duration_days: durationDays,
          difficulty_level: difficultyLevel || null,
          destination_id: destinationId || null,
          featured,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tour.id);
      if (error) throw error;
      showSavedFeedback('general');
    } catch (error: any) {
      if (error.code === '23505') {
        alert('Ya existe un tour con ese slug');
      } else {
        alert('Error al guardar');
      }
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleSaveImages = async () => {
    setIsSavingImages(true);
    try {
      const { error } = await supabase
        .from('tours')
        .update({
          hero_image_url: heroImageUrl || null,
          gallery_image_urls: galleryImages.length > 0 ? galleryImages : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tour.id);
      if (error) throw error;
      showSavedFeedback('images');
    } catch (error) {
      alert('Error al guardar imágenes');
    } finally {
      setIsSavingImages(false);
    }
  };

  const handleSavePricing = async () => {
    setIsSavingPricing(true);
    try {
      const defaultPkg = packages.find(p => p.isDefault) || packages[0];
      const mainPrice = defaultPkg?.adultPrice || priceUsd;
      const { error } = await supabase
        .from('tours')
        .update({
          price_usd: mainPrice,
          package_type: packageType,
          primary_price_category: primaryCategory,
          price_packages: packages,
          starting_price_from: startingPriceFrom,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tour.id);
      if (error) throw error;
      showSavedFeedback('pricing');
    } catch (error) {
      alert('Error al guardar precios');
    } finally {
      setIsSavingPricing(false);
    }
  };

  const handleSaveDates = async () => {
    setIsSavingDates(true);
    try {
      for (const date of dates) {
        const { data: savedDate, error: dateError } = await supabase
          .from('tour_dates')
          .upsert({
            id: date.isNew ? undefined : date.id,
            tour_id: tour.id,
            start_date: date.starting_date,
            max_participants: date.max_pax,
            is_available: true,
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
          const { data: savedPo } = await supabase
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

          if (savedPo && po.blocked_dates.length > 0) {
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
      showSavedFeedback('dates');
    } catch (error) {
      alert('Error al guardar fechas');
    } finally {
      setIsSavingDates(false);
    }
  };

  const handleSaveItinerary = async () => {
    setIsSavingItinerary(true);
    try {
      const { error } = await supabase
        .from('tours')
        .update({
          itinerary_days: itineraryDays.length > 0 ? itineraryDays : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tour.id);
      if (error) throw error;
      showSavedFeedback('itinerary');
    } catch (error) {
      alert('Error al guardar itinerario');
    } finally {
      setIsSavingItinerary(false);
    }
  };

  const handleSaveIncludes = async () => {
    setIsSavingIncludes(true);
    try {
      const { error } = await supabase
        .from('tours')
        .update({
          includes: includes.length > 0 ? includes : null,
          excludes: excludes.length > 0 ? excludes : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tour.id);
      if (error) throw error;
      showSavedFeedback('includes');
    } catch (error) {
      alert('Error al guardar');
    } finally {
      setIsSavingIncludes(false);
    }
  };

  const handleSave = async () => {
    if (!title || !slug) {
      alert('El nombre y el slug son requeridos');
      return;
    }

    // Calculate main price from default package
    const defaultPkg = packages.find(p => p.isDefault) || packages[0];
    const mainPrice = defaultPkg?.adultPrice || priceUsd;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('tours')
        .update({
          title,
          slug,
          short_description: shortDescription || null,
          long_description: longDescription || null,
          hero_image_url: heroImageUrl || null,
          gallery_image_urls: galleryImages.length > 0 ? galleryImages : null,
          duration_days: durationDays,
          price_usd: mainPrice,
          difficulty_level: difficultyLevel || null,
          destination_id: destinationId || null,
          featured,
          status,
          itinerary_days: itineraryDays.length > 0 ? itineraryDays : null,
          includes: includes.length > 0 ? includes : null,
          excludes: excludes.length > 0 ? excludes : null,
          faqs: faqs.length > 0 ? faqs : null,
          // Pricing fields
          package_type: packageType,
          primary_price_category: primaryCategory,
          price_packages: packages,
          starting_price_from: startingPriceFrom,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tour.id);

      if (error) throw error;

      // Update local state
      setTour({
        ...tour,
        title,
        slug,
        short_description: shortDescription,
        long_description: longDescription,
        hero_image_url: heroImageUrl,
        gallery_image_urls: galleryImages,
        duration_days: durationDays,
        price_usd: priceUsd,
        difficulty_level: difficultyLevel,
        destination_id: destinationId,
        featured,
        status,
      });
    } catch (error: any) {
      console.error('Error saving tour:', error);
      if (error.code === '23505') {
        alert('Ya existe un tour con ese slug');
      } else {
        alert('Error al guardar el tour');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    const newStatus = status === 'published' ? 'draft' : 'published';
    setStatus(newStatus);
    
    try {
      const { error } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tour.id);

      if (error) throw error;
      setTour({ ...tour, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      setStatus(status);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude('');
    }
  };

  const addExclude = () => {
    if (newExclude.trim()) {
      setExcludes([...excludes, newExclude.trim()]);
      setNewExclude('');
    }
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const addItineraryDay = () => {
    setItineraryDays([...itineraryDays, { 
      day: itineraryDays.length + 1, 
      title: '', 
      description: '',
      activities: []
    }]);
  };

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const updated = [...itineraryDays];
    updated[index][field] = value;
    setItineraryDays(updated);
  };

  const removeItineraryDay = (index: number) => {
    setItineraryDays(itineraryDays.filter((_, i) => i !== index));
  };

  // Save button component
  const SaveButton = ({ 
    onClick, 
    isSaving, 
    sectionKey 
  }: { 
    onClick: () => void; 
    isSaving: boolean; 
    sectionKey: string;
  }) => (
    <Button 
      onClick={onClick}
      disabled={isSaving}
      className={cn(
        "transition-all",
        savedFeedback === sectionKey 
          ? "bg-green-500 hover:bg-green-600" 
          : "bg-gradient-to-r from-[#3546A6] to-[#9996DB] hover:opacity-90"
      )}
      size="sm"
    >
      {isSaving ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : savedFeedback === sectionKey ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <Save className="w-4 h-4 mr-2" />
      )}
      {savedFeedback === sectionKey ? 'Guardado' : 'Guardar'}
    </Button>
  );

  // UI
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 bg-slate-50 overflow-y-auto flex-shrink-0">
        <div className="p-4">
          <h2 className="font-semibold text-slate-900 mb-1">Editor del Tour</h2>
          <p className="text-xs text-slate-500 mb-4">Toda la configuración en una página</p>
          
          <nav className="space-y-1">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                    activeSection === section.id
                      ? "bg-[#3546A6] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-12">
        {/* General Information */}
            <section id="general" className="scroll-mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#3546A6]" />
                  Información General
                </h2>
                <SaveButton onClick={handleSaveGeneral} isSaving={isSavingGeneral} sectionKey="general" />
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-700">Tour Destacado</Label>
                  <Switch 
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                </div>

                <div>
                  <Label className="text-slate-700">Nombre del Tour *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Machu Picchu 4 Días"
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label className="text-slate-700">URL (Slug) *</Label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="machu-picchu-4-dias"
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label className="text-slate-700">Destino</Label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="mt-2 w-full h-12 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3546A6]"
                  >
                    <option value="">Sin destino</option>
                    {destinations.map(dest => (
                      <option key={dest.id} value={dest.id}>{dest.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-slate-700">Descripción Corta</Label>
                  <Textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Resumen breve del tour..."
                    className="mt-2"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="text-slate-700">Descripción Completa</Label>
                  <Textarea
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    placeholder="Descripción detallada del tour..."
                    className="mt-2"
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700">Duración (días)</Label>
                    <Input
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="mt-2 h-12"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Nivel de Dificultad</Label>
                    <select
                      value={difficultyLevel}
                      onChange={(e) => setDifficultyLevel(e.target.value)}
                      className="mt-2 w-full h-12 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3546A6]"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Fácil">Fácil</option>
                      <option value="Moderado">Moderado</option>
                      <option value="Difícil">Difícil</option>
                      <option value="Intenso">Intenso</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Images */}
            <section id="images" className="scroll-mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#3546A6]" />
                  Imágenes
                </h2>
                <SaveButton onClick={handleSaveImages} isSaving={isSavingImages} sectionKey="images" />
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
                {/* Hero Image */}
                <div>
                  <Label className="text-slate-700 mb-3 block">Imagen Principal (Hero)</Label>
                  
                  {heroImageUrl && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100 mb-3">
                      <img 
                        src={heroImageUrl}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setHeroImageUrl('')}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/80 text-slate-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <ImageUpload
                    onImageUpload={(url) => setHeroImageUrl(url)}
                    label="URL de imagen principal"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Gallery */}
                <div>
                  <Label className="text-slate-700 mb-3 block">Galería de Imágenes</Label>
                  
                  <ImageUpload
                    onImageUpload={(url) => setGalleryImages([...galleryImages, url])}
                    label="Agregar imagen a la galería"
                    placeholder="https://images.unsplash.com/..."
                  />

                  {galleryImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
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
                            className="absolute top-1 right-1 w-5 h-5 bg-white/80 text-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500 hover:text-white"
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

            {/* Pricing */}
            <section id="pricing" className="scroll-mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#3546A6]" />
                  Precios
                </h2>
                <SaveButton onClick={handleSavePricing} isSaving={isSavingPricing} sectionKey="pricing" />
              </div>
              
              <TooltipProvider>
                {/* Package Type Selection */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 mb-4">
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
                            <p className="max-w-xs">Single: Un único precio. Multiple: Varios paquetes con diferentes precios (ej: Habitación Doble, Triple, etc.)</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                        <button
                          type="button"
                          className={cn(
                            "px-16 py-2.5 text-sm font-medium transition-all",
                            packageType === 'single' 
                              ? "bg-slate-100 text-[#3546A6] border-b-2 border-[#3546A6]" 
                              : "bg-white text-slate-600 hover:bg-slate-50"
                          )}
                          onClick={() => setPackageType('single')}
                        >
                          Single
                        </button>
                        <button
                          type="button"
                          className={cn(
                            "px-16 py-2.5 text-sm font-medium transition-all",
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

                    {/* Primary Price Category - only for multiple */}
                    {packageType === 'multiple' && (
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
                    )}
                  </div>
                </div>

                {/* Single Package Mode */}
                {packageType === 'single' && (
                  <div className="bg-white rounded-lg border border-slate-200">
                    <Tabs defaultValue="adult" className="p-4">
                      <TabsList className="bg-white border border-slate-200 p-1">
                        <TabsTrigger 
                          value="adult"
                          className="data-[state=active]:bg-[#3546A6] data-[state=active]:text-white"
                        >
                          Adultos
                        </TabsTrigger>
                        <TabsTrigger 
                          value="child"
                          className="data-[state=active]:bg-[#3546A6] data-[state=active]:text-white"
                        >
                          Niños
                        </TabsTrigger>
                      </TabsList>

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
                                  <p>Precio por persona (adulto)</p>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm font-medium text-slate-600">
                                USD $
                              </span>
                              <Input
                                type="number"
                                value={packages[0]?.adultPrice || 0}
                                onChange={(e) => updatePackage(packages[0]?.id, 'adultPrice', Number(e.target.value))}
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
                                value={packages[0]?.adultCrossedPrice || ''}
                                onChange={(e) => updatePackage(packages[0]?.id, 'adultCrossedPrice', e.target.value ? Number(e.target.value) : 0)}
                                placeholder="320"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Vista previa:</strong> 
                            {packages[0]?.adultCrossedPrice && packages[0]?.adultCrossedPrice > 0 && (
                              <span className="line-through text-slate-500 ml-1">
                                ${packages[0]?.adultCrossedPrice.toLocaleString()} USD
                              </span>
                            )}
                            <span className="ml-1 font-semibold">
                              ${packages[0]?.adultPrice?.toLocaleString() || 0} USD por persona
                            </span>
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
                                  <p>Precio por niño</p>
                                </TooltipContent>
                              </Tooltip>
                            </Label>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm font-medium text-slate-600">
                                USD $
                              </span>
                              <Input
                                type="number"
                                value={packages[0]?.childPrice || 0}
                                onChange={(e) => updatePackage(packages[0]?.id, 'childPrice', Number(e.target.value))}
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
                                value={packages[0]?.childCrossedPrice || ''}
                                onChange={(e) => updatePackage(packages[0]?.id, 'childCrossedPrice', e.target.value ? Number(e.target.value) : 0)}
                                placeholder="200"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-slate-700 mb-3">Rango de Edad</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Edad Mínima</Label>
                              <Input
                                type="number"
                                value={packages[0]?.childAgeMin || 0}
                                onChange={(e) => updatePackage(packages[0]?.id, 'childAgeMin', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="3"
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>Edad Máxima</Label>
                              <Input
                                type="number"
                                value={packages[0]?.childAgeMax || 0}
                                onChange={(e) => updatePackage(packages[0]?.id, 'childAgeMax', Number(e.target.value))}
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
                                value={packages[0]?.infantPrice || 0}
                                onChange={(e) => updatePackage(packages[0]?.id, 'infantPrice', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="0"
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>Edad Máxima Infante</Label>
                              <Input
                                type="number"
                                value={packages[0]?.infantAgeMax || 0}
                                onChange={(e) => updatePackage(packages[0]?.id, 'infantAgeMax', Number(e.target.value))}
                                className="mt-1.5"
                                placeholder="2"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">
                            <strong>Niños ({packages[0]?.childAgeMin}-{packages[0]?.childAgeMax} años):</strong> 
                            {packages[0]?.childCrossedPrice && packages[0]?.childCrossedPrice > 0 && (
                              <span className="line-through text-slate-500 ml-1">
                                ${packages[0]?.childCrossedPrice.toLocaleString()} USD
                              </span>
                            )}
                            <span className="ml-1 font-semibold">
                              ${packages[0]?.childPrice?.toLocaleString() || 0} USD
                            </span>
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            <strong>Infantes (0-{packages[0]?.infantAgeMax} años):</strong> ${packages[0]?.infantPrice?.toLocaleString() || 0} USD
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {/* Multiple Packages Mode */}
                {packageType === 'multiple' && (
                  <div className="space-y-3">
                  {packages.map((pkg) => (
                    <Collapsible 
                      key={pkg.id}
                      open={expandedPackages.includes(pkg.id)}
                      onOpenChange={() => togglePackageExpand(pkg.id)}
                    >
                      <div className="bg-white rounded-lg border border-slate-200 shadow-none">
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
                                type="button"
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
                                  Adultos
                                </TabsTrigger>
                                <TabsTrigger 
                                  value="child"
                                  className="data-[state=active]:bg-[#3546A6] data-[state=active]:text-white"
                                >
                                  Niños
                                </TabsTrigger>
                                <TabsTrigger 
                                  value="details"
                                  className="data-[state=active]:bg-[#3546A6] data-[state=active]:text-white"
                                >
                                  Detalles
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

                                <div className="p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-700">
                                    <strong>Vista previa:</strong> 
                                    {pkg.adultCrossedPrice && pkg.adultCrossedPrice > 0 && (
                                      <span className="line-through text-slate-500 ml-1">
                                        ${pkg.adultCrossedPrice.toLocaleString()} USD
                                      </span>
                                    )}
                                    <span className="ml-1 font-semibold">
                                      ${pkg.adultPrice.toLocaleString()} USD por persona
                                    </span>
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
                                  <Textarea
                                    value={pkg.details}
                                    onChange={(e) => updatePackage(pkg.id, 'details', e.target.value)}
                                    className="mt-1.5 min-h-[120px]"
                                    placeholder="Notas adicionales sobre este paquete (ej: incluye desayuno, tipo de habitación, etc.)"
                                  />
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}

                  {/* Add New Package Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPackage}
                    className="w-full border-dashed border-2 border-slate-300 hover:border-[#3546A6] hover:bg-slate-50 h-12"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Nuevo Paquete
                  </Button>
                </div>
                )}

                {/* Starting Price - Optional */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 mt-4">
                  <h3 className="font-semibold text-slate-900 mb-1">Precio de Referencia</h3>
                  <p className="text-sm text-slate-500 mb-4">Se mostrará en las tarjetas del tour</p>
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
                </div>
              </TooltipProvider>
            </section>

            {/* Dates */}
            <section id="dates" className="scroll-mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#3546A6]" />
                  Fechas
                </h2>
                <SaveButton onClick={handleSaveDates} isSaving={isSavingDates} sectionKey="dates" />
              </div>
              
              <div className="space-y-4">
                {/* Add Date Button */}
                <div>
                  <Button
                    variant="outline"
                    onClick={addDate}
                    className="border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Fecha
                  </Button>
                </div>

                {datesLoading ? (
                  <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3546A6] mx-auto" />
                    <p className="text-slate-500 mt-2">Cargando fechas...</p>
                  </div>
                ) : dates.length === 0 ? (
                  <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No hay fechas configuradas</p>
                    <p className="text-sm text-slate-400 mt-1">Agrega una fecha para comenzar</p>
                  </div>
                ) : (
                  dates.map((date) => (
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
                          <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-6">
                            {/* Cut Off Time */}
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
                                <span className="text-sm text-slate-600">Día(s)</span>
                              </div>
                            </div>

                            {/* Starting Dates */}
                            <div>
                              <Label className="text-sm font-medium text-slate-700">Fecha de Inicio</Label>
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
                                <Label className="text-sm font-medium text-slate-700">Repetir Fecha</Label>
                                <Switch
                                  checked={date.repeat_enabled}
                                  onCheckedChange={(checked) => updateDate(date.id, 'repeat_enabled', checked)}
                                />
                              </div>

                              {date.repeat_enabled && (
                                <>
                                  <div>
                                    <Label className="text-sm font-medium text-slate-700 mb-3 block">Patrón</Label>
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
                                    <Label className="text-sm font-medium text-slate-700">Repetir Hasta</Label>
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
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))
                )}
              </div>
            </section>

            {/* Itinerary */}
            <section id="itinerary" className="scroll-mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Map className="w-5 h-5 text-[#3546A6]" />
                  Itinerario
                </h2>
                <SaveButton onClick={handleSaveItinerary} isSaving={isSavingItinerary} sectionKey="itinerary" />
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
                {itineraryDays.map((day, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900">Día {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeItineraryDay(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="Título del día"
                        value={day.title || ''}
                        onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                      />
                      <Textarea
                        placeholder="Descripción de las actividades..."
                        value={day.description || ''}
                        onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addItineraryDay}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar día
                </Button>
              </div>
            </section>

            {/* Includes/Excludes */}
            <section id="includes" className="scroll-mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <List className="w-5 h-5 text-[#3546A6]" />
                  Incluye / No Incluye
                </h2>
                <SaveButton onClick={handleSaveIncludes} isSaving={isSavingIncludes} sectionKey="includes" />
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Includes */}
                  <div>
                    <Label className="text-green-700 font-medium mb-3 block">✓ Incluye</Label>
                    <div className="space-y-2">
                      {includes.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                          <span className="flex-1 text-sm">{item}</span>
                          <button
                            type="button"
                            onClick={() => setIncludes(includes.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Agregar item..."
                          value={newInclude}
                          onChange={(e) => setNewInclude(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
                        />
                        <Button variant="outline" size="sm" onClick={addInclude}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Excludes */}
                  <div>
                    <Label className="text-red-700 font-medium mb-3 block">✗ No Incluye</Label>
                    <div className="space-y-2">
                      {excludes.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                          <span className="flex-1 text-sm">{item}</span>
                          <button
                            type="button"
                            onClick={() => setExcludes(excludes.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Agregar item..."
                          value={newExclude}
                          onChange={(e) => setNewExclude(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExclude())}
                        />
                        <Button variant="outline" size="sm" onClick={addExclude}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom spacing */}
            <div className="h-20" />
          </div>
        </div>

        {/* Delete Date Confirmation Dialog */}
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
