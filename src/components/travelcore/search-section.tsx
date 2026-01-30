"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tours?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative -mt-16 z-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
          {/* Section Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-tc-purple-deep mb-2">
              ¿A dónde quieres viajar?
            </h2>
            <p className="text-gray-500">
              Encuentra tu próxima aventura entre más de 50 destinos
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              {/* Destination Input */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tc-purple-light" />
                <Input
                  type="text"
                  placeholder="Destino, país o tipo de tour..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 border-gray-200 focus:border-tc-purple-deep text-gray-700 placeholder:text-gray-400 rounded-xl text-base"
                />
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                className="h-14 px-8 bg-tc-purple-deep hover:bg-tc-purple-deep/90 text-white rounded-xl font-semibold text-base flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Buscar Tours
              </Button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Populares:</span>
            {["Europa", "Caribe", "Asia", "Sudamérica", "Aventura"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  router.push(`/tours?search=${encodeURIComponent(tag)}`);
                }}
                className="px-4 py-1.5 bg-tc-purple-deep/5 hover:bg-tc-purple-deep/10 text-tc-purple-deep text-sm rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
