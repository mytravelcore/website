import { useCallback, useState } from 'react';

interface UseImageUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

interface UseImageUploadReturn {
  isLoading: boolean;
  error: Error | null;
  uploadedUrl: string | null;
  setImageUrl: (url: string) => void;
  reset: () => void;
}

/**
 * Hook for managing image URL state
 * Handles loading states, errors, and success callbacks
 * 
 * @example
 * const { setImageUrl, isLoading, error, uploadedUrl } = useImageUpload({
 *   onSuccess: (url) => {
 *     console.log('Image URL set:', url);
 *   },
 * });
 */
export function useImageUpload({
  onSuccess,
  onError,
}: UseImageUploadOptions = {}): UseImageUploadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const setImageUrl = useCallback(
    (url: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Basic URL validation
        new URL(url);
        
        setUploadedUrl(url);
        onSuccess?.(url);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Invalid URL');
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setUploadedUrl(null);
  }, []);

  return {
    isLoading,
    error,
    uploadedUrl,
    setImageUrl,
    reset,
  };
}
