"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
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

  useEffect(() => {
    async function loadTour() {
      const supabase = createClient();
      
      const { data: tourData, error } = await supabase
        .from('tours')
        .select(`*, destination:destinations(*)`)
        .eq('id', tourId)
        .single();

      if (error || !tourData) {
        router.push('/admin/tours');
        return;
      }

      setTour(tourData);
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
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Sidebar - Simple navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Back to Tours */}
        <div className="p-4 border-b border-slate-200">
          <NavLink 
            href="/admin/tours"
            className="flex items-center gap-2 text-slate-600 hover:text-[#3546A6] text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Tours
          </NavLink>
        </div>

        {/* Tour Status Badge */}
        <div className="px-4 py-3 border-b border-slate-200">
          <Badge 
            variant={tour.status === 'published' ? 'default' : 'secondary'}
            className={cn(
              "w-full justify-center py-1.5",
              tour.status === 'published' 
                ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
            )}
          >
            {tour.status === 'published' ? 'Publicado' : 'Borrador'}
          </Badge>
        </div>

        {/* Info section */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-700">Editor Unificado</h3>
            <p className="text-xs text-slate-500">
              Toda la configuración del tour en una sola página con scroll.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          {/* Tour Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-[#3546A6]">
              {tour.title}
            </h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Preview Button */}
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link href={`/tours/${tour.slug}`} target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                Vista previa
              </Link>
            </Button>

            {/* Publish/Draft Toggle */}
            <Button
              onClick={handlePublish}
              disabled={isSaving}
              variant={tour.status === 'published' ? 'outline' : 'default'}
              size="sm"
              className={cn(
                tour.status !== 'published' && "bg-gradient-to-r from-[#FFA03B] to-[#FFD491] hover:opacity-90 text-white"
              )}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {tour.status === 'published' ? 'Despublicar' : 'Publicar'}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3546A6] to-[#9996DB] flex items-center justify-center text-white text-sm font-medium">
                    A
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
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
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
