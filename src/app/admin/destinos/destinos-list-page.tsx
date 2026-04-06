"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Loader2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/supabase/client';
import type { Destination } from '@/types/database';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageUpload from '@/components/admin/image-upload';

interface DestinosListPageProps {
  initialDestinations: Destination[];
}

export default function DestinosListPage({ initialDestinations }: DestinosListPageProps) {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(initialDestinations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formRegion, setFormRegion] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const filtered = destinations.filter(dest => 
      dest.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDestinations(filtered);
  }, [searchQuery, destinations]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormName(value);
    if (!editingDestination) {
      setFormSlug(generateSlug(value));
    }
  };

  const openCreateModal = () => {
    setEditingDestination(null);
    setFormName('');
    setFormSlug('');
    setFormCountry('');
    setFormRegion('');
    setFormDescription('');
    setFormImageUrl('');
    setFormIsFeatured(false);
    setEditModalOpen(true);
  };

  const openEditModal = (destination: Destination) => {
    setEditingDestination(destination);
    setFormName(destination.name || '');
    setFormSlug(destination.slug || '');
    setFormCountry(destination.country || '');
    setFormRegion(destination.region || '');
    setFormDescription(destination.short_description || '');
    setFormImageUrl(destination.image_url || destination.hero_image_url || '');
    setFormIsFeatured(destination.is_featured || false);
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName || !formSlug) {
      alert('Nombre y slug son requeridos');
      return;
    }

    setIsSaving(true);
    try {
      if (editingDestination) {
        // Update
        const { error } = await supabase
          .from('destinations')
          .update({
            name: formName,
            slug: formSlug,
            country: formCountry || null,
            region: formRegion || null,
            short_description: formDescription || null,
            image_url: formImageUrl || null,
            hero_image_url: formImageUrl || null,
            is_featured: formIsFeatured,
          })
          .eq('id', editingDestination.id);

        if (error) throw error;

        setDestinations(destinations.map(d => 
          d.id === editingDestination.id 
            ? { ...d, name: formName, slug: formSlug, country: formCountry, region: formRegion, short_description: formDescription, image_url: formImageUrl, hero_image_url: formImageUrl, is_featured: formIsFeatured }
            : d
        ));
      } else {
        // Create
        const { data, error } = await supabase
          .from('destinations')
          .insert([{
            name: formName,
            slug: formSlug,
            country: formCountry || null,
            region: formRegion || null,
            short_description: formDescription || null,
            image_url: formImageUrl || null,
            hero_image_url: formImageUrl || null,
            is_featured: formIsFeatured,
          }])
          .select()
          .single();

        if (error) throw error;

        setDestinations([data, ...destinations]);
      }

      setEditModalOpen(false);
    } catch (error: any) {
      console.error('Error saving destination:', error);
      if (error.code === '23505') {
        alert('Ya existe un destino con ese slug. Por favor usa otro.');
      } else {
        alert('Error al guardar el destino');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDestination = async (destId: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', destId);

      if (error) throw error;

      setDestinations(destinations.filter(d => d.id !== destId));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Error al eliminar el destino');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDestinations.length === 0) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('destinations')
        .delete()
        .in('id', selectedDestinations);

      if (error) throw error;

      setDestinations(destinations.filter(d => !selectedDestinations.includes(d.id)));
      setSelectedDestinations([]);
      setBulkDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting destinations:', error);
      alert('Error al eliminar los destinos');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectDestination = (destId: string) => {
    setSelectedDestinations(prev => 
      prev.includes(destId) 
        ? prev.filter(id => id !== destId)
        : [...prev, destId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDestinations.length === filteredDestinations.length) {
      setSelectedDestinations([]);
    } else {
      setSelectedDestinations(filteredDestinations.map(d => d.id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Destinos</h1>
          <p className="text-slate-500 text-sm mt-1">{destinations.length} destinos en total</p>
        </div>
        <Button 
          onClick={openCreateModal}
          className="bg-gradient-to-r from-[#FFA03B] to-[#FFD491] hover:opacity-90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Destino
        </Button>
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar destinos por nombre o país..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 border-slate-200 focus:border-[#3546A6]"
          />
        </div>
        {selectedDestinations.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={() => setBulkDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar ({selectedDestinations.length})
          </Button>
        )}
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDestinations.map((dest) => (
          <div 
            key={dest.id} 
            className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-40 bg-slate-100">
              {dest.hero_image_url ? (
                <img 
                  src={dest.hero_image_url} 
                  alt={dest.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3546A6]/20 to-[#9996DB]/20">
                  <span className="text-slate-400 text-sm">Sin imagen</span>
                </div>
              )}
              <div className="absolute top-2 left-2">
                <Checkbox
                  checked={selectedDestinations.includes(dest.id)}
                  onCheckedChange={() => toggleSelectDestination(dest.id)}
                  className="bg-white"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-900">{dest.name}</h3>
              {dest.country && (
                <p className="text-sm text-slate-500">{dest.country}</p>
              )}
              {dest.short_description && (
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">{dest.short_description}</p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEditModal(dest)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setDeleteTarget(dest)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No se encontraron destinos</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDestination ? 'Editar Destino' : 'Nuevo Destino'}</DialogTitle>
            <DialogDescription>
              {editingDestination ? 'Actualiza la información del destino' : 'Agrega un nuevo destino'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Nombre *</Label>
              <Input
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Cancún"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Slug *</Label>
              <Input
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="cancun"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>País</Label>
                <Input
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  placeholder="Ej: México"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Región</Label>
                <Input
                  value={formRegion}
                  onChange={(e) => setFormRegion(e.target.value)}
                  placeholder="Ej: Caribe"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>URL de Imagen</Label>
              <Input
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div>
              <Label>Descripción corta</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Descripción breve del destino..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label className="mb-2 block">Imagen</Label>
              {formImageUrl && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-100 mb-3">
                  <img 
                    src={formImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('')}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/80 text-slate-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <ImageUpload
                onImageUpload={(url) => setFormImageUrl(url)}
                label="URL de imagen del destino"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="flex items-center justify-between space-x-2 pt-2 pb-2 px-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex-1">
                <Label 
                  htmlFor="featured"
                  className="text-sm font-medium leading-tight cursor-pointer"
                >
                  Destino destacado
                </Label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aparecerá en la página principal
                </p>
              </div>
              <Switch
                id="featured"
                checked={formIsFeatured}
                onCheckedChange={(checked) => setFormIsFeatured(checked)}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-[#3546A6] to-[#9996DB] hover:opacity-90 text-white"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {editingDestination ? 'Guardar' : 'Crear'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Single Dialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar destino</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar &quot;{deleteTarget?.name}&quot;? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDeleteDestination(deleteTarget.id)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar {selectedDestinations.length} destinos</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar los {selectedDestinations.length} destinos seleccionados? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : `Eliminar ${selectedDestinations.length} destinos`}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
