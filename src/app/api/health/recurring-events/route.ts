import { NextResponse } from 'next/server';
import { RecurringEventsCacheService } from '@/lib/recurring-events-cache';

export async function GET() {
  try {
    const events = await RecurringEventsCacheService.getRecurringEvents();
    const needsRefresh = await RecurringEventsCacheService.needsRefresh();
    
    return NextResponse.json({
      status: events.length > 0 ? 'healthy' : 'empty',
      eventCount: events.length,
      needsRefresh,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking recurring events cache health:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Failed to check cache health',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Force refresh the cache and return health status
    console.log('Force refreshing recurring events cache from health check...');
    await RecurringEventsCacheService.refreshRecurringEventsCache();
    
    const events = await RecurringEventsCacheService.getRecurringEvents();
    
    return NextResponse.json({
      status: 'refreshed',
      message: 'Cache refreshed successfully',
      eventCount: events.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error refreshing recurring events cache:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Failed to refresh cache',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
