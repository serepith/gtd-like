// components/errors/boundaries/ErrorBoundary.tsx
'use client';

import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: React.ComponentType<FallbackProps>;
}

// TODO
// Create an error.tsx file in your route folder for client-side errors
// Create a not-found.tsx for 404 errors
// Create a loading.tsx for loading states (acts like Suspense)

export function ErrorBoundary({ 
  children, 
  fallback: FallbackComponent 
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ReactErrorBoundary>
  );
}