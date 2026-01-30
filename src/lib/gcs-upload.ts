import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export type EntityType = 'tour' | 'activity' | 'destination';

export interface UploadImageParams {
  file: File;
  entityType: EntityType;
  entityId: string;
}

export interface UploadImageResult {
  publicUrl: string;
  storagePath: string;
  fileName: string;
}

export async function uploadImageToGCS(params: UploadImageParams): Promise<UploadImageResult> {
  try {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('entityType', params.entityType);
    formData.append('entityId', params.entityId);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export function generateStoragePath(
  entityType: EntityType,
  entityId: string,
  originalFileName: string
): string {
  const extension = path.extname(originalFileName).toLowerCase();
  const fileName = `${uuidv4()}${extension}`;
  return `/${entityType}/${entityId}/${fileName}`;
}

export function extractFileExtension(fileName: string): string {
  return path.extname(fileName).toLowerCase();
}

export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[extension] || 'application/octet-stream';
}
