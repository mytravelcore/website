import { createClient } from "@/supabase/server";
import AdminDashboard from "./components/admin-dashboard-new";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin | TravelCore',
  description: 'Panel de administración de TravelCore.',
};

export default async function AdminPage() {
  // Check authentication
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');

  if (!adminSession) {
    redirect('/admin/login');
  }

  const supabase = await createClient();
  
  // Fetch all data for dashboard
  const [toursResult, destinationsResult, activitiesResult] = await Promise.all([
    supabase
      .from('tours')
      .select(`*, destination:destinations(*)`)
      .order('created_at', { ascending: false }),
    supabase
      .from('destinations')
      .select('*')
      .order('name'),
    supabase
      .from('activities')
      .select('*')
      .order('name'),
  ]);

  return (
    <AdminDashboard 
      initialTours={toursResult.data || []} 
      initialDestinations={destinationsResult.data || []}
      initialActivities={activitiesResult.data || []}
    />
  );
}
