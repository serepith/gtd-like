// ClientFallback.tsx (Client Component)
'use client';

import { useContext } from 'react';
import { AuthContext } from '@/components/providers/firebase-auth-provider';
import LoadingSpinner from '../providers/loading-spinner';
import DashboardShell from './dashboard-shell';

import { ReactNode } from 'react';
import TaskInput from '../ui/task-input';
import Link from 'next/link';
import Image from 'next/image';

export default function ClientFallback() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
            {user ? (
        // Logged-in view
        <div>
          <p>Welcome back, idiot, server auth isn't working {user.displayName || 'User'}!</p>
          <TaskInput />
        </div>
      ) : (
        // Guest view
        <div>
          <p>Sign in to manage your tasks</p>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href="/login"
           >
            <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Login
              </Link>
        </div>
      )}
    </div>
  );
}