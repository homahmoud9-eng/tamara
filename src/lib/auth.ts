import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const SECRET_KEY = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'tamara_k1tch3n_jwt_s3cur1ty_pr0t0c0l_2026_x99';
const key = new TextEncoder().encode(SECRET_KEY);

export interface AdminSessionPayload {
  adminId: string;
  roleName: string;
  [key: string]: any;
}

export async function encrypt(payload: AdminSessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(token: string): Promise<AdminSessionPayload | null> {
  try {
    if (!token || typeof token !== 'string') return null;
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(adminId: string, roleName: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ adminId, roleName });

  const cookieStore = await cookies();
  cookieStore.set('admin_session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (!session) return null;
    return await decrypt(session);
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getSession();
  if (!session || !session.adminId) {
    throw new Error('UNAUTHORIZED: Admin access required');
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      role: { select: { id: true, name: true } },
    },
  });

  if (!admin || admin.status !== 'ACTIVE') {
    throw new Error('FORBIDDEN: Admin account is inactive or revoked');
  }

  return admin;
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', '', {
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  } catch {
    // ignore in environments without cookie writer
  }
}
