'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, Users, Calendar, X, Settings, Star, Music, Mail, Phone, Baby, User2, BookOpen, Heart, Coffee, Globe } from 'lucide-react';
import { RecurringEvent, analyzeEvents, getWeeklySchedule, analyzeWorshipServices } from '@/lib/event-analyzer';
import { MinistryContactModal } from '@/components/ministry/ministry-contact-modal';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  allDay: boolean;
  recurring?: boolean;
  ministryConnection?: string;
  specialEventId?: string;
  ministryTeamId?: string;
  isExternal?: boolean;
  ministryInfo?: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    leaders?: Array<{
      id: string;
      memberId: string;
      role: string | null;
      isPrimary: boolean;
      member: {
        id: string;
        firstName: string;
        lastName: string;
        preferredName: string | null;
      } | null;
    }>;
  };
  specialEventInfo?: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    color?: string;
    contactPerson?: string;
  };
  isSpecialEvent?: boolean;
  specialEventNote?: string;
  specialEventImage?: string;
  contactPerson?: string;
  recurringDescription?: string;
  endsBy?: string;
  featuredOnHomePage?: boolean;
}

interface MiniCalendarProps {
  events: CalendarEvent[];
  isAdminMode?: boolean;
  onEventUpdated?: () => void;
  currentMonth: Date;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function MiniCalendar({ events, isAdminMode = false, onEventUpdated, currentMonth }: MiniCalendarProps) {
  const [analysis, setAnalysis] = useState<{
    recurringEvents: RecurringEvent[];
    uniqueEvents: CalendarEvent[];
    weeklyPatterns: { [dayOfWeek: number]: RecurringEvent[] };
  } | null>(null);
  const [worshipAnalysis, setWorshipAnalysis] = useState<{
    regularServices: CalendarEvent[];
    exceptions: CalendarEvent[];
    schedule: string;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [ministries, setMinistries] = useState<{
    id: string;
    name: string;
    description?: string;
  }[]>([]);
  const [specialEvents, setSpecialEvents] = useState<{
    id: string;
    name: string;
    description?: string;
    color?: string;
  }[]>([]);
  const [recurringPatterns, setRecurringPatterns] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile-sized
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 720);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Format time from HH:MM to HAM or H:MMAM/PM
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return minute > 0 ? `${displayHour}:${minutes}${ampm}` : `${displayHour}${ampm}`;
  };

  useEffect(() => {
    // Fetch recurring patterns for the current month from cache
    if (currentMonth) {
      const fetchRecurringPatterns = async () => {
        try {
          const month = currentMonth.getMonth();
          const year = currentMonth.getFullYear();
          
          const response = await fetch(`/api/recurring-events?month=${month}&year=${year}&includeExternal=${isAdminMode}`);
          if (response.ok) {
            const data = await response.json();
            const cachedEvents = data.recurringEvents || [];
            
            // Convert cached events to analysis format
            const analysisData = {
              recurringEvents: cachedEvents,
              uniqueEvents: [],
              weeklyPatterns: data.weeklyPatterns || {}
            };
            setAnalysis(analysisData);
            
            // Debug: Check for external events in the cache
            const externalEvents = cachedEvents.filter((e: any) => e.isExternal);
            if (externalEvents.length > 0) {
              console.log(`Found ${externalEvents.length} external events in cache`);
            }
            
            console.log(`Loaded ${cachedEvents.length} cached recurring patterns for ${currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
          } else {
            console.warn('Failed to fetch recurring patterns, falling back to live analysis');
            // Fallback to live analysis if cache fails
            if (events.length > 0) {
              const currentMonthEvents = events.filter(event => {
                const eventDate = new Date(event.start);
                const eventMonth = eventDate.getMonth();
                const eventYear = eventDate.getFullYear();
                const currentMonthNum = currentMonth.getMonth();
                const currentYear = currentMonth.getFullYear();
                return eventMonth === currentMonthNum && eventYear === currentYear;
              });

              const eventAnalysis = analyzeEvents(currentMonthEvents);
              setAnalysis(eventAnalysis);
            }
          }
        } catch (error) {
          console.error('Error fetching recurring patterns:', error);
        }
      };

      fetchRecurringPatterns();

      // Always analyze worship services for Sunday exceptions (use all events, not just current month)
      if (events.length > 0) {
        const worshipAnalysisResult = analyzeWorshipServices(events);
        setWorshipAnalysis(worshipAnalysisResult);
      }
    }
  }, [events, currentMonth]);

  useEffect(() => {
    if (isAdminMode) {
      fetchMinistries();
      fetchSpecialEvents();
    }
  }, [isAdminMode]);

  // Always load recurring patterns so both public and admin mini-calendars use the same connections
  useEffect(() => {
    fetchRecurringPatterns();
  }, []);

  const fetchMinistries = async () => {
    try {
      const response = await fetch('/api/ministries');
      if (response.ok) {
        const data = await response.json();
        setMinistries(data.ministries || []);
      }
    } catch (error) {
      console.error('Failed to fetch ministries:', error);
    }
  };

  const fetchSpecialEvents = async () => {
    try {
      const response = await fetch('/api/admin/special-events');
      if (response.ok) {
        const data = await response.json();
        setSpecialEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch special events:', error);
    }
  };

  const fetchRecurringPatterns = async () => {
    try {
      const res = await fetch(`/api/recurring-events?includeExternal=${isAdminMode}`);
      if (res.ok) {
        const data = await res.json();
        setRecurringPatterns(data.recurringEvents || []);
      }
    } catch (e) {
      console.error('Failed to fetch recurring events patterns:', e);
    }
  };

  // Helper function to get next occurrence date for recurring events
  const getNextOccurrenceDate = (dayOfWeek: number, timeHHmm: string): Date => {
    const now = new Date();
    // Start from today in America/Chicago, then move to requested day
    const chicagoNow = new Date(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
      }).format(now).replace(/(\d{2})\/(\d{2})\/(\d{4}),\s(\d{2}):(\d{2})/, '$3-$1-$2T$4:$5:00')
    );
    const chicagoDay = chicagoNow.getDay();
    const [hh, mm] = timeHHmm.split(':').map(Number);
    const delta = (dayOfWeek - chicagoDay + 7) % 7;
    chicagoNow.setDate(chicagoNow.getDate() + delta);
    chicagoNow.setHours(hh, mm, 0, 0);
    return chicagoNow;
  };

  const handleEventClick = async (recurringEvent: RecurringEvent) => {
    console.log('Mini-calendar recurring event clicked:', {
      title: recurringEvent.title,
      ministryTeamId: recurringEvent.ministryTeamId,
      specialEventId: recurringEvent.specialEventId,
      isSpecialEvent: recurringEvent.isSpecialEvent
    });

    // Try to enrich from cached recurring patterns (admin wants pattern-based linkage)
    const norm = (s?: string) => (s || '').trim().toLowerCase();
    const match = recurringPatterns.find((p: any) => {
      const titleEq = norm(p.title) === norm(recurringEvent.title);
      const dowEq = parseInt(p.dayOfWeek as string) === recurringEvent.dayOfWeek;
      const timeEq = norm(p.time) === norm(recurringEvent.time);
      const locA = norm(p.location);
      const locB = norm(recurringEvent.location);
      const locEq = locA === locB || !locA || !locB; // treat empty/undefined as equivalent
      return titleEq && dowEq && timeEq && locEq;
    }) || {};

    // Create a calendar event from the recurring event with stored connections
    const calendarEvent: CalendarEvent = {
      id: `${recurringEvent.title}-${recurringEvent.dayOfWeek}-${recurringEvent.time}`,
      title: recurringEvent.title,
      start: getNextOccurrenceDate(recurringEvent.dayOfWeek, recurringEvent.time),
      end: getNextOccurrenceDate(recurringEvent.dayOfWeek, recurringEvent.time),
      location: recurringEvent.location,
      allDay: false,
      recurring: true,
      ministryConnection: recurringEvent.ministryConnection,
      ministryTeamId: match.ministryTeamId ?? recurringEvent.ministryTeamId,
      specialEventId: match.specialEventId ?? recurringEvent.specialEventId,
      isSpecialEvent: (match.isSpecialEvent ?? recurringEvent.isSpecialEvent) || false,
      specialEventNote: match.specialEventNote ?? recurringEvent.specialEventNote,
      specialEventImage: match.specialEventImage ?? recurringEvent.specialEventImage,
      contactPerson: match.contactPerson ?? recurringEvent.contactPerson,
      recurringDescription: match.recurringDescription ?? recurringEvent.recurringDescription,
      endsBy: match.endsBy ?? recurringEvent.endsBy,
      featuredOnHomePage: (match.featuredOnHomePage ?? recurringEvent.featuredOnHomePage) || false,
      isExternal: (match.isExternal ?? recurringEvent.isExternal) || false,
    };

    // Set the event and open modal
    setSelectedEvent(calendarEvent);
    setIsModalOpen(true);

    // Fetch ministry and special event details if IDs are present
    let effectiveMinistryTeamId = calendarEvent.ministryTeamId;
    let effectiveSpecialEventId = calendarEvent.specialEventId;

    // Fallback: if IDs missing after cache match, query by pattern
    if (!effectiveMinistryTeamId && !effectiveSpecialEventId) {
      try {
        const body = {
          title: recurringEvent.title,
          dayOfWeek: recurringEvent.dayOfWeek,
          time: recurringEvent.time,
          location: recurringEvent.location || ''
        };
        const resp = await fetch('/api/calendar/events/by-recurring?includeExternal=true', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (resp.ok) {
          const data = await resp.json();
          effectiveMinistryTeamId = data?.event?.ministryTeamId || null;
          effectiveSpecialEventId = data?.event?.specialEventId || null;
          if (effectiveMinistryTeamId || effectiveSpecialEventId || typeof data?.event?.isExternal === 'boolean') {
            setSelectedEvent(prev => prev ? {
              ...prev,
              ministryTeamId: effectiveMinistryTeamId || undefined,
              specialEventId: effectiveSpecialEventId || undefined,
              isSpecialEvent: data?.event?.isSpecialEvent ?? prev.isSpecialEvent,
              isExternal: typeof data?.event?.isExternal === 'boolean' ? data.event.isExternal : prev.isExternal,
              specialEventNote: data?.event?.specialEventNote ?? prev.specialEventNote,
              specialEventImage: data?.event?.specialEventImage ?? prev.specialEventImage,
              contactPerson: data?.event?.contactPerson ?? prev.contactPerson,
              recurringDescription: data?.event?.recurringDescription ?? prev.recurringDescription,
              endsBy: data?.event?.endsBy ?? prev.endsBy,
              featuredOnHomePage: data?.event?.featuredOnHomePage ?? prev.featuredOnHomePage,
            } : prev);
          }
        }
      } catch (e) {
        console.error('Pattern lookup failed:', e);
      }
    }

    if (effectiveMinistryTeamId) {
      try {
        const teamRes = await fetch(`/api/ministries/${effectiveMinistryTeamId}`);
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          if (teamData.team) {
            setSelectedEvent((prev) => prev ? {
              ...prev,
              ministryInfo: {
                id: teamData.team.id,
                name: teamData.team.name,
                description: teamData.team.description,
                imageUrl: teamData.team.imageUrl,
                contactPerson: teamData.team.contactPerson,
                contactEmail: teamData.team.contactEmail,
                contactPhone: teamData.team.contactPhone,
                leaders: teamData.team.leaders || []
              }
            } : prev);
          }
        }
      } catch (e) {
        console.error('Failed to fetch ministry team info:', e);
      }
    }

    if (effectiveSpecialEventId) {
      try {
        const seRes = await fetch(`/api/special-events/${effectiveSpecialEventId}`);
        if (seRes.ok) {
          const seData = await seRes.json();
          if (seData.event) {
            setSelectedEvent((prev) => prev ? {
              ...prev,
              specialEventInfo: {
                id: seData.event.id,
                name: seData.event.name,
                description: seData.event.description,
                imageUrl: seData.event.imageUrl,
                color: seData.event.color,
                contactPerson: seData.event.contactPerson,
              }
            } : prev);
          }
        }
      } catch (e) {
        console.error('Failed to fetch special event info:', e);
      }
    }
  };

  const handleSaveEvent = async (eventData: Partial<CalendarEvent>) => {
    if (!selectedEvent) return;

    try {
      // Ensure ISO strings for API
      const startIso = new Date(selectedEvent.start as any).toISOString();
      const endIso = new Date(selectedEvent.end as any).toISOString();
      
      // Make API call to save the event data
      const createResponse = await fetch('/api/admin/calendar-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleEventId: selectedEvent.id, // Use Google Calendar ID as the identifier
          title: selectedEvent.title,
          description: selectedEvent.description,
          location: selectedEvent.location,
          startTime: startIso,
          endTime: endIso,
          allDay: selectedEvent.allDay,
          recurring: selectedEvent.recurring,
          specialEventId: eventData.specialEventId,
          ministryTeamId: eventData.ministryTeamId,
          isSpecialEvent: eventData.isSpecialEvent,
          isExternal: eventData.isExternal,
          specialEventNote: eventData.specialEventNote,
          specialEventImage: eventData.specialEventImage,
          contactPerson: eventData.contactPerson,
          recurringDescription: eventData.recurringDescription,
          endsBy: eventData.endsBy,
          featuredOnHomePage: eventData.featuredOnHomePage,
          // When toggling from mini calendar, also allow bulk applying to the series
          applyToSeries: true,
          seriesCriteria: (() => {
            // Derive Chicago time and day for matching
            const d = new Date(selectedEvent.start);
            const timeFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', hour12: false });
            const parts = timeFmt.formatToParts(d);
            const hh = parts.find(p => p.type === 'hour')?.value || '00';
            const mm = parts.find(p => p.type === 'minute')?.value || '00';
            const dayFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'long' });
            const dayName = dayFmt.format(d).toLowerCase();
            const dow = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].indexOf(dayName);
            return {
              title: selectedEvent.title,
              dayOfWeek: dow,
              time: `${hh}:${mm}`,
              location: selectedEvent.location || ''
            };
          })()
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error('Failed to save event:', errorData);
        if (errorData?.error) alert(`Failed to save: ${errorData.error}`);
        return;
      }

      const savedEvent = await createResponse.json();
      
      // Update current selection with persisted flags so reopening shows correct state
      setSelectedEvent(prev => prev ? { ...prev, isExternal: !!eventData.isExternal } : prev);
      
      // Refresh the analysis data to pick up the changes
      await fetchRecurringPatterns();
      
      // Close the modal and refresh
      setIsModalOpen(false);
      setSelectedEvent(null);
      onEventUpdated?.();
      console.log('Saved recurring event from mini calendar:', savedEvent);
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  if (!analysis || analysis.recurringEvents.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Analyzing events to identify weekly patterns...
          </p>
        </CardContent>
      </Card>
    );
  }

  const getEventColor = (event: RecurringEvent): string => {
    const colors = {
      'worship': 'bg-blue-100 text-blue-800 border-blue-200',
      'children': 'bg-green-100 text-green-800 border-green-200',
      'youth': 'bg-purple-100 text-purple-800 border-purple-200',
      'bible study': 'bg-orange-100 text-orange-800 border-orange-200',
      'prayer': 'bg-red-100 text-red-800 border-red-200',
      'fellowship': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'missions': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'special': 'bg-pink-100 text-pink-800 border-pink-200',
      'external': 'bg-stone-200 text-stone-600 border-stone-300',
      'default': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    // External groups should be visibly greyed in admin mini calendar
    if ((event as any).isExternal) {
      return colors.external;
    }

    // Check if it's a special event first
    if (event.isSpecialEvent) {
      return colors.special;
    }
    
    // Then check ministry connection
    return colors[event.ministryConnection as keyof typeof colors] || colors.default;
  };

  const getMinistryIcon = (ministry?: string) => {
    switch (ministry) {
      case 'children': return <Baby className="inline h-4 w-4" />;
      case 'youth': return <User2 className="inline h-4 w-4" />;
      case 'worship': return <Music className="inline h-4 w-4" />;
      case 'bible study': return <BookOpen className="inline h-4 w-4" />;
      case 'prayer': return <Heart className="inline h-4 w-4" />;
      case 'fellowship': return <Coffee className="inline h-4 w-4" />;
      case 'missions': return <Globe className="inline h-4 w-4" />;
      default: return <Calendar className="inline h-4 w-4" />;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Weekly Recurring Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Weekly Grid - Taller to show all events */}
          <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-7'}`}>
            {DAYS.map((day, index) => {
              const dayEvents = analysis.weeklyPatterns[index] || [];
              // Hide external groups on public mini calendar; show in admin
              const visibleDayEvents = (dayEvents as RecurringEvent[]).filter((e) => {
                const isExternal = (e as any).isExternal;
                return isAdminMode || !isExternal;
              });
              const hasEvents = visibleDayEvents.length > 0;
              const isSunday = index === 0;
              
              // Cycle through our signature colors for day headers
              const colorSchemes = [
                { bg: 'rgb(220 38 38)', name: 'red-600' },      // Sunday - Red
                { bg: 'rgb(17 94 89)', name: 'teal-800' },      // Monday - Teal
                { bg: 'rgb(49 46 129)', name: 'indigo-900' },   // Tuesday - Indigo
                { bg: 'rgb(245 158 11)', name: 'amber-500' },   // Wednesday - Amber
                { bg: 'rgb(77 124 15)', name: 'lime-700' },     // Thursday - Lime
                { bg: 'rgb(113 78 145)', name: 'purple' },      // Friday - Purple
                { bg: 'rgb(220 38 38)', name: 'red-600' }       // Saturday - Red
              ];
              const colorScheme = colorSchemes[index];
              
              return (
                <div
                  key={day}
                  className="p-3 rounded-lg transition-all min-h-[120px] md:min-h-[200px]"
                  style={{ backgroundColor: colorScheme.bg }}
                >
                  <div className="text-base font-semibold text-white mb-3 text-center">
                    {day}
                    {isSunday && (
                      <div className="text-sm text-white font-normal mt-1">
                        <Music className="inline h-4 w-4 mr-1" /> Worship Services
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {isSunday ? (
                      <>
                        {/* Standard Sunday Schedule */}
                        <div className="space-y-1">
                          <div className="p-2 rounded bg-white text-base">
                            <span className="font-bold text-base" style={{ color: colorScheme.bg }}>9am Worship</span>
                          </div>
                          
                          <div className="p-2 rounded bg-white text-base">
                            <span className="font-bold text-base" style={{ color: colorScheme.bg }}>10am Sunday School</span>
                          </div>
                          
                          <div className="p-2 rounded bg-white text-base">
                            <span className="font-bold text-base" style={{ color: colorScheme.bg }}>11am Worship</span>
                          </div>
                        </div>
                        
                        {/* Worship Service Exceptions */}
                        {worshipAnalysis && worshipAnalysis.exceptions.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/30">
                            <div className="text-sm font-medium mb-1 text-white">Exceptions:</div>
                            <div className="space-y-1">
                              {worshipAnalysis.exceptions
                                .filter((event: CalendarEvent) => {
                                  // Only show future exceptions
                                  const eventDate = new Date(event.start);
                                  const now = new Date();
                                  return eventDate > now;
                                })
                                .sort((a: CalendarEvent, b: CalendarEvent) => new Date(a.start).getTime() - new Date(b.start).getTime())
                                .slice(0, 3) // Show only the next 3 exceptions
                                .map((event: CalendarEvent, eventIndex: number) => {
                                  const isExternal = event.isExternal;
                                  const textColor = isAdminMode && isExternal ? '#6b7280' : colorScheme.bg;
                                  
                                  return (
                                    <div
                                      key={eventIndex}
                                      className="p-2 rounded text-base cursor-pointer hover:shadow-sm transition-shadow"
                                      style={{
                                        backgroundColor: isAdminMode && isExternal ? '#f3f4f6' : 'white'
                                      }}
                                      onClick={() => {
                                        setSelectedEvent(event);
                                        setIsModalOpen(true);
                                      }}
                                    >
                                      <div className="space-y-1">
                                        <div className="text-sm font-mono" style={{ color: textColor }}>
                                          {new Date(event.start).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            timeZone: 'America/Chicago'
                                          })}
                                        </div>
                                        <div className="font-bold text-base break-words" style={{ color: textColor }}>
                                          {event.title}
                                          {isAdminMode && isExternal && (
                                            <span className="ml-2 text-xs font-normal opacity-75">(External)</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </>
                    ) : hasEvents ? (
                      visibleDayEvents
                        .sort((a: RecurringEvent, b: RecurringEvent) => a.time.localeCompare(b.time))
                        .map((event: RecurringEvent, eventIndex: number) => {
                          const isExternal = (event as any).isExternal;
                          const eventStyle = isAdminMode && isExternal ? {
                            backgroundColor: '#f3f4f6', // grey-100
                            color: '#6b7280', // grey-500
                            border: '1px solid #d1d5db' // grey-300
                          } : {};
                          const textColor = isAdminMode && isExternal ? '#6b7280' : colorScheme.bg;
                          
                          return (
                            <div
                              key={eventIndex}
                              className="p-2 rounded text-base cursor-pointer hover:shadow-sm transition-shadow"
                              style={{
                                backgroundColor: isAdminMode && isExternal ? '#f3f4f6' : 'white',
                                ...eventStyle
                              }}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-mono" style={{ color: textColor }}>{formatTime(event.time)}</div>
                                <div className="font-bold text-base break-words" style={{ color: textColor }}>
                                  {event.title}
                                  {isAdminMode && isExternal && (
                                    <span className="ml-2 text-xs font-normal opacity-75">(External)</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-center text-white text-sm py-4">
                        No recurring events
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Removed Ministry Connections Summary and toggle */}
        </div>
      </CardContent>
      
      {/* Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={isAdminMode ? "max-w-2xl max-h-[90vh] overflow-y-auto" : "max-w-md max-h-[90vh] overflow-y-auto"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-900 font-serif">
              {isAdminMode ? (
                <>
                  <Settings className="h-5 w-5" />
                  Event Admin Settings
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5" />
                  Event Details
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {/* Accessible description for dialog content to satisfy aria-describedby */}
          <p className="sr-only" id="mini-calendar-dialog-description">
            Edit event settings and connections for the selected recurring event.
          </p>
          
          {selectedEvent && (
            isAdminMode ? (
              <AdminEventEditForm
                event={selectedEvent}
                ministries={ministries}
                specialEvents={specialEvents}
                onSave={handleSaveEvent}
                onCancel={() => setIsModalOpen(false)}
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-stone-700">{selectedEvent.title}</h3>
                </div>
                
                <div className="space-y-2">
                  {/* Check if this is a recurring event */}
                  {(() => {
                    const eventDate = new Date(selectedEvent.start);
                    const dayOfWeek = eventDate.getDay();
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    
                    // Check if this event appears in our recurring events analysis
                    const chicagoFormatter = new Intl.DateTimeFormat('en-US', {
                      timeZone: 'America/Chicago',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    });
                    
                    const timeParts = chicagoFormatter.formatToParts(eventDate);
                    const chicagoTime = `${timeParts.find(part => part.type === 'hour')?.value}:${timeParts.find(part => part.type === 'minute')?.value}`;
                    
                    // Get day of week using a separate formatter
                    const dayFormatter = new Intl.DateTimeFormat('en-US', {
                      timeZone: 'America/Chicago',
                      weekday: 'long'
                    });
                    const dayName = dayFormatter.format(eventDate);
                    const chicagoDayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(dayName.toLowerCase());
                    
                    const isRecurring = analysis?.recurringEvents?.some((recurring: RecurringEvent) => 
                      recurring.title === selectedEvent.title && 
                      recurring.dayOfWeek === chicagoDayOfWeek &&
                      recurring.time === chicagoTime
                    );
                    
                    if (isRecurring) {
                      return (
                        <div className="flex items-center gap-2 text-stone-700">
                          <Calendar className="h-4 w-4" />
                          <span className="text-base">
                            Every {days[dayOfWeek]} at {new Date(selectedEvent.start).toLocaleTimeString('en-US', {
                              timeZone: 'America/Chicago',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        </div>
                      );
                    } else {
                      return (
                        <>
                          <div className="flex items-center gap-2 text-stone-700">
                            <Clock className="h-4 w-4" />
                            <span className="text-base">
                              {new Date(selectedEvent.start).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                timeZone: 'America/Chicago'
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-stone-700">
                            <Clock className="h-4 w-4" />
                            <span className="text-base">
                              {new Date(selectedEvent.start).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                                timeZone: 'America/Chicago'
                              })} - {new Date(selectedEvent.end).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                                timeZone: 'America/Chicago'
                              })}
                            </span>
                          </div>
                        </>
                      );
                    }
                  })()}
                  
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 text-stone-700">
                      <MapPin className="h-4 w-4" />
                      <span className="text-base">{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
                
                
                {(selectedEvent.ministryInfo || selectedEvent.specialEventInfo || selectedEvent.specialEventNote || selectedEvent.specialEventImage) && (
                  <div className="pt-4 border-t border-indigo-200">
                    
                    {selectedEvent.ministryInfo && (
                      <div className="p-4 rounded-lg" style={{ 
                        backgroundColor: (() => {
                          const eventDate = new Date(selectedEvent.start);
                          const dayOfWeek = eventDate.getDay();
                          const colorSchemes = [
                            'rgb(220 38 38)',      // Sunday - Red
                            'rgb(17 94 89)',       // Monday - Teal
                            'rgb(49 46 129)',      // Tuesday - Indigo
                            'rgb(245 158 11)',     // Wednesday - Amber
                            'rgb(77 124 15)',      // Thursday - Lime
                            'rgb(113 78 145)',     // Friday - Purple
                            'rgb(220 38 38)'       // Saturday - Red
                          ];
                          return colorSchemes[dayOfWeek];
                        })()
                      }}>
                        {selectedEvent.ministryInfo.imageUrl && (
                          <div className="mb-3 -mx-4 -mt-4">
                            <img
                              src={selectedEvent.ministryInfo.imageUrl}
                              alt={selectedEvent.ministryInfo.name}
                              className="w-full aspect-[1200/630] object-cover rounded-t-lg"
                            />
                          </div>
                        )}
                        {selectedEvent.ministryInfo.description && (
                          <p className="text-base text-white mb-3">{selectedEvent.ministryInfo.description}</p>
                        )}
                        {selectedEvent.ministryInfo.contactPerson && (
                          <div className="flex items-center gap-2 text-base text-white">
                            <Users className="h-4 w-4" />
                            <span>Contact: {selectedEvent.ministryInfo.contactPerson}</span>
                          </div>
                        )}
                        {selectedEvent.ministryInfo.contactEmail && (
                          <div className="flex items-center gap-2 text-base text-white mt-1">
                            <Mail className="h-3 w-3" />
                            <span>{selectedEvent.ministryInfo.contactEmail}</span>
                          </div>
                        )}
                        {selectedEvent.ministryInfo.contactPhone && (
                          <div className="flex items-center gap-2 text-base text-white mt-1">
                            <Phone className="h-3 w-3" />
                            <span>{selectedEvent.ministryInfo.contactPhone}</span>
                          </div>
                        )}
                        <Button 
                          onClick={() => setContactModalOpen(true)}
                          className="mt-4 w-full bg-white hover:bg-white/10 border border-white transition-colors whitespace-normal h-auto py-2"
                          style={{ 
                            color: (() => {
                              const eventDate = new Date(selectedEvent.start);
                              const dayOfWeek = eventDate.getDay();
                              const colorSchemes = [
                                'rgb(220 38 38)',      // Sunday - Red
                                'rgb(17 94 89)',       // Monday - Teal
                                'rgb(49 46 129)',      // Tuesday - Indigo
                                'rgb(245 158 11)',     // Wednesday - Amber
                                'rgb(77 124 15)',      // Thursday - Lime
                                'rgb(113 78 145)',     // Friday - Purple
                                'rgb(220 38 38)'       // Saturday - Red
                              ];
                              return colorSchemes[dayOfWeek];
                            })()
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          {(() => {
                            const leaders = selectedEvent.ministryInfo.leaders || [];
                            if (leaders.length === 0) {
                              return 'Questions? Contact Ministry';
                            }
                            
                            const leaderNames = leaders
                              .filter(l => l.member)
                              .map(l => {
                                const firstName = l.member!.preferredName || l.member!.firstName;
                                const lastName = l.member!.lastName;
                                return `${firstName} ${lastName}`;
                              });
                            
                            if (leaderNames.length === 0) {
                              return 'Questions? Contact Ministry';
                            } else if (leaderNames.length === 1) {
                              return `Questions? Contact ${leaderNames[0]}`;
                            } else if (leaderNames.length === 2) {
                              return `Questions? Contact ${leaderNames[0]} & ${leaderNames[1]}`;
                            } else {
                              return `Questions? Contact ${leaderNames.slice(0, -1).join(', ')} & ${leaderNames[leaderNames.length - 1]}`;
                            }
                          })()}
                        </Button>
                      </div>
                    )}
                    
                    {selectedEvent.specialEventInfo && (
                      <div className="p-4 rounded-lg" style={{ 
                        backgroundColor: (() => {
                          const eventDate = new Date(selectedEvent.start);
                          const dayOfWeek = eventDate.getDay();
                          const colorSchemes = [
                            'rgb(220 38 38)',      // Sunday - Red
                            'rgb(17 94 89)',       // Monday - Teal
                            'rgb(49 46 129)',      // Tuesday - Indigo
                            'rgb(245 158 11)',     // Wednesday - Amber
                            'rgb(77 124 15)',      // Thursday - Lime
                            'rgb(113 78 145)',     // Friday - Purple
                            'rgb(220 38 38)'       // Saturday - Red
                          ];
                          return colorSchemes[dayOfWeek];
                        })()
                      }}>
                        {selectedEvent.specialEventInfo.imageUrl && (
                          <div className="mb-3 -mx-4 -mt-4">
                            <img
                              src={selectedEvent.specialEventInfo.imageUrl}
                              alt={selectedEvent.specialEventInfo.name}
                              className="w-full aspect-[1200/630] object-cover rounded-t-lg"
                            />
                          </div>
                        )}
                        {selectedEvent.specialEventInfo.description && (
                          <p className="text-base text-white mb-3">{selectedEvent.specialEventInfo.description}</p>
                        )}
                        {selectedEvent.specialEventInfo.contactPerson && (
                          <div className="flex items-center gap-2 text-base text-white">
                            <Users className="h-4 w-4" />
                            <span>Contact: {selectedEvent.specialEventInfo.contactPerson}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fallback render for special event data saved on the event (no specialEventInfo object) */}
                    {!selectedEvent.specialEventInfo && (selectedEvent.specialEventImage || selectedEvent.specialEventNote) && (
                      <div className="p-4 rounded-lg" style={{ 
                        backgroundColor: (() => {
                          const eventDate = new Date(selectedEvent.start);
                          const dayOfWeek = eventDate.getDay();
                          const colorSchemes = [
                            'rgb(220 38 38)',      // Sunday - Red
                            'rgb(17 94 89)',       // Monday - Teal
                            'rgb(49 46 129)',      // Tuesday - Indigo
                            'rgb(245 158 11)',     // Wednesday - Amber
                            'rgb(77 124 15)',      // Thursday - Lime
                            'rgb(113 78 145)',     // Friday - Purple
                            'rgb(220 38 38)'       // Saturday - Red
                          ];
                          return colorSchemes[dayOfWeek];
                        })()
                      }}>
                        {selectedEvent.specialEventImage && (
                          <div className="mb-3 -mx-4 -mt-4">
                            <img
                              src={selectedEvent.specialEventImage}
                              alt={selectedEvent.title}
                              className="w-full aspect-[1200/630] object-cover rounded-t-lg"
                            />
                          </div>
                        )}
                        {selectedEvent.specialEventNote && (
                          <p className="text-base text-white mb-3">{selectedEvent.specialEventNote}</p>
                        )}
                        {selectedEvent.contactPerson && (
                          <div className="flex items-center gap-2 text-base text-white">
                            <Users className="h-4 w-4" />
                            <span>Contact: {selectedEvent.contactPerson}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end pt-4 border-t border-stone-200">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center gap-2 border-stone-300 text-stone-700 hover:bg-stone-50"
                  >
                    <X className="h-4 w-4" />
                    Close
                  </Button>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>

      {/* Ministry Contact Modal */}
      {selectedEvent?.ministryInfo && (
        <MinistryContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          ministryName={selectedEvent.ministryInfo.name}
          ministryId={selectedEvent.ministryInfo.id}
          leaders={selectedEvent.ministryInfo.leaders || []}
        />
      )}
    </Card>
  );
}

interface AdminEventEditFormProps {
  event: CalendarEvent;
  ministries: Array<{ id: string; name: string; description?: string }>;
  specialEvents: Array<{ id: string; name: string; description?: string; color?: string }>;
  onSave: (data: Partial<CalendarEvent>) => void;
  onCancel: () => void;
}

function AdminEventEditForm({ event, ministries, specialEvents, onSave, onCancel }: AdminEventEditFormProps) {
  const [formData, setFormData] = useState({
    specialEventId: event.specialEventId || 'none',
    ministryTeamId: event.ministryTeamId || 'none',
    isSpecialEvent: event.isSpecialEvent || false,
    isExternal: event.isExternal || false,
    specialEventNote: event.specialEventNote || '',
    featuredOnHomePage: event.featuredOnHomePage || false,
    specialEventImage: event.specialEventImage || '',
    contactPerson: event.contactPerson || '',
    recurringDescription: event.recurringDescription || '',
    endsBy: event.endsBy || '',
  });

  // Update form data when event changes (when saved connections are loaded)
  useEffect(() => {
    setFormData({
      specialEventId: event.specialEventId || 'none',
      ministryTeamId: event.ministryTeamId || 'none',
      isSpecialEvent: event.isSpecialEvent || false,
      isExternal: event.isExternal || false,
      specialEventNote: event.specialEventNote || '',
      featuredOnHomePage: event.featuredOnHomePage || false,
      specialEventImage: event.specialEventImage || '',
      contactPerson: event.contactPerson || '',
      recurringDescription: event.recurringDescription || '',
      endsBy: event.endsBy || '',
    });
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert "none" values back to empty strings for saving
    const saveData = {
      ...formData,
      specialEventId: formData.specialEventId === 'none' ? undefined : formData.specialEventId,
      ministryTeamId: formData.ministryTeamId === 'none' ? undefined : formData.ministryTeamId,
    };
    onSave(saveData);
  };

  return (
    <div className="space-y-6">
      {/* Event Info Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{event.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-base text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(event.start).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'America/Chicago'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(event.start).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'America/Chicago'
              })} - {new Date(event.end).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'America/Chicago'
              })}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        {event.description && (
          <div className="mt-2 text-base text-gray-600">
            <strong>Description:</strong> {event.description}
          </div>
        )}
      </div>

      {/* Admin Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="specialEventId">Special Event Type</Label>
            <Select 
              value={formData.specialEventId} 
              onValueChange={(value) => setFormData({ ...formData, specialEventId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select special event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {specialEvents
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(specialEvent => (
                    <SelectItem key={specialEvent.id} value={specialEvent.id}>
                      <div className="flex items-center gap-2">
                        {specialEvent.color && (
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: specialEvent.color }}
                          />
                        )}
                        {specialEvent.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ministryTeam">Specific Ministry Team</Label>
            <Select 
              value={formData.ministryTeamId} 
              onValueChange={(value) => setFormData({ ...formData, ministryTeamId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ministry team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {ministries
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(ministry => (
                    <SelectItem key={ministry.id} value={ministry.id}>
                      {ministry.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isExternal"
              checked={formData.isExternal}
              onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isExternal" className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              Outside group (hide from public calendar)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isSpecialEvent"
              checked={formData.isSpecialEvent}
              onChange={(e) => setFormData({ ...formData, isSpecialEvent: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isSpecialEvent" className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              Mark as Special Event
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featuredOnHomePage"
              checked={formData.featuredOnHomePage}
              onChange={(e) => setFormData({ ...formData, featuredOnHomePage: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="featuredOnHomePage" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Feature on Home Page
            </Label>
          </div>

          {formData.featuredOnHomePage && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="recurringDescription">Recurring Pattern Description</Label>
                <Input
                  id="recurringDescription"
                  value={formData.recurringDescription || ''}
                  onChange={(e) => setFormData({ ...formData, recurringDescription: e.target.value })}
                  placeholder="e.g., 'Tuesdays in January', 'Every Sunday', 'First Friday of each month'"
                  className="mt-1"
                />
                <p className="text-base text-gray-500 mt-1">
                  Describe how often this event occurs (only needed for recurring events)
                </p>
              </div>
              
              <div>
                <Label htmlFor="endsBy">Ends By (Optional)</Label>
                <Input
                  id="endsBy"
                  type="date"
                  value={formData.endsBy ? new Date(formData.endsBy).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, endsBy: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                  className="mt-1"
                />
                <p className="text-base text-gray-500 mt-1">
                  When to stop featuring this recurring event on the homepage (leave blank for no end date)
                </p>
              </div>
            </div>
          )}

          {formData.isSpecialEvent && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <Label htmlFor="specialEventNote">Special Event Description</Label>
                <Textarea
                  id="specialEventNote"
                  value={formData.specialEventNote}
                  onChange={(e) => setFormData({ ...formData, specialEventNote: e.target.value })}
                  placeholder="Detailed description of this special event..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="specialEventImage">Event Image</Label>
                <Input
                  type="file"
                  id="specialEventImage"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        // Upload to blob storage
                        const uploadFormData = new FormData();
                        uploadFormData.append('file', file);
                        
                        const response = await fetch('/api/admin/special-event-image/upload', {
                          method: 'POST',
                          body: uploadFormData,
                        });
                        
                        if (response.ok) {
                          const result = await response.json();
                          setFormData({ ...formData, specialEventImage: result.url });
                        } else {
                          console.error('Failed to upload image');
                        }
                      } catch (error) {
                        console.error('Error uploading image:', error);
                      }
                    }
                  }}
                  className="mt-1"
                />
                {formData.specialEventImage && (
                  <div className="mt-2">
                    <p className="text-base text-gray-500 mb-2">Uploaded image:</p>
                    <img 
                      src={formData.specialEventImage} 
                      alt="Event preview" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Name of person to contact for this event"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
