"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Copy, Check, Calendar, ClipboardList, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const tourName = searchParams.get('tour') || '';
  const roomType = searchParams.get('room') || '';
  const dateRange = searchParams.get('dates') || '';
  const returnSlug = searchParams.get('slug') || '';

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPulsing, setIsPulsing] = useState(true);

  // Load calendar script when on step 3
  useEffect(() => {
    if (currentStep === 3) {
      const script = document.createElement('script');
      script.src = 'https://link.bralto.io/js/form_embed.js';
      script.type = 'text/javascript';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        const existingScript = document.querySelector('script[src="https://link.bralto.io/js/form_embed.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [currentStep]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const formatAllText = () => {
    return `RESERVA\nTour: ${tourName}\nHabitación: ${roomType}\nFechas: ${dateRange}`;
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setIsPulsing(false);
      toast({
        title: "¡Copiado!",
        description: "Información copiada al portapapeles",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  const copyAll = () => {
    copyToClipboard(formatAllText(), "Todo");
    setTimeout(() => {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }, 5000);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoBackToTour = () => {
    if (returnSlug) {
      router.push(`/tours/${returnSlug}`);
    } else {
      router.back();
    }
  };

  const steps = [
    { number: 1, label: "Video tutorial" },
    { number: 2, label: "Copia tu información" },
    { number: 3, label: "Completa el formulario" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-tc-lilac/10">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-tc-purple-deep to-[#4a5bc2] shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handleGoBackToTour}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
                aria-label="Volver al tour"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-bold text-white truncate">Agendar tu Llamada</h1>
                  <p className="text-white/70 text-xs sm:text-sm hidden sm:block">
                    {steps[currentStep - 1]?.label}
                  </p>
                </div>
              </div>
            </div>

            {/* Step Progress */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                      step.number === currentStep
                        ? "bg-white text-tc-purple-deep"
                        : step.number < currentStep
                        ? "bg-white/80 text-tc-purple-deep"
                        : "bg-white/20 text-white/60"
                    }`}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  {step.number < 3 && (
                    <div
                      className={`w-5 sm:w-8 h-0.5 mx-0.5 sm:mx-1 ${
                        step.number < currentStep ? "bg-white/80" : "bg-white/20"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Step 1: Video Tutorial */}
        {currentStep === 1 && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl">
              {/* Video Container */}
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-6 sm:mb-8">
                <video
                  src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/697ba6b74d56831567b965ef.mp4"
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                />
              </div>

              {/* Brief Text */}
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-tc-purple-deep mb-3">
                  ¿Cómo funciona la reserva?
                </h2>
                <p className="text-tc-purple-deep/70 text-base sm:text-lg max-w-2xl mx-auto">
                  Mira este breve tutorial para entender los pasos simples que
                  necesitas seguir para agendar tu llamada con nuestro equipo
                </p>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleNext}
                  className="gradient-orange text-white border-0 rounded-full px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg"
                >
                  Continuar al Paso 1
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Copy Tour Info */}
        {currentStep === 2 && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              {/* Step Indicator */}
              <div className="inline-flex items-center gap-2 bg-tc-purple-deep text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  1
                </span>
                Paso 1: Copia tu información
              </div>

              {/* Instructions */}
              <div className="mb-6 text-center">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-tc-purple-deep mb-2">
                  Información del Tour
                </h3>
                <p className="text-tc-purple-deep/70 text-base">
                  Haz clic en el botón para copiar estos detalles
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-2xl border-2 border-tc-purple-light/30 shadow-lg overflow-hidden mb-6">
                {/* Tour */}
                <div className="p-4 border-b border-tc-purple-light/10 bg-gradient-to-r from-tc-lilac/10 to-transparent">
                  <span className="text-xs font-semibold text-tc-purple-deep/60 uppercase tracking-wide">
                    Tour
                  </span>
                  <p className="font-semibold text-tc-purple-deep mt-1">
                    {tourName}
                  </p>
                </div>

                {/* Room Type */}
                <div className="p-4 border-b border-tc-purple-light/10">
                  <span className="text-xs font-semibold text-tc-purple-deep/60 uppercase tracking-wide">
                    Habitación
                  </span>
                  <p className="font-semibold text-tc-purple-deep mt-1">
                    {roomType}
                  </p>
                </div>

                {/* Dates */}
                <div className="p-4 bg-gradient-to-r from-transparent to-tc-lilac/10">
                  <span className="text-xs font-semibold text-tc-purple-deep/60 uppercase tracking-wide">
                    Fechas
                  </span>
                  <p className="font-semibold text-tc-purple-deep mt-1">
                    {dateRange}
                  </p>
                </div>
              </div>

              {/* Copy Button */}
              <Button
                onClick={copyAll}
                className={`w-full rounded-xl py-6 text-lg font-bold transition-all shadow-lg ${
                  copiedField === "Todo"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : isPulsing
                    ? "gradient-orange text-white animate-pulse hover:animate-none hover:scale-[1.02]"
                    : "gradient-orange text-white hover:scale-[1.02]"
                }`}
              >
                {copiedField === "Todo" ? (
                  <>
                    <Check className="w-6 h-6 mr-2" />
                    ¡Información Copiada!
                  </>
                ) : (
                  <>
                    <Copy className="w-6 h-6 mr-2" />
                    Copiar toda la información
                  </>
                )}
              </Button>

              {/* Helper Text */}
              {copiedField === "Todo" && (
                <p className="text-center text-green-600 font-medium mt-4 animate-fade-in">
                  ✓ Avanzando al formulario en 5 segundos...
                </p>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  className="text-tc-purple-deep hover:bg-tc-purple-light/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atrás
                </Button>
                <Button
                  onClick={handleNext}
                  className="gradient-orange text-white border-0 rounded-full px-6 py-3 font-bold hover:scale-105 active:scale-95 transition-transform"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Calendar Form */}
        {currentStep === 3 && (
          <div className="flex flex-col">
            {/* Instructions Banner */}
            <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-tc-purple-deep text-base sm:text-lg mb-2 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-2 bg-tc-purple-deep text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">
                          2
                        </span>
                        Paso 2
                      </span>
                      Pega la información en el formulario
                    </h3>
                    <p className="text-tc-purple-deep/80 text-sm sm:text-base mb-3">
                      En el campo llamado{" "}
                      <strong className="text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                        &quot;Detalles de la reserva&quot;
                      </strong>
                      , pega la información que copiaste (Ctrl+V o Cmd+V)
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-tc-purple-deep/70">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Completa tus datos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Selecciona fecha y hora</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Confirma tu cita</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Form */}
            <div className="bg-white rounded-2xl border border-tc-purple-light/20 shadow-lg overflow-hidden">
              <div className="bg-tc-lilac/5 p-4 sm:p-6">
                <iframe
                  src="https://link.bralto.io/widget/booking/U2s8b4hu4zabQXWU2Jc6"
                  style={{
                    width: "100%",
                    border: "none",
                    overflow: "hidden",
                    minHeight: "700px",
                  }}
                  scrolling="no"
                  id="U2s8b4hu4zabQXWU2Jc6_booking_page"
                />
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6 sm:mt-8">
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-tc-purple-light text-tc-purple-deep hover:bg-tc-purple-light/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al paso anterior
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom safe area for mobile */}
      <div className="h-8 sm:h-12" />
    </div>
  );
}

export default function ReservarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-tc-lilac/10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-tc-purple-deep/30 border-t-tc-purple-deep rounded-full animate-spin mx-auto mb-4" />
            <p className="text-tc-purple-deep/70 font-medium">Cargando...</p>
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
