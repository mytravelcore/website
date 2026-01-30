"use client";

import { useState, useEffect } from 'react';
import { Copy, Check, X, Calendar, ClipboardList, Phone, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourName: string;
  roomType: string;
  dateRange: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  tourName,
  roomType,
  dateRange,
}: BookingModalProps) {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPulsing, setIsPulsing] = useState(true);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsPulsing(true);
    }
  }, [isOpen]);

  // Load calendar script when modal opens
  useEffect(() => {
    if (isOpen && currentStep === 3) {
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
  }, [isOpen, currentStep]);

  const formatAllText = () => {
    return `RESERVA
Tour: ${tourName}
Habitación: ${roomType}
Fechas: ${dateRange}`;
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
      // Do NOT reset copiedField - keep it green
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
    // Auto-advance after 5 seconds
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

  // Step 1: Video Tutorial
  const Step1 = () => (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-3xl">
        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
          <video 
             src="https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/697ba6b74d56831567b965ef.mp4"
             className="w-full h-full object-cover"
             controls
             autoPlay
           />
        </div>
        
        {/* Brief Text */}
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-tc-purple-deep mb-3">
            ¿Cómo funciona la reserva?
          </h2>
          <p className="text-tc-purple-deep/70 text-base max-w-2xl mx-auto">
            Mira este breve tutorial para entender los pasos simples que necesitas seguir para agendar tu llamada con nuestro equipo
          </p>
        </div>
        
        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleNext}
            className="gradient-orange text-white border-0 rounded-full px-10 py-6 text-lg font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg"
          >
            Continuar al Paso 1
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Step 2: Copy Tour Info Only
  const Step2 = () => (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
      <div className="w-full max-w-md">
        {/* Step Indicator */}
        <div className="inline-flex items-center gap-2 bg-tc-purple-deep text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">1</span>
          Paso 1: Copia tu información
        </div>
        
        {/* Instructions */}
        <div className="mb-6 text-center">
          <h3 className="font-display text-2xl font-bold text-tc-purple-deep mb-2">
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
            <span className="text-xs font-semibold text-tc-purple-deep/60 uppercase tracking-wide">Tour</span>
            <p className="font-semibold text-tc-purple-deep mt-1">{tourName}</p>
          </div>

          {/* Room Type */}
          <div className="p-4 border-b border-tc-purple-light/10">
            <span className="text-xs font-semibold text-tc-purple-deep/60 uppercase tracking-wide">Habitación</span>
            <p className="font-semibold text-tc-purple-deep mt-1">{roomType}</p>
          </div>

          {/* Dates */}
          <div className="p-4 bg-gradient-to-r from-transparent to-tc-lilac/10">
            <span className="text-xs font-semibold text-tc-purple-deep/60 uppercase tracking-wide">Fechas</span>
            <p className="font-semibold text-tc-purple-deep mt-1">{dateRange}</p>
          </div>
        </div>

        {/* Copy Button - Dynamic and Eye-catching */}
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
  );

  // Step 3: Calendar Form with Instructions at Top
  const Step3 = () => (
    <div className="flex flex-col min-h-[600px] overflow-hidden">
      {/* Top - Instructions Banner */}
      <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-b-2 border-orange-300 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-tc-purple-deep text-lg mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-2 bg-tc-purple-deep text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">2</span>
                  Paso 2
                </span>
                Pega la información en el formulario
              </h3>
              <p className="text-tc-purple-deep/80 text-base mb-3">
                En el campo llamado <strong className="text-orange-600 bg-orange-100 px-2 py-0.5 rounded">&quot;Detalles de la reserva&quot;</strong>, pega la información que copiaste (Ctrl+V o Cmd+V)
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

      {/* Bottom - Calendar Form */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-tc-lilac/5 rounded-xl p-4 border border-tc-purple-light/20">
            <iframe 
              src="https://link.bralto.io/widget/booking/U2s8b4hu4zabQXWU2Jc6" 
              style={{ 
                width: '100%', 
                border: 'none', 
                overflow: 'hidden', 
                minHeight: '600px' 
              }} 
              scrolling="no" 
              id="U2s8b4hu4zabQXWU2Jc6_1769648403367"
            />
          </div>

          {/* Back Button */}
          <div className="mt-6">
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
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-tc-purple-light/20 bg-gradient-to-r from-tc-purple-deep to-[#4a5bc2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Agendar tu Llamada</h2>
              <p className="text-white/70 text-sm">
                {currentStep === 1 && "Video tutorial"}
                {currentStep === 2 && "Copia tu información"}
                {currentStep === 3 && "Completa el formulario"}
              </p>
            </div>
          </div>
          
          {/* Step Progress */}
          <div className="hidden md:flex items-center gap-2 mr-10">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === currentStep 
                      ? "bg-white text-tc-purple-deep" 
                      : step < currentStep 
                      ? "bg-white/80 text-tc-purple-deep"
                      : "bg-white/20 text-white/60"
                  }`}
                >
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 mx-1 ${step < currentStep ? "bg-white/80" : "bg-white/20"}`} />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
