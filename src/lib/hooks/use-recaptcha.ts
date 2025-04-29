// hooks/useRecaptcha.ts
'use client';

import { useState, useEffect } from 'react';

// Define types once, centrally
interface RecaptchaAction {
  login: 'login';
  signup: 'signup';
  submit: 'submit';
  // Add more as needed
}

type RecaptchaActionType = keyof RecaptchaAction;

interface UseRecaptchaReturn {
  ready: boolean;
  executeRecaptcha: <T extends RecaptchaActionType>(action: T) => Promise<string>;
}

export function useRecaptcha(): UseRecaptchaReturn {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Safe check for window to appease SSR gods
    if (typeof window === 'undefined') return;

    // Check if already available
    if (
      'grecaptcha' in window && 
      typeof (window as any).grecaptcha?.ready === 'function'
    ) {
      (window as any).grecaptcha.ready(() => setReady(true));
      return;
    }

    // Set up listener for async load
    (window as any).onloadRecaptcha = () => {
      if ((window as any).grecaptcha?.ready) {
        (window as any).grecaptcha.ready(() => setReady(true));
      }
    };
  }, []);

  // Our safely wrapped execution function
  const executeRecaptcha = async <T extends RecaptchaActionType>(action: T): Promise<string> => {
    if (!ready) {
      throw new Error('reCAPTCHA not ready');
    }

    if (
      typeof window === 'undefined' || 
      !(window as any).grecaptcha?.execute
    ) {
      throw new Error('reCAPTCHA not available');
    }

    return (window as any).grecaptcha.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
      { action }
    );
  };

  return { ready, executeRecaptcha };
}