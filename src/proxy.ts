import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Admin Dashboard Guard
  const adminSession = request.cookies.get('admin_session')?.value;
  const isDashboardPath = pathname.startsWith('/dashboard');
  if (isDashboardPath && !adminSession) {
    return NextResponse.redirect(new URL('/vision-login', request.url));
  }

  // 2. Checkout Customer Auth Guard (Mandatory login before checkout)
  if (pathname.startsWith('/checkout')) {
    const customerSession = 
      request.cookies.get('next-auth.session-token')?.value ||
      request.cookies.get('__Secure-next-auth.session-token')?.value;

    if (!customerSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', '/checkout');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/vision-login', '/checkout/:path*'],
};
