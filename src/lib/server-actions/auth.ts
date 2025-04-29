// app/actions/auth.js
"use server";

import { getAuth, UserRecord } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirebaseAdmin } from '@/lib/server-actions/firebase-admin';
import { NextResponse } from "next/server";
// Let's check if the issue is TLS-specific or broader
const net = require('net');
const tls = require('tls');

type verifySessionResponse = {
  user: UserRecord | null;
  error: string | null;
};

export async function verifySession(_sessionCookie: string) : Promise<verifySessionResponse> {
  const app = await getFirebaseAdmin();
  const auth = getAuth(app);

  //TODO: bruh
  try {
    const auth = getAuth();
    const decodedClaim = await auth.verifySessionCookie(_sessionCookie, true);
    //console.log("decodedClaim", decodedClaim);
    auth.getUser(decodedClaim.uid).then((user) => {
      console.log("returning value");
      return { user, error: null };
    }).catch((error) => { 
      console.error("Error verifying session cookie:", decodedClaim, error);

      return { user: null, error: error.message };
    });
  } catch (error : any) {
    console.error("Error verifying session cookie:", _sessionCookie, error);
      return { user: null, error: error.message };
    }

    return { user: null, error: "who knows man" };

  }


  export const diagnoseTiming = async (token: string) => {
    const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;






    console.log('Starting diagnostic...');


// Test raw TCP connection
const tcpTest = new Promise((resolve, reject) => {
  const socket = net.createConnection(443, 'www.google.com');
  socket.setTimeout(5000);
  
  socket.on('connect', () => {
    console.log('Raw TCP connection successful');
    socket.destroy();
    resolve(true);
  });
  
  socket.on('error', (err: Error) => {
    console.error('TCP connection failed:', err);
    reject(err);
  });
});

// Test TLS handshake
const tlsTest = new Promise((resolve, reject) => {
  const socket = tls.connect(443, 'www.google.com', {
    rejectUnauthorized: false // Just for testing
  });
  
  socket.on('secureConnect', () => {
    console.log('TLS handshake successful');
    socket.destroy();
    resolve(true);
  });
  
  socket.on('error', (err: Error) => {
    console.error('TLS handshake failed:', err);
    reject(err);
  });
});

try {
  await tcpTest;
  await tlsTest;
} catch (error) {
  console.error('Network test failed:', error);
}

    
    // Test basic connectivity first, in sequence
   // First, let's identify which timeout is actually firing
const controller = new AbortController();
const timeoutId = setTimeout(() => {
  console.log('AbortController timeout triggered at 30 seconds');
  controller.abort();
}, 30000);

try {
  console.time('Actual request duration');
  const response = await fetch('https://www.google.com', {
    signal: controller.signal
  });
  console.timeEnd('Actual request duration');
  clearTimeout(timeoutId);
} catch (error) {
  console.timeEnd('Actual request duration');
  if (error instanceof Error) {
    console.log('Error type:', error.name);
    console.log('Error message:', error.message);
    // This will reveal if it's our abort or something else
    if (error.name === 'AbortError') {
      console.log('This was our controlled abort');
    } else {
      console.log('This timeout came from elsewhere');
    }
  } else {
    console.log('Error type: Unknown error');
  }
  
}




    clearTimeout(timeoutId);
    const timeoutId2 = setTimeout(() => controller.abort(), 30000); // 30 seconds
    // Only then test reCAPTCHA
    try {
      console.time('reCAPTCHA verification');
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${encodeURIComponent(SECRET_KEY || "")}&response=${encodeURIComponent(token)}`,
        signal: controller.signal
      });
      console.timeEnd('reCAPTCHA verification');
      console.log('reCAPTCHA status:', recaptchaResponse.status);
    } catch (error) {
      console.timeEnd('reCAPTCHA verification');
      if (error instanceof Error) {
        console.error('reCAPTCHA failed:', error.message);
      } else {
        console.error('reCAPTCHA failed:', error);
      }
    }
    
    clearTimeout(timeoutId2);
  };


  export async function verifyRecaptcha(token: string) {
    const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

    // console.log('Verifying reCAPTCHA with secret key:', SECRET_KEY);
    console.log('Verifying reCAPTCHA');
    // console.log('Verifying reCAPTCHA with token:', token);
    //diagnoseTiming(token);
    
// Use a longer timeout and explicit DNS settings
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(SECRET_KEY || "")}&response=${encodeURIComponent(token)}`,

    });

    const result = response.json();
    //console.log(result);

    return result;
    // Returns: { success: boolean, score: number, action: string, ... }
  }