"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/supabase/client';
import type { Tour } from '@/types/database';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ToursListPageProps {
  initialTours: Tour[];
}

export default function ToursListPage({ initialTours }: ToursListPageProps) {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [filteredTours, setFilteredTours] = useState<Tour[]>(initialTours);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Tour | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const filtered = tours.filter(tour => 
      tour.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.slug?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTours(filtered);
  }, [searchQuery, tours]);

  const handleDeleteTour = async (tourId: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tourId);

      if (error) throw error;

      setTours(tours.filter(t => t.id !== tourId));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Error al eliminar el tour');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTours.length === 0) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('tours')
        .delete()
        .in('id', selectedTours);

      if (error) throw error;

      setTours(tours.filter(t => !selectedTours.includes(t.id)));
      setSelectedTours([]);
      setBulkDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting tours:', error);
      alert('Error al eliminar los tours');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectTour = (tourId: string) => {
    setSelectedTours(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTours.length === filteredTours.length) {
      setSelectedTours([]);
    } else {
      setSelectedTours(filteredTours.map(t => t.id));
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return 'bg-gray-100 text-gray-700';
    const lower = difficulty.toLowerCase();
    if (lower.includes('fácil') || lower.includes('facil')) return 'bg-green-100 text-green-700';
    if (lower.includes('moderado')) return 'bg-yellow-100 text-yellow-700';
    if (lower.includes('difícil')) return 'bg-orange-100 text-orange-700';
    if (lower.includes('intenso')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Todos los Tours</h1>
          <p className="text-slate-500 text-sm mt-1">{tours.length} tours en total</p>
        </div>
        <Link href="/admin/tours/create">
          <Button className="bg-gradient-to-r from-[#FFA03B] to-[#FFD491] hover:opacity-90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Crear Tour
          </Button>
        </Link>
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar tours por nombre o slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 border-slate-200 focus:border-[#3546A6]"
          />
        </div>
        {selectedTours.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={() => setBulkDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar ({selectedTours.length})
          </Button>
        )}
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-4 text-left">
                  <Checkbox
                    checked={selectedTours.length === filteredTours.length && filteredTours.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Tour</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Dificultad</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Duración</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Estado</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.length > 0 ? (
                filteredTours.map((tour) => (
                  <tr key={tour.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedTours.includes(tour.id)}
                        onCheckedChange={() => toggleSelectTour(tour.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          {tour.hero_image_url ? (
                            <img
                              src={tour.hero_image_url}
                              alt={tour.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              Sin img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{tour.title}</p>
                          <p className="text-xs text-slate-500">/{tour.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {tour.difficulty_level ? (
                        <Badge className={getDifficultyColor(tour.difficulty_level)}>
                          {tour.difficulty_level}
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-600">
                        {tour.duration_days ? `${tour.duration_days} día(s)` : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {tour.featured ? (
                        <Badge className="bg-green-100 text-green-700">Destacado</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600">Normal</Badge>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/tours/${tour.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="text-slate-600">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/tours/${tour.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-slate-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(tour)}
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
                    <p className="text-slate-500">No se encontraron tours</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Single Tour Dialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar tour</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar &quot;{deleteTarget?.title}&quot;? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDeleteTour(deleteTarget.id)}
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
            <AlertDialogTitle>Eliminar {selectedTours.length} tours</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar los {selectedTours.length} tours seleccionados? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : `Eliminar ${selectedTours.length} tours`}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
