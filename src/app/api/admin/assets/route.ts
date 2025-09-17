import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assets, type NewAsset } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdminAuth } from '@/lib/admin-auth';

// GET /api/admin/assets - Get all assets
export async function GET(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Database connection should already be configured for ministry database

    const allAssets = await db
      .select()
      .from(assets)
      .orderBy(desc(assets.createdAt));

    return NextResponse.json(allAssets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    
    // Check if it's a table doesn't exist error
    if (error instanceof Error && (
      error.message.includes('relation "assets" does not exist') ||
      error.message.includes('Failed query: select') ||
      error.message.includes('assets')
    )) {
      return NextResponse.json({ 
        error: 'Assets table not found. Please click "Create Assets Table" button to set up the table.' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined 
    }, { status: 500 });
  }
}

// POST /api/admin/assets - Create new asset
export async function POST(request: NextRequest) {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, type, fileUrl, fileName, fileSize, mimeType, metadata } = body;

    if (!name || !type || !fileUrl || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAsset: NewAsset = {
      name,
      description,
      type,
      fileUrl,
      fileName,
      fileSize,
      mimeType,
      metadata: metadata ? JSON.stringify(metadata) : null,
    };

    const [createdAsset] = await db.insert(assets).values(newAsset).returning();

    return NextResponse.json(createdAsset, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
