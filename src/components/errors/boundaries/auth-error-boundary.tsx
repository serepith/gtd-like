// components/errors/boundaries/AuthErrorBoundary.tsx
'use client';

import { AuthErrorFallback } from '../fallbacks/auth-error-fallback';
import { ErrorBoundary } from './error-boundary';

import { ReactNode } from 'react';

export function AuthErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={AuthErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}