import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();
    if (authenticated) {
      return NextResponse.json({ authenticated: true });
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
