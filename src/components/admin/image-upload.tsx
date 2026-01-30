"use client";

import { useState } from 'react';
import { Upload, X, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { uploadImageToGCS, type EntityType } from '@/lib/gcs-upload';

interface ImageUploadProps {
  entityType: EntityType;
  entityId: string;
  onImageUpload: (result: { publicUrl: string; storagePath: string }) => void;
  maxSize?: number; // in MB, default 10
  label?: string;
}

export default function ImageUpload({
  entityType,
  entityId,
  onImageUpload,
  maxSize = 10,
  label = 'Subir imagen',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    fileName: string;
  } | null>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`El archivo no puede exceder ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    setIsLoading(true);
    try {
      const result = await uploadImageToGCS({
        file,
        entityType,
        entityId,
      });

      setUploadedImage({
        url: result.publicUrl,
        fileName: file.name,
      });

      onImageUpload(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="w-full">
      <Label>{label}</Label>
      
      {!uploadedImage ? (
        <div
          className={`mt-2 border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging
              ? 'border-tc-orange bg-tc-orange/5'
              : 'border-tc-purple-light hover:border-tc-purple-main'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            {isLoading ? (
              <>
                <Loader2 className="w-8 h-8 text-tc-purple-main animate-spin mb-2" />
                <p className="text-sm text-gray-600">Subiendo imagen...</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-tc-purple-light mb-2" />
                <p className="text-sm font-medium text-gray-700 text-center">
                  Arrastra tu imagen aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Máximo {maxSize}MB • PNG, JPG, WebP, GIF
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id={`file-input-${entityType}-${entityId}`}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    document
                      .getElementById(`file-input-${entityType}-${entityId}`)
                      ?.click()
                  }
                  disabled={isLoading}
                >
                  Seleccionar archivo
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-2 border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900">
                  Imagen subida exitosamente
                </p>
                <p className="text-xs text-green-700 mt-1 break-all">
                  {uploadedImage.fileName}
                </p>
                <img
                  src={uploadedImage.url}
                  alt="Uploaded preview"
                  className="mt-2 max-w-xs h-32 object-cover rounded"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={() => {
                setUploadedImage(null);
                setError(null);
              }}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
