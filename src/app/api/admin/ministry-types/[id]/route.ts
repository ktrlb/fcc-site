import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ministryCategories } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, color } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if another category with this name exists
    const existing = await db
      .select()
      .from(ministryCategories)
      .where(eq(ministryCategories.name, name.trim()));

    if (existing.length > 0 && existing[0].id !== id) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    const updatedCategory = await db
      .update(ministryCategories)
      .set({
        name: name.trim(),
        description: description?.trim() || null,
        color: color || null,
      })
      .where(eq(ministryCategories.id, id))
      .returning();

    if (updatedCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    console.error('Error updating ministry type:', error);
    return NextResponse.json(
      { error: 'Failed to update ministry type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // First check if the category exists
    const existingCategory = await db
      .select()
      .from(ministryCategories)
      .where(eq(ministryCategories.id, id));

    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Delete the category
    const deletedCategory = await db
      .delete(ministryCategories)
      .where(eq(ministryCategories.id, id))
      .returning();

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting ministry type:', error);
    return NextResponse.json(
      { error: 'Failed to delete ministry type' },
      { status: 500 }
    );
  }
}
