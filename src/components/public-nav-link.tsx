"use client";

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useCallback, useTransition } from 'react';

interface PublicNavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function PublicNavLink({ href, children, className, onClick }: PublicNavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Don't navigate if we're already on this path
    if (href === pathname) return;
    
    // Handle external links
    if (href.startsWith('http')) {
      window.open(href, '_blank');
      return;
    }
    
    onClick?.();
    
    startTransition(() => {
      router.push(href);
    });
  }, [href, pathname, router, onClick]);

  return (
    <a 
      href={href} 
      onClick={handleClick} 
      className={className}
      data-pending={isPending}
    >
      {children}
    </a>
  );
}
