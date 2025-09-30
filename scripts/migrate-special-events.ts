import { db } from '../src/lib/db';
import { calendarEvents, featuredSpecialEvents, specialEventTypes, ministryTeams } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';

async function migrateSpecialEvents() {
  console.log('🔄 Starting migration of special events to featuredSpecialEvents table...');

  try {
    // First, get all special events from calendarEvents
    const specialEvents = await db
      .select({
        id: calendarEvents.id,
        googleEventId: calendarEvents.googleEventId,
        title: calendarEvents.title,
        description: calendarEvents.description,
        location: calendarEvents.location,
        startTime: calendarEvents.startTime,
        endTime: calendarEvents.endTime,
        allDay: calendarEvents.allDay,
        specialEventNote: calendarEvents.specialEventNote,
        specialEventImage: calendarEvents.specialEventImage,
        contactPerson: calendarEvents.contactPerson,
        featuredOnHomePage: calendarEvents.featuredOnHomePage,
        specialEventId: calendarEvents.specialEventId,
        ministryTeamId: calendarEvents.ministryTeamId,
        recurringDescription: calendarEvents.recurringDescription,
        endsBy: calendarEvents.endsBy,
      })
      .from(calendarEvents)
      .where(
        and(
          eq(calendarEvents.isActive, true),
          eq(calendarEvents.isSpecialEvent, true)
        )
      );

    console.log(`📊 Found ${specialEvents.length} special events to migrate`);

    // Migrate each special event
    for (const event of specialEvents) {
      try {
        // Only migrate events that are featured on homepage or have special event properties
        if (event.featuredOnHomePage || event.specialEventNote || event.specialEventImage || event.contactPerson) {
          const newEvent = {
            title: event.title,
            description: event.description || null,
            location: event.location || null,
            startTime: event.startTime,
            endTime: event.endTime,
            allDay: event.allDay || false,
            specialEventImage: event.specialEventImage || null,
            contactPerson: event.contactPerson || null,
            specialEventNote: event.specialEventNote || null,
            specialEventTypeId: event.specialEventId || null,
            ministryTeamId: event.ministryTeamId || null,
            isActive: true,
            sortOrder: 0,
          };

          const result = await db.insert(featuredSpecialEvents).values(newEvent).returning();
          console.log(`✅ Migrated: ${event.title} (ID: ${result[0].id})`);
        } else {
          console.log(`⏭️  Skipped: ${event.title} (not featured and no special properties)`);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate ${event.title}:`, error);
      }
    }

    console.log('🎉 Migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
migrateSpecialEvents()
  .then(() => {
    console.log('Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
