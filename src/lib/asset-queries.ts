import { db } from './db';
import { assets } from './schema';
import { eq, and } from 'drizzle-orm';

export async function getFeaturedAssets() {
  return await db
    .select()
    .from(assets)
    .where(
      and(
        eq(assets.isFeatured, true),
        eq(assets.isActive, true)
      )
    );
}

export async function getFeaturedSeasonalGuide() {
  try {
    const result = await db
      .select()
      .from(assets)
      .where(
        and(
          eq(assets.type, 'seasonal_guide'),
          eq(assets.isFeatured, true),
          eq(assets.isActive, true)
        )
      )
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching featured seasonal guide:', error);
    return null;
  }
}

export async function getFeaturedSeasonalGuideCover() {
  try {
    const result = await db
      .select()
      .from(assets)
      .where(
        and(
          eq(assets.type, 'seasonal_guide_cover'),
          eq(assets.isFeatured, true),
          eq(assets.isActive, true)
        )
      )
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching featured seasonal guide cover:', error);
    return null;
  }
}

export async function getFeaturedSermonSeriesImage() {
  try {
    // Check for new sermon_series_image type first, then fall back to old sermon_series type
    let result = await db
      .select()
      .from(assets)
      .where(
        and(
          eq(assets.type, 'sermon_series_image'),
          eq(assets.isFeatured, true),
          eq(assets.isActive, true)
        )
      )
      .limit(1);
    
    // If no new type found, check for old sermon_series type
    if (result.length === 0) {
      result = await db
        .select()
        .from(assets)
        .where(
          and(
            eq(assets.type, 'sermon_series'),
            eq(assets.isFeatured, true),
            eq(assets.isActive, true)
          )
        )
        .limit(1);
    }
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching featured sermon series image:', error);
    return null;
  }
}

export async function getFeaturedSermonSeriesDescription() {
  try {
    // Check for new sermon_series_description type first
    let result = await db
      .select()
      .from(assets)
      .where(
        and(
          eq(assets.type, 'sermon_series_description'),
          eq(assets.isFeatured, true),
          eq(assets.isActive, true)
        )
      )
      .limit(1);
    
    // If no new type found, check if old sermon_series has description
    if (result.length === 0) {
      result = await db
        .select()
        .from(assets)
        .where(
          and(
            eq(assets.type, 'sermon_series'),
            eq(assets.isFeatured, true),
            eq(assets.isActive, true)
          )
        )
        .limit(1);
      
      // Only return if it has a description
      if (result.length > 0 && !result[0].description) {
        result = [];
      }
    }
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching featured sermon series description:', error);
    return null;
  }
}

export async function getFeaturedSermonSeries() {
  const [image, description] = await Promise.all([
    getFeaturedSermonSeriesImage(),
    getFeaturedSermonSeriesDescription()
  ]);
  
  return { image, description };
}
