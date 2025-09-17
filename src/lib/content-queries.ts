import { db } from './db';
import { sermonSeries, seasonalGuides } from './schema';
import { eq, and } from 'drizzle-orm';

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
