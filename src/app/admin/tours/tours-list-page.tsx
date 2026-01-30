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
  Archive,
  ArrowLeft,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  PanelLeftClose,
  PanelLeft
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
import { cn } from '@/lib/utils';

interface ToursListPageProps {
  initialTours: Tour[];
  destinations: Destination[];
}

export default function ToursListPage({ initialTours, destinations }: ToursListPageProps) {
  const router = useRouter();
  const { navigateTo, isNavigating } = useNavigation();
  const [tours, setTours] = useState(initialTours);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [deletingTour, setDeletingTour] = useState<Tour | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'featured' && tour.featured) ||
      (statusFilter === 'draft' && !tour.featured) ||
      (statusFilter === 'published' && tour.status === 'published');
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
      
      setTours(tours.filter(t => t.id !== deletingTour.id));
      setDeletingTour(null);
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Error al eliminar el tour');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateTour = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tours')
        .insert([{
          title: 'Nuevo Tour',
          slug: `nuevo-tour-${Date.now()}`,
          status: 'draft',
          featured: false,
          price_usd: 0,
          duration_days: 1,
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Navigate to the new tour editor
      navigateTo(`/admin/tours/${data.id}/general`);
    } catch (error) {
      console.error('Error creating tour:', error);
      alert('Error al crear el tour');
    }
  };

  const handleEditTour = (tourId: string) => {
    navigateTo(`/admin/tours/${tourId}/general`);
  };

  const handleToggleSelect = (tourId: string) => {
    setSelectedTours(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTours.length === filteredTours.length) {
      setSelectedTours([]);
    } else {
      setSelectedTours(filteredTours.map(t => t.id));
    }
  };

  const handleDuplicateTour = async (tour: Tour) => {
    try {
      const supabase = createClient();
      const { id, created_at, updated_at, destination, ...tourData } = tour;
      const { data, error } = await supabase
        .from('tours')
        .insert([{
          ...tourData,
          title: `${tour.title} (Copia)`,
          slug: `${tour.slug}-copy-${Date.now()}`,
          status: 'draft',
        }])
        .select(`*, destination:destinations(*)`)
        .single();

      if (error) throw error;
      
      setTours([data, ...tours]);
    } catch (error) {
      console.error('Error duplicating tour:', error);
      alert('Error al duplicar el tour');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          {!isCollapsed && (
            <NavLink 
              href="/admin"
              className="flex items-center gap-2 text-slate-600 hover:text-[#3546A6] text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Admin
            </NavLink>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-500 hover:text-[#3546A6]"
          >
            {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="flex-1 p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700">Gestión de Tours</h3>
              <p className="text-xs text-slate-500">
                Lista completa de todos los tours disponibles
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          {/* Left side - Title */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#3546A6]">Todos los Tours</h1>
              <p className="text-sm text-slate-500">{tours.length} tours en total</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3546A6] to-[#9996DB] flex items-center justify-center text-white text-sm font-medium">
                    A
                  </div>
                  <span className="text-sm font-medium text-slate-700">Admin</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Buscar tours..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="published">Publicados</SelectItem>
                      <SelectItem value="featured">Destacados</SelectItem>
                      <SelectItem value="draft">Borradores</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Destino" />
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

                {/* Add Tour Button */}
                <Button 
                  onClick={handleCreateTour}
                  className="bg-gradient-to-r from-[#FFA03B] to-[#FFD491] hover:opacity-90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Tour
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedTours.length === filteredTours.length && filteredTours.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTours.map((tour) => (
                  <TableRow 
                    key={tour.id} 
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleEditTour(tour.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedTours.includes(tour.id)}
                        onCheckedChange={() => handleToggleSelect(tour.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100">
                          {tour.hero_image_url ? (
                            <Image
                              src={tour.hero_image_url}
                              alt={tour.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-[#3546A6]/20 to-[#9996DB]/20" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 flex items-center gap-2">
                            {tour.title}
                            {tour.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          </p>
                          <p className="text-sm text-slate-500">/{tour.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600">
                        {tour.destination?.name || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-slate-800">
                        ${tour.price_usd?.toLocaleString() || '0'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600">
                        {tour.duration_days} {tour.duration_days === 1 ? 'día' : 'días'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={tour.status === 'published' ? 'default' : 'secondary'}
                        className={tour.status === 'published' 
                          ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                          : 'bg-slate-100 text-slate-600'
                        }
                      >
                        {tour.status === 'published' ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTour(tour.id)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/tours/${tour.slug}`} target="_blank">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver en sitio
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateTour(tour)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setDeletingTour(tour)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTours.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                      No se encontraron tours
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTour} onOpenChange={() => setDeletingTour(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tour?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el tour "{deletingTour?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTour}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
