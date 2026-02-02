"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Route,
  MapPin,
  Activity,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Map,
  Star,
  ChevronDown,
  Bell,
  User,
  LogOut,
  Settings,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/supabase/client";
import type { Tour, Destination, Activity as ActivityType } from "@/types/database";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

// Navigation tabs
type NavTab = "panel" | "tours" | "actividades" | "destinos";

interface AdminDashboardProps {
  initialTours: Tour[];
  initialDestinations: Destination[];
  initialActivities: ActivityType[];
}

export default function AdminDashboard({ 
  initialTours, 
  initialDestinations, 
  initialActivities 
}: AdminDashboardProps) {
  const router = useRouter();
  const supabase = createClient();

  // State
  const [activeTab, setActiveTab] = useState<NavTab>("panel");
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [activities, setActivities] = useState<ActivityType[]>(initialActivities);
  
  // Search
  const [tourSearch, setTourSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  
  // Selection
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  // Modals
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; item: any } | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleteType, setBulkDeleteType] = useState<string>("");
  
  // Create modals
  const [createDestinationOpen, setCreateDestinationOpen] = useState(false);
  const [createActivityOpen, setCreateActivityOpen] = useState(false);
  const [editDestination, setEditDestination] = useState<Destination | null>(null);
  const [editActivity, setEditActivity] = useState<ActivityType | null>(null);
  
  // Form data
  const [destinationForm, setDestinationForm] = useState({
    name: "",
    slug: "",
    country: "",
    region: "",
    short_description: "",
    image_url: "",
  });
  const [activityForm, setActivityForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
  });
  
  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Real-time subscriptions for sync
  useEffect(() => {
    // Subscribe to tours changes
    const toursChannel = supabase
      .channel('admin-tours-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tours' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the complete tour with destination
            const { data: newTour } = await supabase
              .from('tours')
              .select(`*, destination:destinations(*)`)
              .eq('id', payload.new.id)
              .single();
            if (newTour) {
              setTours(prev => [newTour, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const { data: updatedTour } = await supabase
              .from('tours')
              .select(`*, destination:destinations(*)`)
              .eq('id', payload.new.id)
              .single();
            if (updatedTour) {
              setTours(prev => prev.map(t => t.id === updatedTour.id ? updatedTour : t));
            }
          } else if (payload.eventType === 'DELETE') {
            setTours(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to destinations changes
    const destinationsChannel = supabase
      .channel('admin-destinations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'destinations' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDestinations(prev => [...prev, payload.new as Destination].sort((a, b) => a.name.localeCompare(b.name)));
          } else if (payload.eventType === 'UPDATE') {
            setDestinations(prev => prev.map(d => d.id === payload.new.id ? payload.new as Destination : d));
          } else if (payload.eventType === 'DELETE') {
            setDestinations(prev => prev.filter(d => d.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to activities changes
    const activitiesChannel = supabase
      .channel('admin-activities-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setActivities(prev => [...prev, payload.new as ActivityType].sort((a, b) => a.name.localeCompare(b.name)));
          } else if (payload.eventType === 'UPDATE') {
            setActivities(prev => prev.map(a => a.id === payload.new.id ? payload.new as ActivityType : a));
          } else if (payload.eventType === 'DELETE') {
            setActivities(prev => prev.filter(a => a.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(toursChannel);
      supabase.removeChannel(destinationsChannel);
      supabase.removeChannel(activitiesChannel);
    };
  }, [supabase]);

  // Filtered data
  const filteredTours = tours.filter(
    (tour) =>
      tour.title?.toLowerCase().includes(tourSearch.toLowerCase()) ||
      tour.slug?.toLowerCase().includes(tourSearch.toLowerCase())
  );

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name?.toLowerCase().includes(destinationSearch.toLowerCase()) ||
      dest.country?.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  const filteredActivities = activities.filter(
    (act) =>
      act.name?.toLowerCase().includes(activitySearch.toLowerCase()) ||
      act.slug?.toLowerCase().includes(activitySearch.toLowerCase())
  );

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // CRUD Operations
  const handleDeleteTour = async (tourId: string) => {
    try {
      const { error } = await supabase.from("tours").delete().eq("id", tourId);
      if (error) throw error;
      setTours(tours.filter((t) => t.id !== tourId));
      setDeleteTarget(null);
      toast({ title: "Tour eliminado correctamente" });
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error al eliminar el tour", variant: "destructive" });
    }
  };

  const handleDeleteDestination = async (destId: string) => {
    try {
      const { error } = await supabase.from("destinations").delete().eq("id", destId);
      if (error) throw error;
      setDestinations(destinations.filter((d) => d.id !== destId));
      setDeleteTarget(null);
      toast({ title: "Destino eliminado correctamente" });
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error al eliminar el destino", variant: "destructive" });
    }
  };

  const handleDeleteActivity = async (actId: string) => {
    try {
      const { error } = await supabase.from("activities").delete().eq("id", actId);
      if (error) throw error;
      setActivities(activities.filter((a) => a.id !== actId));
      setDeleteTarget(null);
      toast({ title: "Actividad eliminada correctamente" });
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error al eliminar la actividad", variant: "destructive" });
    }
  };

  const handleBulkDelete = async () => {
    setIsLoading(true);
    try {
      if (bulkDeleteType === "tours") {
        const { error } = await supabase.from("tours").delete().in("id", selectedTours);
        if (error) throw error;
        setTours(tours.filter((t) => !selectedTours.includes(t.id)));
        setSelectedTours([]);
      } else if (bulkDeleteType === "destinos") {
        const { error } = await supabase.from("destinations").delete().in("id", selectedDestinations);
        if (error) throw error;
        setDestinations(destinations.filter((d) => !selectedDestinations.includes(d.id)));
        setSelectedDestinations([]);
      } else if (bulkDeleteType === "actividades") {
        const { error } = await supabase.from("activities").delete().in("id", selectedActivities);
        if (error) throw error;
        setActivities(activities.filter((a) => !selectedActivities.includes(a.id)));
        setSelectedActivities([]);
      }
      setBulkDeleteOpen(false);
      toast({ title: "Elementos eliminados correctamente" });
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error al eliminar elementos", variant: "destructive" });
    }
    setIsLoading(false);
  };

  // Create/Edit Destination
  const handleSaveDestination = async () => {
    setIsLoading(true);
    try {
      const data = {
        name: destinationForm.name,
        slug: destinationForm.slug || generateSlug(destinationForm.name),
        country: destinationForm.country,
        region: destinationForm.region || null,
        short_description: destinationForm.short_description || null,
        image_url: destinationForm.image_url || null,
      };

      if (editDestination) {
        const { error } = await supabase
          .from("destinations")
          .update(data)
          .eq("id", editDestination.id);
        if (error) throw error;
        setDestinations(destinations.map((d) => (d.id === editDestination.id ? { ...d, ...data } : d)));
        toast({ title: "Destino actualizado correctamente" });
      } else {
        const { data: newDest, error } = await supabase
          .from("destinations")
          .insert(data)
          .select()
          .single();
        if (error) throw error;
        setDestinations([...destinations, newDest]);
        toast({ title: "Destino creado correctamente" });
      }
      setCreateDestinationOpen(false);
      setEditDestination(null);
      setDestinationForm({ name: "", slug: "", country: "", region: "", short_description: "", image_url: "" });
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error al guardar el destino", variant: "destructive" });
    }
    setIsLoading(false);
  };

  // Create/Edit Activity
  const handleSaveActivity = async () => {
    setIsLoading(true);
    try {
      const data = {
        name: activityForm.name,
        slug: activityForm.slug || generateSlug(activityForm.name),
        description: activityForm.description || null,
        icon: activityForm.icon || null,
      };

      if (editActivity) {
        const { error } = await supabase
          .from("activities")
          .update(data)
          .eq("id", editActivity.id);
        if (error) throw error;
        setActivities(activities.map((a) => (a.id === editActivity.id ? { ...a, ...data } : a)));
        toast({ title: "Actividad actualizada correctamente" });
      } else {
        const { data: newAct, error } = await supabase
          .from("activities")
          .insert(data)
          .select()
          .single();
        if (error) throw error;
        setActivities([...activities, newAct]);
        toast({ title: "Actividad creada correctamente" });
      }
      setCreateActivityOpen(false);
      setEditActivity(null);
      setActivityForm({ name: "", slug: "", description: "", icon: "" });
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error al guardar la actividad", variant: "destructive" });
    }
    setIsLoading(false);
  };

  // Selection helpers
  const toggleSelectTour = (id: string) => {
    setSelectedTours((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAllTours = () => {
    if (selectedTours.length === filteredTours.length) {
      setSelectedTours([]);
    } else {
      setSelectedTours(filteredTours.map((t) => t.id));
    }
  };

  const toggleSelectDestination = (id: string) => {
    setSelectedDestinations((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAllDestinations = () => {
    if (selectedDestinations.length === filteredDestinations.length) {
      setSelectedDestinations([]);
    } else {
      setSelectedDestinations(filteredDestinations.map((d) => d.id));
    }
  };

  const toggleSelectActivity = (id: string) => {
    setSelectedActivities((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAllActivities = () => {
    if (selectedActivities.length === filteredActivities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(filteredActivities.map((a) => a.id));
    }
  };

  // Difficulty color helper
  const getDifficultyColor = (difficulty?: string | null) => {
    if (!difficulty) return "bg-gray-100 text-gray-700";
    const lower = difficulty.toLowerCase();
    if (lower.includes("fácil") || lower.includes("facil")) return "bg-green-100 text-green-700";
    if (lower.includes("moderado")) return "bg-yellow-100 text-yellow-700";
    if (lower.includes("difícil") || lower.includes("dificil")) return "bg-orange-100 text-orange-700";
    if (lower.includes("intenso")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  // Open edit modals
  const openEditDestination = (dest: Destination) => {
    setDestinationForm({
      name: dest.name,
      slug: dest.slug,
      country: dest.country,
      region: dest.region || "",
      short_description: dest.short_description || "",
      image_url: dest.image_url || "",
    });
    setEditDestination(dest);
    setCreateDestinationOpen(true);
  };

  const openEditActivity = (act: ActivityType) => {
    setActivityForm({
      name: act.name,
      slug: act.slug,
      description: act.description || "",
      icon: act.icon || "",
    });
    setEditActivity(act);
    setCreateActivityOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#3546A6] to-[#9996DB] flex items-center justify-center text-white font-bold text-lg">
                T
              </div>
              <span className="font-bold text-xl text-[#3546A6]">TravelCore</span>
              <Badge variant="secondary" className="ml-2">Admin</Badge>
            </div>

            {/* Tabs */}
            <nav className="flex items-center gap-1">
              <Button
                variant={activeTab === "panel" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("panel")}
                className={cn(activeTab === "panel" && "bg-[#3546A6]/10 text-[#3546A6]")}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Panel
              </Button>
              <Button
                variant={activeTab === "tours" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("tours")}
                className={cn(activeTab === "tours" && "bg-[#3546A6]/10 text-[#3546A6]")}
              >
                <Route className="w-4 h-4 mr-2" />
                Todos los tours
              </Button>
              <Button
                variant={activeTab === "actividades" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("actividades")}
                className={cn(activeTab === "actividades" && "bg-[#3546A6]/10 text-[#3546A6]")}
              >
                <Activity className="w-4 h-4 mr-2" />
                Actividades
              </Button>
              <Button
                variant={activeTab === "destinos" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("destinos")}
                className={cn(activeTab === "destinos" && "bg-[#3546A6]/10 text-[#3546A6]")}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Destinos
              </Button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-slate-500 hover:text-[#3546A6]">
                ← Volver al portal
              </Link>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* PANEL TAB */}
        {activeTab === "panel" && (
          <div className="space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-[#3546A6] to-[#9996DB] rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Panel de Administración!</h1>
              <p className="text-white/80 text-lg">
                Gestiona tours, destinos y actividades desde un solo lugar.
              </p>
            </div>

            {/* Stats */}
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
                </div>
                <p className="text-3xl font-bold text-[#3546A6]">
                  {tours.filter((t) => t.featured).length}
                </p>
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
                    <Activity className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-[#3546A6]">{activities.length}</p>
                <p className="text-slate-500">Actividades</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-[#3546A6] mb-4">Acciones rápidas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/admin/tours/create">
                  <Button className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-r from-[#FFA03B] to-[#FFD491] hover:opacity-90 text-white">
                    <Plus className="w-6 h-6" />
                    <span>Crear tour</span>
                  </Button>
                </Link>
                <Button
                  onClick={() => setActiveTab("tours")}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 border-[#3546A6] text-[#3546A6] hover:bg-[#3546A6]/5"
                >
                  <Route className="w-6 h-6" />
                  <span>Ver tours</span>
                </Button>
                <Button
                  onClick={() => {
                    setActiveTab("destinos");
                    setCreateDestinationOpen(true);
                  }}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                >
                  <MapPin className="w-6 h-6" />
                  <span>Agregar destino</span>
                </Button>
                <Button
                  onClick={() => {
                    setActiveTab("actividades");
                    setCreateActivityOpen(true);
                  }}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                >
                  <Activity className="w-6 h-6" />
                  <span>Agregar actividad</span>
                </Button>
              </div>
            </div>

            {/* Recent Tours */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#3546A6]">Tours recientes</h2>
                <Button variant="ghost" onClick={() => setActiveTab("tours")} className="text-[#3546A6]">
                  Ver todos →
                </Button>
              </div>
              <div className="space-y-3">
                {tours.slice(0, 5).map((tour) => (
                  <div
                    key={tour.id}
                    className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => router.push(`/admin/tours/${tour.id}/edit`)}
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
                      <p className="text-sm text-slate-500">
                        {tour.destination?.name || "Sin destino"} • {tour.duration_days || 0} días
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#3546A6]">
                        ${tour.base_price_usd?.toLocaleString() || 0}
                      </p>
                      <Badge className={tour.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}>
                        {tour.status === "published" ? "Publicado" : tour.status === "draft" ? "Borrador" : "Archivado"}
                      </Badge>
                    </div>
                  </div>
                ))}
                {tours.length === 0 && (
                  <p className="text-center text-slate-500 py-8">No hay tours registrados</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TOURS TAB */}
        {activeTab === "tours" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
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

            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Buscar tours por nombre o slug..."
                  value={tourSearch}
                  onChange={(e) => setTourSearch(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus:border-[#3546A6]"
                />
              </div>
              {selectedTours.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setBulkDeleteType("tours");
                    setBulkDeleteOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar ({selectedTours.length})
                </Button>
              )}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-4 text-left">
                        <Checkbox
                          checked={selectedTours.length === filteredTours.length && filteredTours.length > 0}
                          onCheckedChange={toggleSelectAllTours}
                        />
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Tour</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Dificultad</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Duración</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Precio</th>
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
                                  <img src={tour.hero_image_url} alt={tour.title} className="w-full h-full object-cover" />
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
                            {tour.difficulty ? (
                              <Badge className={getDifficultyColor(tour.difficulty)}>{tour.difficulty}</Badge>
                            ) : (
                              <span className="text-slate-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-600">
                              {tour.duration_days ? `${tour.duration_days} día(s)` : "-"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-medium text-slate-900">
                              {tour.base_price_usd ? `$${tour.base_price_usd.toLocaleString()}` : "-"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              className={
                                tour.status === "published"
                                  ? "bg-green-100 text-green-700"
                                  : tour.status === "draft"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-slate-100 text-slate-600"
                              }
                            >
                              {tour.status === "published" ? "Publicado" : tour.status === "draft" ? "Borrador" : "Archivado"}
                            </Badge>
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
                                onClick={() => setDeleteTarget({ type: "tour", item: tour })}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <p className="text-slate-500">No se encontraron tours</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVIDADES TAB */}
        {activeTab === "actividades" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Actividades</h1>
                <p className="text-slate-500 text-sm mt-1">{activities.length} actividades en total</p>
              </div>
              <Button
                onClick={() => {
                  setActivityForm({ name: "", slug: "", description: "", icon: "" });
                  setEditActivity(null);
                  setCreateActivityOpen(true);
                }}
                className="bg-gradient-to-r from-[#FFA03B] to-[#FFD491] hover:opacity-90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Actividad
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Buscar actividades..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus:border-[#3546A6]"
                />
              </div>
              {selectedActivities.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setBulkDeleteType("actividades");
                    setBulkDeleteOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar ({selectedActivities.length})
                </Button>
              )}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-4 text-left">
                        <Checkbox
                          checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0}
                          onCheckedChange={toggleSelectAllActivities}
                        />
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Nombre</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Slug</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Icono</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Descripción</th>
                      <th className="px-4 py-4 text-right text-sm font-semibold text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((act) => (
                        <tr key={act.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4">
                            <Checkbox
                              checked={selectedActivities.includes(act.id)}
                              onCheckedChange={() => toggleSelectActivity(act.id)}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-900">{act.name}</p>
                          </td>
                          <td className="px-4 py-4">
                            <code className="text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded">{act.slug}</code>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-600">{act.icon || "-"}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-600 line-clamp-1">{act.description || "-"}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => openEditActivity(act)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setDeleteTarget({ type: "activity", item: act })}
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
          </div>
        )}

        {/* DESTINOS TAB */}
        {activeTab === "destinos" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Destinos</h1>
                <p className="text-slate-500 text-sm mt-1">{destinations.length} destinos en total</p>
              </div>
              <Button
                onClick={() => {
                  setDestinationForm({ name: "", slug: "", country: "", region: "", short_description: "", image_url: "" });
                  setEditDestination(null);
                  setCreateDestinationOpen(true);
                }}
                className="bg-gradient-to-r from-[#FFA03B] to-[#FFD491] hover:opacity-90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Destino
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Buscar destinos..."
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus:border-[#3546A6]"
                />
              </div>
              {selectedDestinations.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setBulkDeleteType("destinos");
                    setBulkDeleteOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar ({selectedDestinations.length})
                </Button>
              )}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-4 text-left">
                        <Checkbox
                          checked={selectedDestinations.length === filteredDestinations.length && filteredDestinations.length > 0}
                          onCheckedChange={toggleSelectAllDestinations}
                        />
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Destino</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">País</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Región</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Descripción</th>
                      <th className="px-4 py-4 text-right text-sm font-semibold text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDestinations.length > 0 ? (
                      filteredDestinations.map((dest) => (
                        <tr key={dest.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4">
                            <Checkbox
                              checked={selectedDestinations.includes(dest.id)}
                              onCheckedChange={() => toggleSelectDestination(dest.id)}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                {dest.image_url ? (
                                  <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                    <MapPin className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{dest.name}</p>
                                <p className="text-xs text-slate-500">/{dest.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-600">{dest.country}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-600">{dest.region || "-"}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-slate-600 line-clamp-1">{dest.short_description || "-"}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => openEditDestination(dest)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setDeleteTarget({ type: "destination", item: dest })}
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
                          <p className="text-slate-500">No se encontraron destinos</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DELETE SINGLE ITEM DIALOG */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Eliminar {deleteTarget?.type === "tour" ? "tour" : deleteTarget?.type === "destination" ? "destino" : "actividad"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar &quot;{deleteTarget?.item?.title || deleteTarget?.item?.name}&quot;? Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget?.type === "tour") handleDeleteTour(deleteTarget.item.id);
                else if (deleteTarget?.type === "destination") handleDeleteDestination(deleteTarget.item.id);
                else if (deleteTarget?.type === "activity") handleDeleteActivity(deleteTarget.item.id);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* BULK DELETE DIALOG */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Eliminar{" "}
              {bulkDeleteType === "tours"
                ? selectedTours.length
                : bulkDeleteType === "destinos"
                ? selectedDestinations.length
                : selectedActivities.length}{" "}
              elementos
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar los elementos seleccionados? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* CREATE/EDIT DESTINATION DIALOG */}
      <Dialog open={createDestinationOpen} onOpenChange={setCreateDestinationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editDestination ? "Editar Destino" : "Nuevo Destino"}</DialogTitle>
            <DialogDescription>
              {editDestination ? "Modifica los datos del destino" : "Completa los datos para crear un nuevo destino"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dest-name">Nombre *</Label>
                <Input
                  id="dest-name"
                  value={destinationForm.name}
                  onChange={(e) => {
                    setDestinationForm({ ...destinationForm, name: e.target.value });
                    if (!editDestination) {
                      setDestinationForm((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  placeholder="Ej: Cusco"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dest-slug">Slug *</Label>
                <Input
                  id="dest-slug"
                  value={destinationForm.slug}
                  onChange={(e) => setDestinationForm({ ...destinationForm, slug: e.target.value })}
                  placeholder="Ej: cusco"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dest-country">País *</Label>
                <Input
                  id="dest-country"
                  value={destinationForm.country}
                  onChange={(e) => setDestinationForm({ ...destinationForm, country: e.target.value })}
                  placeholder="Ej: Perú"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dest-region">Región</Label>
                <Input
                  id="dest-region"
                  value={destinationForm.region}
                  onChange={(e) => setDestinationForm({ ...destinationForm, region: e.target.value })}
                  placeholder="Ej: Cusco"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dest-image">URL de Imagen</Label>
              <Input
                id="dest-image"
                value={destinationForm.image_url}
                onChange={(e) => setDestinationForm({ ...destinationForm, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dest-desc">Descripción corta</Label>
              <Textarea
                id="dest-desc"
                value={destinationForm.short_description}
                onChange={(e) => setDestinationForm({ ...destinationForm, short_description: e.target.value })}
                placeholder="Breve descripción del destino..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCreateDestinationOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveDestination}
              disabled={!destinationForm.name || !destinationForm.country || isLoading}
              className="bg-[#3546A6] hover:bg-[#3546A6]/90"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editDestination ? "Guardar cambios" : "Crear destino"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CREATE/EDIT ACTIVITY DIALOG */}
      <Dialog open={createActivityOpen} onOpenChange={setCreateActivityOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editActivity ? "Editar Actividad" : "Nueva Actividad"}</DialogTitle>
            <DialogDescription>
              {editActivity ? "Modifica los datos de la actividad" : "Completa los datos para crear una nueva actividad"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="act-name">Nombre *</Label>
                <Input
                  id="act-name"
                  value={activityForm.name}
                  onChange={(e) => {
                    setActivityForm({ ...activityForm, name: e.target.value });
                    if (!editActivity) {
                      setActivityForm((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  placeholder="Ej: Aventura"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="act-slug">Slug *</Label>
                <Input
                  id="act-slug"
                  value={activityForm.slug}
                  onChange={(e) => setActivityForm({ ...activityForm, slug: e.target.value })}
                  placeholder="Ej: aventura"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="act-icon">Icono (lucide-react)</Label>
              <Input
                id="act-icon"
                value={activityForm.icon}
                onChange={(e) => setActivityForm({ ...activityForm, icon: e.target.value })}
                placeholder="Ej: mountain, trees, camera"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="act-desc">Descripción</Label>
              <Textarea
                id="act-desc"
                value={activityForm.description}
                onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                placeholder="Descripción de la actividad..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCreateActivityOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveActivity}
              disabled={!activityForm.name || isLoading}
              className="bg-[#3546A6] hover:bg-[#3546A6]/90"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editActivity ? "Guardar cambios" : "Crear actividad"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
