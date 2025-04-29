// ClientFallback.tsx (Client Component)
'use client';

import LoadingSpinner from '../ui/loading-spinner';
import TaskInput from '../ui/task-input';
import { useAuth } from '@/lib/hooks/use-auth';
import LoginForm from './login-form';
import { Router } from 'express';
import { useRouter } from 'next/navigation';

export default function ClientFallback() {
  //const { data : user, isLoading } = useAuth();
  const user = useAuth();
  const router = useRouter();

  // try {
  //   if(isLoading) {
  //     return (
  //       <div className="flex items-center justify-center h-screen">
  //         <LoadingSpinner />
  //       </div>
  //     );
  //   }

  //   if(!user) {
  //     router.push('/login');
  //   }

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
            <LoginForm />
          </div>
        )}
      </div>
    );
  // } catch (error) {
  //   console.error('Render error:', error);
  //   return <div>Component failed to render</div>;
  // }
}