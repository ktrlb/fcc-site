import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, validateFile } from '@/lib/blob-storage';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload to special-events folder
    const uploadResult = await uploadFile(file, 'images/special-events');

    return NextResponse.json({ 
      url: uploadResult.url,
      fileName: uploadResult.fileName 
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading special event image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

