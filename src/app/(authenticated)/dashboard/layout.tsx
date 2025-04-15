// app/(authenticated)/dashboard/layout.tsx
import { validateSessionCookie } from '@/lib/firebase/server/server-auth';
import { fetchUserProfile } from '@/lib/firebase/server/server-fetch';
import { UserProvider } from '../../../components/providers/user-data-provider';
import { ReactNode } from 'react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // This will redirect if authentication fails
  const claims = await validateSessionCookie();
  
  return (
      <div className="dashboard-layout">
        <main>{children}</main>
      </div>
  );
}