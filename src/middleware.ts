import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { checkRateLimit } from '@/lib/rate-limit';

const SECRET_KEY = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'tamara_k1tch3n_jwt_s3cur1ty_pr0t0c0l_2026_x99';
const key = new TextEncoder().encode(SECRET_KEY);

async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return !!payload?.adminId;
  } catch {
    return false;
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const ip = getClientIp(request);

  // 1. CORS Preflight Handling for API
  if (pathname.startsWith('/api') && request.method === 'OPTIONS') {
    const preflight = new NextResponse(null, { status: 204 });
    preflight.headers.set('Access-Control-Allow-Origin', '*');
    preflight.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    preflight.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    preflight.headers.set('Access-Control-Max-Age', '86400');
    return applySecurityHeaders(preflight);
  }

  // 2. Rate Limiting Protection
  if (pathname.startsWith('/api/auth/register') || pathname === '/vision-login') {
    const rate = checkRateLimit(`auth:${ip}`, 10, 60000);
    if (!rate.success) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Too many requests. Please try again after 1 minute.' },
          { status: 429 }
        )
      );
    }
  } else if (pathname.startsWith('/api/')) {
    const rate = checkRateLimit(`api:${ip}`, 120, 60000);
    if (!rate.success) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Rate limit exceeded. Please slow down.' },
          { status: 429 }
        )
      );
    }
  }

  // 3. Strict Admin Dashboard Guard (HTTP-level interception)
  const isDashboardPath = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const adminCookie = request.cookies.get('admin_session')?.value;

  if (isDashboardPath) {
    if (!adminCookie) {
      const loginUrl = new URL('/vision-login', request.url);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    const isValidAdmin = await verifyAdminToken(adminCookie);
    if (!isValidAdmin) {
      const loginUrl = new URL('/vision-login', request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete('admin_session');
      return applySecurityHeaders(redirectResponse);
    }
  }

  // 4. Vision Login Redirect (if already logged in as valid admin)
  if (pathname === '/vision-login') {
    const isValidAdmin = await verifyAdminToken(adminCookie);
    if (isValidAdmin) {
      return applySecurityHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
    }
  }

  // 5. Checkout Customer Auth Guard
  if (pathname === '/checkout' || pathname.startsWith('/checkout/')) {
    const customerSession =
      request.cookies.get('next-auth.session-token')?.value ||
      request.cookies.get('__Secure-next-auth.session-token')?.value;

    if (!customerSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', '/checkout');
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  const response = NextResponse.next();
  if (pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/vision-login',
    '/checkout',
    '/checkout/:path*',
    '/api/:path*',
  ],
};
