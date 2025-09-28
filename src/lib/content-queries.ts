import { db } from './db';
import { sermonSeries, seasonalGuides, calendarEvents, calendarCache, specialEventTypes, ministryTeams, featuredSpecialEvents } from './schema';
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
    // Get featured special events from the dedicated table
    const events = await db
      .select({
        id: featuredSpecialEvents.id,
        title: featuredSpecialEvents.title,
        description: featuredSpecialEvents.description,
        location: featuredSpecialEvents.location,
        startTime: featuredSpecialEvents.startTime,
        endTime: featuredSpecialEvents.endTime,
        allDay: featuredSpecialEvents.allDay,
        specialEventImage: featuredSpecialEvents.specialEventImage,
        contactPerson: featuredSpecialEvents.contactPerson,
        specialEventNote: featuredSpecialEvents.specialEventNote,
        specialEventType: {
          id: specialEventTypes.id,
          name: specialEventTypes.name,
          color: specialEventTypes.color,
        },
        ministryTeam: {
          id: ministryTeams.id,
          name: ministryTeams.name,
        },
        isActive: featuredSpecialEvents.isActive,
        sortOrder: featuredSpecialEvents.sortOrder,
      })
      .from(featuredSpecialEvents)
      .leftJoin(specialEventTypes, eq(featuredSpecialEvents.specialEventTypeId, specialEventTypes.id))
      .leftJoin(ministryTeams, eq(featuredSpecialEvents.ministryTeamId, ministryTeams.id))
      .where(eq(featuredSpecialEvents.isActive, true))
      .orderBy(featuredSpecialEvents.startTime);

    // Filter events - only show future events
    const now = new Date();
    const futureEvents = events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= now;
    });

    // Convert Date objects to strings and return only the first 3 events
    return futureEvents.slice(0, 3).map(event => ({
      ...event,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime.toISOString(),
      description: event.description ?? undefined,
      location: event.location ?? undefined,
      specialEventImage: event.specialEventImage ?? undefined,
      specialEventNote: event.specialEventNote ?? undefined,
      contactPerson: event.contactPerson ?? undefined,
      specialEventType: event.specialEventType ? {
        ...event.specialEventType,
        color: event.specialEventType.color ?? undefined,
      } : undefined,
      ministryTeam: event.ministryTeam ?? undefined,
    }));
  } catch (error) {
    console.error('Error fetching featured special events:', error);
    return [];
  }
}
