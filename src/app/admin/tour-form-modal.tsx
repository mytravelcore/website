"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from '@/supabase/client';
import ImageUpload from '@/components/admin/image-upload';
import type { Tour, Destination } from '@/types/database';

interface TourFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tour: Tour | null;
  destinations: Destination[];
}

interface TourFormData {
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  price_usd: number;
  duration_days: number;
  difficulty: string;
  destination_id: string;
  category: string;
  featured: boolean;
  hero_image_url: string;
  // Tour details fields
  destination_name: string;
  difficulty_level: string;
  age_min: number | null;
  age_max: number | null;
  group_size_min: number | null;
  group_size_max: number | null;
  activities_label: string;
}

const categories = ['Aventura', 'Playa', 'Cultural', 'Historia', 'Theme Parks', 'Naturaleza'];
const difficulties = ['Fácil', 'Moderado', 'Intenso'];
const difficultyLevels = ['Fácil', 'Moderado', 'Difícil'];

export default function TourFormModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  tour, 
  destinations 
}: TourFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itinerary, setItinerary] = useState<{ day: number; title: string; description: string }[]>([]);
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TourFormData>();

  const title = watch('title');

  // Generate slug from title
  useEffect(() => {
    if (title && !tour) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [title, tour, setValue]);

  // Populate form when editing
  useEffect(() => {
    if (tour) {
      reset({
        title: tour.title,
        slug: tour.slug,
        short_description: tour.short_description || '',
        long_description: tour.long_description || '',
        price_usd: tour.price_usd || 0,
        duration_days: tour.duration_days || 1,
        difficulty: tour.difficulty || '',
        destination_id: tour.destination_id || '',
        category: tour.category || '',
        featured: tour.featured,
        hero_image_url: tour.hero_image_url || '',
        // Tour details fields
        destination_name: tour.destination_name || '',
        difficulty_level: tour.difficulty_level || '',
        age_min: tour.age_min ?? null,
        age_max: tour.age_max ?? null,
        group_size_min: tour.group_size_min ?? null,
        group_size_max: tour.group_size_max ?? null,
        activities_label: tour.activities_label || '',
      });
      setItinerary(tour.itinerary || []);
      setIncludes(tour.includes || []);
      setExcludes(tour.excludes || []);
    } else {
      reset({
        title: '',
        slug: '',
        short_description: '',
        long_description: '',
        price_usd: 0,
        duration_days: 1,
        difficulty: '',
        destination_id: '',
        category: '',
        featured: false,
        hero_image_url: '',
        // Tour details fields
        destination_name: '',
        difficulty_level: '',
        age_min: null,
        age_max: null,
        group_size_min: null,
        group_size_max: null,
        activities_label: '',
      });
      setItinerary([]);
      setIncludes([]);
      setExcludes([]);
    }
  }, [tour, reset]);

  const onSubmit = async (data: TourFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      
      // Handle null/NaN values for number fields
      const cleanNumber = (val: number | null | undefined): number | null => {
        if (val === null || val === undefined || Number.isNaN(val)) return null;
        return val;
      };

      const tourData = {
        ...data,
        itinerary,
        includes,
        excludes,
        gallery_image_urls: [],
        // Clean number fields
        age_min: cleanNumber(data.age_min),
        age_max: cleanNumber(data.age_max),
        group_size_min: cleanNumber(data.group_size_min),
        group_size_max: cleanNumber(data.group_size_max),
        // Clean string fields
        destination_name: data.destination_name || null,
        difficulty_level: data.difficulty_level || null,
        activities_label: data.activities_label || null,
      };

      if (tour) {
        // Update existing tour
        const { error } = await supabase
          .from('tours')
          .update(tourData)
          .eq('id', tour.id);

        if (error) throw error;
      } else {
        // Create new tour
        const { error } = await supabase
          .from('tours')
          .insert([tourData]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving tour:', error);
      alert('Error al guardar el tour');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Itinerary handlers
  const addItineraryDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }]);
  };

  const updateItineraryDay = (index: number, field: string, value: string) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const removeItineraryDay = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 })));
  };

  // Includes/Excludes handlers
  const addInclude = () => setIncludes([...includes, '']);
  const updateInclude = (index: number, value: string) => {
    const updated = [...includes];
    updated[index] = value;
    setIncludes(updated);
  };
  const removeInclude = (index: number) => setIncludes(includes.filter((_, i) => i !== index));

  const addExclude = () => setExcludes([...excludes, '']);
  const updateExclude = (index: number, value: string) => {
    const updated = [...excludes];
    updated[index] = value;
    setExcludes(updated);
  };
  const removeExclude = (index: number) => setExcludes(excludes.filter((_, i) => i !== index));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-tc-purple-deep">
            {tour ? 'Editar Tour' : 'Agregar Nuevo Tour'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                {...register('title', { required: 'El título es requerido' })}
                className="mt-1.5"
                placeholder="Nombre del tour"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug', { required: 'El slug es requerido' })}
                className="mt-1.5"
                placeholder="nombre-del-tour"
              />
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <Label htmlFor="short_description">Descripción corta</Label>
            <Textarea
              id="short_description"
              {...register('short_description')}
              className="mt-1.5"
              placeholder="Breve descripción del tour"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="long_description">Descripción larga</Label>
            <Textarea
              id="long_description"
              {...register('long_description')}
              className="mt-1.5"
              placeholder="Descripción detallada del tour"
              rows={4}
            />
          </div>

          {/* Price, Duration, Difficulty */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price_usd">Precio (USD) *</Label>
              <Input
                id="price_usd"
                type="number"
                {...register('price_usd', { required: true, min: 0 })}
                className="mt-1.5"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="duration_days">Duración (días) *</Label>
              <Input
                id="duration_days"
                type="number"
                {...register('duration_days', { required: true, min: 1 })}
                className="mt-1.5"
                placeholder="1"
              />
            </div>
            <div>
              <Label>Dificultad</Label>
              <Select onValueChange={(value) => setValue('difficulty', value)} defaultValue={tour?.difficulty || ''}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Destination & Category */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Destino</Label>
              <Select onValueChange={(value) => setValue('destination_id', value)} defaultValue={tour?.destination_id || ''}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleccionar destino" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.id} value={dest.id}>
                      {dest.name}, {dest.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Categoría</Label>
              <Select onValueChange={(value) => setValue('category', value)} defaultValue={tour?.category || ''}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hero Image */}
          <div>
            <Label htmlFor="hero_image_url">URL de imagen principal</Label>
            <Input
              id="hero_image_url"
              {...register('hero_image_url')}
              className="mt-1.5"
              placeholder="https://..."
            />
          </div>

          {/* Tour Details Section */}
          <div className="border-t pt-6 mt-6">
            <h4 className="font-semibold text-lg text-tc-purple-deep mb-4">Detalles del Tour</h4>
            
            {/* Destination Name & Difficulty Level */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="destination_name">Destino (texto libre)</Label>
                <Input
                  id="destination_name"
                  {...register('destination_name')}
                  className="mt-1.5"
                  placeholder="Ej: Perú, Machu Picchu"
                />
              </div>
              <div>
                <Label>Nivel de Dificultad</Label>
                <Select onValueChange={(value) => setValue('difficulty_level', value)} defaultValue={tour?.difficulty_level || ''}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Age Range */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="age_min">Edad mínima</Label>
                <Input
                  id="age_min"
                  type="number"
                  {...register('age_min', { min: 0, valueAsNumber: true })}
                  className="mt-1.5"
                  placeholder="Ej: 12"
                />
              </div>
              <div>
                <Label htmlFor="age_max">Edad máxima</Label>
                <Input
                  id="age_max"
                  type="number"
                  {...register('age_max', { min: 0, valueAsNumber: true })}
                  className="mt-1.5"
                  placeholder="Ej: 65"
                />
              </div>
            </div>

            {/* Group Size */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="group_size_min">Tamaño mínimo del grupo</Label>
                <Input
                  id="group_size_min"
                  type="number"
                  {...register('group_size_min', { min: 0, valueAsNumber: true })}
                  className="mt-1.5"
                  placeholder="Ej: 2"
                />
              </div>
              <div>
                <Label htmlFor="group_size_max">Tamaño máximo del grupo</Label>
                <Input
                  id="group_size_max"
                  type="number"
                  {...register('group_size_max', { min: 0, valueAsNumber: true })}
                  className="mt-1.5"
                  placeholder="Ej: 15"
                />
              </div>
            </div>

            {/* Activities */}
            <div>
              <Label htmlFor="activities_label">Actividades</Label>
              <Input
                id="activities_label"
                {...register('activities_label')}
                className="mt-1.5"
                placeholder="Ej: Cultural, Aventura, Naturaleza"
              />
              <p className="text-sm text-gray-500 mt-1">Separar por comas si son varias</p>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3">
            <Switch
              id="featured"
              checked={watch('featured')}
              onCheckedChange={(checked) => setValue('featured', checked)}
            />
            <Label htmlFor="featured">Tour destacado</Label>
          </div>

          {/* Itinerary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Itinerario</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
                <Plus className="w-4 h-4 mr-1" /> Agregar día
              </Button>
            </div>
            <div className="space-y-3">
              {itinerary.map((day, index) => (
                <div key={index} className="flex gap-3 items-start bg-tc-lilac/10 p-3 rounded-lg">
                  <span className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {day.day}
                  </span>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Título del día"
                      value={day.title}
                      onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                    />
                    <Textarea
                      placeholder="Descripción"
                      value={day.description}
                      onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItineraryDay(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Incluye</Label>
              <Button type="button" variant="outline" size="sm" onClick={addInclude}>
                <Plus className="w-4 h-4 mr-1" /> Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {includes.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ej: Alojamiento 4 noches"
                    value={item}
                    onChange={(e) => updateInclude(index, e.target.value)}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeInclude(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Excludes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>No incluye</Label>
              <Button type="button" variant="outline" size="sm" onClick={addExclude}>
                <Plus className="w-4 h-4 mr-1" /> Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {excludes.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ej: Vuelos internacionales"
                    value={item}
                    onChange={(e) => updateExclude(index, e.target.value)}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeExclude(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="gradient-orange text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                tour ? 'Actualizar Tour' : 'Crear Tour'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
