import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';
import { getAllSermonSeries, createSermonSeries } from '@/lib/content-queries';
import { uploadFile } from '@/lib/blob-storage';

// GET /api/admin/sermon-series - Get all sermon series
export async function GET(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const series = await getAllSermonSeries();
    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching sermon series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/sermon-series - Create new sermon series
export async function POST(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isFeatured = formData.get('isFeatured') === 'true';
    const imageFile = formData.get('image') as File;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!imageFile) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    // Upload image to Vercel Blob
    const imageUploadResult = await uploadFile(imageFile, "sermon-series");

    const newSeries = await createSermonSeries({
      title,
      description: description || undefined,
      imageUrl: imageUploadResult.url,
      isFeatured: isFeatured || false,
    });

    return NextResponse.json(newSeries, { status: 201 });
  } catch (error) {
    console.error('Error creating sermon series:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
