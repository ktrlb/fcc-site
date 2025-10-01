import { NextResponse } from 'next/server';
import { RecurringEventsCacheService } from '@/lib/recurring-events-cache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const includeExternal = searchParams.get('includeExternal') === 'true';

    // Check if we need to refresh the cache
    const needsRefresh = await RecurringEventsCacheService.needsRefresh();
    
    if (needsRefresh) {
      console.log('Recurring events cache is stale, refreshing...');
      await RecurringEventsCacheService.refreshRecurringEventsCache();
    }

    // Get the cached recurring events for the specified month/year
    const recurringEvents = await RecurringEventsCacheService.getRecurringEvents(month, year, includeExternal);
    const weeklyPatterns = await RecurringEventsCacheService.getWeeklyPatterns(month, year, includeExternal);

    return NextResponse.json({
      recurringEvents,
      weeklyPatterns,
      totalEvents: recurringEvents.length,
      month: month ?? new Date().getMonth(),
      year: year ?? new Date().getFullYear(),
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
