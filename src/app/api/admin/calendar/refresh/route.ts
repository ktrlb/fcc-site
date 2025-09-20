import { NextRequest, NextResponse } from 'next/server';
import { CalendarCacheService } from '@/lib/calendar-cache';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const authResult = await requireAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Manual calendar cache refresh requested by admin');
    
    // Force refresh the cache
    const events = await CalendarCacheService.refreshCache();
    
    // Get cache stats
    const stats = await CalendarCacheService.getCacheStats();
    
    return NextResponse.json({
      success: true,
      message: `Calendar cache refreshed successfully`,
      eventsCount: events.length,
      stats,
    });
  } catch (error) {
    console.error('Error refreshing calendar cache:', error);
    return NextResponse.json(
      { error: 'Failed to refresh calendar cache' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const authResult = await requireAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get cache stats
    const stats = await CalendarCacheService.getCacheStats();
    
    return NextResponse.json({
      stats,
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}
