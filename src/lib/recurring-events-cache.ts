import { db } from './db';
import { recurringEventsCache } from './schema';
import { CalendarCacheService } from './calendar-cache';
import { analyzeEvents, RecurringEvent } from './event-analyzer';
import { eq, desc } from 'drizzle-orm';

export interface CachedRecurringEvent {
  id: string;
  title: string;
  dayOfWeek: number;
  time: string;
  location?: string;
  description?: string;
  frequency: string;
  confidence: number;
  ministryConnection?: string;
  eventIds: string[];
  lastAnalyzed: Date;
}

export class RecurringEventsCacheService {
  /**
   * Get cached recurring events analysis
   */
  static async getRecurringEvents(): Promise<CachedRecurringEvent[]> {
    const cachedEvents = await db
      .select()
      .from(recurringEventsCache)
      .orderBy(desc(recurringEventsCache.dayOfWeek), recurringEventsCache.time);

    return cachedEvents.map(event => ({
      id: event.id,
      title: event.title,
      dayOfWeek: parseInt(event.dayOfWeek),
      time: event.time,
      location: event.location || undefined,
      description: event.description || undefined,
      frequency: event.frequency,
      confidence: parseFloat(event.confidence),
      ministryConnection: event.ministryConnection || undefined,
      eventIds: event.eventIds || [],
      lastAnalyzed: event.lastAnalyzed,
    }));
  }

  /**
   * Refresh the recurring events cache by analyzing current calendar events
   */
  static async refreshRecurringEventsCache(): Promise<CachedRecurringEvent[]> {
    try {
      console.log('Analyzing calendar events for recurring patterns...');
      
      // Get current calendar events
      const calendarEvents = await CalendarCacheService.getCalendarEvents();
      
      // Convert to the format expected by analyzeEvents
      const eventsForAnalysis = calendarEvents.map(event => ({
        id: event.googleEventId,
        title: event.title,
        start: event.startTime,
        end: event.endTime,
        description: event.description,
        location: event.location,
        allDay: event.allDay,
        recurring: event.recurring,
      }));

      // Analyze events for recurring patterns
      const analysis = analyzeEvents(eventsForAnalysis);
      
      console.log(`Found ${analysis.recurringEvents.length} recurring event patterns`);

      // Clear existing recurring events cache
      await db.delete(recurringEventsCache);
      console.log('Cleared existing recurring events cache');

      // Insert new recurring events into cache
      if (analysis.recurringEvents.length > 0) {
        const cachePromises = analysis.recurringEvents.map(recurringEvent => 
          db.insert(recurringEventsCache).values({
            title: recurringEvent.title,
            dayOfWeek: recurringEvent.dayOfWeek.toString(),
            time: recurringEvent.time,
            location: recurringEvent.location,
            description: recurringEvent.description,
            frequency: recurringEvent.frequency,
            confidence: recurringEvent.confidence.toString(),
            ministryConnection: recurringEvent.ministryConnection,
            eventIds: recurringEvent.eventIds,
            lastAnalyzed: new Date(),
          })
        );

        await Promise.all(cachePromises);
        console.log(`Cached ${analysis.recurringEvents.length} recurring event patterns`);
      }

      // Return the cached events
      return await this.getRecurringEvents();
    } catch (error) {
      console.error('Error refreshing recurring events cache:', error);
      
      // Fall back to existing cache if available
      return await this.getRecurringEvents();
    }
  }

  /**
   * Get recurring events organized by day of week for easy display
   */
  static async getWeeklyPatterns(): Promise<{ [dayOfWeek: number]: CachedRecurringEvent[] }> {
    const events = await this.getRecurringEvents();
    const patterns: { [dayOfWeek: number]: CachedRecurringEvent[] } = {
      0: [], // Sunday
      1: [], // Monday
      2: [], // Tuesday
      3: [], // Wednesday
      4: [], // Thursday
      5: [], // Friday
      6: [], // Saturday
    };

    events.forEach(event => {
      patterns[event.dayOfWeek].push(event);
    });

    // Sort events by time within each day
    Object.keys(patterns).forEach(dayKey => {
      const dayIndex = parseInt(dayKey);
      patterns[dayIndex].sort((a, b) => a.time.localeCompare(b.time));
    });

    return patterns;
  }

  /**
   * Clear the recurring events cache
   */
  static async clearCache(): Promise<void> {
    await db.delete(recurringEventsCache);
    console.log('Recurring events cache cleared');
  }

  /**
   * Check if the cache needs to be refreshed (older than 24 hours)
   */
  static async needsRefresh(): Promise<boolean> {
    const events = await db
      .select({ lastAnalyzed: recurringEventsCache.lastAnalyzed })
      .from(recurringEventsCache)
      .limit(1);

    if (events.length === 0) {
      return true; // No cache exists
    }

    const lastAnalyzed = events[0].lastAnalyzed;
    const now = new Date();
    const hoursSinceLastUpdate = (now.getTime() - lastAnalyzed.getTime()) / (1000 * 60 * 60);

    return hoursSinceLastUpdate > 24; // Refresh if older than 24 hours
  }
}
