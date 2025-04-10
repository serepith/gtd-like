'use client';

import { AuthProvider } from "./firebase-auth-provider";
import { FirebaseProvider } from "./firebase-provider";
import QueryProvider from "./query-provider";
import { RepositoryProvider } from "./repository-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <FirebaseProvider>
                  <AuthProvider>
                    <RepositoryProvider>
                      <QueryProvider>
                      {children}
                      </QueryProvider>
                    </RepositoryProvider>
                  </AuthProvider>
                </FirebaseProvider>
    </div>
  );
}