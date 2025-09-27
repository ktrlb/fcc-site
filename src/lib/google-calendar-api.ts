import { google } from 'googleapis';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  allDay: boolean;
  recurring?: boolean;
}

export async function getGoogleCalendarEvents(calendarId: string, serviceAccountKey: string) {
  try {
    console.log('Parsing service account key...');
    console.log('Service account key length:', serviceAccountKey.length);
    console.log('Service account key starts with:', serviceAccountKey.substring(0, 50));
    
    // Debug: Check character at position 167
    if (serviceAccountKey.length > 167) {
      const charAt167 = serviceAccountKey.charAt(167);
      console.log('Character at position 167:', JSON.stringify(charAt167), 'Code:', charAt167.charCodeAt(0));
      console.log('Context around position 167:', JSON.stringify(serviceAccountKey.substring(160, 175)));
    }
    
    // The issue is that the private key contains literal newlines that break JSON parsing
    // We need to escape them properly for JSON parsing
    let credentials;
    
    // First, try to parse as-is
    try {
      credentials = JSON.parse(serviceAccountKey);
      console.log('Direct JSON parse successful!');
    } catch (directError) {
      console.log('Direct JSON parse failed:', directError instanceof Error ? directError.message : 'Unknown error');
      
      // The private key contains literal newlines that need to be escaped for JSON
      // We need to replace literal newlines with escaped newlines in the private key field
      let cleanedKey = serviceAccountKey;
      
      // Find the private key field and escape its newlines
      const privateKeyMatch = cleanedKey.match(/"private_key":"([^"]+)"/);
      if (privateKeyMatch) {
        const privateKeyValue = privateKeyMatch[1];
        // Replace literal newlines with escaped newlines
        const escapedPrivateKey = privateKeyValue.replace(/\n/g, '\\n');
        cleanedKey = cleanedKey.replace(/"private_key":"[^"]+"/, `"private_key":"${escapedPrivateKey}"`);
        console.log('Escaped newlines in private key');
      }
      
      console.log('Cleaned service account key length:', cleanedKey.length);
      
      credentials = JSON.parse(cleanedKey);
    }
    
    console.log('Service account email:', credentials.client_email);
    console.log('Project ID:', credentials.project_id);
    console.log('Private key exists:', !!credentials.private_key);
    
    // Create JWT auth client with proper configuration
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    // Get the auth client
    console.log('Getting auth client...');
    const authClient = await auth.getClient();
    console.log('Auth client obtained successfully');

    console.log('Creating calendar API client...');
    // Create calendar API client
    const calendar = google.calendar({ version: 'v3', auth });

    // List available calendars first
    console.log('Listing available calendars...');
    try {
      const calendarList = await calendar.calendarList.list();
      console.log('Available calendars:', calendarList.data.items?.map(cal => ({ id: cal.id, summary: cal.summary })));
      
      // If we have calendars, try to use the first one if the specified one fails
      if (calendarList.data.items && calendarList.data.items.length > 0) {
        const firstCalendar = calendarList.data.items[0];
        console.log('Using first available calendar:', firstCalendar.id, firstCalendar.summary);
        // Update the calendarId to use the first available calendar
        calendarId = firstCalendar.id || calendarId;
      }
    } catch (listError) {
      console.error('Failed to list calendars:', listError);
    }

    // Test authentication by trying to get calendar metadata
    console.log('Testing authentication with calendar:', calendarId);
    try {
      const calendarInfo = await calendar.calendars.get({ calendarId: calendarId });
      console.log('Authentication successful! Calendar name:', calendarInfo.data.summary);
    } catch (authError) {
      console.error('Authentication failed:', authError);
      throw authError;
    }

    // Get events from today to about 18 months out (should be around 500 events)
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfNext18Months = new Date(now.getFullYear() + 1, now.getMonth() + 6, 31, 23, 59, 59); // 18 months from now

    console.log('Fetching events from calendar:', calendarId);
    console.log('Time range:', startOfToday.toISOString(), 'to', endOfNext18Months.toISOString());
    console.log('Current date:', now.toISOString());
    console.log('End of 18 months date:', endOfNext18Months.toISOString());

    // Fetch events
    const requestParams = {
      calendarId: calendarId,
      timeMin: startOfToday.toISOString(),
      timeMax: endOfNext18Months.toISOString(),
      singleEvents: true, // This expands recurring events
      orderBy: 'startTime',
      maxResults: 500, // Limit to 500 events for efficiency
    };
    
    console.log('Google Calendar API request parameters:', requestParams);
    
    // Fetch all events with pagination
    let allEvents: any[] = [];
    let pageToken: string | undefined = undefined;
    let pageCount = 0;
    
    do {
      pageCount++;
      console.log(`Fetching page ${pageCount}...`);
      
      const response: any = await calendar.events.list({
        ...requestParams,
        pageToken: pageToken
      });

      console.log(`Page ${pageCount} - Status:`, response.status);
      console.log(`Page ${pageCount} - Events returned:`, response.data.items?.length || 0);
      console.log(`Page ${pageCount} - Next page token:`, response.data.nextPageToken);

      if (response.data.items) {
        allEvents = allEvents.concat(response.data.items);
        console.log(`Total events so far: ${allEvents.length}`);
      }

      pageToken = response.data.nextPageToken || undefined;
      
      // Safety check to prevent infinite loops
      if (pageCount > 10) {
        console.log('Reached maximum page limit (10), stopping pagination');
        break;
      }
    } while (pageToken);

    console.log(`Fetched ${allEvents.length} events across ${pageCount} pages`);
    const events = allEvents;
    
    // Debug: Check the date range of events returned by Google Calendar
    if (events.length > 0) {
      const sortedEvents = events.sort((a, b) => {
        const aStart = a.start?.dateTime || a.start?.date;
        const bStart = b.start?.dateTime || b.start?.date;
        return new Date(aStart || '').getTime() - new Date(bStart || '').getTime();
      });
      
      const earliestEvent = sortedEvents[0];
      const latestEvent = sortedEvents[sortedEvents.length - 1];
      const earliestStart = earliestEvent.start?.dateTime || earliestEvent.start?.date;
      const latestStart = latestEvent.start?.dateTime || latestEvent.start?.date;
      
      console.log(`Google Calendar events date range: ${earliestStart} to ${latestStart}`);
      
      // Check specifically for events after November 9th, 2025
      const nov9_2025 = new Date('2025-11-09');
      const eventsAfterNov9 = events.filter(event => {
        const start = event.start?.dateTime || event.start?.date;
        return start && new Date(start) > nov9_2025;
      });
      
      console.log(`Events after Nov 9, 2025 from Google Calendar: ${eventsAfterNov9.length}`);
      if (eventsAfterNov9.length > 0) {
        console.log(`Latest events after Nov 9:`, eventsAfterNov9.slice(0, 3).map(e => ({
          title: e.summary,
          start: e.start?.dateTime || e.start?.date
        })));
      }
    }

    // Transform events to our format
    const transformedEvents: CalendarEvent[] = events.map(event => {
      const start = event.start?.dateTime || event.start?.date;
      const end = event.end?.dateTime || event.end?.date;
      
      return {
        id: event.id || '',
        title: event.summary || 'No Title',
        start: new Date(start || ''),
        end: new Date(end || ''),
        description: event.description || undefined,
        location: event.location || undefined,
        allDay: !event.start?.dateTime, // If no time, it's all day
        recurring: !!event.recurrence?.length
      };
    });

    return transformedEvents;
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    throw error;
  }
}
