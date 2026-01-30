"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Save, Loader2, Plus, ExternalLink, X, HelpCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { createClient } from '@/supabase/client';
import type { Tour, Destination } from '@/types/database';

interface GeneralFormData {
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  duration_days: number;
  tour_type: 'activity' | 'multiday';
  destination_id: string;
  featured: boolean;
  hero_image_url: string;
  difficulty_level: string;
  age_min: number;
  age_max: number;
  activities: string[];
  tour_label: string;
}

// Default options that can be extended
const defaultDestinations = ['Suramérica', 'Europa', 'Asia', 'África', 'Norteamérica', 'Oceanía'];
const defaultActivities = ['Cultural', 'Aventura', 'Naturaleza', 'Playa', 'Historia', 'Gastronomía'];
const defaultDifficultyLevels = ['Facil', 'Moderado', 'Difícil', 'Intenso'];

export default function GeneralPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.tourId as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  // Custom options state (extend defaults)
  const [customDestinations, setCustomDestinations] = useState<string[]>([]);
  const [customActivities, setCustomActivities] = useState<string[]>([]);
  const [customDifficultyLevels, setCustomDifficultyLevels] = useState<string[]>([]);
  
  // Selected values
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [tourType, setTourType] = useState<'activity' | 'multiday'>('multiday');
  const [durationDays, setDurationDays] = useState(1);
  const [ageRange, setAgeRange] = useState<[number, number]>([10, 70]);

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
        router.push('/admin/tours');
        return;
      }

      const tourData = tourResult.data;
      setTour(tourData);
      setDestinations(destResult.data || []);
      setGalleryImages(tourData.gallery_image_urls || []);
      setDurationDays(tourData.duration_days || 1);
      setTourType(tourData.duration_days > 1 ? 'multiday' : 'activity');
      setAgeRange([tourData.age_min || 10, tourData.age_max || 70]);
      setSelectedDifficulty(tourData.difficulty_level || '');
      
      // Parse destinations and activities
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
      
      setLoading(false);
    }

    loadData();
  }, [tourId, router, reset]);

  const onSubmit = async (data: GeneralFormData) => {
    setIsSaving(true);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('tours')
        .update({
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
        })
        .eq('id', tourId);

      if (error) throw error;
      
      // Refresh tour data
      const { data: updatedTour } = await supabase
        .from('tours')
        .select(`*, destination:destinations(*)`)
        .eq('id', tourId)
        .single();
      
      if (updatedTour) {
        setTour(updatedTour);
      }
    } catch (error) {
      console.error('Error saving tour:', error);
      alert('Error al guardar el tour');
    } finally {
      setIsSaving(false);
    }
  };

  const addGalleryImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) setGalleryImages([...galleryImages, url]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // Combined options lists
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#3546A6]" />
      </div>
    );
  }

  const tourUrl = slug ? `https://travelcore.ontripcart.com/tour/${slug}/` : '';

  return (
    <TooltipProvider>
      <div className="flex gap-8">
        {/* Main Form - Left Side */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Tour Name */}
            <div>
              <Label className="text-slate-600 font-medium">Nombre del tour</Label>
              <Input
                {...register('title', { required: 'El título es requerido' })}
                className="mt-2 h-12 text-base border-slate-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                placeholder="Nombre del tour"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Link */}
            <div>
              <Label className="text-slate-600 font-medium">Enlace</Label>
              <Input
                {...register('slug', { required: 'El slug es requerido' })}
                className="mt-2 h-12 text-base border-slate-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
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
              <Label className="text-slate-600 font-medium">Tipo de tour</Label>
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

            {/* Duration - Only show for multiday tours */}
            {tourType === 'multiday' && (
              <div>
                <Label className="text-slate-600 font-medium">Duración</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-20 h-12 text-center border-slate-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                    min="1"
                  />
                  <span className="px-4 py-3 bg-slate-100 rounded-lg text-slate-600 text-sm">Día(s)</span>
                </div>
              </div>
            )}

            {/* Age Range */}
            <div>
              <Label className="text-slate-600 font-medium">Rango de edad</Label>
              <div className="mt-4 flex items-center gap-4">
                <Input
                  type="number"
                  value={ageRange[0]}
                  onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
                  className="w-16 h-10 text-center border-slate-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
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
                    className="w-full"
                  />
                </div>
                <Input
                  type="number"
                  value={ageRange[1]}
                  onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
                  className="w-16 h-10 text-center border-slate-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <Label className="text-slate-600 font-medium">Destino</Label>
              <Select>
                <SelectTrigger className="mt-2 h-12 border-slate-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]">
                  <div className="flex flex-wrap gap-1">
                    {selectedDestinations.length > 0 ? (
                      selectedDestinations.map((dest) => (
                        <Badge 
                          key={dest} 
                          variant="secondary" 
                          className="bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20"
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
              <Label className="text-slate-600 font-medium">Actividades</Label>
              <Select>
                <SelectTrigger className="mt-2 h-12 border-slate-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]">
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

            {/* Difficulty Level */}
            <div>
              <Label className="text-slate-600 font-medium">Nivel de dificultad</Label>
              <Select 
                value={selectedDifficulty} 
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger className="mt-2 h-12 border-slate-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]">
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
                      Añadir nuevo nivel de dificultad
                    </button>
                  </div>
                </SelectContent>
              </Select>
              {selectedDifficulty && (
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
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
              <Label className="text-slate-600 font-medium flex items-center gap-1">
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
                className="mt-2 h-12 text-base border-slate-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                placeholder="Etiqueta del tour"
              />
            </div>

            {/* Excerpt */}
            <div>
              <Label className="text-slate-600 font-medium">Resumen</Label>
              <Textarea
                {...register('short_description')}
                className="mt-2 border-slate-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                placeholder="Ingresa un resumen del tour"
                rows={2}
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-slate-600 font-medium">Descripción</Label>
              <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden">
                <Textarea
                  {...register('long_description')}
                  className="border-0 focus:ring-0 min-h-[120px]"
                  placeholder="Descripción detallada del tour"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
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
                Guardar cambios
              </Button>
            </div>
          </form>
        </div>

        {/* Gallery - Right Side */}
        <div className="w-72">
          <Label className="text-slate-600 font-medium">Agregar galería</Label>
          <button
            type="button"
            onClick={addGalleryImage}
            className="mt-2 w-full h-32 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-[#3B82F6] hover:border-[#3B82F6] hover:bg-[#3B82F6]/5 transition-colors"
          >
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Abrir galería de imágenes</span>
          </button>
          
          {/* Gallery Grid */}
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
                  {/* Drag handle */}
                  <div className="absolute top-1 left-1 w-5 h-5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="9" cy="6" r="2" />
                      <circle cx="15" cy="6" r="2" />
                      <circle cx="9" cy="12" r="2" />
                      <circle cx="15" cy="12" r="2" />
                      <circle cx="9" cy="18" r="2" />
                      <circle cx="15" cy="18" r="2" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
