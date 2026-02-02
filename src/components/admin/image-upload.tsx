"use client";

import { useState } from 'react';
import { Link2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({
  onImageUpload,
  label = 'URL de imagen',
  placeholder = 'https://example.com/image.jpg',
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateAndPreviewUrl = (url: string) => {
    setError(null);
    
    if (!url.trim()) {
      setError('Por favor ingresa una URL');
      return false;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('URL inválida');
      return false;
    }

    // Check if it looks like an image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    if (!hasImageExtension && !url.includes('unsplash.com') && !url.includes('images')) {
      setError('La URL no parece ser una imagen válida');
      return false;
    }

    return true;
  };

  const handleAddImage = () => {
    if (validateAndPreviewUrl(imageUrl)) {
      setPreviewUrl(imageUrl);
      onImageUpload(imageUrl);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImage();
    }
  };

  const handleClear = () => {
    setImageUrl('');
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <Label className="flex items-center gap-2 mb-2">
        <Link2 className="w-4 h-4" />
        {label}
      </Label>
      
      {!previewUrl ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder={placeholder}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddImage}
              disabled={!imageUrl.trim()}
            >
              Agregar
            </Button>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900">
                  Imagen agregada exitosamente
                </p>
                <p className="text-xs text-green-700 mt-1 break-all">
                  {previewUrl}
                </p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 max-w-xs h-32 object-cover rounded"
                  onError={() => setError('Error al cargar la imagen')}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={handleClear}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
