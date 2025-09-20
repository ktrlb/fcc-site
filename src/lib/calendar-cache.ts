import { db } from './db';
import { calendarCache } from './schema';
import { eq, desc, and, gte } from 'drizzle-orm';
import { getGoogleCalendarEvents } from './google-calendar-api';

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
   * Get calendar events from cache, refreshing if needed
   */
  static async getCalendarEvents(forceRefresh = false): Promise<CachedCalendarEvent[]> {
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
    return await this.refreshCache();
  }

  /**
   * Refresh the cache by fetching fresh data from Google Calendar
   */
  static async refreshCache(): Promise<CachedCalendarEvent[]> {
    try {
      console.log('Fetching fresh calendar data from Google...');
      const googleEvents = await getGoogleCalendarEvents();
      
      console.log(`Received ${googleEvents.length} events from Google Calendar`);

      // Clear existing cache
      await db.delete(calendarCache);
      console.log('Cleared existing cache');

      // Insert new events into cache
      const cachePromises = googleEvents.map(event => 
        db.insert(calendarCache).values({
          googleEventId: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          startTime: new Date(event.start),
          endTime: new Date(event.end),
          allDay: event.allDay,
          recurring: event.recurring || false,
          rawData: JSON.stringify(event),
          lastUpdated: new Date(),
        })
      );

      await Promise.all(cachePromises);
      console.log(`Cached ${googleEvents.length} events`);

      // Return the cached events
      return await this.getCalendarEvents(false);
    } catch (error) {
      console.error('Error refreshing calendar cache:', error);
      
      // Fall back to existing cache if available
      const fallbackEvents = await db
        .select()
        .from(calendarCache)
        .orderBy(desc(calendarCache.startTime));
      
      console.log(`Using fallback cache: ${fallbackEvents.length} events`);
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
}
