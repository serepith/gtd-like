// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFirebaseAdmin } from '@/lib/firebase/firebase-admin';
import { verifyRecaptcha } from '@/lib/server/recaptcha';

export async function POST(request: Request) {

  const { userToken, recaptchaToken } = await request.json();
  
  // 1. Verify reCAPTCHA first
  const recaptchaResponse = await verifyRecaptcha(recaptchaToken);
  
  // 2. Check score threshold
  if (recaptchaResponse.score < 0.5) {
    return new Response(JSON.stringify({ 
      error: 'Security check failed' 
    }), { status: 403 });
  }
  
  // 3. Only then proceed with Firebase authentication
  try {
    
    if (!userToken) {
      return NextResponse.json(
        { error: 'Missing token' }, 
        { status: 400 }
      );
    }

    // Initialize Firebase Admin
    const { getAuth } = getFirebaseAdmin();
    
    // Create session cookie (15 days)
    const expiresIn = 60 * 60 * 24 * 14 * 1000;
    const sessionCookie = await getAuth().createSessionCookie(userToken, { expiresIn });
    
    // Set cookie for server-side auth
    (await
          // Set cookie for server-side auth
          cookies()).set('firebase-session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error setting session:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}