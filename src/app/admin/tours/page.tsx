import { redirect } from 'next/navigation';
import { createClient } from '@/supabase/server';
import ToursListPage from './tours-list-page';

export const metadata = {
  title: 'Todos los Tours | Admin - TravelCore',
  description: 'Gestión de tours.',
};

export default async function AdminToursPage() {
  const supabase = await createClient();

  // Fetch all tours with destinations
  const { data: tours } = await supabase
    .from('tours')
    .select(`
      *,
      destination:destinations(*)
    `)
    .order('created_at', { ascending: false });

  // Fetch all destinations for filters
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .order('name');

  return (
    <ToursListPage 
      initialTours={tours || []} 
      destinations={destinations || []}
    />
  );
}
