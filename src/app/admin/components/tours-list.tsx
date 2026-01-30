"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  Star, 
  Search,
  Filter,
  MoreHorizontal,
  Copy,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from '@/supabase/client';
import type { Tour, Destination } from '@/types/database';
import { NavLink } from '@/components/admin/nav-link';
import { useNavigation } from '@/components/admin/navigation-provider';

interface ToursListProps {
  tours: Tour[];
  destinations: Destination[];
  onEditTour: (tour: Tour) => void;
  onAddTour: () => void;
  onRefresh: () => void;
}

export default function ToursList({ tours, destinations, onEditTour, onAddTour, onRefresh }: ToursListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [deletingTour, setDeletingTour] = useState<Tour | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'featured' && tour.featured) ||
      (statusFilter === 'draft' && !tour.featured);
    const matchesDestination = destinationFilter === 'all' || tour.destination_id === destinationFilter;
    
    return matchesSearch && matchesStatus && matchesDestination;
  });

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

      setDeletingTour(null);
      onRefresh();
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Error al eliminar el tour');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectTour = (id: string) => {
    setSelectedTours(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTours(prev => 
      prev.length === filteredTours.length ? [] : filteredTours.map(t => t.id)
    );
  };

  const difficultyColors: Record<string, string> = {
    'Fácil': 'bg-green-100 text-green-700 border-green-200',
    'Moderado': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Intenso': 'bg-red-100 text-red-700 border-red-200',
  };

  const categoryColors: Record<string, string> = {
    'Aventura': 'bg-purple-100 text-purple-700',
    'Playa': 'bg-blue-100 text-blue-700',
    'Cultural': 'bg-amber-100 text-amber-700',
    'Historia': 'bg-stone-100 text-stone-700',
    'Theme Parks': 'bg-pink-100 text-pink-700',
    'Naturaleza': 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#3546A6]">Tours</h1>
          <p className="text-slate-500">Gestiona todos los tours de tu agencia</p>
        </div>
        <Button 
          onClick={onAddTour}
          className="bg-gradient-to-r from-[#FFA03B] to-[#FFD491] text-white border-0 rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Tour
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar tours por nombre o destino..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-slate-200"
            />
          </div>

          {/* Filter Tabs */}
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="featured">Destacados</TabsTrigger>
              <TabsTrigger value="draft">Normales</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Destination Filter */}
          <Select value={destinationFilter} onValueChange={setDestinationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los destinos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los destinos</SelectItem>
              {destinations.map((dest) => (
                <SelectItem key={dest.id} value={dest.id}>
                  {dest.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedTours.length === filteredTours.length && filteredTours.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-[#3546A6]">Tour</TableHead>
              <TableHead className="font-semibold text-[#3546A6]">Tipo</TableHead>
              <TableHead className="font-semibold text-[#3546A6]">Duración</TableHead>
              <TableHead className="font-semibold text-[#3546A6]">Precio</TableHead>
              <TableHead className="font-semibold text-[#3546A6]">Estado</TableHead>
              <TableHead className="font-semibold text-[#3546A6]">Fecha</TableHead>
              <TableHead className="font-semibold text-[#3546A6] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTours.map((tour) => (
              <TableRow key={tour.id} className="hover:bg-slate-50/50">
                <TableCell>
                  <Checkbox 
                    checked={selectedTours.includes(tour.id)}
                    onCheckedChange={() => toggleSelectTour(tour.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {tour.hero_image_url ? (
                      <img 
                        src={tour.hero_image_url} 
                        alt={tour.title}
                        className="w-14 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-14 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[#3546A6] line-clamp-1">{tour.title}</p>
                      <p className="text-xs text-slate-500">{tour.destination?.name || 'Sin destino'}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {tour.category && (
                      <Badge className={categoryColors[tour.category] || 'bg-slate-100 text-slate-700'}>
                        {tour.category}
                      </Badge>
                    )}
                    {tour.difficulty && (
                      <Badge variant="outline" className={difficultyColors[tour.difficulty] || ''}>
                        {tour.difficulty}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">
                  {tour.duration_days} días
                </TableCell>
                <TableCell className="font-medium text-[#3546A6]">
                  ${tour.price_usd?.toLocaleString()}
                </TableCell>
                <TableCell>
                  {tour.featured ? (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Destacado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                      Normal
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {new Date(tour.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/tours/${tour.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-[#3546A6]">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <NavLink href={`/admin/tours/${tour.id}/general`} className="inline-flex">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-500 hover:text-[#3546A6]"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </NavLink>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-500">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditTour(tour)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archivar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setDeletingTour(tour)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredTours.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                  {searchQuery || statusFilter !== 'all' || destinationFilter !== 'all'
                    ? 'No se encontraron tours con los filtros aplicados'
                    : 'No hay tours registrados. ¡Crea tu primer tour!'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Tours</p>
          <p className="text-3xl font-bold text-[#3546A6] mt-1">{tours.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Destacados</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{tours.filter(t => t.featured).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Destinos</p>
          <p className="text-3xl font-bold text-[#3546A6] mt-1">{destinations.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Precio Promedio</p>
          <p className="text-3xl font-bold text-[#3546A6] mt-1">
            ${Math.round(tours.reduce((acc, t) => acc + (t.price_usd || 0), 0) / tours.length || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTour} onOpenChange={() => setDeletingTour(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este tour?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El tour "{deletingTour?.title}" será eliminado permanentemente de la base de datos.
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
    </div>
  );
}
