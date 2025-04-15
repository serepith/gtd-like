'use client';

import { AuthProvider } from "./firebase-auth-provider";
import { FirebaseProvider } from "./firebase-provider";
import QueryProvider from "./query-provider";
import { ManagerProvider } from "./manager-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <FirebaseProvider>
          <AuthProvider>
            <ManagerProvider>
              <QueryProvider>
              {children}
              </QueryProvider>
            </ManagerProvider>
          </AuthProvider>
        </FirebaseProvider>
    </div>
  );
}