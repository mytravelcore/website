"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './admin-sidebar';
import ToursList from './tours-list';
import TourBuilder from './tour-builder';
import AdminHome from './admin-home';
import { createClient } from '@/supabase/client';
import type { Tour, Destination } from '@/types/database';
import { Bell, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import Image from 'next/image';

interface AdminLayoutProps {
  initialTours: Tour[];
  destinations: Destination[];
}

export default function AdminLayout({ initialTours, destinations }: AdminLayoutProps) {
  const router = useRouter();
  const [tours, setTours] = useState(initialTours);
  const [mainView, setMainView] = useState<'home' | 'tours'>('home');
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [activeSection, setActiveSection] = useState('tours');

  const handleAddTour = () => {
    setEditingTour(null);
    setView('builder');
  };

  const handleEditTour = (tour: Tour) => {
    setEditingTour(tour);
    setView('builder');
  };

  const handleCloseBuilder = () => {
    setEditingTour(null);
    setView('list');
  };

  const handleRefresh = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('tours')
      .select(`
        *,
        destination:destinations(*)
      `)
      .order('created_at', { ascending: false });
    
    if (data) {
      setTours(data);
    }
    router.refresh();
  };

  const handleSuccess = () => {
    handleRefresh();
    handleCloseBuilder();
  };

  const getSectionTitle = () => {
    if (view === 'builder') return editingTour ? 'Editar Tour' : 'Nuevo Tour';
    const titles: Record<string, string> = {
      'dashboard': 'Dashboard',
      'tours': 'Todos los Tours',
      'destinations': 'Destinos',
      'activities': 'Actividades',
      'tour-info': 'Info del Tour',
      'difficulty': 'Nivel de Dificultad',
      'settings': 'Configuración',
      'bookings': 'Reservas',
      'customers': 'Clientes',
    };
    return titles[activeSection] || 'Tours';
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setView('list');
  };

  const handleNavigateToTours = () => {
    setMainView('tours');
    setView('list');
  };

  const handleBackToHome = () => {
    setMainView('home');
  };

  // Show Admin Home view
  if (mainView === 'home') {
    return (
      <AdminHome 
        tours={tours}
        destinations={destinations}
        onNavigateToTours={handleNavigateToTours}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} onBackToHome={handleBackToHome} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => handleSectionChange('dashboard')} className="text-slate-500 hover:text-[#3546A6]">
              Admin
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-[#3546A6] font-medium">
              {getSectionTitle()}
            </span>
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
        <main className="flex-1 overflow-hidden">
          {view === 'builder' ? (
            <TourBuilder 
              tour={editingTour}
              destinations={destinations}
              onClose={handleCloseBuilder}
              onSuccess={handleSuccess}
            />
          ) : activeSection === 'tours' || activeSection === 'dashboard' ? (
            <div className="h-full overflow-y-auto p-6">
              <ToursList 
                tours={tours}
                destinations={destinations}
                onEditTour={handleEditTour}
                onAddTour={handleAddTour}
                onRefresh={handleRefresh}
              />
            </div>
          ) : activeSection === 'destinations' ? (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl">
                <h1 className="text-2xl font-semibold text-[#3546A6] mb-6">Gestión de Destinos</h1>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="space-y-4">
                    {destinations.map((dest) => (
                      <div key={dest.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-[#3546A6]">{dest.name}</p>
                          <p className="text-sm text-slate-500">{dest.country} {dest.region && `• ${dest.region}`}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="outline" size="sm" className="text-red-500">Eliminar</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl">
                <h1 className="text-2xl font-semibold text-[#3546A6] mb-2">{getSectionTitle()}</h1>
                <p className="text-slate-500 mb-6">Esta sección está en desarrollo.</p>
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <p className="text-slate-400">Próximamente disponible</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
