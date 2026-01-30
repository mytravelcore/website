"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationContextType {
  isNavigating: boolean;
  navigateTo: (href: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  navigateTo: () => {},
});

export function useNavigation() {
  return useContext(NavigationContext);
}

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const navigateTo = useCallback((href: string) => {
    // Don't navigate if we're already on this path
    if (href === pathname) return;
    
    setIsNavigating(true);
    setTargetPath(href);
    
    // Use setTimeout to ensure the loading state is visible before navigation starts
    setTimeout(() => {
      router.push(href);
    }, 50);
  }, [pathname, router]);

  // Reset navigation state when pathname changes
  useEffect(() => {
    if (targetPath && pathname.startsWith(targetPath.split('?')[0])) {
      setIsNavigating(false);
      setTargetPath(null);
    }
  }, [pathname, targetPath]);

  return (
    <NavigationContext.Provider value={{ isNavigating, navigateTo }}>
      {children}
      
      {/* Top progress bar */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 h-1 z-[100] transition-all duration-300",
          isNavigating 
            ? "opacity-100" 
            : "opacity-0"
        )}
      >
        <div className="h-full bg-gradient-to-r from-[#3546A6] via-[#9996DB] to-[#3546A6] animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
      </div>
      
      {/* Full screen overlay loader */}
      {isNavigating && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[99] flex items-center justify-center pointer-events-auto">
          <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white shadow-lg border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <Loader2 className="w-8 h-8 animate-spin text-[#3546A6]" />
            <span className="text-sm font-medium text-slate-600">Cargando...</span>
          </div>
        </div>
      )}
    </NavigationContext.Provider>
  );
}
