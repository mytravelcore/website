"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, Calendar, Mail, MessageSquare, Clock } from 'lucide-react';

export default function AppointmentConfirmationPage() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = 'https://mytravelcore.com/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-tc-purple-deep via-[#4a5bc2] to-tc-purple-light flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              ¡Cita Agendada con Éxito!
            </h1>
            <p className="text-white/90">
              Tu llamada ha sido programada correctamente
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Thank You Message */}
            <div className="text-center mb-8">
              <p className="text-tc-purple-deep/80 text-lg leading-relaxed">
                Gracias por confiar en <strong className="text-tc-purple-deep">TravelCore</strong>. 
                Nuestro equipo de especialistas está emocionado de ayudarte a planificar tu próxima aventura.
              </p>
            </div>

            {/* Reminder Cards */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-tc-lilac/20 rounded-xl border border-tc-purple-light/30">
                <div className="w-10 h-10 bg-tc-purple-deep rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-tc-purple-deep mb-1">Correo Electrónico</h3>
                  <p className="text-sm text-tc-purple-deep/70">
                    Recibirás un recordatorio por correo electrónico antes de tu llamada programada.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-700 mb-1">WhatsApp</h3>
                  <p className="text-sm text-green-600/80">
                    También recibirás un mensaje de WhatsApp como recordatorio adicional.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-tc-purple-light/20 my-6"></div>

            {/* Countdown Section */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-tc-purple-deep/60 mb-4">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Redirigiendo en...</span>
              </div>
              
              {/* Countdown Timer */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 - (276.46 * countdown) / 10}
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3546A6" />
                      <stop offset="100%" stopColor="#FFA03B" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Countdown Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-tc-purple-deep">{countdown}</span>
                </div>
              </div>

              <p className="text-sm text-tc-purple-deep/60">
                Serás redirigido a{' '}
                <a 
                  href="https://mytravelcore.com/" 
                  className="text-tc-purple-deep font-semibold hover:underline"
                >
                  mytravelcore.com
                </a>
              </p>

              {/* Skip Button */}
              <a
                href="https://mytravelcore.com/"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-tc-purple-deep text-white rounded-full font-semibold hover:bg-tc-purple-deep/90 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Ir ahora
              </a>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white/70 text-sm mt-6">
          ¿Tienes alguna pregunta? Contáctanos por WhatsApp
        </p>
      </div>
    </div>
  );
}
