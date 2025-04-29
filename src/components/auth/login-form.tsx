// components/login-form.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/data-firebase/init';
import { useRecaptcha } from '@/lib/hooks/use-recaptcha';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { ready: recaptchaReady, executeRecaptcha } = useRecaptcha();

  const handleEmailLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
        const recaptchaToken = await executeRecaptcha('login');
        // Firebase authentication
        const userCredential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
        
      // Use the user from the credential response
        const user = userCredential.user;
        
        if (!user) {
          throw new Error('Authentication succeeded but no user was returned');
        }
        
        // Get ID token for server-side session
        const userToken = await user.getIdToken();


      // Create server-side session
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userToken, recaptchaToken })
      });
      
      // Navigate to dashboard
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  const handleGoogleLogin = async (e: { preventDefault: () => void; }) => {
    
    try {
        const recaptchaToken = await executeRecaptcha('login');

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(getFirebaseAuth(), provider);
      const user = userCredential.user;
      // Get token and create session as above
      const userToken = await user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userToken, recaptchaToken })
      });
      
      router.push('/');
    } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  if(!recaptchaReady) { 
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleEmailLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Password" 
          required 
        />
        <button
         disabled={!recaptchaReady} 
        type="submit"
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >Sign In</button>
      </form>
      
      <div className="divider">or</div>
      
      <button 
       disabled={!recaptchaReady}
      onClick={handleGoogleLogin} 
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto google-button"
      >
        Sign in with Google
      </button>
    </div>
  );
}