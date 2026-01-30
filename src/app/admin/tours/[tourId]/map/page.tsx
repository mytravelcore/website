"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/supabase/client';
import type { Tour } from '@/types/database';

export default function MapPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.tourId as string;
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      const { data: tourData, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', tourId)
        .single();

      if (error || !tourData) {
        router.push('/admin/tours');
        return;
      }

      setTour(tourData);
      setLoading(false);
    }

    loadData();
  }, [tourId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#3546A6]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#3546A6]">Mapa</h2>
        <p className="text-slate-500">Configura la ubicación y ruta del tour</p>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa del Tour</CardTitle>
          <CardDescription>Define los puntos de interés y la ruta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-slate-500">Esta sección está en desarrollo.</p>
            <p className="text-sm text-slate-400 mt-2">Próximamente podrás agregar mapas interactivos y puntos de interés.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
