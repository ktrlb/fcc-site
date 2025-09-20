import { NextResponse } from 'next/server';
import { getMinistryTeams } from '@/lib/ministry-queries';

export async function GET() {
  try {
    const ministries = await getMinistryTeams();
    return NextResponse.json({ ministries });
  } catch (error) {
    console.error('Error fetching ministries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ministries' },
      { status: 500 }
    );
  }
}
