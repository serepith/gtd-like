// app/(authenticated)/dashboard/layout.tsx
import { UserProvider } from '../../../components/providers/user-data-provider';
import { ReactNode } from 'react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
      <div className="dashboard-layout">
        <main>{children}</main>
      </div>
  );
}