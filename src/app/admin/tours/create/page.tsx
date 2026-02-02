'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/supabase/client';
import { ArrowLeft, Save, Loader2, X, Link2, FileText, ImageIcon, DollarSign, Calendar, Map, List, Star, HelpCircle, Home, Building } from 'lucide-react';
import ImageUpload from '@/components/admin/image-upload';
import { cn } from '@/lib/utils';

const sidebarSections = [
  { id: 'general', label: 'Información General', icon: FileText },
  { id: 'images', label: 'Imágenes', icon: ImageIcon },
  { id: 'pricing', label: 'Precios', icon: DollarSign },
  { id: 'dates', label: 'Fechas', icon: Calendar },
  { id: 'itinerary', label: 'Itinerario', icon: Map },
  { id: 'includes', label: 'Incluye/No Incluye', icon: List },
  { id: 'accommodation', label: 'Alojamiento', icon: Building },
  { id: 'reviews', label: 'Reseñas', icon: Star },
  { id: 'faqs', label: 'Preguntas Frecuentes', icon: HelpCircle },
];

export default function CreateTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [durationDays, setDurationDays] = useState(1);
  const [priceUsd, setPriceUsd] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState('');
  
  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug) {
      alert('Por favor completa los campos requeridos (Nombre y Slug)');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('tours')
        .insert([
          {
            title,
            slug,
            short_description: shortDescription || null,
            long_description: longDescription || null,
            hero_image_url: heroImageUrl || null,
            gallery_image_urls: galleryImages.length > 0 ? galleryImages : null,
            duration_days: durationDays,
            price_usd: priceUsd,
            difficulty_level: difficultyLevel || null,
            status: 'draft',
            featured: false,
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        router.push(`/admin/tours/${data.id}/edit`);
      }
    } catch (error: any) {
      console.error('Error creating tour:', error);
      if (error.code === '23505') {
        alert('Ya existe un tour con ese slug. Por favor usa otro.');
      } else {
        alert('Error al crear el tour');
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Back to Tours */}
        <div className="p-4 border-b border-slate-200">
          <Link 
            href="/admin"
            className="flex items-center gap-2 text-slate-600 hover:text-[#3546A6] text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Tours
          </Link>
        </div>

        {/* Section Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Secciones
          </p>
          <ul className="space-y-1">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      activeSection === section.id
                        ? "bg-[#3546A6]/10 text-[#3546A6] font-medium"
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-[#3546A6]">Crear Nuevo Tour</h1>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-[#FFA03B] to-[#FFD491] hover:opacity-90 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Crear Tour
          </Button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-12">
            {/* General Information */}
            <section id="general" className="scroll-mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3546A6]" />
                Información General
              </h2>
              <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
                <div>
                  <Label className="text-slate-700">Nombre del Tour *</Label>
                  <Input
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Ej: Machu Picchu 4 Días"
                    className="mt-2 h-12"
                    required
                  />
                </div>

                <div>
                  <Label className="text-slate-700">URL (Slug) *</Label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="machu-picchu-4-dias"
                    className="mt-2 h-12"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Se genera automáticamente desde el nombre</p>
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
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#3546A6]" />
                Imágenes
              </h2>
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

                    maxSize={10}
                    label="Agregar imagen a la galería"
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
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#3546A6]" />
                Precios
              </h2>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div>
                  <Label className="text-slate-700">Precio Base (USD)</Label>
                  <Input
                    type="number"
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(Number(e.target.value))}
                    className="mt-2 h-12"
                    min="0"
                  />
                  <p className="text-xs text-slate-500 mt-1">Puedes agregar más opciones de precios después de crear el tour</p>
                </div>
              </div>
            </section>

            {/* Placeholder sections */}
            <section id="dates" className="scroll-mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#3546A6]" />
                Fechas
              </h2>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-500 text-center py-8">
                  Podrás agregar fechas disponibles después de crear el tour
                </p>
              </div>
            </section>

            <section id="itinerary" className="scroll-mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Map className="w-5 h-5 text-[#3546A6]" />
                Itinerario
              </h2>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-500 text-center py-8">
                  Podrás agregar el itinerario después de crear el tour
                </p>
              </div>
            </section>

            <section id="includes" className="scroll-mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <List className="w-5 h-5 text-[#3546A6]" />
                Incluye / No Incluye
              </h2>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-500 text-center py-8">
                  Podrás agregar qué incluye y qué no incluye después de crear el tour
                </p>
              </div>
            </section>

            <section id="accommodation" className="scroll-mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#3546A6]" />
                Alojamiento
              </h2>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-500 text-center py-8">
                  Podrás agregar información de alojamiento después de crear el tour
                </p>
              </div>
            </section>

            <section id="reviews" className="scroll-mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#3546A6]" />
                Reseñas
              </h2>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-500 text-center py-8">
                  Podrás agregar reseñas después de crear el tour
                </p>
              </div>
            </section>

            <section id="faqs" className="scroll-mt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#3546A6]" />
                Preguntas Frecuentes
              </h2>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-500 text-center py-8">
                  Podrás agregar preguntas frecuentes después de crear el tour
                </p>
              </div>
            </section>

            {/* Bottom spacing */}
            <div className="h-20" />
          </form>
        </main>
      </div>
    </div>
  );
}
