// app/login/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import LoginForm from '../../../components/auth/login-form';
import { getFirebaseAuth } from '@/lib/data-firebase/init';

export default async function LoginPage() {
  // Check if already logged in
  const sessionCookie = (await cookies()).get('firebase-session')?.value;
  
  if (sessionCookie) {
    // Already authenticated, go to dashboard
    redirect('/');
  }

  if (getFirebaseAuth().currentUser) {
    redirect('/');
  }
  
  return (
    <div className="login-container">
      <h1>Sign In</h1>
      <LoginForm />
    </div>
  );
}