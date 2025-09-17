import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Create the assets table using raw SQL
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS assets (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_size VARCHAR(20),
        mime_type VARCHAR(100),
        is_active BOOLEAN DEFAULT true NOT NULL,
        sort_order VARCHAR(10) DEFAULT '0',
        metadata TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Assets table created successfully' 
    });
  } catch (error) {
    console.error('Error creating assets table:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
