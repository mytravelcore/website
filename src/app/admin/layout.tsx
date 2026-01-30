"use client";

import { NavigationProvider } from '@/components/admin/navigation-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      {children}
    </NavigationProvider>
  );
}
