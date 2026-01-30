"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TourCard from '@/components/travelcore/tour-card';
import type { Tour, Destination } from '@/types/database';

interface ToursContentProps {
  tours: Tour[];
  destinations: Destination[];
  categories: string[];
  currentFilters: {
    destination?: string;
    category?: string;
    difficulty?: string;
  };
}

const difficulties = ['Fácil', 'Moderado', 'Intenso'];

export default function ToursContent({ 
  tours, 
  destinations, 
  categories,
  currentFilters 
}: ToursContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/tours?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/tours');
  };

  const hasActiveFilters = currentFilters.destination || currentFilters.category || currentFilters.difficulty;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white rounded-2xl border border-tc-purple-light/20 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold text-tc-purple-deep flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </h3>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-tc-orange hover:text-tc-orange/80"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Destination Filter */}
                <div>
                  <label className="block text-sm font-medium text-tc-purple-deep mb-2">
                    Destino
                  </label>
                  <Select
                    value={currentFilters.destination || "all"}
                    onValueChange={(value) => updateFilter('destination', value === 'all' ? null : value)}
                  >
                    <SelectTrigger className="w-full border-tc-purple-light/30 focus:ring-tc-purple-light">
                      <SelectValue placeholder="Todos los destinos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los destinos</SelectItem>
                      {destinations.map((dest) => (
                        <SelectItem key={dest.id} value={dest.id}>
                          {dest.name}, {dest.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-tc-purple-deep mb-2">
                    Categoría
                  </label>
                  <Select
                    value={currentFilters.category || "all"}
                    onValueChange={(value) => updateFilter('category', value === 'all' ? null : value)}
                  >
                    <SelectTrigger className="w-full border-tc-purple-light/30 focus:ring-tc-purple-light">
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-tc-purple-deep mb-2">
                    Dificultad
                  </label>
                  <Select
                    value={currentFilters.difficulty || "all"}
                    onValueChange={(value) => updateFilter('difficulty', value === 'all' ? null : value)}
                  >
                    <SelectTrigger className="w-full border-tc-purple-light/30 focus:ring-tc-purple-light">
                      <SelectValue placeholder="Todas las dificultades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las dificultades</SelectItem>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff} value={diff}>
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Tours Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentFilters.destination && (
                  <Badge 
                    variant="secondary" 
                    className="bg-tc-lilac/30 text-tc-purple-deep cursor-pointer hover:bg-tc-lilac/50"
                    onClick={() => updateFilter('destination', null)}
                  >
                    {destinations.find(d => d.id === currentFilters.destination)?.name}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {currentFilters.category && (
                  <Badge 
                    variant="secondary" 
                    className="bg-tc-lilac/30 text-tc-purple-deep cursor-pointer hover:bg-tc-lilac/50"
                    onClick={() => updateFilter('category', null)}
                  >
                    {currentFilters.category}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {currentFilters.difficulty && (
                  <Badge 
                    variant="secondary" 
                    className="bg-tc-lilac/30 text-tc-purple-deep cursor-pointer hover:bg-tc-lilac/50"
                    onClick={() => updateFilter('difficulty', null)}
                  >
                    {currentFilters.difficulty}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <p className="text-tc-purple-deep/60 mb-6">
              {tours.length} {tours.length === 1 ? 'tour encontrado' : 'tours encontrados'}
            </p>

            {/* Tours Grid */}
            {tours.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TourCard tour={tour} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-tc-purple-deep/60 text-lg mb-4">
                  No se encontraron tours con los filtros seleccionados.
                </p>
                <Button onClick={clearFilters} className="gradient-orange text-white rounded-full">
                  Ver todos los tours
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
