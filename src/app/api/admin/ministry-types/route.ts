import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ministryCategories } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const categories = await db.select().from(ministryCategories);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching ministry types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ministry types' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existing = await db
      .select()
      .from(ministryCategories)
      .where(eq(ministryCategories.name, name.trim()));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    const newCategory = await db
      .insert(ministryCategories)
      .values({
        name: name.trim(),
        description: description?.trim() || null,
        color: color || null,
      })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('Error creating ministry type:', error);
    return NextResponse.json(
      { error: 'Failed to create ministry type' },
      { status: 500 }
    );
  }
}
