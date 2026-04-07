"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import type { PostgrestError } from '@supabase/supabase-js';
import { 
  ArrowLeft, 
  Save, 
  Loader2,
  Eye,
  ChevronDown,
  LogOut,
  Settings,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { createClient } from '@/supabase/client';
import type { Tour } from '@/types/database';
import { NavLink } from '@/components/admin/nav-link';
import { useNavigation } from '@/components/admin/navigation-provider';

export default function TourEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const tourId = params.tourId as string;
  const { navigateTo, isNavigating } = useNavigation();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    async function loadTour() {
      const supabase = createClient();
      
      const { data: tourData, error } = await supabase
        .from('tours')
        .select(`*, destination:destinations(*)`)
        .eq('id', tourId)
        .single();

      if (error || !tourData) {
        setLoadError(error ?? null);
        setLoading(false);
        return;
      }

      setTour(tourData);
      setLoadError(null);
      setLoading(false);
    }

    loadTour();
  }, [tourId, router]);

  const handlePublish = async () => {
    if (!tour) return;
    
    setIsSaving(true);
    try {
      const supabase = createClient();
      const newStatus = tour.status === 'published' ? 'draft' : 'published';
      
      const { error } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', tour.id);

      if (error) throw error;
      
      setTour({ ...tour, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#3546A6]" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">No se pudo cargar el tour</h2>
          <p className="mt-2 text-sm text-slate-600">
            {loadError?.message ?? 'Vuelve a intentarlo o regresa a la lista de tours.'}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" onClick={() => router.push('/admin')}>Volver</Button>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:h-14 px-4 md:px-6 py-2 md:py-0 gap-2">
          {/* Left: back + title + badge */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <NavLink
              href="/admin"
              className="flex items-center gap-1.5 text-slate-600 hover:text-[#3546A6] text-sm font-medium transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver</span>
            </NavLink>
            <div className="h-5 w-px bg-slate-200 hidden md:block" />
            <h1 className="text-sm md:text-base font-semibold text-[#3546A6] truncate">
              {tour.title}
            </h1>
            <Badge
              variant={tour.status === 'published' ? 'default' : 'secondary'}
              className={cn(
                "shrink-0 py-0.5 text-xs",
                tour.status === 'published'
                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
              )}
            >
              {tour.status === 'published' ? 'Publicado' : 'Borrador'}
            </Badge>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/tours/${tour.slug}`} target="_blank">
                <Eye className="w-4 h-4 md:mr-1.5" />
                <span className="hidden md:inline">Vista previa</span>
              </Link>
            </Button>

            <Button
              onClick={handlePublish}
              disabled={isSaving}
              variant={tour.status === 'published' ? 'outline' : 'default'}
              size="sm"
              className={cn(
                tour.status !== 'published' && "bg-gradient-to-r from-[#FFA03B] to-[#FFD491] hover:opacity-90 text-white"
              )}
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : null}
              {tour.status === 'published' ? 'Despublicar' : 'Publicar'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#3546A6] to-[#9996DB] flex items-center justify-center text-white text-xs font-medium">
                    A
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Mi perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
