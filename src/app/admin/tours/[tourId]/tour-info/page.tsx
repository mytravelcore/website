"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/supabase/client';
import type { Tour } from '@/types/database';

export default function TourInfoPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.tourId as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [destinationLabel, setDestinationLabel] = useState('');
  const [difficultyLabel, setDifficultyLabel] = useState('');
  const [activitiesLabel, setActivitiesLabel] = useState('');
  const [groupSizeLabel, setGroupSizeLabel] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [subtitle, setSubtitle] = useState('');

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
      setDestinationLabel(tourData.destination_label || '');
      setDifficultyLabel(tourData.difficulty_label || '');
      setActivitiesLabel(tourData.activities_label || '');
      setGroupSizeLabel(tourData.group_size_label || '');
      setAgeRange(tourData.age_range || '');
      setSubtitle(tourData.subtitle || '');
      setLoading(false);
    }

    loadData();
  }, [tourId, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('tours')
        .update({ 
          destination_label: destinationLabel || null,
          difficulty_label: difficultyLabel || null,
          activities_label: activitiesLabel || null,
          group_size_label: groupSizeLabel || null,
          age_range: ageRange || null,
          subtitle: subtitle || null,
        })
        .eq('id', tourId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving tour info:', error);
      alert('Error al guardar la información');
    } finally {
      setIsSaving(false);
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
    <div className="max-w-4xl">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#3546A6]">Info del Tour</h2>
          <p className="text-slate-500">Información adicional mostrada en la tarjeta de reserva</p>
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
          Guardar
        </Button>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Etiquetas de Información</CardTitle>
          <CardDescription>
            Estos campos se muestran en la tarjeta de reserva del tour
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subtitle */}
          <div>
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="mt-1.5"
              placeholder="Ej: Una aventura inolvidable"
            />
          </div>

          {/* Grid of labels */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="destination_label">Etiqueta de Destino</Label>
              <Input
                id="destination_label"
                value={destinationLabel}
                onChange={(e) => setDestinationLabel(e.target.value)}
                className="mt-1.5"
                placeholder="Ej: Cusco y Machu Picchu"
              />
            </div>
            <div>
              <Label htmlFor="difficulty_label">Etiqueta de Dificultad</Label>
              <Input
                id="difficulty_label"
                value={difficultyLabel}
                onChange={(e) => setDifficultyLabel(e.target.value)}
                className="mt-1.5"
                placeholder="Ej: Moderado - Caminatas de 4-6 horas"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="activities_label">Etiqueta de Actividades</Label>
              <Input
                id="activities_label"
                value={activitiesLabel}
                onChange={(e) => setActivitiesLabel(e.target.value)}
                className="mt-1.5"
                placeholder="Ej: Trekking, Cultural, Fotografía"
              />
            </div>
            <div>
              <Label htmlFor="group_size_label">Etiqueta de Tamaño de Grupo</Label>
              <Input
                id="group_size_label"
                value={groupSizeLabel}
                onChange={(e) => setGroupSizeLabel(e.target.value)}
                className="mt-1.5"
                placeholder="Ej: 6-12 personas"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="age_range">Rango de Edad</Label>
            <Input
              id="age_range"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="mt-1.5"
              placeholder="Ej: 18-65 años"
            />
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
          Guardar
        </Button>
      </div>
    </div>
  );
}
