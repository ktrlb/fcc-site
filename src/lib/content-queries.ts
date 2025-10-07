import { db } from './db';
import { sermonSeries, seasonalGuides, calendarEvents, calendarCache, specialEventTypes, ministryTeams, featuredSpecialEvents } from './schema';
import { eq, and, desc, gte } from 'drizzle-orm';

// Sermon Series Queries
export async function getFeaturedSermonSeries() {
  try {
    const result = await db
      .select()
      .from(sermonSeries)
      .where(
        and(
          eq(sermonSeries.isFeatured, true),
          eq(sermonSeries.isActive, true)
        )
      )
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching featured sermon series:', error);
    return null;
  }
}

export async function getAllSermonSeries() {
  try {
    return await db
      .select()
      .from(sermonSeries)
      .where(eq(sermonSeries.isActive, true))
      .orderBy(sermonSeries.createdAt);
  } catch (error) {
    console.error('Error fetching sermon series:', error);
    return [];
  }
}

export async function createSermonSeries(data: {
  title: string;
  description?: string;
  imageUrl?: string;
  isFeatured?: boolean;
}) {
  try {
    const [newSeries] = await db
      .insert(sermonSeries)
      .values({
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        isFeatured: data.isFeatured || false,
      })
      .returning();
    
    return newSeries;
  } catch (error) {
    console.error('Error creating sermon series:', error);
    throw error;
  }
}

export async function updateSermonSeries(id: string, data: {
  title?: string;
  description?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}) {
  try {
    // If setting as featured, unfeature all other sermon series
    if (data.isFeatured === true) {
      await db
        .update(sermonSeries)
        .set({ isFeatured: false, updatedAt: new Date() })
        .where(eq(sermonSeries.isFeatured, true));
    }

    const [updatedSeries] = await db
      .update(sermonSeries)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(sermonSeries.id, id))
      .returning();
    
    return updatedSeries;
  } catch (error) {
    console.error('Error updating sermon series:', error);
    throw error;
  }
}

// Seasonal Guide Queries
export async function getFeaturedSeasonalGuide() {
  try {
    const result = await db
      .select()
      .from(seasonalGuides)
      .where(
        and(
          eq(seasonalGuides.isFeatured, true),
          eq(seasonalGuides.isActive, true)
        )
      )
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching featured seasonal guide:', error);
    return null;
  }
}

export async function getAllSeasonalGuides() {
  try {
    return await db
      .select()
      .from(seasonalGuides)
      .where(eq(seasonalGuides.isActive, true))
      .orderBy(seasonalGuides.createdAt);
  } catch (error) {
    console.error('Error fetching seasonal guides:', error);
    return [];
  }
}

export async function createSeasonalGuide(data: {
  title: string;
  description?: string;
  pdfUrl?: string;
  coverImageUrl?: string;
  isFeatured?: boolean;
}) {
  try {
    const [newGuide] = await db
      .insert(seasonalGuides)
      .values({
        title: data.title,
        description: data.description,
        pdfUrl: data.pdfUrl,
        coverImageUrl: data.coverImageUrl,
        isFeatured: data.isFeatured || false,
      })
      .returning();
    
    return newGuide;
  } catch (error) {
    console.error('Error creating seasonal guide:', error);
    throw error;
  }
}

export async function updateSeasonalGuide(id: string, data: {
  title?: string;
  description?: string;
  pdfUrl?: string;
  coverImageUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}) {
  try {
    // If setting as featured, unfeature all other seasonal guides
    if (data.isFeatured === true) {
      await db
        .update(seasonalGuides)
        .set({ isFeatured: false, updatedAt: new Date() })
        .where(eq(seasonalGuides.isFeatured, true));
    }

    const [updatedGuide] = await db
      .update(seasonalGuides)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(seasonalGuides.id, id))
      .returning();
    
    return updatedGuide;
  } catch (error) {
    console.error('Error updating seasonal guide:', error);
    throw error;
  }
}

// Featured Special Events Queries
export async function getFeaturedSpecialEvents() {
  try {
    // Get featured special events from calendar_events table
    const now = new Date();
    const allEventsQuery = await db
      .select({
        id: calendarEvents.id,
        googleEventId: calendarEvents.googleEventId,
        title: calendarEvents.title,
        description: calendarEvents.description,
        location: calendarEvents.location,
        // Get dates from both tables for fallback
        cacheStartTime: calendarCache.startTime,
        cacheEndTime: calendarCache.endTime,
        eventStartTime: calendarEvents.startTime,
        eventEndTime: calendarEvents.endTime,
        allDay: calendarEvents.allDay,
        recurring: calendarEvents.recurring,
        specialEventId: calendarEvents.specialEventId,
        ministryTeamId: calendarEvents.ministryTeamId,
        isSpecialEvent: calendarEvents.isSpecialEvent,
        isExternal: calendarEvents.isExternal,
        specialEventNote: calendarEvents.specialEventNote,
        specialEventImage: calendarEvents.specialEventImage,
        contactPerson: calendarEvents.contactPerson,
        recurringDescription: calendarEvents.recurringDescription,
        endsBy: calendarEvents.endsBy,
        seriesName: calendarEvents.seriesName,
        featuredOnHomePage: calendarEvents.featuredOnHomePage,
        isActive: calendarEvents.isActive,
      })
      .from(calendarEvents)
      .leftJoin(calendarCache, eq(calendarEvents.googleEventId, calendarCache.googleEventId))
      .where(
        and(
          eq(calendarEvents.isSpecialEvent, true),
          eq(calendarEvents.featuredOnHomePage, true),
          eq(calendarEvents.isActive, true),
          eq(calendarEvents.isExternal, false) // Don't show external events on public homepage
        )
      );
    
    const allEvents = allEventsQuery.map(e => ({
      ...e,
      // Use cache dates if available (more accurate), fallback to calendar_events dates
      startTime: e.cacheStartTime || e.eventStartTime,
      endTime: e.cacheEndTime || e.eventEndTime,
    }));
    
    // Filter based on endsBy date OR startTime if no endsBy is set
    const events = allEvents.filter(event => {
      if (event.endsBy) {
        // If endsBy is set, use that to determine if event should show
        return new Date(event.endsBy) >= now;
      } else {
        // Otherwise use startTime
        return new Date(event.startTime) >= now;
      }
    });

    // Group by seriesName
    const grouped = new Map<string, typeof events>();
    const individual: typeof events = [];
    
    events.forEach(event => {
      if (event.seriesName) {
        // Group events by series name
        if (!grouped.has(event.seriesName)) {
          grouped.set(event.seriesName, []);
        }
        grouped.get(event.seriesName)!.push(event);
      } else {
        // Individual events (no series)
        individual.push(event);
      }
    });
    
    // Sort events within each series by start time
    grouped.forEach((seriesEvents) => {
      seriesEvents.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });
    
    // Sort individual events by start time
    individual.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    // Format series items
    const seriesItems = Array.from(grouped.entries()).map(([seriesName, seriesEvents]) => ({
      id: seriesName, // Use series name as ID for homepage
      title: seriesEvents[0].title,
      description: seriesEvents[0].specialEventNote ?? undefined,
      location: seriesEvents[0].location ?? undefined,
      startTime: seriesEvents[0].startTime.toISOString(),
      endTime: seriesEvents[seriesEvents.length - 1].endTime.toISOString(),
      allDay: seriesEvents[0].allDay,
      specialEventImage: seriesEvents[0].specialEventImage ?? undefined,
      contactPerson: seriesEvents[0].contactPerson ?? undefined,
      specialEventNote: seriesEvents[0].specialEventNote ?? undefined,
      recurringDescription: seriesEvents[0].recurringDescription ?? undefined,
      displayTitle: `${seriesEvents[0].title}`, // Can add (${seriesEvents.length} sessions) if desired
      eventCount: seriesEvents.length,
    }));
    
    // Format individual items
    const individualItems = individual.map(event => ({
      id: event.id,
      title: event.title,
      description: event.specialEventNote ?? undefined,
      location: event.location ?? undefined,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime.toISOString(),
      allDay: event.allDay,
      specialEventImage: event.specialEventImage ?? undefined,
      contactPerson: event.contactPerson ?? undefined,
      specialEventNote: event.specialEventNote ?? undefined,
    }));
    
    // Combine and return first 3 items
    const allItems = [...seriesItems, ...individualItems]
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 3);
    
    return allItems;
  } catch (error) {
    console.error('Error fetching featured special events:', error);
    return [];
  }
}
