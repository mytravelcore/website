"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Eye, Star, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TourFormModal from './tour-form-modal';
import { createClient } from '@/supabase/client';
import type { Tour, Destination } from '@/types/database';
import Link from 'next/link';

interface AdminDashboardProps {
  initialTours: Tour[];
  destinations: Destination[];
}

export default function AdminDashboard({ initialTours, destinations }: AdminDashboardProps) {
  const router = useRouter();
  const [tours, setTours] = useState(initialTours);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [deletingTour, setDeletingTour] = useState<Tour | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTours = tours.filter(tour => 
    tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTour = () => {
    setEditingTour(null);
    setIsFormOpen(true);
  };

  const handleEditTour = (tour: Tour) => {
    setEditingTour(tour);
    setIsFormOpen(true);
  };

  const handleDeleteTour = async () => {
    if (!deletingTour) return;
    
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', deletingTour.id);

      if (error) throw error;

      setTours(tours.filter(t => t.id !== deletingTour.id));
      setDeletingTour(null);
      router.refresh();
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Error al eliminar el tour');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTour(null);
    router.refresh();
  };

  const difficultyColors: Record<string, string> = {
    'Fácil': 'bg-green-100 text-green-700',
    'Moderado': 'bg-yellow-100 text-yellow-700',
    'Intenso': 'bg-red-100 text-red-700',
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 lg:px-20">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tc-purple-deep/40" />
            <Input
              placeholder="Buscar tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-tc-purple-light/30"
            />
          </div>
          <Button 
            onClick={handleAddTour}
            className="gradient-orange text-white border-0 rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Tour
          </Button>
        </div>

        {/* Tours Table */}
        <div className="bg-white rounded-xl border border-tc-purple-light/20 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-tc-lilac/10">
                <TableHead className="font-semibold text-tc-purple-deep">Tour</TableHead>
                <TableHead className="font-semibold text-tc-purple-deep">Destino</TableHead>
                <TableHead className="font-semibold text-tc-purple-deep">Precio</TableHead>
                <TableHead className="font-semibold text-tc-purple-deep">Duración</TableHead>
                <TableHead className="font-semibold text-tc-purple-deep">Dificultad</TableHead>
                <TableHead className="font-semibold text-tc-purple-deep">Estado</TableHead>
                <TableHead className="font-semibold text-tc-purple-deep text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTours.map((tour) => (
                <TableRow key={tour.id} className="hover:bg-tc-lilac/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {tour.hero_image_url && (
                        <img 
                          src={tour.hero_image_url} 
                          alt={tour.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-tc-purple-deep">{tour.title}</p>
                        <p className="text-sm text-tc-purple-deep/60">{tour.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-tc-purple-deep/70">
                    {tour.destination?.name || '-'}
                  </TableCell>
                  <TableCell className="font-medium text-tc-purple-deep">
                    ${tour.price_usd?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-tc-purple-deep/70">
                    {tour.duration_days} días
                  </TableCell>
                  <TableCell>
                    {tour.difficulty && (
                      <Badge className={difficultyColors[tour.difficulty] || ''}>
                        {tour.difficulty}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {tour.featured ? (
                      <Badge className="bg-tc-orange/10 text-tc-orange border-tc-orange/20">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Destacado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Normal
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/tours/${tour.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="text-tc-purple-deep/60 hover:text-tc-purple-deep">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-tc-purple-deep/60 hover:text-tc-purple-deep"
                        onClick={() => handleEditTour(tour)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500/60 hover:text-red-500"
                        onClick={() => setDeletingTour(tour)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTours.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-tc-purple-deep/60">
                    {searchQuery ? 'No se encontraron tours' : 'No hay tours registrados'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-xl border border-tc-purple-light/20 p-6">
            <p className="text-sm text-tc-purple-deep/60">Total Tours</p>
            <p className="text-3xl font-bold text-tc-purple-deep">{tours.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-tc-purple-light/20 p-6">
            <p className="text-sm text-tc-purple-deep/60">Destacados</p>
            <p className="text-3xl font-bold text-tc-orange">{tours.filter(t => t.featured).length}</p>
          </div>
          <div className="bg-white rounded-xl border border-tc-purple-light/20 p-6">
            <p className="text-sm text-tc-purple-deep/60">Destinos</p>
            <p className="text-3xl font-bold text-tc-purple-deep">{destinations.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-tc-purple-light/20 p-6">
            <p className="text-sm text-tc-purple-deep/60">Precio Promedio</p>
            <p className="text-3xl font-bold text-tc-purple-deep">
              ${Math.round(tours.reduce((acc, t) => acc + (t.price_usd || 0), 0) / tours.length || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tour Form Modal */}
      <TourFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTour(null);
        }}
        onSuccess={handleFormSuccess}
        tour={editingTour}
        destinations={destinations}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTour} onOpenChange={() => setDeletingTour(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este tour?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El tour "{deletingTour?.title}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTour}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
