"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUpload from '@/components/admin/image-upload';

/**
 * Demo component showing ImageUpload integration
 * This demonstrates how to use the ImageUpload component with URL-based images
 */
export default function ImageUploadDemo() {
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ type: string; url: string; timestamp: string }>
  >([]);

  const handleHeroImageUpload = (url: string) => {
    setUploadedImages((prev) => [
      ...prev,
      {
        type: 'hero',
        url: url,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  };

  const handleGalleryImageUpload = (url: string) => {
    setUploadedImages((prev) => [
      ...prev,
      {
        type: 'gallery',
        url: url,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  };

  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Image URL Manager Demo</h1>
        <p className="text-gray-600">
          Add images using URLs from Unsplash, your own server, or any public CDN
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Hero Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Image URL</CardTitle>
            <CardDescription>Add tour hero/banner image URL</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onImageUpload={handleHeroImageUpload}
              label="Hero Image URL"
              placeholder="https://images.unsplash.com/..."
            />
          </CardContent>
        </Card>

        {/* Gallery Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Gallery Image URL</CardTitle>
            <CardDescription>Add tour gallery image URL</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onImageUpload={handleGalleryImageUpload}
              label="Gallery Image URL"
              placeholder="https://images.unsplash.com/..."
            />
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Images List */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Added Images ({uploadedImages.length})</CardTitle>
            <CardDescription>All images referenced via public URLs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">
                        {image.type === 'hero' ? '🖼️ Hero Image' : '📸 Gallery Image'}
                      </p>
                      <p className="text-sm text-gray-500">{image.timestamp}</p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="mb-3 bg-gray-100 rounded h-32 flex items-center justify-center overflow-hidden">
                    <img
                      src={image.url}
                      alt={`${image.type} preview`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* URL (Copyable) */}
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs break-all">
                    {image.url}
                  </div>

                  {/* Copy Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(image.url);
                      alert('URL copied to clipboard!');
                    }}
                    className="mt-2"
                  >
                    Copy URL
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            ✅ <strong>URL Input:</strong> Enter image URL from any public source
          </p>
          <p>
            ✅ <strong>Validate:</strong> URL format and image extension checked
          </p>
          <p>
            ✅ <strong>Preview:</strong> Image preview displayed immediately
          </p>
          <p>
            ✅ <strong>Store:</strong> URL saved to database (no file storage needed)
          </p>
          <p>
            ✅ <strong>Recommended:</strong> Use Unsplash, ImgIX, or your own CDN
          </p>
          <p className="text-xs pt-2 border-t border-blue-200">
            Example: <code>https://images.unsplash.com/photo-123?w=800&q=80</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
