'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Layout from '@/components/Layout';

// rutele publice care NU trebuie învelite cu Layout/ProtectedRoute
const PUBLIC_ROUTES = new Set<string>(['/signin', '/signup']);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // dacă suntem pe o rută publică, redăm direct conținutul (fără Layout)
  if (PUBLIC_ROUTES.has(pathname)) {
    return <>{children}</>;
  }

  // altfel, învelim cu Layout (care la tine include deja ProtectedRoute)
  return <Layout>{children}</Layout>;
}
