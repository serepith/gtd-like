'use client';

// components/ProtectedRoute.tsx
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { AuthContext } from "../providers/firebase-auth-provider";
import LoadingSpinner from "../providers/loading-spinner";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useSuspenseAuth } from '@/lib/query/hooks/use-auth';
import { getFirebaseAuth } from '@/lib/firebase/client/client-firebase';
import { useSuspenseQuery } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { DecodedIdToken } from 'firebase-admin/auth';


interface ProtectedRouteProps {
  children: React.ReactNode;
  user: DecodedIdToken;
  fallback?: React.ReactNode;
}

export default function DashboardShell({ 
  children, user
}: ProtectedRouteProps) {
  //const user = useAuthenticatedUser();
  console.log("user", user);
    //const [user, loading, error] = useAuthState(getFirebaseAuth());
    if (user) {
        return <div>
  
        {children}
  
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/tasks"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Tasks
          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                    <a
                      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                      href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        aria-hidden
                        src="/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                      />
                      Learn
                    </a>
                    <a
                      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                      href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        aria-hidden
                        src="/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                      />
                      Examples
                    </a>
                    <a
                      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                      href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                      />
                      Go to nextjs.org →
                    </a>
                  </footer>
  </div>;
    } else {
        return <div>login bro</div>;
    }


  // useEffect(() => {
  //   if (!user) {
  //     router.push('/login');
  //   }
  // }, [user, router]);

  // // Don't render children for unauthenticated users
  // if (!user) {
  //   return null;
  // }

  
  
  ;
}
