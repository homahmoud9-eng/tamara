'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
    include: { role: true }
  });

  if (!admin || admin.status !== 'ACTIVE') {
    return { error: 'Invalid credentials or inactive account.' };
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);
  if (!isValidPassword) {
    return { error: 'Invalid credentials.' };
  }

  await createSession(admin.id, admin.role.name);
  
  redirect('/dashboard');
}

export async function logoutAction() {
  const { logout } = await import('@/lib/auth');
  await logout();
  redirect('/login');
}
