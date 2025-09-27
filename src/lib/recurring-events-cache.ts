/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from './db';
import { recurringEventsCache } from './schema';
import { CalendarCacheService } from './calendar-cache';
import { analyzeEvents } from './event-analyzer';
import { desc, and, eq } from 'drizzle-orm';

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
  // Add ministry and special event connection fields
  ministryTeamId?: string;
  specialEventId?: string;
  isSpecialEvent?: boolean;
  specialEventNote?: string;
  specialEventImage?: string;
  contactPerson?: string;
  recurringDescription?: string;
  endsBy?: Date;
  featuredOnHomePage?: boolean;
  eventIds: string[];
  isExternal?: boolean;
  lastAnalyzed: Date;
}

export class RecurringEventsCacheService {
  /**
   * Get cached recurring events analysis for a specific month
   */
  static async getRecurringEvents(month?: number, year?: number): Promise<CachedRecurringEvent[]> {
    const now = new Date();
    const targetMonth = month ?? now.getMonth();
    const targetYear = year ?? now.getFullYear();

    const cachedEvents = await db
      .select()
      .from(recurringEventsCache)
      .where(
        and(
          eq(recurringEventsCache.month, targetMonth),
          eq(recurringEventsCache.year, targetYear)
        )
      )
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
      ministryTeamId: (event as any).ministryTeamId || undefined,
      specialEventId: (event as any).specialEventId || undefined,
      isSpecialEvent: (event as any).isSpecialEvent || false,
      specialEventNote: (event as any).specialEventNote || undefined,
      specialEventImage: (event as any).specialEventImage || undefined,
      contactPerson: (event as any).contactPerson || undefined,
      recurringDescription: (event as any).recurringDescription || undefined,
      endsBy: (event as any).endsBy || undefined,
      featuredOnHomePage: (event as any).featuredOnHomePage || false,
      eventIds: event.eventIds || [],
      isExternal: (event as any).isExternal || false,
      lastAnalyzed: event.lastAnalyzed,
    }));
  }

  /**
   * Refresh the recurring events cache by analyzing calendar events for multiple months
   */
  static async refreshRecurringEventsCache(): Promise<CachedRecurringEvent[]> {
    try {
      console.log('Analyzing calendar events for monthly recurring patterns...');
      
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

      // Group events by month and analyze each month separately
      const eventsByMonth = new Map<string, any[]>();
      
      eventsForAnalysis.forEach(event => {
        const eventDate = new Date(event.start);
        const monthKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}`;
        
        if (!eventsByMonth.has(monthKey)) {
          eventsByMonth.set(monthKey, []);
        }
        eventsByMonth.get(monthKey)!.push(event);
      });

      console.log(`Analyzing ${eventsByMonth.size} months of events`);

      // Clear existing recurring events cache
      await db.delete(recurringEventsCache);
      console.log('Cleared existing recurring events cache');

      // External series keys are computed upstream; keep empty set here
      const externalSeriesKeys = new Set<string>();

      // Process each month separately
      const allCachePromises: Promise<any>[] = [];
      
      for (const [monthKey, monthEvents] of eventsByMonth) {
        const [year, month] = monthKey.split('-').map(Number);
        
        // Analyze events for this month
        const analysis = analyzeEvents(monthEvents as any);
        
        console.log(`Month ${month + 1}/${year}: Found ${analysis.recurringEvents.length} recurring patterns`);
        
        if (analysis.recurringEvents.length > 0) {
          const monthCachePromises = analysis.recurringEvents.map(async (recurringEvent) => {
            const seriesKey = [
              (recurringEvent.title || '').trim(),
              recurringEvent.dayOfWeek,
              recurringEvent.time,
              (recurringEvent.location || '').trim(),
            ].join('|');
            const isExternal = externalSeriesKeys.has(seriesKey);
            
            // Look up ministry connections from calendar_events table
            let ministryConnection = recurringEvent.ministryConnection;
            let ministryTeamId = null;
            let specialEventId = null;
            let isSpecialEvent = false;
            let specialEventNote = null;
            let specialEventImage = null;
            let contactPerson = null;
            let recurringDescription = null;
            let endsBy = null;
            let featuredOnHomePage = false;

            // Try to find a matching calendar event with ministry connections
            if (recurringEvent.eventIds && recurringEvent.eventIds.length > 0) {
              try {
                const { calendarEvents } = await import('./schema');
                const { eq, or } = await import('drizzle-orm');
                
                const matchingEvent = await db
                  .select()
                  .from(calendarEvents)
                  .where(
                    or(
                      ...recurringEvent.eventIds.map(eventId => 
                        eq(calendarEvents.googleEventId, eventId)
                      )
                    )
                  )
                  .limit(1);

                if (matchingEvent.length > 0) {
                  const event = matchingEvent[0];
                  ministryTeamId = event.ministryTeamId;
                  specialEventId = event.specialEventId;
                  isSpecialEvent = event.isSpecialEvent || false;
                  specialEventNote = event.specialEventNote;
                  specialEventImage = event.specialEventImage;
                  contactPerson = event.contactPerson;
                  recurringDescription = event.recurringDescription;
                  endsBy = event.endsBy;
                  featuredOnHomePage = event.featuredOnHomePage || false;
                }
              } catch (error) {
                console.warn('Failed to lookup ministry connections for recurring event:', error);
              }
            }

            return db.insert(recurringEventsCache).values({
              title: recurringEvent.title,
              dayOfWeek: recurringEvent.dayOfWeek.toString(),
              time: recurringEvent.time,
              location: recurringEvent.location,
              description: recurringEvent.description,
              frequency: recurringEvent.frequency,
              confidence: recurringEvent.confidence.toString(),
              ministryConnection,
              ministryTeamId,
              specialEventId,
              isSpecialEvent,
              specialEventNote,
              specialEventImage,
              contactPerson,
              recurringDescription,
              endsBy,
              featuredOnHomePage,
              eventIds: recurringEvent.eventIds,
              isExternal,
              month,
              year,
              lastAnalyzed: new Date(),
            });
          });

          allCachePromises.push(...monthCachePromises);
        }
      }

      await Promise.all(allCachePromises);
      console.log(`Cached recurring event patterns for ${eventsByMonth.size} months`);

      // Return the cached events for current month
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
  static async getWeeklyPatterns(month?: number, year?: number): Promise<{ [dayOfWeek: number]: CachedRecurringEvent[] }> {
    const events = await this.getRecurringEvents(month, year);
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
