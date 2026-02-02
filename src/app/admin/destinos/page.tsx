import { createClient } from "@/supabase/server";
import DestinosListPage from "./destinos-list-page";

export const metadata = {
  title: 'Admin - Destinos | TravelCore',
  description: 'Gestión de destinos.',
};

export default async function AdminDestinosPage() {
  const supabase = await createClient();
  
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .order('name');

  return <DestinosListPage initialDestinations={destinations || []} />;
}
