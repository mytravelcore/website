"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUpload from '@/components/admin/image-upload';

/**
 * Demo component showing ImageUpload integration
 * This demonstrates how to use the ImageUpload component with GCS
 */
export default function ImageUploadDemo() {
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ type: string; url: string; timestamp: string }>
  >([]);

  // Demo tour ID (in real app, this comes from the tour being edited)
  const demoTourId = 'tour-demo-123';

  const handleHeroImageUpload = (result: { publicUrl: string; storagePath: string }) => {
    setUploadedImages((prev) => [
      ...prev,
      {
        type: 'hero',
        url: result.publicUrl,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  };

  const handleGalleryImageUpload = (result: { publicUrl: string; storagePath: string }) => {
    setUploadedImages((prev) => [
      ...prev,
      {
        type: 'gallery',
        url: result.publicUrl,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  };

  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">GCS Image Upload Demo</h1>
        <p className="text-gray-600">
          Upload images to Google Cloud Storage with real-time feedback
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Hero Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Image Upload</CardTitle>
            <CardDescription>Upload tour hero/banner image</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              entityType="tour"
              entityId={demoTourId}
              onImageUpload={handleHeroImageUpload}
              maxSize={15}
              label="Upload Hero Image"
            />
          </CardContent>
        </Card>

        {/* Gallery Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Gallery Image Upload</CardTitle>
            <CardDescription>Upload tour gallery images</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              entityType="tour"
              entityId={demoTourId}
              onImageUpload={handleGalleryImageUpload}
              maxSize={10}
              label="Upload Gallery Image"
            />
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Images List */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Images ({uploadedImages.length})</CardTitle>
            <CardDescription>All images stored in GCS with public URLs</CardDescription>
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
            ✅ <strong>Upload:</strong> Select image and upload via drag-drop or click
          </p>
          <p>
            ✅ <strong>Validate:</strong> File type and size checked on client & server
          </p>
          <p>
            ✅ <strong>Store:</strong> Image uploaded to Google Cloud Storage
          </p>
          <p>
            ✅ <strong>Public:</strong> File automatically made publicly accessible
          </p>
          <p>
            ✅ <strong>URL:</strong> Public HTTPS URL returned and ready to use
          </p>
          <p className="text-xs pt-2 border-t border-blue-200">
            Storage path: <code>/tour/{demoTourId}/[uuid].jpg</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
