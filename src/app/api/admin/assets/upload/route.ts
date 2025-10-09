import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assets, type NewAsset } from '@/lib/schema';
import { requireAdminAuth } from '@/lib/admin-auth';
import { uploadFile, validateFile, getFileCategory } from '@/lib/blob-storage';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string | null;
    const isFeatured = formData.get('isFeatured') === 'true';

    if (!file || !name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Determine upload folder based on file type and asset type
    const fileCategory = getFileCategory(file.type);
    const uploadFolder = `${fileCategory}/${type}`;

    // Upload file to Vercel Blob
    const uploadResult = await uploadFile(file, uploadFolder);

    // If this asset is being featured, unfeature other assets of the same type
    if (isFeatured) {
      await db
        .update(assets)
        .set({ isFeatured: false, updatedAt: new Date() })
        .where(eq(assets.type, type));
    }

    // Create asset record in database
    const newAsset: NewAsset = {
      name,
      description: description || null,
      type,
      category: category || null,
      fileUrl: uploadResult.url, // Vercel Blob public URL
      fileName: uploadResult.fileName,
      fileSize: file.size.toString(),
      mimeType: file.type,
      isFeatured,
      metadata: JSON.stringify({
        blobPathname: uploadResult.pathname,
        uploadFolder,
        originalFileName: file.name
      }),
    };

    const [createdAsset] = await db.insert(assets).values(newAsset).returning();

    return NextResponse.json(createdAsset, { status: 201 });
  } catch (error) {
    console.error('Error uploading asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
