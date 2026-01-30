import { useCallback, useState } from 'react';
import { uploadImageToGCS, type EntityType, type UploadImageResult } from '@/lib/gcs-upload';

interface UseImageUploadOptions {
  entityType: EntityType;
  entityId: string;
  onSuccess?: (result: UploadImageResult) => void;
  onError?: (error: Error) => void;
}

interface UseImageUploadReturn {
  isLoading: boolean;
  error: Error | null;
  uploadedUrl: string | null;
  uploadedPath: string | null;
  upload: (file: File) => Promise<UploadImageResult | null>;
  reset: () => void;
}

/**
 * Hook for uploading images to GCS
 * Handles loading states, errors, and success callbacks
 * 
 * @example
 * const { upload, isLoading, error, uploadedUrl } = useImageUpload({
 *   entityType: 'tour',
 *   entityId: tourId,
 *   onSuccess: (result) => {
 *     console.log('Uploaded to:', result.publicUrl);
 *   },
 * });
 */
export function useImageUpload({
  entityType,
  entityId,
  onSuccess,
  onError,
}: UseImageUploadOptions): UseImageUploadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadImageResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await uploadImageToGCS({
          file,
          entityType,
          entityId,
        });

        setUploadedUrl(result.publicUrl);
        setUploadedPath(result.storagePath);

        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed');
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [entityType, entityId, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setUploadedUrl(null);
    setUploadedPath(null);
  }, []);

  return {
    isLoading,
    error,
    uploadedUrl,
    uploadedPath,
    upload,
    reset,
  };
}
