import { NextResponse } from 'next/server';
import { CalendarCacheService } from '@/lib/calendar-cache';
import { getMinistryTeams } from '@/lib/ministry-queries';
import { analyzeEvents } from '@/lib/event-analyzer';
import { db } from '@/lib/db';
import { calendarEvents, ministryTeams, specialEvents } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    // Check for forceRefresh parameter
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('forceRefresh') === 'true';
    const refreshType = searchParams.get('refreshType') as 'scheduled' | 'manual' | 'force' || 'scheduled';
    
    // Get environment variables
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;


    if (!calendarId || !serviceAccountKey) {
      
      // Return sample events if credentials not configured
      const sampleEvents = [
        {
          id: 'sample-1',
          title: 'Sunday Service',
          start: new Date(2025, 8, 15, 9, 0), // September 15, 2025, 9:00 AM
          end: new Date(2025, 8, 15, 10, 0),
          description: 'Weekly Sunday service',
          location: 'Main Sanctuary',
          allDay: false,
          recurring: true
        },
        {
          id: 'sample-2',
          title: 'Bible Study',
          start: new Date(2025, 8, 18, 19, 0), // September 18, 2025, 7:00 PM
          end: new Date(2025, 8, 18, 20, 0),
          description: 'Weekly Bible study group',
          location: 'Fellowship Hall',
          allDay: false,
          recurring: true
        },
        {
          id: 'sample-3',
          title: 'Church Board Meeting',
          start: new Date(2025, 8, 25, 18, 0), // September 25, 2025, 6:00 PM
          end: new Date(2025, 8, 25, 19, 30),
          description: 'Monthly board meeting',
          location: 'Conference Room',
          allDay: false,
          recurring: false
        }
      ];

      return NextResponse.json({ 
        events: sampleEvents.map(event => ({
          ...event,
          start: event.start.toISOString(),
          end: event.end.toISOString()
        }))
      });
    }

    // Fetch events from cache (which will refresh from Google Calendar if needed)
    let events;
    try {
      const actualRefreshType = forceRefresh ? (refreshType === 'manual' ? 'manual' : 'force') : 'scheduled';
      const cachedEvents = await CalendarCacheService.getCalendarEvents(forceRefresh, actualRefreshType);
      
      // Convert cached events to the format expected by the rest of the code
      events = cachedEvents.map(event => ({
        id: event.googleEventId,
        title: event.title,
        start: event.startTime,
        end: event.endTime,
        description: event.description,
        location: event.location,
        allDay: event.allDay,
        recurring: event.recurring,
      }));
      
      console.log(`Loaded ${events.length} events from calendar cache`);
    } catch (error) {
      console.error('Error loading events from cache:', error);
      throw error; // This will trigger the fallback to sample data
    }
    

    // If no events found, return sample data
    if (events.length === 0) {
      const sampleEvents = [
        {
          id: 'sample-1',
          title: 'Sunday Service',
          start: new Date(2025, 8, 15, 9, 0), // September 15, 2025, 9:00 AM
          end: new Date(2025, 8, 15, 10, 0),
          description: 'Weekly Sunday service',
          location: 'Main Sanctuary',
          allDay: false,
          recurring: true
        },
        {
          id: 'sample-2',
          title: 'Bible Study',
          start: new Date(2025, 8, 18, 19, 0), // September 18, 2025, 7:00 PM
          end: new Date(2025, 8, 18, 20, 0),
          description: 'Weekly Bible study group',
          location: 'Fellowship Hall',
          allDay: false,
          recurring: true
        },
        {
          id: 'sample-3',
          title: 'Church Board Meeting',
          start: new Date(2025, 8, 25, 18, 0), // September 25, 2025, 6:00 PM
          end: new Date(2025, 8, 25, 19, 30),
          description: 'Monthly board meeting',
          location: 'Conference Room',
          allDay: false,
          recurring: false
        }
      ];

      return NextResponse.json({ 
        events: sampleEvents.map(event => ({
          ...event,
          start: event.start.toISOString(),
          end: event.end.toISOString()
        }))
      });
    }

    // Get ministries for potential linking
    let ministries: Array<{ 
      id: string; 
      name: string; 
      description?: string;
      imageUrl?: string;
      contactPerson?: string;
      contactEmail?: string;
      contactPhone?: string;
    }> = [];
    try {
      const ministryData = await getMinistryTeams();
      ministries = (ministryData || []).map(ministry => ({
        id: ministry.id,
        name: ministry.name,
        description: ministry.description,
        imageUrl: ministry.imageUrl || ministry.graphicImage || undefined,
        contactPerson: ministry.contactPerson,
        contactEmail: ministry.contactEmail || undefined,
        contactPhone: ministry.contactPhone || undefined,
        categories: ministry.categories || undefined
      }));
    } catch (error) {
    }

    // Analyze events for ministry connections
    const analysis = analyzeEvents(events);
    
    
    // Get existing calendar event connections from database
    let calendarEventConnections: Array<{
      googleEventId: string;
      ministryTeamId?: string;
      specialEventId?: string;
      isSpecialEvent?: boolean;
      specialEventImage?: string;
      specialEventNote?: string;
      contactPerson?: string;
      ministryTeam?: {
        id: string;
        name: string;
        description?: string;
        imageUrl?: string;
        graphicImage?: string;
        contactPerson?: string;
        contactEmail?: string;
        contactPhone?: string;
        categories?: string[];
      };
      specialEvent?: {
        id: string;
        name: string;
        description?: string;
        imageUrl?: string;
        color?: string;
      };
    }> = [];
    
    try {
      // Directly query the database instead of making an HTTP fetch call
      const connections = await db
        .select({
          googleEventId: calendarEvents.googleEventId,
          ministryTeamId: calendarEvents.ministryTeamId,
          specialEventId: calendarEvents.specialEventId,
          isSpecialEvent: calendarEvents.isSpecialEvent,
          specialEventImage: calendarEvents.specialEventImage,
          specialEventNote: calendarEvents.specialEventNote,
          contactPerson: calendarEvents.contactPerson,
          ministryTeam: {
            id: ministryTeams.id,
            name: ministryTeams.name,
            description: ministryTeams.description,
            imageUrl: ministryTeams.imageUrl,
            graphicImage: ministryTeams.graphicImage,
            contactPerson: ministryTeams.contactPerson,
            contactEmail: ministryTeams.contactEmail,
            contactPhone: ministryTeams.contactPhone,
            categories: ministryTeams.categories,
          },
          specialEvent: {
            id: specialEvents.id,
            name: specialEvents.name,
            description: specialEvents.description,
            imageUrl: specialEvents.imageUrl,
            color: specialEvents.color,
          }
        })
        .from(calendarEvents)
        .leftJoin(ministryTeams, eq(calendarEvents.ministryTeamId, ministryTeams.id))
        .leftJoin(specialEvents, eq(calendarEvents.specialEventId, specialEvents.id))
        .where(eq(calendarEvents.isActive, true));

      calendarEventConnections = connections.filter(conn => conn.googleEventId !== null) as typeof calendarEventConnections;
      console.log('Loaded calendar connections directly from database:', calendarEventConnections.length);
      
      // Debug: Check if any connections have ministry data
      const connectionsWithMinistry = connections.filter(conn => conn.ministryTeam);
      console.log(`Connections with ministry data: ${connectionsWithMinistry.length}/${connections.length}`);
    } catch (error) {
      console.log('Error fetching connections from database:', error);
    }
    
    // Enhance events with only explicit database connections
    const enhancedEvents = events.map(event => {
      // Check if there's an existing database connection for this event
      const existingConnection = calendarEventConnections.find(conn => 
        conn.googleEventId === event.id
      );
      
      let ministryConnection = null;
      let matchedMinistry = null;
      let specialEventInfo = null;
      
      if (existingConnection) {
        console.log(`Found connection for event "${event.title}":`, {
          ministryTeamId: existingConnection.ministryTeamId,
          specialEventId: existingConnection.specialEventId,
          isSpecialEvent: existingConnection.isSpecialEvent
        });
        // Use only explicit database connections
        if (existingConnection.ministryTeam) {
          matchedMinistry = {
            ...existingConnection.ministryTeam,
            imageUrl: existingConnection.ministryTeam.imageUrl || existingConnection.ministryTeam.graphicImage
          };
          ministryConnection = 'ministry';
        }
        if (existingConnection.isSpecialEvent && (existingConnection.specialEventImage || existingConnection.specialEventNote || existingConnection.contactPerson)) {
          // Use direct special event fields from calendarEvents table
          specialEventInfo = {
            id: existingConnection.googleEventId, // Use googleEventId as a unique identifier
            name: event.title, // Use the event title as the name
            description: existingConnection.specialEventNote,
            imageUrl: existingConnection.specialEventImage,
            contactPerson: existingConnection.contactPerson
          };
          ministryConnection = 'special event';
        } else if (existingConnection.specialEvent) {
          // Fallback to special event types table (for future use)
          specialEventInfo = existingConnection.specialEvent;
          ministryConnection = 'special event';
        }
      }
      
      const enhancedEvent = {
        ...event,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        ministryConnection,
        ministryInfo: matchedMinistry,
        specialEventInfo
      };
      
      
      return enhancedEvent;
    });

    return NextResponse.json({ 
      events: enhancedEvents,
      analysis: {
        recurringEvents: analysis.recurringEvents,
        uniqueEvents: analysis.uniqueEvents,
        weeklyPatterns: analysis.weeklyPatterns,
        ministryBreakdown: analysis.ministryBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      hasServiceKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      serviceKeyLength: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.length
    });
    
    // If it's a Google Calendar API error, return sample data as fallback
    if (error instanceof Error && error.message.includes('unregistered callers')) {
      
      const sampleEvents = [
        {
          id: 'sample-1',
          title: 'Sunday Service',
          start: new Date(2025, 8, 15, 9, 0), // September 15, 2025, 9:00 AM
          end: new Date(2025, 8, 15, 10, 0),
          description: 'Weekly Sunday service',
          location: 'Main Sanctuary',
          allDay: false,
          recurring: true
        },
        {
          id: 'sample-2',
          title: 'Bible Study',
          start: new Date(2025, 8, 18, 19, 0), // September 18, 2025, 7:00 PM
          end: new Date(2025, 8, 18, 20, 0),
          description: 'Weekly Bible study group',
          location: 'Fellowship Hall',
          allDay: false,
          recurring: true
        },
        {
          id: 'sample-3',
          title: 'Church Board Meeting',
          start: new Date(2025, 8, 25, 18, 0), // September 25, 2025, 6:00 PM
          end: new Date(2025, 8, 25, 19, 30),
          description: 'Monthly board meeting',
          location: 'Conference Room',
          allDay: false,
          recurring: false
        }
      ];

      return NextResponse.json({ 
        events: sampleEvents.map(event => ({
          ...event,
          start: event.start.toISOString(),
          end: event.end.toISOString()
        }))
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch calendar events',
        message: 'Calendar service is temporarily unavailable. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}