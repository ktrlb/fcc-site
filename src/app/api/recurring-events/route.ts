import { NextResponse } from 'next/server';
import { RecurringEventsCacheService } from '@/lib/recurring-events-cache';

export async function GET() {
  try {
    // Check if we need to refresh the cache
    const needsRefresh = await RecurringEventsCacheService.needsRefresh();
    
    if (needsRefresh) {
      console.log('Recurring events cache is stale, refreshing...');
      await RecurringEventsCacheService.refreshRecurringEventsCache();
    }

    // Get the cached recurring events
    const recurringEvents = await RecurringEventsCacheService.getRecurringEvents();
    const weeklyPatterns = await RecurringEventsCacheService.getWeeklyPatterns();

    return NextResponse.json({
      recurringEvents,
      weeklyPatterns,
      totalEvents: recurringEvents.length,
      lastRefreshed: recurringEvents.length > 0 ? recurringEvents[0].lastAnalyzed : null,
    });
  } catch (error) {
    console.error('Error fetching recurring events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recurring events' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Force refresh the recurring events cache
    console.log('Force refreshing recurring events cache...');
    const recurringEvents = await RecurringEventsCacheService.refreshRecurringEventsCache();
    const weeklyPatterns = await RecurringEventsCacheService.getWeeklyPatterns();

    return NextResponse.json({
      recurringEvents,
      weeklyPatterns,
      totalEvents: recurringEvents.length,
      message: 'Recurring events cache refreshed successfully',
    });
  } catch (error) {
    console.error('Error refreshing recurring events cache:', error);
    return NextResponse.json(
      { error: 'Failed to refresh recurring events cache' },
      { status: 500 }
    );
  }
}
