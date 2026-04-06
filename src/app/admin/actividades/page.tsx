import { createClient } from "@/supabase/server";
import ActividadesListPage from "./actividades-list-page";

export const metadata = {
  title: 'Admin - Actividades | TravelCore',
  description: 'Gestión de actividades.',
};

export default async function AdminActividadesPage() {
  const supabase = await createClient();
  
  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .order('name');

  return <ActividadesListPage initialActivities={activities || []} />;
}
