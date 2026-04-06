"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Plane, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GlobalNavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    // When the path changes, mark loading as complete
    if (pathname !== previousPath) {
      setPreviousPath(pathname);
      setIsLoading(false);
    }
  }, [pathname, previousPath]);

  // Listen for click events on links to trigger loading
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href) return;
      
      // Skip external links
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      
      // Skip hash links
      if (href.startsWith('#')) return;
      
      // Skip if already on this page
      if (href === pathname) return;
      
      // Skip admin routes (they have their own loader)
      if (href.startsWith('/admin') || pathname.startsWith('/admin')) return;
      
      // Skip if the link has data-no-loading
      if (anchor.hasAttribute('data-no-loading')) return;
      
      // Skip if it's a file download
      if (anchor.hasAttribute('download')) return;
      
      // Skip if target is _blank
      if (anchor.getAttribute('target') === '_blank') return;
      
      // Show loading for internal navigation
      setIsLoading(true);
    };

    document.addEventListener('click', handleLinkClick, true);
    
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [pathname]);

  // Safety timeout
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 8000);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100]">
        <div className="h-full bg-gradient-to-r from-tc-orange via-tc-purple-deep to-tc-orange animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
      </div>
      
      {/* Full screen overlay loader */}
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[99] flex items-center justify-center pointer-events-auto">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/95 shadow-xl border border-tc-purple-light/20 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-tc-purple-deep to-tc-orange animate-spin-slow flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Plane className="w-5 h-5 text-tc-purple-deep" />
              </div>
            </div>
          </div>
          <span className="text-sm font-semibold text-tc-purple-deep">Cargando...</span>
        </div>
      </div>
    </>
  );
}
