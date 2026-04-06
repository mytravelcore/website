import DashboardNavbar from "@/components/dashboard-navbar";
import { InfoIcon, UserCircle, Settings, Map, MessageSquare, BarChart3 } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch stats
  const { count: toursCount } = await supabase
    .from('tours')
    .select('*', { count: 'exact', head: true });

  const { count: destinationsCount } = await supabase
    .from('destinations')
    .select('*', { count: 'exact', head: true });

  const { count: contactsCount } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true });

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-tc-lilac/10 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-tc-purple-deep">Dashboard</h1>
              <p className="text-tc-purple-deep/60 mt-1">Bienvenido de vuelta, {user.email}</p>
            </div>
            <Link href="/admin">
              <Button className="gradient-orange text-white rounded-full">
                <Settings className="w-4 h-4 mr-2" />
                Administrar Tours
              </Button>
            </Link>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-tc-purple-light/20 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-tc-purple-deep/60">Tours Activos</p>
                  <p className="text-3xl font-bold text-tc-purple-deep">{toursCount || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-tc-purple-light/20 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-tc-purple-deep/60">Destinos</p>
                  <p className="text-3xl font-bold text-tc-purple-deep">{destinationsCount || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-tc-purple-light/20 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-tc-purple-deep/60">Mensajes</p>
                  <p className="text-3xl font-bold text-tc-purple-deep">{contactsCount || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <section className="bg-white rounded-xl p-6 border border-tc-purple-light/20 shadow-sm">
            <h2 className="font-display text-xl font-bold text-tc-purple-deep mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin" className="block">
                <div className="p-4 rounded-lg border border-tc-purple-light/20 hover:bg-tc-lilac/10 transition-colors">
                  <Settings className="w-8 h-8 text-tc-orange mb-2" />
                  <h3 className="font-semibold text-tc-purple-deep">Gestionar Tours</h3>
                  <p className="text-sm text-tc-purple-deep/60">Agregar, editar o eliminar tours</p>
                </div>
              </Link>
              <Link href="/tours" className="block">
                <div className="p-4 rounded-lg border border-tc-purple-light/20 hover:bg-tc-lilac/10 transition-colors">
                  <Map className="w-8 h-8 text-tc-orange mb-2" />
                  <h3 className="font-semibold text-tc-purple-deep">Ver Tours</h3>
                  <p className="text-sm text-tc-purple-deep/60">Vista pública de todos los tours</p>
                </div>
              </Link>
              <Link href="/destinos" className="block">
                <div className="p-4 rounded-lg border border-tc-purple-light/20 hover:bg-tc-lilac/10 transition-colors">
                  <BarChart3 className="w-8 h-8 text-tc-orange mb-2" />
                  <h3 className="font-semibold text-tc-purple-deep">Ver Destinos</h3>
                  <p className="text-sm text-tc-purple-deep/60">Explorar todos los destinos</p>
                </div>
              </Link>
            </div>
          </section>

          {/* User Profile Section */}
          <section className="bg-white rounded-xl p-6 border border-tc-purple-light/20 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <UserCircle size={48} className="text-tc-purple-deep" />
              <div>
                <h2 className="font-display font-semibold text-xl text-tc-purple-deep">Perfil de Usuario</h2>
                <p className="text-sm text-tc-purple-deep/60">{user.email}</p>
              </div>
            </div>
            <div className="bg-tc-lilac/10 rounded-lg p-4 overflow-hidden">
              <pre className="text-xs font-mono max-h-48 overflow-auto text-tc-purple-deep/70">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
