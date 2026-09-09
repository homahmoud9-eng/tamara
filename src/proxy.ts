import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  
  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard');
  const isLoginPath = request.nextUrl.pathname === '/login';

  // If trying to access dashboard without session, redirect to login
  if (isDashboardPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login while already authenticated, redirect to dashboard
  if (isLoginPath && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
