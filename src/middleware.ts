// middleware.ts (in your project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
    // Check for Firebase session cookie
    const session = request.cookies.get('firebase-session')?.value;
  
  // Check if the user is accessing a protected route and isn't authenticated
  if (!session && !isPublicPath(request.nextUrl.pathname)) {
    // Redirect them to login, but remember where they were trying to go
    const url = new URL('/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next(); // Proceed to the requested page
}

// Helper to determine if a path should be publicly accessible
function isPublicPath(path: string) {
  const publicPaths = ['/login', '/signup', '/forgot-password'];
  return publicPaths.some(publicPath => path.startsWith(publicPath));
}
 
// Define which routes this middleware applies to
export const config = {
  matcher: [
    // Apply to all routes except:
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};