"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from '@/supabase/client';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ContactFormData {
  full_name: string;
  email: string;
  phone?: string;
  trip_type: string;
  message: string;
}

const tripTypes = [
  { value: 'vacacional', label: 'Viaje Vacacional' },
  { value: 'corporativo', label: 'Viaje Corporativo' },
  { value: 'tours', label: 'Tours Grupales' },
  { value: 'luna_miel', label: 'Luna de Miel' },
  { value: 'aventura', label: 'Aventura' },
  { value: 'otro', label: 'Otro' },
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: submitError } = await supabase
        .from('contact_submissions')
        .insert([data]);

      if (submitError) throw submitError;

      setIsSuccess(true);
      reset();
    } catch (err) {
      setError('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-display text-2xl font-bold text-tc-purple-deep mb-2">
          ¡Mensaje enviado!
        </h3>
        <p className="text-tc-purple-deep/70 mb-6">
          Gracias por contactarnos. Te responderemos pronto.
        </p>
        <Button 
          onClick={() => setIsSuccess(false)}
          variant="outline"
          className="border-tc-purple-deep text-tc-purple-deep rounded-full"
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <Label htmlFor="full_name" className="text-tc-purple-deep">
          Nombre completo *
        </Label>
        <Input
          id="full_name"
          {...register('full_name', { required: 'El nombre es requerido' })}
          className="mt-1.5 border-tc-purple-light/30 focus:border-tc-purple-light focus:ring-tc-purple-light"
          placeholder="Tu nombre"
        />
        {errors.full_name && (
          <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-tc-purple-deep">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email', { 
            required: 'El email es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
          className="mt-1.5 border-tc-purple-light/30 focus:border-tc-purple-light focus:ring-tc-purple-light"
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone" className="text-tc-purple-deep">
          Teléfono (opcional)
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          className="mt-1.5 border-tc-purple-light/30 focus:border-tc-purple-light focus:ring-tc-purple-light"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      {/* Trip Type */}
      <div>
        <Label htmlFor="trip_type" className="text-tc-purple-deep">
          Tipo de viaje *
        </Label>
        <Select onValueChange={(value) => setValue('trip_type', value)}>
          <SelectTrigger className="mt-1.5 border-tc-purple-light/30 focus:ring-tc-purple-light">
            <SelectValue placeholder="Selecciona el tipo de viaje" />
          </SelectTrigger>
          <SelectContent>
            {tripTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="message" className="text-tc-purple-deep">
          Mensaje
        </Label>
        <Textarea
          id="message"
          {...register('message')}
          className="mt-1.5 border-tc-purple-light/30 focus:border-tc-purple-light focus:ring-tc-purple-light min-h-[120px]"
          placeholder="Cuéntanos sobre el viaje que tienes en mente..."
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full gradient-orange text-white border-0 rounded-full py-6 text-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar mensaje'
        )}
      </Button>
    </form>
  );
}
