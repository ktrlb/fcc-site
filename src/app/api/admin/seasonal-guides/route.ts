import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';
import { getAllSeasonalGuides, createSeasonalGuide } from '@/lib/content-queries';
import { uploadFile } from '@/lib/blob-storage';

// GET /api/admin/seasonal-guides - Get all seasonal guides
export async function GET(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const guides = await getAllSeasonalGuides();
    return NextResponse.json(guides);
  } catch (error) {
    console.error('Error fetching seasonal guides:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/seasonal-guides - Create new seasonal guide
export async function POST(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isFeatured = formData.get('isFeatured') === 'true';
    const pdfFile = formData.get('pdf') as File;
    const coverImageFile = formData.get('coverImage') as File;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!pdfFile) {
      return NextResponse.json({ error: 'PDF file is required' }, { status: 400 });
    }

    if (!coverImageFile) {
      return NextResponse.json({ error: 'Cover image is required' }, { status: 400 });
    }

    // Upload files to Vercel Blob
    const pdfUploadResult = await uploadFile(pdfFile, "seasonal-guides");
    const coverImageUploadResult = await uploadFile(coverImageFile, "seasonal-guides");

    const newGuide = await createSeasonalGuide({
      title,
      description: description || undefined,
      pdfUrl: pdfUploadResult.url,
      coverImageUrl: coverImageUploadResult.url,
      isFeatured: isFeatured || false,
    });

    return NextResponse.json(newGuide, { status: 201 });
  } catch (error) {
    console.error('Error creating seasonal guide:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
