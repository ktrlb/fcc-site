import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq, and, or, sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // Fetch all active images first
    const allImages = await db
      .select()
      .from(assets)
      .where(
        and(
          eq(assets.type, 'image'),
          eq(assets.isActive, true)
        )
      )
      .orderBy(assets.createdAt);

    // Filter in JavaScript to check both legacy category field and new categories array
    const images = allImages.filter(img => 
      img.category === category || 
      (img.categories && Array.isArray(img.categories) && img.categories.includes(category))
    );

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}



