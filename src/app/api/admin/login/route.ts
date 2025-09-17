import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, setAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    await setAdminSession();

    return NextResponse.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during admin login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}