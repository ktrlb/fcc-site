export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  allDay: boolean;
  recurring?: boolean;
  ministryConnection?: string;
  ministryInfo?: {
    id: string;
    name: string;
    description?: string;
  };
  isSpecialEvent?: boolean;
  specialEventNote?: string;
  featuredOnHomePage?: boolean;
}

export interface RecurringEvent {
  title: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  time: string;
  location?: string;
  description?: string;
  frequency: 'weekly' | 'monthly' | 'custom';
  confidence: number; // 0-1, how confident we are this is recurring
  eventIds: string[]; // IDs of events that match this pattern
  ministryConnection?: string; // Link to ministry if detected
  // Add ministry and special event connection fields for persistent connections
  ministryTeamId?: string;
  specialEventId?: string;
  isSpecialEvent?: boolean;
  specialEventNote?: string;
  specialEventImage?: string;
  contactPerson?: string;
  recurringDescription?: string;
  endsBy?: Date;
  featuredOnHomePage?: boolean;
  isExternal?: boolean;
}

export interface EventAnalysis {
  recurringEvents: RecurringEvent[];
  uniqueEvents: CalendarEvent[];
  weeklyPatterns: { [dayOfWeek: number]: RecurringEvent[] };
  ministryBreakdown?: { [ministry: string]: number };
}

export function analyzeEvents(events: CalendarEvent[]): EventAnalysis {
  const recurringEvents: RecurringEvent[] = [];
  const uniqueEvents: CalendarEvent[] = [];
  const weeklyPatterns: { [dayOfWeek: number]: RecurringEvent[] } = {
    0: [], // Sunday
    1: [], // Monday
    2: [], // Tuesday
    3: [], // Wednesday
    4: [], // Thursday
    5: [], // Friday
    6: [], // Saturday
  };

  // Group events by title similarity and day of week (ignoring time for initial grouping)
  const eventGroups = new Map<string, CalendarEvent[]>();

  events.forEach(event => {
    // Get the event date and convert to Chicago timezone properly
    const eventDate = new Date(event.start);
    
    // Use Intl.DateTimeFormat to get Chicago timezone components
    const chicagoFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const timeParts = chicagoFormatter.formatToParts(eventDate);
    const time = `${timeParts.find(part => part.type === 'hour')?.value}:${timeParts.find(part => part.type === 'minute')?.value}`;
    
    // Get day of week using a separate formatter
    const dayFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      weekday: 'long'
    });
    const dayName = dayFormatter.format(eventDate);
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(dayName.toLowerCase());
    
    // Create a key for grouping similar events by title, day, and time
    const normalizedTitle = normalizeEventTitle(event.title);
    const key = `${dayOfWeek}-${time}-${normalizedTitle}`;
    
    if (!eventGroups.has(key)) {
      eventGroups.set(key, []);
    }
    eventGroups.get(key)!.push(event);
  });

  // Analyze each group to determine if it's recurring
  eventGroups.forEach((groupEvents, key) => {
    if (groupEvents.length >= 3) { // At least 3 occurrences to consider it recurring
      const firstEvent = groupEvents[0];
      const eventDate = new Date(firstEvent.start);
      
      // Use the same Chicago timezone conversion as the grouping key
      const chicagoFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      const timeParts = chicagoFormatter.formatToParts(eventDate);
      const time = `${timeParts.find(part => part.type === 'hour')?.value}:${timeParts.find(part => part.type === 'minute')?.value}`;
      
      // Get day of week using a separate formatter
      const dayFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        weekday: 'long'
      });
      const dayName = dayFormatter.format(eventDate);
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(dayName.toLowerCase());
      
      // Calculate confidence based on consistency
      const confidence = calculateConfidence(groupEvents);
      
      if (confidence > 0.7) { // High confidence threshold
        const recurringEvent: RecurringEvent = {
          title: firstEvent.title,
          dayOfWeek,
          time,
          location: firstEvent.location,
          description: firstEvent.description,
          frequency: 'weekly',
          confidence,
          eventIds: groupEvents.map(e => e.id),
          ministryConnection: detectMinistryConnection(firstEvent.title, firstEvent.description)
        };
        
        recurringEvents.push(recurringEvent);
        weeklyPatterns[dayOfWeek].push(recurringEvent);
      } else {
        // Add to unique events if not confident enough
        uniqueEvents.push(...groupEvents);
      }
    } else {
      // Not enough occurrences, add to unique events
      uniqueEvents.push(...groupEvents);
    }
  });

  // Generate ministry breakdown
  const ministryBreakdown: { [ministry: string]: number } = {};
  recurringEvents.forEach(event => {
    if (event.ministryConnection) {
      ministryBreakdown[event.ministryConnection] = (ministryBreakdown[event.ministryConnection] || 0) + 1;
    }
  });

  return {
    recurringEvents,
    uniqueEvents,
    weeklyPatterns,
    ministryBreakdown
  };
}

function normalizeEventTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .trim();
}

function calculateConfidence(events: CalendarEvent[]): number {
  if (events.length < 3) return 0;
  
  const dates = events.map(e => new Date(e.start)).sort();
  const intervals = [];
  
  // Calculate intervals between events
  for (let i = 1; i < dates.length; i++) {
    const interval = dates[i].getTime() - dates[i-1].getTime();
    intervals.push(interval);
  }
  
  // Check if intervals are consistent (around 7 days for weekly)
  const expectedInterval = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const tolerance = 2 * 24 * 60 * 60 * 1000; // 2 days tolerance
  
  const consistentIntervals = intervals.filter(interval => 
    Math.abs(interval - expectedInterval) < tolerance
  ).length;
  
  return consistentIntervals / intervals.length;
}

function detectMinistryConnection(title: string, description?: string): string | undefined {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  // Enhanced ministry keywords mapping
  const ministryKeywords = {
    'children': ['children', 'kids', 'childcare', 'nursery', 'sunday school', 'children\'s ministry', 'vbs', 'vacation bible school'],
    'youth': ['youth', 'teen', 'teenager', 'student', 'youth group', 'youth ministry', 'confirm', 'confirmation'],
    'worship': ['worship', 'service', 'sunday service', 'praise', 'music', 'choir', 'church service', 'morning service', 'evening service', 'sermon'],
    'prayer': ['prayer', 'pray', 'intercession', 'prayer meeting', 'prayer group'],
    'bible study': ['bible study', 'study', 'small group', 'life group', 'cell group', 'bible', 'scripture'],
    'fellowship': ['fellowship', 'potluck', 'dinner', 'lunch', 'coffee', 'fellowship hall', 'social', 'gathering'],
    'missions': ['mission', 'outreach', 'community', 'service', 'volunteer', 'serve', 'ministry'],
    'seniors': ['senior', 'elder', 'golden', 'mature', 'adult', 'older adult'],
    'men': ['men', 'brotherhood', 'men\'s', 'father', 'men\'s group'],
    'women': ['women', 'sisterhood', 'women\'s', 'mother', 'ladies', 'women\'s group'],
    'young adults': ['young adult', 'college', 'career', 'twenty', 'thirty'],
    'family': ['family', 'families', 'parent', 'marriage', 'couples'],
    'discipleship': ['discipleship', 'mentor', 'spiritual formation', 'growth'],
    'evangelism': ['evangelism', 'witness', 'share', 'invite', 'outreach'],
    'pastoral care': ['pastoral', 'care', 'visitation', 'hospital', 'counseling']
  };
  
  for (const [ministry, keywords] of Object.entries(ministryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return ministry;
    }
  }
  
  return undefined;
}

export function analyzeWorshipServices(events: CalendarEvent[]): {
  regularServices: CalendarEvent[];
  exceptions: CalendarEvent[];
  schedule: string;
} {
  // Filter for Sunday worship services using Chicago timezone
  const sundayEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    const dayFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      weekday: 'long'
    });
    const dayName = dayFormatter.format(eventDate);
    return dayName.toLowerCase() === 'sunday';
  });

  const worshipServices = sundayEvents.filter(event => {
    const title = event.title.toLowerCase();
    return title.includes('service') || 
           title.includes('worship') || 
           title.includes('sunday') ||
           (title.includes('church') && !title.includes('school'));
  });

  // Check for regular 9 AM and 11 AM services using Chicago timezone
  const regularServices = worshipServices.filter(event => {
    const eventDate = new Date(event.start);
    const chicagoFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const timeParts = chicagoFormatter.formatToParts(eventDate);
    const time = `${timeParts.find(part => part.type === 'hour')?.value}:${timeParts.find(part => part.type === 'minute')?.value}`;
    return time === '09:00' || time === '11:00';
  });

  // Find exceptions (different times or special services) using Chicago timezone
  const exceptions = worshipServices.filter(event => {
    const eventDate = new Date(event.start);
    const chicagoFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const timeParts = chicagoFormatter.formatToParts(eventDate);
    const time = `${timeParts.find(part => part.type === 'hour')?.value}:${timeParts.find(part => part.type === 'minute')?.value}`;
    const title = event.title.toLowerCase();
    return (time !== '09:00' && time !== '11:00') || 
           title.includes('special') ||
           title.includes('combined') ||
           title.includes('one service') ||
           title.includes('cancelled');
  });

  // Generate schedule description
  let schedule = 'Regular 9 AM & 11 AM services';
  if (exceptions.length > 0) {
    schedule += ' (see exceptions below)';
  }

  return {
    regularServices,
    exceptions,
    schedule
  };
}

export function getWeeklySchedule(recurringEvents: RecurringEvent[]): string[] {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const schedule: string[] = [];
  
  days.forEach((day, index) => {
    const dayEvents = recurringEvents.filter(event => event.dayOfWeek === index);
    if (dayEvents.length > 0) {
      const eventList = dayEvents
        .sort((a, b) => a.time.localeCompare(b.time))
        .map(event => `${event.time} - ${event.title}`)
        .join(', ');
      schedule.push(`${day}: ${eventList}`);
    } else {
      schedule.push(`${day}: No recurring events`);
    }
  });
  
  return schedule;
}
