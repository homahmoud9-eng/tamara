import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  
  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard');
  const isLoginPath = request.nextUrl.pathname === '/vision-login';

  // If trying to access dashboard without session, redirect to login
  if (isDashboardPath && !session) {
    return NextResponse.redirect(new URL('/vision-login', request.url));
  }

  // We no longer auto-redirect away from /vision-login if authenticated.
  // This ensures the login form always renders when visited, allowing
  // users to re-authenticate or clear stale sessions.

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/vision-login'],
};
