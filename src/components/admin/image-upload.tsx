"use client";

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateUrl = (url: string) => {
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

    return true;
  };

  const handleAddImage = () => {
    const trimmedUrl = imageUrl.trim();
    if (validateUrl(trimmedUrl)) {
      onImageUpload(trimmedUrl);
      setSuccessMessage('Imagen agregada exitosamente');
      setImageUrl('');
      // Clear success message after 2 seconds
      setTimeout(() => setSuccessMessage(null), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImage();
    }
  };

  return (
    <div className="w-full">
      <Label className="flex items-center gap-2 mb-2">
        <Link2 className="w-4 h-4" />
        {label}
      </Label>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder={placeholder}
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setError(null);
              setSuccessMessage(null);
            }}
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

        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
