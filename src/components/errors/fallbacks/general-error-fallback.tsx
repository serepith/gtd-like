// components/errors/fallbacks/GeneralErrorFallback.tsx
'use client';

// The standard structure for error fallbacks
export const GeneralErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary?: () => void }) => {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>We encountered an unexpected error.</p>
      {process.env.NODE_ENV !== 'production' && (
        <pre className="error-details">{error.message}</pre>
      )}
      {resetErrorBoundary && (
        <button onClick={resetErrorBoundary}>
          Try again
        </button>
      )}
    </div>
  );
}