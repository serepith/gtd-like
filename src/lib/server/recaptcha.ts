// lib/recaptcha.ts
export async function verifyRecaptcha(token: string) {
    const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
    
    //console.log('Verifying reCAPTCHA with token:', token);

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`,
      { method: 'POST' }
    );
    
    const result = response.json();
    console.log(result);

    return result;
    // Returns: { success: boolean, score: number, action: string, ... }
  }