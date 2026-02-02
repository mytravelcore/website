"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/supabase/client';
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

interface Activity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at?: string;
}

interface ActividadesListPageProps {
  initialActivities: Activity[];
}

export default function ActividadesListPage({ initialActivities }: ActividadesListPageProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(initialActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIcon, setFormIcon] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    const filtered = activities.filter(act => 
      act.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredActivities(filtered);
  }, [searchQuery, activities]);

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
    if (!editingActivity) {
      setFormSlug(generateSlug(value));
    }
  };

  const openCreateModal = () => {
    setEditingActivity(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormIcon('');
    setEditModalOpen(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setFormName(activity.name || '');
    setFormSlug(activity.slug || '');
    setFormDescription(activity.description || '');
    setFormIcon(activity.icon || '');
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName || !formSlug) {
      alert('Nombre y slug son requeridos');
      return;
    }

    setIsSaving(true);
    try {
      if (editingActivity) {
        // Update
        const { error } = await supabase
          .from('activities')
          .update({
            name: formName,
            slug: formSlug,
            description: formDescription || null,
            icon: formIcon || null,
          })
          .eq('id', editingActivity.id);

        if (error) throw error;

        setActivities(activities.map(a => 
          a.id === editingActivity.id 
            ? { ...a, name: formName, slug: formSlug, description: formDescription, icon: formIcon }
            : a
        ));
      } else {
        // Create
        const { data, error } = await supabase
          .from('activities')
          .insert([{
            name: formName,
            slug: formSlug,
            description: formDescription || null,
            icon: formIcon || null,
          }])
          .select()
          .single();

        if (error) throw error;

        setActivities([data, ...activities]);
      }

      setEditModalOpen(false);
    } catch (error: any) {
      console.error('Error saving activity:', error);
      if (error.code === '23505') {
        alert('Ya existe una actividad con ese nombre. Por favor usa otro.');
      } else {
        alert('Error al guardar la actividad');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteActivity = async (actId: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', actId);

      if (error) throw error;

      setActivities(activities.filter(a => a.id !== actId));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Error al eliminar la actividad');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedActivities.length === 0) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .in('id', selectedActivities);

      if (error) throw error;

      setActivities(activities.filter(a => !selectedActivities.includes(a.id)));
      setSelectedActivities([]);
      setBulkDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting activities:', error);
      alert('Error al eliminar las actividades');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectActivity = (actId: string) => {
    setSelectedActivities(prev => 
      prev.includes(actId) 
        ? prev.filter(id => id !== actId)
        : [...prev, actId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedActivities.length === filteredActivities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(filteredActivities.map(a => a.id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Actividades</h1>
          <p className="text-slate-500 text-sm mt-1">{activities.length} actividades en total</p>
        </div>
        <Button 
          onClick={openCreateModal}
          className="bg-gradient-to-r from-[#FFA03B] to-[#FFD491] hover:opacity-90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Actividad
        </Button>
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar actividades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 border-slate-200 focus:border-[#3546A6]"
          />
        </div>
        {selectedActivities.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={() => setBulkDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar ({selectedActivities.length})
          </Button>
        )}
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-4 text-left">
                  <Checkbox
                    checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Nombre</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Slug</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Descripción</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Icono</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <tr key={activity.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedActivities.includes(activity.id)}
                        onCheckedChange={() => toggleSelectActivity(activity.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{activity.name}</p>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {activity.slug}
                      </code>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-600 truncate max-w-xs">
                        {activity.description || '-'}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600">
                        {activity.icon || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-600"
                          onClick={() => openEditModal(activity)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(activity)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-500">No se encontraron actividades</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingActivity ? 'Editar Actividad' : 'Nueva Actividad'}</DialogTitle>
            <DialogDescription>
              {editingActivity ? 'Actualiza la información de la actividad' : 'Agrega una nueva actividad'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Nombre *</Label>
              <Input
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Aventura"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Slug *</Label>
              <Input
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="aventura"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Descripción de la actividad..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Icono (lucide-react)</Label>
              <Input
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                placeholder="mountain, trees, umbrella-beach..."
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">
                Nombre del icono de lucide-react (opcional)
              </p>
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
              {editingActivity ? 'Guardar' : 'Crear'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Single Dialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar actividad</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar &quot;{deleteTarget?.name}&quot;? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDeleteActivity(deleteTarget.id)}
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
            <AlertDialogTitle>Eliminar {selectedActivities.length} actividades</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar las {selectedActivities.length} actividades seleccionadas? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : `Eliminar ${selectedActivities.length} actividades`}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
