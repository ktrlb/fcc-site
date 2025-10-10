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
    // Parse the Google service account credentials
    
    // The issue is that the private key contains literal newlines that break JSON parsing
    // We need to escape them properly for JSON parsing
    let credentials;
    
    // First, try to parse as-is
    try {
      credentials = JSON.parse(serviceAccountKey);
      // Direct JSON parse successful
    } catch (directError) {
      // Direct JSON parse failed, attempting to fix newline issues
      
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
        // Escaped newlines in private key
      }
      
      // Cleaned service account key for parsing
      
      credentials = JSON.parse(cleanedKey);
    }
    
    // Service account credentials validated
    
    // Create JWT auth client with proper configuration
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    // Get the auth client
    // Getting authentication client
    const authClient = await auth.getClient();
    // Auth client obtained successfully

    // Creating calendar API client
    // Create calendar API client
    const calendar = google.calendar({ version: 'v3', auth });

    // List available calendars first
    // Listing available calendars
    try {
      const calendarList = await calendar.calendarList.list();
      // Available calendars retrieved
      
      // If we have calendars, try to use the first one if the specified one fails
      if (calendarList.data.items && calendarList.data.items.length > 0) {
        const firstCalendar = calendarList.data.items[0];
        // Using first available calendar
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

    // Get events from the first of the current month to about 18 months out (should be around 500 events)
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
    const endOfNext18Months = new Date(now.getFullYear() + 1, now.getMonth() + 6, 31, 23, 59, 59); // 18 months from now

    console.log('Fetching events from calendar:', calendarId);
    console.log('Time range:', startOfCurrentMonth.toISOString(), 'to', endOfNext18Months.toISOString());
    console.log('Current date:', now.toISOString());
    console.log('End of 18 months date:', endOfNext18Months.toISOString());

    // Fetch events
    const requestParams = {
      calendarId: calendarId,
      timeMin: startOfCurrentMonth.toISOString(),
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
        // Reached maximum page limit (10), stopping pagination
        break;
      }
    } while (pageToken);

    const events = allEvents;
    

    // Transform events to our format
    const transformedEvents: CalendarEvent[] = events.map(event => {
      const isAllDay = !event.start?.dateTime;
      const start = event.start?.dateTime || event.start?.date;
      const end = event.end?.dateTime || event.end?.date;
      
      // Fix timezone issue for all-day events
      // Google Calendar returns all-day events as date strings (e.g., "2025-10-15")
      // When parsed by new Date(), they're treated as UTC midnight, which shows as previous day in Chicago
      // Solution: Append Chicago timezone offset to force correct local date
      let startDate: Date;
      let endDate: Date;
      
      if (isAllDay && start) {
        // For all-day events, append time to ensure correct date in Chicago timezone
        startDate = new Date(start + 'T00:00:00-05:00'); // Chicago is UTC-5 (CDT) or UTC-6 (CST)
        endDate = new Date((end || start) + 'T00:00:00-05:00');
      } else {
        startDate = new Date(start || '');
        endDate = new Date(end || '');
      }
      
      return {
        id: event.id || '',
        title: event.summary || 'No Title',
        start: startDate,
        end: endDate,
        description: event.description || undefined,
        location: event.location || undefined,
        allDay: isAllDay,
        recurring: !!event.recurrence?.length
      };
    });

    return transformedEvents;
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    throw error;
  }
}
