import { NextRequest, NextResponse } from 'next/server';
import { getMinistryTeams, createMinistryTeam } from '@/lib/ministry-queries';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ministries = await getMinistryTeams();
    return NextResponse.json(ministries);
  } catch (error) {
    console.error('Error fetching ministries:', error);
    return NextResponse.json({ error: 'Failed to fetch ministries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const ministry = await createMinistryTeam(data);
    return NextResponse.json(ministry[0]);
  } catch (error) {
    console.error('Error creating ministry:', error);
    return NextResponse.json({ error: 'Failed to create ministry' }, { status: 500 });
  }
}
