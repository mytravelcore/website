"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterBar() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", { name, email });
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-tc-purple-deep/5 to-tc-lilac/10">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-tc-purple-deep/10">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-tc-purple-deep mb-2">
              Recibe ofertas exclusivas
            </h3>
            <p className="text-gray-600">
              Suscríbete a nuestro newsletter y obtén descuentos especiales
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
              <div className="flex-1">
                <Input 
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-gray-200 focus:border-tc-purple-deep text-gray-700 placeholder:text-gray-400 h-12"
                  required
                />
              </div>
              <div className="flex-1">
                <Input 
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-200 focus:border-tc-purple-deep text-gray-700 placeholder:text-gray-400 h-12"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="bg-tc-purple-deep hover:bg-tc-purple-deep/90 text-white rounded-full px-8 h-12 whitespace-nowrap font-semibold"
              >
                Suscribirse
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
