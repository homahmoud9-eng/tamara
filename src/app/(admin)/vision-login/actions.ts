'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' };
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
    include: { role: true },
  });

  // Generic credential error to avoid user/admin enumeration
  if (!admin || admin.status !== 'ACTIVE') {
    return { error: 'بيانات الاعتماد غير صحيحة أو الحساب غير مفعّل.' };
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);
  if (!isValidPassword) {
    return { error: 'بيانات الاعتماد غير صحيحة أو الحساب غير مفعّل.' };
  }

  await createSession(admin.id, admin.role?.name || 'ADMIN');

  redirect('/dashboard');
}

export async function logoutAction() {
  await logout();
  redirect('/vision-login');
}

export async function clearSession() {
  await logout();
}
