import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { requireAdminAuth } from '@/lib/admin-auth';
import { deleteFile } from '@/lib/blob-storage';

// GET /api/admin/assets/[id] - Get single asset
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const [asset] = await db
      .select()
      .from(assets)
      .where(eq(assets.id, id));

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/assets/[id] - Update asset
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, type, fileUrl, fileName, fileSize, mimeType, isActive, isFeatured, sortOrder, metadata, unfeatureOthers } = body;

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
    if (fileName !== undefined) updateData.fileName = fileName;
    if (fileSize !== undefined) updateData.fileSize = fileSize;
    if (mimeType !== undefined) updateData.mimeType = mimeType;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (metadata !== undefined) updateData.metadata = metadata ? JSON.stringify(metadata) : null;

    // If making this asset featured and unfeatureOthers is true, unfeature other assets of the same type
    if (isFeatured && unfeatureOthers) {
      await db
        .update(assets)
        .set({ isFeatured: false, updatedAt: new Date() })
        .where(eq(assets.type, type));
    }

    const [updatedAsset] = await db
      .update(assets)
      .set(updateData)
      .where(eq(assets.id, id))
      .returning();

    if (!updatedAsset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/assets/[id] - Delete asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // First get the asset to extract S3 key
    const [asset] = await db
      .select()
      .from(assets)
      .where(eq(assets.id, id));

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Delete from database
    await db
      .delete(assets)
      .where(eq(assets.id, id))
      .returning();

    // Try to delete from Vercel Blob (don't fail if this doesn't work)
    try {
      await deleteFile(asset.fileUrl);
    } catch (blobError) {
      console.warn('Failed to delete file from Vercel Blob:', blobError);
      // Don't fail the entire operation if Blob deletion fails
    }

    return NextResponse.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
