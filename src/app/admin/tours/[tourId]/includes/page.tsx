"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, Plus, Trash2, Check, X, Wand2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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

/** Inline-editable item row */
function EditableItem({
  value,
  onSave,
  onRemove,
  colorClass,
  iconElement,
}: {
  value: string;
  onSave: (next: string) => void;
  onRemove: () => void;
  colorClass: string;
  iconElement: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    else setDraft(value);
    setEditing(false);
  };

  return (
    <div className={`flex items-center justify-between p-2 rounded-lg ${colorClass}`}>
      {editing ? (
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') { setDraft(value); setEditing(false); }
          }}
          className="h-7 text-sm flex-1 mr-2 bg-white"
        />
      ) : (
        <span className="text-sm flex items-center gap-2 flex-1 min-w-0">
          {iconElement}
          <span className="truncate">{value}</span>
        </span>
      )}
      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
        {!editing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => { setDraft(value); setEditing(true); }}
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700"
          >
            <Pencil className="w-3 h-3" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

/** Bulk-paste panel shared between includes and excludes */
function BulkPanel({
  onImport,
  onCancel,
  label,
}: {
  onImport: (items: string[]) => void;
  onCancel: () => void;
  label: string;
}) {
  const [text, setText] = useState('');

  const handleImport = () => {
    const items = text
      .split('\n')
      .map((l) => l.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);
    if (items.length === 0) return;
    onImport(items);
  };

  return (
    <div className="mt-4 p-3 border border-dashed border-slate-300 rounded-lg bg-slate-50 space-y-2">
      <Label className="text-xs text-slate-500">
        Pega la lista de <strong>{label}</strong> (un ítem por línea)
      </Label>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"Alojamiento\nDesayunos diarios\nTraslados aeropuerto-hotel"}
        rows={6}
        className="text-sm font-mono"
      />
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          onClick={handleImport}
          disabled={!text.trim()}
          className="bg-gradient-to-r from-[#3546A6] to-[#9996DB] hover:opacity-90 text-white"
        >
          <Wand2 className="w-3 h-3 mr-1.5" />
          Importar
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

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
  const [showBulkIncludes, setShowBulkIncludes] = useState(false);
  const [showBulkExcludes, setShowBulkExcludes] = useState(false);

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

  const togglePredefined = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const addCustom = (value: string, list: string[], setList: (v: string[]) => void, clear: () => void) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      clear();
    }
  };

  const updateItem = (index: number, next: string, list: string[], setList: (v: string[]) => void) => {
    if (!next || list.some((it, i) => it === next && i !== index)) return;
    const updated = [...list];
    updated[index] = next;
    setList(updated);
  };

  const removeItem = (index: number, list: string[], setList: (v: string[]) => void) => {
    setList(list.filter((_, i) => i !== index));
  };

  const bulkImport = (
    items: string[],
    list: string[],
    setList: (v: string[]) => void,
    closeBulk: () => void
  ) => {
    const deduped = items.filter((it) => !list.includes(it));
    setList([...list, ...deduped]);
    closeBulk();
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
        <h2 className="text-2xl font-semibold text-[#3546A6]">Incluye / No incluye</h2>
        <p className="text-slate-500">Define qué está incluido y qué no en el tour</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Includes ── */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Check className="w-5 h-5" />
                  Incluye
                </CardTitle>
                <CardDescription>Lo que está incluido en el precio</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setShowBulkIncludes(!showBulkIncludes); }}
                className="text-[#3546A6] border-[#3546A6] text-xs"
              >
                <Wand2 className="w-3 h-3 mr-1.5" />
                Pegar en bulk
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Predefined */}
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
                    onClick={() => togglePredefined(item, includes, setIncludes)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Bulk panel */}
            {showBulkIncludes && (
              <BulkPanel
                label="incluye"
                onImport={(items) =>
                  bulkImport(items, includes, setIncludes, () => setShowBulkIncludes(false))
                }
                onCancel={() => setShowBulkIncludes(false)}
              />
            )}

            {/* Custom add */}
            <div>
              <Label className="text-sm text-slate-500">Agregar personalizado</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  placeholder="Nuevo item..."
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    addCustom(newInclude, includes, setIncludes, () => setNewInclude(''))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addCustom(newInclude, includes, setIncludes, () => setNewInclude(''))
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* List with inline edit */}
            <div>
              <Label className="text-sm text-slate-500">Lista actual ({includes.length})</Label>
              <div className="mt-2 space-y-1">
                {includes.map((item, index) => (
                  <EditableItem
                    key={index}
                    value={item}
                    colorClass="bg-green-50"
                    iconElement={<Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                    onSave={(next) => updateItem(index, next, includes, setIncludes)}
                    onRemove={() => removeItem(index, includes, setIncludes)}
                  />
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

        {/* ── Excludes ── */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <X className="w-5 h-5" />
                  No incluye
                </CardTitle>
                <CardDescription>Lo que NO está incluido en el precio</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setShowBulkExcludes(!showBulkExcludes); }}
                className="text-[#3546A6] border-[#3546A6] text-xs"
              >
                <Wand2 className="w-3 h-3 mr-1.5" />
                Pegar en bulk
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Predefined */}
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
                    onClick={() => togglePredefined(item, excludes, setExcludes)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Bulk panel */}
            {showBulkExcludes && (
              <BulkPanel
                label="no incluye"
                onImport={(items) =>
                  bulkImport(items, excludes, setExcludes, () => setShowBulkExcludes(false))
                }
                onCancel={() => setShowBulkExcludes(false)}
              />
            )}

            {/* Custom add */}
            <div>
              <Label className="text-sm text-slate-500">Agregar personalizado</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newExclude}
                  onChange={(e) => setNewExclude(e.target.value)}
                  placeholder="Nuevo item..."
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    addCustom(newExclude, excludes, setExcludes, () => setNewExclude(''))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addCustom(newExclude, excludes, setExcludes, () => setNewExclude(''))
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* List with inline edit */}
            <div>
              <Label className="text-sm text-slate-500">Lista actual ({excludes.length})</Label>
              <div className="mt-2 space-y-1">
                {excludes.map((item, index) => (
                  <EditableItem
                    key={index}
                    value={item}
                    colorClass="bg-red-50"
                    iconElement={<X className="w-4 h-4 text-red-500 flex-shrink-0" />}
                    onSave={(next) => updateItem(index, next, excludes, setExcludes)}
                    onRemove={() => removeItem(index, excludes, setExcludes)}
                  />
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

      {/* Save */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex justify-end">
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
        </CardContent>
      </Card>
    </div>
  );
}
