"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  Compass, 
  Activity, 
  Info, 
  Gauge, 
  Settings, 
  Calendar,
  Users,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/admin/nav-link';

interface NavItem {
  label: string;
  icon: React.ElementType;
  id?: string;
  subItems?: { label: string; id: string }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { 
    label: 'Tours', 
    icon: Map,
    subItems: [
      { label: 'Todos los Tours', id: 'tours' },
      { label: 'Destinos', id: 'destinations' },
      { label: 'Actividades', id: 'activities' },
      { label: 'Info del Tour', id: 'tour-info' },
      { label: 'Nivel de Dificultad', id: 'difficulty' },
    ]
  },
  { label: 'Configuración', icon: Settings, id: 'settings' },
  { label: 'Reservas', icon: Calendar, id: 'bookings' },
  { label: 'Clientes', icon: Users, id: 'customers' },
];

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onBackToHome?: () => void;
}

export default function AdminSidebar({ activeSection, onSectionChange, onBackToHome }: AdminSidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Tours']);

  const handleLogout = async () => {
    // Clear the session cookie
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  return (
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
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                  {!isCollapsed && isExpanded && (
                    <ul className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">
                      {item.subItems?.map((subItem) => (
                        <li key={subItem.label}>
                          <button
                            onClick={() => onSectionChange(subItem.id)}
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
                  onClick={() => item.id && onSectionChange(item.id)}
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
        <div className="p-4 border-t border-slate-200 space-y-2">
          {onBackToHome && (
            <button 
              onClick={onBackToHome}
              className="block w-full text-left text-sm text-slate-500 hover:text-[#3546A6]"
            >
              ← Volver al inicio
            </button>
          )}
          <NavLink href="/portal" className="block text-sm text-slate-500 hover:text-[#3546A6]">
            ← Volver al portal
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors mt-4 border-t pt-4"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  );
}
