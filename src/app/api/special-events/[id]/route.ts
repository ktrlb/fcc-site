import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { specialEvents } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await db.select().from(specialEvents).where(eq(specialEvents.id, id)).limit(1);
    const ev = rows[0] || null;
    if (!ev) return NextResponse.json({ event: null }, { status: 404 });

    return NextResponse.json({
      event: {
        id: ev.id,
        name: (ev as any).name,
        description: (ev as any).description ?? null,
        imageUrl: (ev as any).imageUrl ?? null,
        color: (ev as any).color ?? null,
      }
    });
  } catch (error) {
    console.error('Error fetching special event by id:', error);
    return NextResponse.json({ error: 'Failed to fetch special event' }, { status: 500 });
  }
}




