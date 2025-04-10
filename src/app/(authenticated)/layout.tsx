// app/(authenticated)/layout.tsx
'use client';

import DashboardShell from '@/components/auth/dashboard-shell';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}