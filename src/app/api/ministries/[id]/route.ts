import { NextResponse } from 'next/server';
import { getMinistryTeamById } from '@/lib/ministry-queries';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const team = await getMinistryTeamById(id);
    if (!team) {
      return NextResponse.json({ team: null }, { status: 404 });
    }

    // Return only fields the client needs
    return NextResponse.json({
      team: {
        id: team.id,
        name: (team as any).name,
        description: (team as any).description ?? (team as any).about ?? null,
        imageUrl: (team as any).imageUrl ?? (team as any).image_url ?? null,
        contactPerson: (team as any).contactPerson ?? null,
        contactEmail: (team as any).contactEmail ?? null,
        contactPhone: (team as any).contactPhone ?? null,
      }
    });
  } catch (error) {
    console.error('Error fetching ministry team by id:', error);
    return NextResponse.json({ error: 'Failed to fetch ministry team' }, { status: 500 });
  }
}




