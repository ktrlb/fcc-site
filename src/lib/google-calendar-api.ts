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
    
    // Parse the service account key
    const credentials = JSON.parse(serviceAccountKey);
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

    // Get first day of current month and 6 months from now
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(now.getMonth() + 6);

    console.log('Fetching events from calendar:', calendarId);
    console.log('Time range:', startOfCurrentMonth.toISOString(), 'to', sixMonthsFromNow.toISOString());

    // Fetch events
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: startOfCurrentMonth.toISOString(),
      timeMax: sixMonthsFromNow.toISOString(),
      singleEvents: true, // This expands recurring events
      orderBy: 'startTime',
    });

    console.log('Google Calendar API response status:', response.status);
    console.log('Number of events returned:', response.data.items?.length || 0);

    const events = response.data.items || [];

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
