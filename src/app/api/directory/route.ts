import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assets } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';

// GET /api/directory - Get the church directory PDF
export async function GET(request: NextRequest) {
  try {
    // Find the most recent directory PDF
    const directoryAssets = await db
      .select()
      .from(assets)
      .where(
        and(
          eq(assets.type, 'directory'),
          eq(assets.isActive, true)
        )
      )
      .orderBy(desc(assets.createdAt))
      .limit(1);

    if (directoryAssets.length === 0) {
      return NextResponse.json({ 
        error: 'Directory PDF not found. Please contact the church office.' 
      }, { status: 404 });
    }

    const directoryAsset = directoryAssets[0];

    return NextResponse.json({
      id: directoryAsset.id,
      name: directoryAsset.name,
      description: directoryAsset.description,
      fileUrl: directoryAsset.fileUrl,
      fileName: directoryAsset.fileName,
      fileSize: directoryAsset.fileSize,
      mimeType: directoryAsset.mimeType,
      createdAt: directoryAsset.createdAt
    });
  } catch (error) {
    console.error('Error fetching directory:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 });
  }
}
