import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ministryTeams } from '@/lib/schema';
import { requireAdminAuth } from '@/lib/admin-auth';
import { uploadFile, validateFile, deleteFile } from '@/lib/blob-storage';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: ministryId } = await params;
    if (!ministryId) {
      return NextResponse.json({ error: 'Ministry ID is required' }, { status: 400 });
    }

    // Check if ministry exists
    const [existingMinistry] = await db
      .select()
      .from(ministryTeams)
      .where(eq(ministryTeams.id, ministryId))
      .limit(1);

    if (!existingMinistry) {
      return NextResponse.json({ error: 'Ministry not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Delete old image if it exists
    if (existingMinistry.imageUrl) {
      try {
        await deleteFile(existingMinistry.imageUrl);
      } catch (error) {
        console.warn('Failed to delete old image:', error);
        // Continue anyway - don't fail the upload if old image deletion fails
      }
    }

    // Upload new image to Vercel Blob
    const uploadResult = await uploadFile(file, 'ministries');

    // Update ministry with new image URL
    const [updatedMinistry] = await db
      .update(ministryTeams)
      .set({ 
        imageUrl: uploadResult.url,
        updatedAt: new Date()
      })
      .where(eq(ministryTeams.id, ministryId))
      .returning();

    return NextResponse.json({
      success: true,
      ministry: updatedMinistry,
      imageUrl: uploadResult.url
    });
  } catch (error) {
    console.error('Error uploading ministry image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: ministryId } = await params;
    if (!ministryId) {
      return NextResponse.json({ error: 'Ministry ID is required' }, { status: 400 });
    }

    // Check if ministry exists
    const [existingMinistry] = await db
      .select()
      .from(ministryTeams)
      .where(eq(ministryTeams.id, ministryId))
      .limit(1);

    if (!existingMinistry) {
      return NextResponse.json({ error: 'Ministry not found' }, { status: 404 });
    }

    // Delete image from Vercel Blob if it exists
    if (existingMinistry.imageUrl) {
      try {
        await deleteFile(existingMinistry.imageUrl);
      } catch (error) {
        console.warn('Failed to delete image from blob storage:', error);
      }
    }

    // Remove image URL from database
    const [updatedMinistry] = await db
      .update(ministryTeams)
      .set({ 
        imageUrl: null,
        updatedAt: new Date()
      })
      .where(eq(ministryTeams.id, ministryId))
      .returning();

    return NextResponse.json({
      success: true,
      ministry: updatedMinistry
    });
  } catch (error) {
    console.error('Error deleting ministry image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
