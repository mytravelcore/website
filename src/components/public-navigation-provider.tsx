"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationContextType {
  isNavigating: boolean;
  navigateTo: (href: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  navigateTo: () => {},
});

export function usePublicNavigation() {
  return useContext(NavigationContext);
}

interface PublicNavigationProviderProps {
  children: ReactNode;
}

export function PublicNavigationProvider({ children }: PublicNavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const navigateTo = useCallback((href: string) => {
    // Don't navigate if we're already on this path
    if (href === pathname) return;
    
    // Handle external links
    if (href.startsWith('http')) {
      window.open(href, '_blank');
      return;
    }
    
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

  // Safety timeout to reset navigation state if it takes too long
  useEffect(() => {
    if (isNavigating) {
      const timeout = setTimeout(() => {
        setIsNavigating(false);
        setTargetPath(null);
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timeout);
    }
  }, [isNavigating]);

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
        <div className="h-full bg-gradient-to-r from-tc-orange via-tc-purple-deep to-tc-orange animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
      </div>
      
      {/* Full screen overlay loader */}
      {isNavigating && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[99] flex items-center justify-center pointer-events-auto">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/90 shadow-xl border border-tc-purple-light/20 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-tc-purple-deep to-tc-orange animate-spin-slow flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Plane className="w-6 h-6 text-tc-purple-deep animate-pulse" />
                </div>
              </div>
            </div>
            <span className="text-base font-semibold text-tc-purple-deep">Cargando...</span>
          </div>
        </div>
      )}
    </NavigationContext.Provider>
  );
}
