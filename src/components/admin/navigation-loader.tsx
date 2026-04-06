"use client";

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      setIsNavigating(false);
      setPrevPath(pathname);
    }
  }, [pathname, prevPath]);

  return (
    <>
      {/* Top progress bar */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3546A6] to-[#9996DB] z-[100] transition-transform duration-300",
          isNavigating ? "translate-x-0 animate-pulse" : "-translate-x-full"
        )}
      />
      
      {/* Full screen overlay loader */}
      {isNavigating && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[99] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white shadow-lg border border-slate-200">
            <Loader2 className="w-8 h-8 animate-spin text-[#3546A6]" />
            <span className="text-sm font-medium text-slate-600">Cargando...</span>
          </div>
        </div>
      )}
    </>
  );
}

// Hook to trigger navigation loading state
export function useNavigationLoading() {
  const [isPending, startTransition] = useTransition();
  return { isPending, startTransition };
}
