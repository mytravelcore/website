"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, Plus, Trash2, GripVertical, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient } from '@/supabase/client';
import type { Tour } from '@/types/database';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string[];
  imageUrl?: string;
}

export default function ItineraryPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.tourId as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [bulkText, setBulkText] = useState('');

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
      setItinerary(tourData.itinerary || []);
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
        .update({ itinerary })
        .eq('id', tourId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert('Error al guardar el itinerario');
    } finally {
      setIsSaving(false);
    }
  };

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

  const parseBulkItinerary = (text: string) => {
    const lines = text.trim().split('\n');
    const days: ItineraryDay[] = [];
    let currentDay: Partial<ItineraryDay> | null = null;
    let dayNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detectar inicio de día: "Día 1:", "Day 1:", "DIA 1:", etc.
      const dayMatch = line.match(/^d[ií]a\s+(\d+)[:\s-]*(.*)/i);
      
      if (dayMatch) {
        // Si hay un día anterior, guardarlo
        if (currentDay && currentDay.title) {
          days.push({
            day: dayNumber,
            title: currentDay.title,
            description: currentDay.description || '',
            accommodation: currentDay.accommodation || '',
            meals: currentDay.meals || [],
            imageUrl: currentDay.imageUrl || '',
          });
          dayNumber++;
        }
        
        // Iniciar nuevo día
        currentDay = {
          title: dayMatch[2].trim() || '',
          description: '',
        };
      } else if (currentDay && line) {
        // Si no es un inicio de día y hay texto, agregarlo a la descripción
        if (currentDay.description) {
          currentDay.description += '\n' + line;
        } else {
          // Si no hay título todavía, el primer texto es el título
          if (!currentDay.title) {
            currentDay.title = line;
          } else {
            currentDay.description = line;
          }
        }
      }
    }

    // Agregar el último día si existe
    if (currentDay && currentDay.title) {
      days.push({
        day: dayNumber,
        title: currentDay.title,
        description: currentDay.description || '',
        accommodation: '',
        meals: [],
        imageUrl: '',
      });
    }

    return days;
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) {
      alert('Por favor ingresa el itinerario completo');
      return;
    }

    const parsedDays = parseBulkItinerary(bulkText);
    
    if (parsedDays.length === 0) {
      alert('No se detectaron días válidos. Asegúrate de usar el formato:\n\nDía 1: Título\nDescripción\n\nDía 2: Título\nDescripción');
      return;
    }

    setItinerary(parsedDays);
    setBulkText('');
    setShowBulkInput(false);
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
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#3546A6]">Itinerario</h2>
        <p className="text-slate-500">Define el itinerario día a día del tour</p>
      </div>

      {/* Itinerary Days */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Días del tour</CardTitle>
              <CardDescription>
                {itinerary.length === 0 
                  ? 'Agrega los días del itinerario' 
                  : `${itinerary.length} ${itinerary.length === 1 ? 'día' : 'días'} en el itinerario`
                }
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowBulkInput(!showBulkInput)}
              className="text-[#3546A6] border-[#3546A6]"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {showBulkInput ? 'Cancelar' : 'Importación rápida'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Import Section */}
          {showBulkInput && (
            <div className="mb-6 p-4 border border-[#9996DB] rounded-lg bg-gradient-to-br from-[#9996DB]/5 to-[#DBBADD]/5">
              <Label className="text-[#3546A6] font-semibold">Pega el itinerario completo</Label>
              <p className="text-sm text-slate-600 mt-1 mb-3">
                Usa el formato:<br />
                <code className="text-xs bg-slate-100 px-2 py-1 rounded mt-1 inline-block">
                  Día 1: Título del día<br />
                  Descripción del día 1...<br />
                  <br />
                  Día 2: Título del día<br />
                  Descripción del día 2...
                </code>
              </p>
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Día 1: Llegada a Cusco&#10;Recepción en el aeropuerto y traslado al hotel...&#10;&#10;Día 2: City Tour Cusco&#10;Visita a la Plaza de Armas, Qoricancha y Sacsayhuaman..."
                rows={12}
                className="font-mono text-sm"
              />
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  onClick={handleBulkImport}
                  className="bg-gradient-to-r from-[#3546A6] to-[#9996DB] hover:opacity-90 text-white"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Procesar itinerario
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setBulkText('');
                    setShowBulkInput(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

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
                      {/* Title */}
                      <div>
                        <Label>Título del día</Label>
                        <Input
                          value={day.title}
                          onChange={(e) => updateDay(index, 'title', e.target.value)}
                          className="mt-1.5"
                          placeholder="Ej: Llegada a Cusco"
                        />
                      </div>

                      {/* Description */}
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

                      {/* Accommodation */}
                      <div>
                        <Label>Alojamiento</Label>
                        <Input
                          value={day.accommodation || ''}
                          onChange={(e) => updateDay(index, 'accommodation', e.target.value)}
                          className="mt-1.5"
                          placeholder="Ej: Hotel Marriott Cusco"
                        />
                      </div>

                      {/* Image URL */}
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

                      {/* Delete Button */}
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

          {/* Add Day Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addDay}
            className="w-full mt-4 border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar día
          </Button>

          {/* Save Button inside card with border */}
          <div className="flex justify-end pt-6 mt-6 border-t">
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
              Guardar itinerario
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
