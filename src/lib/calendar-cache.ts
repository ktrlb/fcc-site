import { db } from './db';
import { calendarCache, calendarCacheHistory } from './schema';
import { eq, desc, and, gte } from 'drizzle-orm';
import { getGoogleCalendarEvents } from './google-calendar-api';
import { RecurringEventsCacheService } from './recurring-events-cache';

export interface CachedCalendarEvent {
  id: string;
  googleEventId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  recurring: boolean;
  rawData?: string;
  lastUpdated: Date;
}

export class CalendarCacheService {
  private static readonly CACHE_DURATION_HOURS = 1; // Cache for 1 hour by default
  private static readonly FORCE_REFRESH_KEY = 'calendar_force_refresh';

  /**
   * Log cache refresh history
   */
  private static async logCacheRefresh(
    refreshType: 'scheduled' | 'manual' | 'force',
    eventsCount: number,
    success: boolean,
    errorMessage: string | null,
    durationMs: number,
    source: 'google_api' | 'fallback_cache' | 'sample_data'
  ): Promise<void> {
    try {
      await db.insert(calendarCacheHistory).values({
        refreshType,
        eventsCount: eventsCount.toString(),
        success,
        errorMessage,
        durationMs: durationMs.toString(),
        source,
      });
      console.log(`Logged cache refresh: ${refreshType} - ${eventsCount} events - ${success ? 'success' : 'failed'} - ${source}`);
    } catch (error) {
      console.error('Failed to log cache refresh history:', error);
    }
  }

  /**
   * Get calendar events from cache, refreshing if needed
   */
  static async getCalendarEvents(forceRefresh = false, refreshType: 'scheduled' | 'manual' | 'force' = 'scheduled'): Promise<CachedCalendarEvent[]> {
    const now = new Date();
    const cacheExpiry = new Date(now.getTime() - (this.CACHE_DURATION_HOURS * 60 * 60 * 1000));

    // Check if we have fresh cache
    if (!forceRefresh) {
      const cachedEvents = await db
        .select()
        .from(calendarCache)
        .where(gte(calendarCache.lastUpdated, cacheExpiry))
        .orderBy(desc(calendarCache.startTime));

      if (cachedEvents.length > 0) {
        console.log(`Using cached calendar events: ${cachedEvents.length} events`);
        return cachedEvents.map(event => ({
          id: event.id,
          googleEventId: event.googleEventId,
          title: event.title,
          description: event.description || undefined,
          location: event.location || undefined,
          startTime: event.startTime,
          endTime: event.endTime,
          allDay: event.allDay || false,
          recurring: event.recurring || false,
          rawData: event.rawData || undefined,
          lastUpdated: event.lastUpdated,
        }));
      }
    }

    console.log('Cache expired or force refresh requested, fetching from Google Calendar...');
    return await this.refreshCache(refreshType);
  }

  /**
   * Refresh the cache by fetching fresh data from Google Calendar
   */
  static async refreshCache(refreshType: 'scheduled' | 'manual' | 'force' = 'scheduled'): Promise<CachedCalendarEvent[]> {
    const startTime = Date.now();
    let eventsCount = 0;
    let success = false;
    let errorMessage: string | null = null;
    let source: 'google_api' | 'fallback_cache' | 'sample_data' = 'fallback_cache';

    try {
      console.log('Fetching fresh calendar data from Google...');
      const calendarId = process.env.GOOGLE_CALENDAR_ID;
      const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      
      if (!calendarId || !serviceAccountKey) {
        throw new Error('Google Calendar credentials not configured');
      }
      
      const googleEvents = await getGoogleCalendarEvents(calendarId, serviceAccountKey);
      eventsCount = googleEvents.length;
      source = 'google_api';
      
      console.log(`Received ${googleEvents.length} events from Google Calendar`);

      // Clear existing cache
      await db.delete(calendarCache);
      console.log('Cleared existing cache');

      // Insert new events into cache
      const cachePromises = googleEvents.map(event => 
        db.insert(calendarCache).values({
          googleEventId: event.id,
          title: event.title.length > 500 ? event.title.substring(0, 497) + '...' : event.title,
          description: event.description,
          location: event.location && event.location.length > 500 ? event.location.substring(0, 497) + '...' : event.location,
          startTime: new Date(event.start),
          endTime: new Date(event.end),
          allDay: event.allDay,
          recurring: event.recurring || false,
          rawData: JSON.stringify(event),
          lastUpdated: new Date(),
        })
      );

      try {
        await Promise.all(cachePromises);
        console.log(`Cached ${googleEvents.length} events`);
      } catch (insertError) {
        console.error('Error inserting events into cache:', insertError);
        console.error('First few events being inserted:', googleEvents.slice(0, 3).map(e => ({
          id: e.id,
          title: e.title.substring(0, 100),
          start: e.start,
          end: e.end
        })));
        throw insertError;
      }

      // Also refresh the recurring events analysis cache
      console.log('Refreshing recurring events analysis...');
      await RecurringEventsCacheService.refreshRecurringEventsCache();

      success = true;
      const durationMs = Date.now() - startTime;
      
      // Log successful refresh
      await this.logCacheRefresh(refreshType, eventsCount, success, null, durationMs, source);

      // Return the cached events
      return await this.getCalendarEvents(false);
    } catch (error) {
      console.error('Error refreshing calendar cache:', error);
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Fall back to existing cache if available
      const fallbackEvents = await db
        .select()
        .from(calendarCache)
        .orderBy(desc(calendarCache.startTime));
      
      eventsCount = fallbackEvents.length;
      console.log(`Using fallback cache: ${fallbackEvents.length} events`);
      
      const durationMs = Date.now() - startTime;
      
      // Log failed refresh with fallback
      await this.logCacheRefresh(refreshType, eventsCount, false, errorMessage, durationMs, source);

      return fallbackEvents.map(event => ({
        id: event.id,
        googleEventId: event.googleEventId,
        title: event.title,
        description: event.description || undefined,
        location: event.location || undefined,
        startTime: event.startTime,
        endTime: event.endTime,
        allDay: event.allDay || false,
        recurring: event.recurring || false,
        rawData: event.rawData || undefined,
        lastUpdated: event.lastUpdated,
      }));
    }
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    totalEvents: number;
    lastUpdated: Date | null;
    oldestEvent: Date | null;
    newestEvent: Date | null;
  }> {
    const events = await db
      .select()
      .from(calendarCache)
      .orderBy(desc(calendarCache.startTime));

    if (events.length === 0) {
      return {
        totalEvents: 0,
        lastUpdated: null,
        oldestEvent: null,
        newestEvent: null,
      };
    }

    const lastUpdated = events.reduce((latest, event) => 
      event.lastUpdated > latest ? event.lastUpdated : latest, events[0].lastUpdated
    );

    const oldestEvent = events[events.length - 1].startTime;
    const newestEvent = events[0].startTime;

    return {
      totalEvents: events.length,
      lastUpdated,
      oldestEvent,
      newestEvent,
    };
  }

  /**
   * Clear the entire cache
   */
  static async clearCache(): Promise<void> {
    await db.delete(calendarCache);
    console.log('Calendar cache cleared');
  }

  /**
   * Get cache refresh history
   */
  static async getCacheHistory(limit = 50): Promise<Array<{
    id: string;
    refreshType: string;
    eventsCount: number;
    success: boolean;
    errorMessage: string | null;
    durationMs: number | null;
    source: string;
    createdAt: Date;
  }>> {
    const history = await db
      .select()
      .from(calendarCacheHistory)
      .orderBy(desc(calendarCacheHistory.createdAt))
      .limit(limit);

    return history.map(entry => ({
      id: entry.id,
      refreshType: entry.refreshType,
      eventsCount: parseInt(entry.eventsCount, 10),
      success: entry.success,
      errorMessage: entry.errorMessage,
      durationMs: entry.durationMs ? parseInt(entry.durationMs, 10) : null,
      source: entry.source,
      createdAt: entry.createdAt,
    }));
  }
}
