// components/errors/fallbacks/AuthErrorFallback.tsx
'use client';

import { useRouter } from 'next/navigation';

interface AuthErrorFallbackProps {
  error: Error; // Replace 'Error' with a custom type if needed
}

export const AuthErrorFallback = ({ error }: AuthErrorFallbackProps) => {
  const router = useRouter();

  return (
    <div className="auth-error-container">
      <h2>Authentication Required</h2>
      <p>You need to be logged in to view this content.</p>
      <button 
        onClick={() => router.push('/login')}
        className="login-button"
      >
        Log in
      </button>
    </div>
  );
}