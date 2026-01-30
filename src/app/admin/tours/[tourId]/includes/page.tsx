"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/supabase/client';
import type { Tour } from '@/types/database';

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

export default function IncludesPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.tourId as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');

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
      setIncludes(tourData.includes || []);
      setExcludes(tourData.excludes || []);
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
        .update({ includes, excludes })
        .eq('id', tourId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving includes/excludes:', error);
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

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
          <h2 className="text-2xl font-semibold text-[#3546A6]">Incluye / No incluye</h2>
          <p className="text-slate-500">Define qué está incluido y qué no en el tour</p>
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Includes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              Incluye
            </CardTitle>
            <CardDescription>Lo que está incluido en el precio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Predefined Options */}
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

            {/* Custom Items */}
            <div>
              <Label className="text-sm text-slate-500">Agregar personalizado</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  placeholder="Nuevo item..."
                  onKeyPress={(e) => e.key === 'Enter' && addCustomInclude()}
                />
                <Button type="button" variant="outline" onClick={addCustomInclude}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Current List */}
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
            <CardDescription>Lo que NO está incluido en el precio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Predefined Options */}
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

            {/* Custom Items */}
            <div>
              <Label className="text-sm text-slate-500">Agregar personalizado</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newExclude}
                  onChange={(e) => setNewExclude(e.target.value)}
                  placeholder="Nuevo item..."
                  onKeyPress={(e) => e.key === 'Enter' && addCustomExclude()}
                />
                <Button type="button" variant="outline" onClick={addCustomExclude}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Current List */}
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
