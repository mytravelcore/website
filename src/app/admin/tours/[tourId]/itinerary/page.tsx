"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
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

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      const { data: tourData, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', tourId)
        .single();

      if (error || !tourData) {
        router.push('/admin/tours');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#3546A6]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#3546A6]">Itinerario</h2>
          <p className="text-slate-500">Define el itinerario día a día del tour</p>
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
          Guardar itinerario
        </Button>
      </div>

      {/* Itinerary Days */}
      <Card>
        <CardHeader>
          <CardTitle>Días del tour</CardTitle>
          <CardDescription>
            {itinerary.length === 0 
              ? 'Agrega los días del itinerario' 
              : `${itinerary.length} ${itinerary.length === 1 ? 'día' : 'días'} en el itinerario`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          Guardar itinerario
        </Button>
      </div>
    </div>
  );
}
