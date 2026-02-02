"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Route,
  MapPin,
  Activity,
  Info,
  Gauge,
  PackagePlus,
  Building,
  Settings,
  DollarSign,
  Coins,
  CreditCard,
  CalendarX,
  Layers,
  MoreHorizontal,
  Filter,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Users,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  PanelLeftClose,
  PanelLeft,
  Bell,
  User,
  LogOut,
  TrendingUp,
  Map,
  Star,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Tour, Destination } from '@/types/database';
import { NavLink } from '@/components/admin/nav-link';
import { useNavigation } from '@/components/admin/navigation-provider';

interface NavItem {
  label: string;
  icon: React.ElementType;
  id?: string;
  subItems?: { label: string; id: string }[];
}

const navItems: NavItem[] = [
  { label: 'Panel', icon: LayoutDashboard, id: 'dashboard' },
  { 
    label: 'Tours', 
    icon: Route,
    subItems: [
      { label: 'Todos los Tours', id: 'all-tours' },
      { label: 'Destinos', id: 'destinations' },
      { label: 'Actividades', id: 'activities' },
      { label: 'Info del Tour', id: 'tour-info' },
      { label: 'Nivel de Dificultad', id: 'difficulty' },
      { label: 'Servicios Adicionales', id: 'addons' },
      { label: 'Alojamiento', id: 'accommodation' },
    ]
  },
  { 
    label: 'Configuración de Tours', 
    icon: Settings,
    subItems: [
      { label: 'Categoría de Precios', id: 'price-category' },
      { label: 'Moneda', id: 'currency' },
      { label: 'Pago de Depósito', id: 'deposit' },
      { label: 'Bloquear Fechas', id: 'block-dates' },
      { label: 'Pestañas del Tour', id: 'tour-tabs' },
      { label: 'Varios', id: 'miscellaneous' },
      { label: 'Filtros Personalizados', id: 'custom-filters' },
    ]
  },
  { 
    label: 'Reservas', 
    icon: Calendar,
    subItems: [
      { label: 'Todas las Reservas', id: 'all-bookings' },
      { label: 'Reserva Personalizada', id: 'custom-booking' },
      { label: 'Tours Próximos', id: 'upcoming-tours' },
    ]
  },
  { label: 'Clientes', icon: Users, id: 'customers' },
];

interface AdminHomeProps {
  tours: Tour[];
  destinations: Destination[];
  onNavigateToTours: () => void;
}

export default function AdminHome({ tours, destinations, onNavigateToTours }: AdminHomeProps) {
  const router = useRouter();
  const { navigateTo, isNavigating } = useNavigation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Tour']);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleSectionChange = (section: string) => {
    if (section === 'all-tours') {
      // Navigate to the main admin dashboard
      navigateTo('/admin');
    } else {
      setActiveSection(section);
    }
  };

  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      'dashboard': 'Panel',
      'destinations': 'Destinos',
      'activities': 'Actividades',
      'tour-info': 'Info del Tour',
      'difficulty': 'Nivel de Dificultad',
      'addons': 'Servicios Adicionales',
      'accommodation': 'Alojamiento',
      'price-category': 'Categoría de Precios',
      'currency': 'Moneda',
      'deposit': 'Pago de Depósito',
      'block-dates': 'Bloquear Fechas',
      'tour-tabs': 'Pestañas del Tour',
      'miscellaneous': 'Varios',
      'custom-filters': 'Filtros Personalizados',
      'all-bookings': 'Todas las Reservas',
      'custom-booking': 'Reserva Personalizada',
      'upcoming-tours': 'Tours Próximos',
      'customers': 'Clientes',
    };
    return titles[activeSection] || 'Panel';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={cn(
        "h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          {!isCollapsed && (
            <Link href="/admin">
              <Image
                src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/68a3842c1004185996b7fbc7.png"
                alt="TravelCore"
                width={120}
                height={33}
                className="h-8 w-auto"
              />
            </Link>
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

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedItems.includes(item.label);
              const hasSubItems = item.subItems && item.subItems.length > 0;

              if (hasSubItems) {
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        "text-slate-600 hover:bg-[#3546A6]/5 hover:text-[#3546A6]"
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </button>
                    {!isCollapsed && isExpanded && (
                      <ul className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">
                        {item.subItems?.map((subItem) => (
                          <li key={subItem.label}>
                            <button
                              onClick={() => handleSectionChange(subItem.id)}
                              className={cn(
                                "w-full text-left block px-3 py-2 rounded-lg text-sm transition-colors",
                                activeSection === subItem.id 
                                  ? "bg-[#3546A6]/10 text-[#3546A6] font-medium"
                                  : "text-slate-500 hover:bg-slate-100 hover:text-[#3546A6]"
                              )}
                            >
                              {subItem.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <button
                    onClick={() => item.id && handleSectionChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activeSection === item.id
                        ? "bg-[#3546A6]/10 text-[#3546A6]"
                        : "text-slate-600 hover:bg-[#3546A6]/5 hover:text-[#3546A6]"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-200">
            <NavLink href="/portal" className="text-sm text-slate-500 hover:text-[#3546A6]">
              ← Volver al portal
            </NavLink>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => setActiveSection('dashboard')} className="text-slate-500 hover:text-[#3546A6]">
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

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === 'dashboard' ? (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-[#3546A6] to-[#9996DB] rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Panel de Administración!</h1>
                <p className="text-white/80 text-lg">Gestiona tours, reservas y clientes desde un solo lugar.</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#3546A6]/10 flex items-center justify-center">
                      <Map className="w-6 h-6 text-[#3546A6]" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-[#3546A6]">{tours.length}</p>
                  <p className="text-slate-500">Tours activos</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-500" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-[#3546A6]">{tours.filter(t => t.featured).length}</p>
                  <p className="text-slate-500">Tours destacados</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-emerald-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#3546A6]">{destinations.length}</p>
                  <p className="text-slate-500">Destinos</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#3546A6]">0</p>
                  <p className="text-slate-500">Clientes</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-[#3546A6] mb-4">Acciones rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={onNavigateToTours}
                    className="h-auto py-4 flex flex-col items-center gap-2 bg-[#3546A6] hover:bg-[#3546A6]/90"
                  >
                    <Map className="w-6 h-6" />
                    <span>Ver tours</span>
                  </Button>
                  <Button 
                    onClick={onNavigateToTours}
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center gap-2 border-[#3546A6] text-[#3546A6] hover:bg-[#3546A6]/5"
                  >
                    <PackagePlus className="w-6 h-6" />
                    <span>Crear tour</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('destinations')}
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center gap-2"
                  >
                    <MapPin className="w-6 h-6" />
                    <span>Destinos</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('all-bookings')}
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center gap-2"
                  >
                    <Calendar className="w-6 h-6" />
                    <span>Reservas</span>
                  </Button>
                </div>
              </div>

              {/* Recent Tours */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#3546A6]">Tours recientes</h2>
                  <Button variant="ghost" onClick={onNavigateToTours} className="text-[#3546A6]">
                    Ver todos →
                  </Button>
                </div>
                <div className="space-y-3">
                  {tours.slice(0, 5).map((tour) => (
                    <div 
                      key={tour.id} 
                      className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => router.push(`/admin/tours/${tour.id}/general`)}
                    >
                      {tour.hero_image_url ? (
                        <img 
                          src={tour.hero_image_url} 
                          alt={tour.title}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
                          <Eye className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-[#3546A6]">{tour.title}</p>
                        <p className="text-sm text-slate-500">{tour.destination?.name || 'Sin destino'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#3546A6]">${tour.price_usd?.toLocaleString()}</p>
                        <p className="text-sm text-slate-500">{tour.duration_days} días</p>
                      </div>
                    </div>
                  ))}
                  {tours.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No hay tours registrados</p>
                  )}
                </div>
              </div>
            </div>
          ) : activeSection === 'destinations' ? (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-semibold text-[#3546A6] mb-6">Gestión de destinos</h1>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex justify-end mb-4">
                  <Button className="bg-[#3546A6]">
                    <MapPin className="w-4 h-4 mr-2" />
                    Agregar destino
                  </Button>
                </div>
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
                  {destinations.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No hay destinos registrados</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-semibold text-[#3546A6] mb-2">{getSectionTitle()}</h1>
              <p className="text-slate-500 mb-6">Esta sección está en desarrollo.</p>
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-400">Próximamente disponible</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
