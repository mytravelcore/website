"use client";

import { useNavigation } from './navigation-provider';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  isActive?: boolean;
}

export function NavLink({ href, children, className, activeClassName, isActive }: NavLinkProps) {
  const { navigateTo, isNavigating } = useNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isNavigating) {
      navigateTo(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        className,
        isActive && activeClassName,
        isNavigating && "pointer-events-none opacity-70"
      )}
    >
      {children}
    </a>
  );
}
