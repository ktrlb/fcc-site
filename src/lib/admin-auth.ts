import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.SITE_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  throw new Error('SITE_ADMIN_PASSWORD environment variable is required');
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set('admin-session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');
  return session?.value === 'authenticated';
}

export function requireAdminAuth(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('admin-session');
  return sessionCookie?.value === 'authenticated';
}