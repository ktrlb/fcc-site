import { NextResponse } from 'next/server';
import { getGoogleCalendarEvents } from '@/lib/google-calendar-api';
import { getMinistryTeams } from '@/lib/ministry-queries';
import { analyzeEvents } from '@/lib/event-analyzer';

export async function GET() {
  try {
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

    // Fetch events from Google Calendar API
    
    // Try with the specific calendar ID first
    let events;
    try {
      events = await getGoogleCalendarEvents(calendarId, serviceAccountKey);
    } catch (error) {
      try {
        events = await getGoogleCalendarEvents('primary', serviceAccountKey);
      } catch (error2) {
        throw error2; // This will trigger the fallback to sample data
      }
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
      const connectionsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/calendar/connections`);
      console.log('Connections API response status:', connectionsResponse.status);
      if (connectionsResponse.ok) {
        const connectionsData = await connectionsResponse.json();
        calendarEventConnections = connectionsData.connections || [];
        console.log('Loaded calendar connections:', calendarEventConnections.length);
      } else {
        console.log('Connections API failed:', connectionsResponse.status, connectionsResponse.statusText);
      }
    } catch (error) {
      console.log('Error fetching connections:', error);
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