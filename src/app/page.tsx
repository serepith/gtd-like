import Image from "next/image";
import * as React from "react";
import TaskInput from "../components/ui/task-input";
import Link from 'next/link';
import { Suspense, useContext } from "react";
import LoadingSpinner from "../components/providers/loading-spinner";
import { AuthContext } from "@/components/providers/firebase-auth-provider";
import { cookies } from "next/headers";
import ClientFallback from "@/components/auth/client-fallback";
import { getServerUser } from "@/lib/server/handle-auth";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchUserTasks } from "@/lib/server/get-user-data";
import DashboardShell from "@/components/auth/dashboard-shell";
import { ErrorBoundary } from "@/components/errors/boundaries/error-boundary";
import { AuthErrorBoundary } from "@/components/errors/boundaries/auth-error-boundary";
import { GeneralErrorFallback } from "@/components/errors/fallbacks/general-error-fallback";

export default async function Home() {
  const user = await getServerUser();
  // Prefetch data for this user
  const queryClient = new QueryClient();
  
  if (user) {
    // Fetch initial data server-side
    await queryClient.prefetchQuery({
      queryKey: ['tasks', user.uid],
      queryFn: () => fetchUserTasks(user.uid) // Your server-side fetch function
    });
  }
  


  if (!user) {
    // No authenticated user, show the client fallback
    return <ClientFallback />;
  }

  // Dehydrate the query cache
  const dehydratedState = dehydrate(queryClient);
  


  // Pass both the user and dehydrated queries to client
  return (
// Outermost: Error Boundary (catches all errors)
<ErrorBoundary fallback={GeneralErrorFallback}>
  
  {/* Next: Suspense (handles loading states) */}
  <Suspense fallback={<LoadingSpinner />}>
    
    {/* Next: Hydration Boundary (client components) */}
    <DashboardShell>
    
      {/* Inner: Auth-specific Error Boundary (for auth errors only) */}
      <AuthErrorBoundary>
        <HydrationBoundary state={dehydratedState}>
          <TaskInput />
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
        </HydrationBoundary>
      </AuthErrorBoundary>
      
    </DashboardShell>
    
  </Suspense>
  
</ErrorBoundary>

  );


  console.log("server user works", user);
  // User is authenticated, show the server-rendered content

  return (
    <div>
      <h1>EAT DIRT</h1>
    </div>
  );

}
