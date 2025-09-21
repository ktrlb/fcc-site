import { NextResponse } from 'next/server';
import { CalendarCacheService } from '@/lib/calendar-cache';

export async function GET() {
  try {
    const history = await CalendarCacheService.getCacheHistory(50);
    
    return NextResponse.json({ 
      history,
      total: history.length 
    });
  } catch (error) {
    console.error('Error fetching cache history:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch cache history',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
