// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFirebaseAdmin } from '@/lib/server-actions/firebase-admin';
import { diagnoseTiming, verifyRecaptcha } from '@/lib/server-actions/auth';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: Request) {

  const { userToken, recaptchaToken } = await request.json();

  // console.log('recaptchaToken', recaptchaToken);
  // console.log('userToken', userToken);
  
  // 1. Verify reCAPTCHA first
  const recaptchaResponse = await verifyRecaptcha(recaptchaToken);

  console.log('recaptchaResponse', recaptchaResponse);
  
  //2. Check score threshold
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
    
    // Create session cookie (15 days)
    const expiresIn = 60 * 60 * 24 * 14 * 1000;
    const sessionCookie = await getAuth(await getFirebaseAdmin()).createSessionCookie(userToken, { expiresIn });
    
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