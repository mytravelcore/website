"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  X,
  Image as ImageIcon,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Check,
  ArrowLeft,
  Upload,
  GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient } from '@/supabase/client';
import type { Tour, Destination } from '@/types/database';

interface TourBuilderProps {
  tour?: Tour | null;
  destinations: Destination[];
  onClose: () => void;
  onSuccess: () => void;
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
  // New booking-related fields
  age_range: string;
  destination_label: string;
  difficulty_label: string;
  activities_label: string;
  group_size_label: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string[];
  imageUrl?: string;
}

interface PackagePrice {
  id: string;
  name: string;
  label: string;
  adultPrice: number;
  childPrice: number;
  isDefault: boolean;
}

const categories = ['Aventura', 'Playa', 'Cultural', 'Historia', 'Theme Parks', 'Naturaleza', 'Romántico', 'Familiar'];
const difficulties = ['Fácil', 'Moderado', 'Intenso'];
const tourTypes = ['Activity/Single-Day', 'Multi Day'];
const meals = ['Desayuno', 'Almuerzo', 'Cena'];

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

export default function TourBuilder({ tour, destinations, onClose, onSuccess }: TourBuilderProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [tourType, setTourType] = useState('Multi Day');
  const [ageRange, setAgeRange] = useState([0, 99]);
  
  // Form states
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [packages, setPackages] = useState<PackagePrice[]>([
    { id: '1', name: 'Habitación Doble', label: 'Por persona', adultPrice: 0, childPrice: 0, isDefault: true },
    { id: '2', name: 'Habitación Triple', label: 'Por persona', adultPrice: 0, childPrice: 0, isDefault: false },
    { id: '3', name: 'Habitación Sencilla', label: 'Por persona', adultPrice: 0, childPrice: 0, isDefault: false },
  ]);
  
  // Modal states
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [newDestination, setNewDestination] = useState({ name: '', country: '', region: '' });
  const [localDestinations, setLocalDestinations] = useState(destinations);

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
        // New fields
        age_range: tour.age_range || '',
        destination_label: tour.destination_label || '',
        difficulty_label: tour.difficulty_label || '',
        activities_label: tour.activities_label || '',
        group_size_label: tour.group_size_label || '',
      });
      setItinerary(tour.itinerary || []);
      setIncludes(tour.includes || []);
      setExcludes(tour.excludes || []);
      setGalleryImages(tour.gallery_image_urls || []);
    }
  }, [tour, reset]);

  const onSubmit = async (data: TourFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      
      const tourData = {
        title: data.title,
        slug: data.slug,
        short_description: data.short_description,
        long_description: data.long_description,
        price_usd: data.price_usd,
        duration_days: data.duration_days,
        difficulty: data.difficulty,
        destination_id: data.destination_id,
        category: data.category,
        featured: data.featured,
        hero_image_url: data.hero_image_url,
        // New booking detail fields
        age_range: data.age_range || null,
        destination_label: data.destination_label || null,
        difficulty_label: data.difficulty_label || null,
        activities_label: data.activities_label || null,
        group_size_label: data.group_size_label || null,
        itinerary,
        includes,
        excludes,
        gallery_image_urls: galleryImages,
      };

      if (tour) {
        const { error } = await supabase
          .from('tours')
          .update(tourData)
          .eq('id', tour.id);

        if (error) throw error;
      } else {
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

  // Destination handlers
  const handleAddDestination = async () => {
    if (!newDestination.name || !newDestination.country) return;
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('destinations')
        .insert([newDestination])
        .select()
        .single();

      if (error) throw error;
      
      setLocalDestinations([...localDestinations, data]);
      setNewDestination({ name: '', country: '', region: '' });
      setIsDestinationModalOpen(false);
    } catch (error) {
      console.error('Error adding destination:', error);
      alert('Error al agregar destino');
    }
  };

  // Itinerary handlers
  const addItineraryDay = () => {
    setItinerary([...itinerary, { 
      day: itinerary.length + 1, 
      title: '', 
      description: '',
      accommodation: '',
      meals: [],
      imageUrl: ''
    }]);
  };

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const removeItineraryDay = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 })));
  };

  // Gallery handlers
  const addGalleryImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) setGalleryImages([...galleryImages, url]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // Includes/Excludes handlers
  const togglePredefinedInclude = (item: string) => {
    setIncludes(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const togglePredefinedExclude = (item: string) => {
    setExcludes(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const addCustomInclude = () => {
    const item = prompt('Añadir item personalizado:');
    if (item) setIncludes([...includes, item]);
  };

  const addCustomExclude = () => {
    const item = prompt('Añadir item personalizado:');
    if (item) setExcludes([...excludes, item]);
  };

  // Package handlers
  const addPackage = () => {
    setPackages([...packages, {
      id: String(Date.now()),
      name: 'Nuevo Paquete',
      label: 'Por persona',
      adultPrice: 0,
      childPrice: 0,
      isDefault: false
    }]);
  };

  const updatePackage = (id: string, field: string, value: any) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, [field]: value } : pkg
    ));
  };

  const removePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const setDefaultPackage = (id: string) => {
    setPackages(packages.map(pkg => ({
      ...pkg,
      isDefault: pkg.id === id
    })));
  };

  const tabItems = [
    { value: 'general', label: 'General', icon: MapPin },
    { value: 'itinerary', label: 'Itinerario', icon: Calendar },
    { value: 'includes', label: 'Incluye', icon: Check },
    { value: 'price', label: 'Precio', icon: DollarSign },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-[#3546A6]">
              {tour ? 'Editar Tour' : 'Nuevo Tour'}
            </h1>
            <p className="text-sm text-slate-500">Constructor de tours</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#FFA03B] to-[#FFD491] text-white border-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Tour
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Internal Nav */}
        <div className="w-56 bg-white border-r border-slate-200 py-4">
          <nav className="space-y-1 px-3">
            {tabItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.value
                      ? 'bg-[#3546A6]/10 text-[#3546A6]'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="max-w-4xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información básica</CardTitle>
                  <CardDescription>Detalles principales del tour</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Nombre del tour *</Label>
                      <Input
                        id="title"
                        {...register('title', { required: 'El título es requerido' })}
                        className="mt-1.5"
                        placeholder="Ej: Encantos de Bogotá..."
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="slug">Permalink/Link *</Label>
                      <Input
                        id="slug"
                        {...register('slug', { required: 'El slug es requerido' })}
                        className="mt-1.5"
                        placeholder="encantos-de-bogota"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Tipo de tour</Label>
                    <div className="flex gap-2 mt-1.5">
                      {tourTypes.map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={tourType === type ? 'default' : 'outline'}
                          className={tourType === type ? 'bg-[#3546A6]' : ''}
                          onClick={() => setTourType(type)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration_days">Duración</Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input
                          id="duration_days"
                          type="number"
                          {...register('duration_days', { required: true, min: 1 })}
                          className="w-24"
                          placeholder="5"
                        />
                        <Select defaultValue="days">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Días</SelectItem>
                            <SelectItem value="hours">Horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Rango de edad</Label>
                      <div className="mt-3 px-2">
                        <Slider
                          value={ageRange}
                          onValueChange={setAgeRange}
                          max={99}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-1 text-sm text-slate-500">
                          <span>{ageRange[0]} años</span>
                          <span>{ageRange[1]} años</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Destino</Label>
                      <Select onValueChange={(value) => setValue('destination_id', value)} defaultValue={tour?.destination_id || ''}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Seleccionar destino" />
                        </SelectTrigger>
                        <SelectContent>
                          {localDestinations.map((dest) => (
                            <SelectItem key={dest.id} value={dest.id}>
                              {dest.name}, {dest.country}
                            </SelectItem>
                          ))}
                          <div className="border-t mt-1 pt-1">
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full justify-start text-[#3546A6]"
                              onClick={() => setIsDestinationModalOpen(true)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Agregar nuevo destino
                            </Button>
                          </div>
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

                  <div>
                    <Label>Dificultad</Label>
                    <div className="flex gap-2 mt-1.5">
                      {difficulties.map((diff) => (
                        <Button
                          key={diff}
                          type="button"
                          variant="outline"
                          className={`${
                            watch('difficulty') === diff 
                              ? diff === 'Fácil' ? 'bg-green-100 border-green-300 text-green-700'
                                : diff === 'Moderado' ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                                : 'bg-red-100 border-red-300 text-red-700'
                              : ''
                          }`}
                          onClick={() => setValue('difficulty', diff)}
                        >
                          {diff}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Tour Details Section - NEW */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-semibold text-[#3546A6] mb-4">Detalles del Tour (para mostrar en página)</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age_range">Rango de Edad</Label>
                        <Input
                          id="age_range"
                          {...register('age_range')}
                          className="mt-1.5"
                          placeholder="0-100 años"
                        />
                      </div>
                      <div>
                        <Label htmlFor="destination_label">Etiqueta de Destino</Label>
                        <Input
                          id="destination_label"
                          {...register('destination_label')}
                          className="mt-1.5"
                          placeholder="Europa"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="activities_label">Actividades</Label>
                        <Input
                          id="activities_label"
                          {...register('activities_label')}
                          className="mt-1.5"
                          placeholder="Cultural"
                        />
                      </div>
                      <div>
                        <Label htmlFor="group_size_label">Tamaño de Grupo</Label>
                        <Input
                          id="group_size_label"
                          {...register('group_size_label')}
                          className="mt-1.5"
                          placeholder="0-Ilimitado"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="difficulty_label">Etiqueta de Dificultad</Label>
                      <Input
                        id="difficulty_label"
                        {...register('difficulty_label')}
                        className="mt-1.5"
                        placeholder="Facil"
                      />
                      <p className="text-xs text-slate-500 mt-1">Texto que se mostrará en los detalles (puede ser diferente al nivel de dificultad interno)</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="short_description">Descripción corta</Label>
                    <Textarea
                      id="short_description"
                      {...register('short_description')}
                      className="mt-1.5"
                      placeholder="Breve descripción que aparece en las tarjetas"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="long_description">Descripción completa</Label>
                    <Textarea
                      id="long_description"
                      {...register('long_description')}
                      className="mt-1.5"
                      placeholder="Descripción detallada del tour"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      id="featured"
                      checked={watch('featured')}
                      onCheckedChange={(checked) => setValue('featured', checked)}
                    />
                    <Label htmlFor="featured">Tour destacado</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Galería de imágenes</CardTitle>
                  <CardDescription>Imagen principal y galería del tour</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hero_image_url">Imagen principal (Hero)</Label>
                    <Input
                      id="hero_image_url"
                      {...register('hero_image_url')}
                      className="mt-1.5"
                      placeholder="https://..."
                    />
                    {watch('hero_image_url') && (
                      <img 
                        src={watch('hero_image_url')} 
                        alt="Preview" 
                        className="mt-2 w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Galería</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addGalleryImage}>
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar imagen
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {galleryImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={url} 
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addGalleryImage}
                        className="w-full h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-[#3546A6] hover:text-[#3546A6] transition-colors"
                      >
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span className="text-xs">Agregar</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <div className="max-w-4xl space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Itinerario</CardTitle>
                      <CardDescription>Detalle día a día del tour</CardDescription>
                    </div>
                    <Button type="button" onClick={addItineraryDay}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar día
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itinerary.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                      <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500">No hay días en el itinerario</p>
                      <Button type="button" variant="outline" className="mt-3" onClick={addItineraryDay}>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar primer día
                      </Button>
                    </div>
                  ) : (
                    <Accordion type="multiple" className="space-y-3">
                      {itinerary.map((day, index) => (
                        <AccordionItem 
                          key={index} 
                          value={`day-${index}`}
                          className="border rounded-lg overflow-hidden"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:no-underline bg-slate-50">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3546A6] to-[#9996DB] flex items-center justify-center text-white text-sm font-bold">
                                {day.day}
                              </span>
                              <span className="font-medium text-[#3546A6]">
                                {day.title || `Día ${day.day}`}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-4 space-y-4">
                            <div>
                              <Label>Título del día</Label>
                              <Input
                                value={day.title}
                                onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                                className="mt-1.5"
                                placeholder="Ej: Llegada a Bogotá"
                              />
                            </div>
                            <div>
                              <Label>Descripción/Actividades</Label>
                              <Textarea
                                value={day.description}
                                onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                                className="mt-1.5"
                                placeholder="Describe las actividades del día..."
                                rows={3}
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label>Alojamiento</Label>
                                <Input
                                  value={day.accommodation || ''}
                                  onChange={(e) => updateItineraryDay(index, 'accommodation', e.target.value)}
                                  className="mt-1.5"
                                  placeholder="Ej: Hotel Bogotá Plaza"
                                />
                              </div>
                              <div>
                                <Label>Comidas incluidas</Label>
                                <div className="flex gap-2 mt-1.5">
                                  {meals.map((meal) => (
                                    <Button
                                      key={meal}
                                      type="button"
                                      size="sm"
                                      variant={day.meals?.includes(meal) ? 'default' : 'outline'}
                                      className={day.meals?.includes(meal) ? 'bg-[#3546A6]' : ''}
                                      onClick={() => {
                                        const currentMeals = day.meals || [];
                                        const newMeals = currentMeals.includes(meal)
                                          ? currentMeals.filter(m => m !== meal)
                                          : [...currentMeals, meal];
                                        updateItineraryDay(index, 'meals', newMeals);
                                      }}
                                    >
                                      {meal}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label>Imagen del día (opcional)</Label>
                              <Input
                                value={day.imageUrl || ''}
                                onChange={(e) => updateItineraryDay(index, 'imageUrl', e.target.value)}
                                className="mt-1.5"
                                placeholder="https://..."
                              />
                            </div>
                            <div className="flex justify-end">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => removeItineraryDay(index)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Eliminar día
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Includes Tab */}
          {activeTab === 'includes' && (
            <div className="max-w-4xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Incluye</CardTitle>
                  <CardDescription>Servicios y amenidades incluidos en el tour</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Opciones predefinidas</Label>
                    <div className="flex flex-wrap gap-2">
                      {predefinedIncludes.map((item) => (
                        <Badge
                          key={item}
                          variant={includes.includes(item) ? 'default' : 'outline'}
                          className={`cursor-pointer transition-colors ${
                            includes.includes(item) 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300' 
                              : 'hover:bg-slate-100'
                          }`}
                          onClick={() => togglePredefinedInclude(item)}
                        >
                          {includes.includes(item) && <Check className="w-3 h-3 mr-1" />}
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label>Items personalizados</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addCustomInclude}>
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {includes.filter(item => !predefinedIncludes.includes(item)).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="flex-1">{item}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setIncludes(includes.filter(i => i !== item))}
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>No incluye</CardTitle>
                  <CardDescription>Servicios que no están incluidos en el precio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Opciones predefinidas</Label>
                    <div className="flex flex-wrap gap-2">
                      {predefinedExcludes.map((item) => (
                        <Badge
                          key={item}
                          variant={excludes.includes(item) ? 'default' : 'outline'}
                          className={`cursor-pointer transition-colors ${
                            excludes.includes(item) 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300' 
                              : 'hover:bg-slate-100'
                          }`}
                          onClick={() => togglePredefinedExclude(item)}
                        >
                          {excludes.includes(item) && <X className="w-3 h-3 mr-1" />}
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label>Items personalizados</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addCustomExclude}>
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {excludes.filter(item => !predefinedExcludes.includes(item)).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          <span className="flex-1">{item}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setExcludes(excludes.filter(i => i !== item))}
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Price Tab */}
          {activeTab === 'price' && (
            <div className="max-w-4xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Precio base</CardTitle>
                  <CardDescription>Precio principal mostrado en el listado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price_usd">Precio desde (USD) *</Label>
                      <div className="relative mt-1.5">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="price_usd"
                          type="number"
                          {...register('price_usd', { required: true, min: 0 })}
                          className="pl-9"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Paquetes de precio</CardTitle>
                      <CardDescription>Configuración de precios por tipo de habitación</CardDescription>
                    </div>
                    <Button type="button" variant="outline" onClick={addPackage}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar paquete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="space-y-3">
                    {packages.map((pkg) => (
                      <AccordionItem 
                        key={pkg.id} 
                        value={pkg.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline bg-slate-50">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-[#3546A6]">{pkg.name}</span>
                            {pkg.isDefault && (
                              <Badge className="bg-green-100 text-green-700">Por defecto</Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Nombre del paquete</Label>
                              <Input
                                value={pkg.name}
                                onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                                className="mt-1.5"
                              />
                            </div>
                            <div>
                              <Label>Etiqueta</Label>
                              <Input
                                value={pkg.label}
                                onChange={(e) => updatePackage(pkg.id, 'label', e.target.value)}
                                className="mt-1.5"
                                placeholder="Ej: Por persona"
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Precio Adulto (USD)</Label>
                              <div className="relative mt-1.5">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                  type="number"
                                  value={pkg.adultPrice}
                                  onChange={(e) => updatePackage(pkg.id, 'adultPrice', Number(e.target.value))}
                                  className="pl-9"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Precio Niño (USD)</Label>
                              <div className="relative mt-1.5">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                  type="number"
                                  value={pkg.childPrice}
                                  onChange={(e) => updatePackage(pkg.id, 'childPrice', Number(e.target.value))}
                                  className="pl-9"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={pkg.isDefault}
                                onCheckedChange={() => setDefaultPackage(pkg.id)}
                              />
                              <Label>Paquete por defecto</Label>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => removePackage(pkg.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Add Destination Modal */}
      <Dialog open={isDestinationModalOpen} onOpenChange={setIsDestinationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nuevo destino</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nombre del destino *</Label>
              <Input
                value={newDestination.name}
                onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                className="mt-1.5"
                placeholder="Ej: Bogotá"
              />
            </div>
            <div>
              <Label>País *</Label>
              <Input
                value={newDestination.country}
                onChange={(e) => setNewDestination({ ...newDestination, country: e.target.value })}
                className="mt-1.5"
                placeholder="Ej: Colombia"
              />
            </div>
            <div>
              <Label>Región</Label>
              <Input
                value={newDestination.region}
                onChange={(e) => setNewDestination({ ...newDestination, region: e.target.value })}
                className="mt-1.5"
                placeholder="Ej: Suramérica"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDestinationModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddDestination} className="bg-[#3546A6]">
              Agregar destino
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
