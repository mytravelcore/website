import { redirect } from 'next/navigation';
import AdminLayout from "./components/admin-layout";
import { createClient } from "@/supabase/server";

export const metadata = {
  title: 'Admin | TravelCore',
  description: 'Panel de administración de tours.',
};

export default async function AdminPage() {
  const supabase = await createClient();
  
  // TEMPORARY: Authentication disabled for development
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) {
  //   redirect('/sign-in');
  // }

  // Fetch all tours with destinations
  const { data: tours } = await supabase
    .from('tours')
    .select(`
      *,
      destination:destinations(*)
    `)
    .order('created_at', { ascending: false });

  // Fetch all destinations for the form
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .order('name');

  return (
    <AdminLayout 
      initialTours={tours || []} 
      destinations={destinations || []}
    />
  );
}
