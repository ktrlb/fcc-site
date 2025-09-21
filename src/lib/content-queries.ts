import { db } from './db';
import { sermonSeries, seasonalGuides, calendarEvents, calendarCache, specialEvents, ministryTeams } from './schema';
import { eq, and, desc } from 'drizzle-orm';

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
    // Fetch calendar events that are marked as featured special events
    // Join with cached calendar data to get the actual event details
    const events = await db
      .select({
        id: calendarEvents.id,
        googleEventId: calendarEvents.googleEventId,
        title: calendarCache.title,
        description: calendarCache.description,
        location: calendarCache.location,
        startTime: calendarCache.startTime,
        endTime: calendarCache.endTime,
        allDay: calendarCache.allDay,
        recurring: calendarCache.recurring,
        specialEventId: calendarEvents.specialEventId,
        specialEventName: specialEvents.name,
        specialEventColor: specialEvents.color,
        specialEventImage: calendarEvents.specialEventImage,
        contactPerson: calendarEvents.contactPerson,
        recurringDescription: calendarEvents.recurringDescription,
        endsBy: calendarEvents.endsBy,
        ministryTeamId: calendarEvents.ministryTeamId,
        ministryTeamName: ministryTeams.name,
        isSpecialEvent: calendarEvents.isSpecialEvent,
        specialEventNote: calendarEvents.specialEventNote,
        featuredOnHomePage: calendarEvents.featuredOnHomePage,
        isActive: calendarEvents.isActive,
      })
      .from(calendarEvents)
      .innerJoin(calendarCache, eq(calendarEvents.googleEventId, calendarCache.googleEventId))
      .leftJoin(specialEvents, eq(calendarEvents.specialEventId, specialEvents.id))
      .leftJoin(ministryTeams, eq(calendarEvents.ministryTeamId, ministryTeams.id))
      .where(
        and(
          eq(calendarEvents.isActive, true),
          eq(calendarEvents.featuredOnHomePage, true)
        )
      )
      .orderBy(desc(calendarCache.startTime));

    // Debug: Log all events before filtering
    console.log(`Found ${events.length} events marked as featuredOnHomePage`);

    // Filter events - for recurring events, show them if they're marked as featured
    // For non-recurring events, only show if they're in the future
    const now = new Date();
    const upcomingEvents = events.filter(event => {
      if (event.recurring) {
        // For recurring events marked as featured, show them unless they have an endsBy date that has passed
        if (event.endsBy) {
          return new Date(event.endsBy) >= now;
        }
        // No endsBy date means show indefinitely
        return true;
      } else {
        // For non-recurring events, only show if they're in the future
        return new Date(event.startTime) >= now;
      }
    });

    // Separate recurring and non-recurring events
    const recurringEvents = upcomingEvents.filter(event => event.recurring);
    const nonRecurringEvents = upcomingEvents.filter(event => !event.recurring);

    // Sort non-recurring events by start time and take the next ones
    const sortedNonRecurring = nonRecurringEvents.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    // For recurring events, create a summary with recurring pattern
    const recurringSummaries = recurringEvents.map(event => {
      // Use custom recurring description if provided, otherwise generate one
      const customDescription = event.recurringDescription;
      let displayTitle = event.title;
      
      if (customDescription) {
        displayTitle = `${event.title} - ${customDescription}`;
      } else {
        // Fallback to auto-generated description
        const eventDate = new Date(event.startTime);
        const month = eventDate.toLocaleDateString('en-US', { month: 'long' });
        const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
        displayTitle = `${event.title} - ${dayOfWeek}s in ${month}`;
      }
      
      return {
        ...event,
        displayTitle,
        isRecurring: true
      };
    });

    // Combine recurring summaries with upcoming non-recurring events
    // Prioritize non-recurring events (they're more time-sensitive)
    const allEvents = [...sortedNonRecurring, ...recurringSummaries];
    const nextFeaturedEvents = allEvents.slice(0, 4); // Take up to 4 events

    console.log(`Featured events to display: ${nextFeaturedEvents.length} of ${upcomingEvents.length} total upcoming events`);

    // Convert Date objects to strings and null values to undefined for the component
    return nextFeaturedEvents.map(event => ({
      ...event,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime.toISOString(),
      allDay: event.allDay ?? undefined,
      location: event.location ?? undefined,
      description: event.description ?? undefined,
      specialEventImage: event.specialEventImage ?? undefined,
      specialEventNote: event.specialEventNote ?? undefined,
      contactPerson: event.contactPerson ?? undefined,
      specialEventColor: event.specialEventColor ?? undefined,
      specialEventName: event.specialEventName ?? undefined,
      ministryTeamName: event.ministryTeamName ?? undefined,
      recurring: event.recurring ?? undefined,
      recurringDescription: event.recurringDescription ?? undefined,
      endsBy: event.endsBy ?? undefined,
      ministryTeamId: event.ministryTeamId ?? undefined,
      specialEventId: event.specialEventId ?? undefined,
      googleEventId: event.googleEventId ?? undefined,
    }));
  } catch (error) {
    console.error('Error fetching featured special events:', error);
    return [];
  }
}
