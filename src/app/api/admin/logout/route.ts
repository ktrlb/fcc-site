import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    await clearAdminSession();
    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during admin logout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}