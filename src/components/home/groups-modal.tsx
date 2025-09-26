'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Calendar, X, Music, Mail, Phone } from 'lucide-react';
import { analyzeEvents, RecurringEvent } from '@/lib/event-analyzer';

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
  ministryInfo?: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
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
  isExternal?: boolean;
  specialEventNote?: string;
  specialEventImage?: string;
  contactPerson?: string;
  recurringDescription?: string;
  endsBy?: string;
  featuredOnHomePage?: boolean;
}

interface GroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function GroupsModal({ isOpen, onClose }: GroupsModalProps) {
  const [analysis, setAnalysis] = useState<{
    recurringEvents: RecurringEvent[];
    uniqueEvents: CalendarEvent[];
    weeklyPatterns: { [dayOfWeek: number]: RecurringEvent[] };
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEventColor, setSelectedEventColor] = useState<string>('rgb(220 38 38)');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Use recurring events cache API for efficient weekly groups display
      const response = await fetch('/api/recurring-events');
      if (response.ok) {
        const data = await response.json() as {
          recurringEvents?: Array<{ title: string; dayOfWeek: number; time: string; location?: string; isExternal?: boolean }>;
          weeklyPatterns?: { [key: number]: Array<{ title: string; dayOfWeek: number; time: string; location?: string; isExternal?: boolean }> };
        };
        // API already returns recurringEvents and weeklyPatterns; exclude external from cache
        type CachedEvent = { title: string; dayOfWeek: number; time: string; location?: string; isExternal?: boolean };
        const recurring = (data.recurringEvents as CachedEvent[] || []).filter((e) => !e.isExternal);
        const weekly: { [key: number]: CachedEvent[] } = data.weeklyPatterns || {};
        const weeklyFiltered: { [key: number]: CachedEvent[] } = {};
        Object.keys(weekly).forEach(k => {
          const day = Number(k);
          weeklyFiltered[day] = (weekly[day] || []).filter((e) => !e.isExternal);
        });
        // If cache is empty (or everything filtered), fall back to live analysis
        if ((recurring?.length || 0) === 0) {
          const live = await fetch('/api/calendar/events');
          if (live.ok) {
            const liveData = await live.json() as {
              events?: Array<{ id: string; title: string; start: string; end: string; location?: string; allDay: boolean; recurring?: boolean; }>;
              analysis?: ReturnType<typeof analyzeEvents>;
            };
            type RawEvent = { id: string; title: string; start: Date; end: Date; location?: string; allDay: boolean; recurring?: boolean; isExternal?: boolean };
            const eventsData: RawEvent[] = (liveData.events || []).map((event) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end)
            }));
            // Filter out external by instance and series (API should already exclude, but double-guard)
            const filtered: RawEvent[] = eventsData.filter((e) => !e.isExternal);
            const analysis = (liveData.analysis || analyzeEvents(filtered));
            setEvents(filtered as unknown as CalendarEvent[]);
            setAnalysis({
              recurringEvents: analysis.recurringEvents,
              uniqueEvents: analysis.uniqueEvents,
              weeklyPatterns: analysis.weeklyPatterns,
            });
            return;
          }
        }

        setEvents([]); // not used now
        setAnalysis({
          recurringEvents: recurring as unknown as RecurringEvent[],
          uniqueEvents: [],
          weeklyPatterns: weeklyFiltered as unknown as { [dayOfWeek: number]: RecurringEvent[] },
        });
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = async (recurringEvent: RecurringEvent, dayIndex: number) => {
    console.log('=== EVENT CLICKED ===');
    console.log('Clicked recurring event:', recurringEvent);
    console.log('Available events count:', events.length);
    console.log('Events with same title:', events.filter(e => e.title === recurringEvent.title).map(e => ({ id: e.id, title: e.title, start: e.start })));
    
    // Get the color scheme for this day
    const colorSchemes = [
      { bg: 'rgb(220 38 38)', name: 'red-600' },      // Sunday - Red
      { bg: 'rgb(17 94 89)', name: 'teal-800' },      // Monday - Teal
      { bg: 'rgb(49 46 129)', name: 'indigo-900' },   // Tuesday - Indigo
      { bg: 'rgb(245 158 11)', name: 'amber-500' },   // Wednesday - Amber
      { bg: 'rgb(77 124 15)', name: 'lime-700' },     // Thursday - Lime
      { bg: 'rgb(113 78 145)', name: 'purple' },      // Friday - Purple
      { bg: 'rgb(220 38 38)', name: 'red-600' }       // Saturday - Red
    ];
    const colorScheme = colorSchemes[dayIndex];
    setSelectedEventColor(colorScheme.bg);
    
    function getNextOccurrenceDate(dayOfWeek: number, timeHHmm: string): Date {
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
    }

    // Find the original event from the events array that matches this recurring event
    const originalEvent = events.find(event => {
      // Convert to Chicago timezone for consistent matching
      const eventDate = new Date(event.start);
      
      // Use Intl.DateTimeFormat to get Chicago timezone components
      const chicagoFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      const timeParts = chicagoFormatter.formatToParts(eventDate);
      const eventTime = `${timeParts.find(part => part.type === 'hour')?.value}:${timeParts.find(part => part.type === 'minute')?.value}`;
      
      // Get day of week using a separate formatter
      const dayFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        weekday: 'long'
      });
      const dayName = dayFormatter.format(eventDate);
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(dayName.toLowerCase());
      const eventTitle = event.title;
      const eventLocation = event.location || '';
      
      return eventTitle === recurringEvent.title && 
             eventTime === recurringEvent.time && 
             eventLocation === (recurringEvent.location || '') &&
             dayOfWeek === recurringEvent.dayOfWeek;
    });

    console.log('=== MATCHING RESULT ===');
    console.log('Found original event:', !!originalEvent);
    if (originalEvent) {
      console.log('Groups modal event clicked:', {
        id: originalEvent.id,
        title: originalEvent.title,
        start: originalEvent.start,
        location: originalEvent.location,
        ministryConnection: originalEvent.ministryConnection,
        ministryInfo: originalEvent.ministryInfo,
        specialEventInfo: originalEvent.specialEventInfo
      });
      
      // First set the basic event data
      setSelectedEvent(originalEvent);
      setIsEventModalOpen(true);
      
      // Then fetch any saved connections from the database
      try {
        const response = await fetch(`/api/calendar/events/by-google-id/${originalEvent.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.event) {
            // Merge the saved connections with the Google Calendar event data
            setSelectedEvent({
              ...originalEvent,
              specialEventId: data.event.specialEventId,
              ministryTeamId: data.event.ministryTeamId,
              isSpecialEvent: data.event.isSpecialEvent,
              specialEventNote: data.event.specialEventNote,
              specialEventImage: data.event.specialEventImage,
              contactPerson: data.event.contactPerson,
              recurringDescription: data.event.recurringDescription,
              endsBy: data.event.endsBy,
              featuredOnHomePage: data.event.featuredOnHomePage,
            });

            // If ministryTeamId exists, fetch ministry info for richer modal
            if (data.event.ministryTeamId) {
              try {
                const teamRes = await fetch(`/api/ministries/${data.event.ministryTeamId}`);
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
                      }
                    } : prev);
                  }
                }
              } catch (e) {
                console.error('Failed to fetch ministry team info:', e);
              }
            } else {
              // Fallback: try resolve a team by name similarity from all ministries
              try {
                const listRes = await fetch('/api/ministries');
                if (listRes.ok) {
                  const listData = await listRes.json();
                  const teams: Array<{ id: string; name: string; description?: string; image_url?: string; imageUrl?: string }>
                    = listData.ministries || [];
                  const title = originalEvent.title.toLowerCase();
                  const guess = teams.find(t => title.includes((t.name || '').toLowerCase()))
                    || teams.find(t => (t.name || '').toLowerCase().includes('respite'))
                    || null;
                  if (guess) {
                    setSelectedEvent((prev) => prev ? {
                      ...prev,
                      ministryInfo: {
                        id: guess.id,
                        name: guess.name,
                        description: (guess as any).description ?? null,
                        imageUrl: (guess as any).imageUrl ?? (guess as any).image_url ?? null,
                      }
                    } : prev);
                  }
                }
              } catch (e) {
                console.error('Failed to resolve ministry by name:', e);
              }
            }

            // If specialEventId exists, fetch special event info too
            if (data.event.specialEventId) {
              try {
                console.log('[GroupsModal] fetch special event (live):', data.event.specialEventId);
                const seRes = await fetch(`/api/special-events/${data.event.specialEventId}`);
                if (seRes.ok) {
                  const seData = await seRes.json();
                  console.log('[GroupsModal] special event response (live):', seData);
                  if (seData.event) {
                    setSelectedEvent((prev) => prev ? {
                      ...prev,
                      specialEventInfo: {
                        id: seData.event.id,
                        name: seData.event.name,
                        description: seData.event.description,
                        imageUrl: seData.event.imageUrl,
                        color: seData.event.color,
                      }
                    } : prev);
                  }
                }
              } catch (e) {
                console.error('Failed to fetch special event info:', e);
              }
            } else if (data.event?.isSpecialEvent) {
              console.warn('[GroupsModal] Event marked as special but missing specialEventId. Cannot load special event details.');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch saved connections:', error);
      }
    }

    // If no live match, try server-side recurring lookup to get manual links
    if (!originalEvent) {
      console.log('[GroupsModal] No live event match. Trying recurring lookup...');
      try {
        const recurRes = await fetch('/api/calendar/events/by-recurring', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: recurringEvent.title,
            dayOfWeek: recurringEvent.dayOfWeek,
            time: recurringEvent.time,
            location: recurringEvent.location || ''
          })
        });
        if (recurRes.ok) {
          const recurData = await recurRes.json();
          console.log('[GroupsModal] Recurring lookup result:', recurData);
          if (recurData?.event) {
            const fallbackEvent: CalendarEvent = {
              id: recurData.event.googleEventId || `${recurringEvent.title}-${recurringEvent.dayOfWeek}-${recurringEvent.time}`,
              title: recurringEvent.title,
              start: getNextOccurrenceDate(recurringEvent.dayOfWeek, recurringEvent.time),
              end: getNextOccurrenceDate(recurringEvent.dayOfWeek, recurringEvent.time),
              location: recurringEvent.location,
              allDay: false,
              recurring: true,
              ministryConnection: (recurringEvent as unknown as { ministryConnection?: string }).ministryConnection,
              specialEventId: recurData.event.specialEventId,
              ministryTeamId: recurData.event.ministryTeamId,
              isSpecialEvent: recurData.event.isSpecialEvent,
              specialEventNote: recurData.event.specialEventNote,
              specialEventImage: recurData.event.specialEventImage,
              contactPerson: recurData.event.contactPerson,
              recurringDescription: recurData.event.recurringDescription,
              endsBy: recurData.event.endsBy,
              featuredOnHomePage: recurData.event.featuredOnHomePage,
            };
            setSelectedEvent(fallbackEvent);
            setIsEventModalOpen(true);

            // Fetch linked ministry info when present
            if (recurData.event.ministryTeamId) {
              try {
                console.log('[GroupsModal] fetch ministry team (recurring):', recurData.event.ministryTeamId);
                const teamRes = await fetch(`/api/ministries/${recurData.event.ministryTeamId}`);
                if (teamRes.ok) {
                  const teamData = await teamRes.json();
                  console.log('[GroupsModal] ministry team response (recurring):', teamData);
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
                      }
                    } : prev);
                  }
                }
              } catch (e) {
                console.error('Failed to fetch ministry team info (recurring):', e);
              }
            }

            // Fetch linked special event info when present
            if (recurData.event.specialEventId) {
              try {
                console.log('[GroupsModal] fetch special event (recurring):', recurData.event.specialEventId);
                const seRes = await fetch(`/api/special-events/${recurData.event.specialEventId}`);
                if (seRes.ok) {
                  const seData = await seRes.json();
                  console.log('[GroupsModal] special event response (recurring):', seData);
                  if (seData.event) {
                    setSelectedEvent((prev) => prev ? {
                      ...prev,
                      specialEventInfo: {
                        id: seData.event.id,
                        name: seData.event.name,
                        description: seData.event.description,
                        imageUrl: seData.event.imageUrl,
                        color: seData.event.color,
                      }
                    } : prev);
                  }
                }
              } catch (e) {
                console.error('Failed to fetch special event info (recurring):', e);
              }
            }
            return;
          }
        } else {
          console.warn('[GroupsModal] Recurring lookup failed with status:', recurRes.status);
        }
      } catch (err) {
        console.error('[GroupsModal] Recurring lookup error:', err);
      }

      // Final minimal fallback so details modal still opens
      console.log('[GroupsModal] Using final minimal fallback event.');
      const minimalEvent: CalendarEvent = {
        id: `${recurringEvent.title}-${recurringEvent.dayOfWeek}-${recurringEvent.time}`,
        title: recurringEvent.title,
        start: getNextOccurrenceDate(recurringEvent.dayOfWeek, recurringEvent.time),
        end: getNextOccurrenceDate(recurringEvent.dayOfWeek, recurringEvent.time),
        location: recurringEvent.location,
        allDay: false,
        recurring: true,
        ministryConnection: (recurringEvent as unknown as { ministryConnection?: string }).ministryConnection,
        ministryTeamId: (recurringEvent as unknown as { ministryTeamId?: string }).ministryTeamId,
        // Carry special event data from the cached recurring pattern when available
        isSpecialEvent: (recurringEvent as unknown as { isSpecialEvent?: boolean }).isSpecialEvent,
        specialEventImage: (recurringEvent as unknown as { specialEventImage?: string }).specialEventImage,
        specialEventNote: (recurringEvent as unknown as { specialEventNote?: string }).specialEventNote,
        contactPerson: (recurringEvent as unknown as { contactPerson?: string }).contactPerson,
        recurringDescription: (recurringEvent as unknown as { recurringDescription?: string }).recurringDescription,
        featuredOnHomePage: (recurringEvent as unknown as { featuredOnHomePage?: boolean }).featuredOnHomePage,
      };
      setSelectedEvent(minimalEvent);
      setIsEventModalOpen(true);

      // If the cached recurring event carries a ministryTeamId, fetch details to render in modal
      try {
        const cachedTeamId = (recurringEvent as unknown as { ministryTeamId?: string }).ministryTeamId;
        if (cachedTeamId) {
          const teamRes = await fetch(`/api/ministries/${cachedTeamId}`);
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
                }
              } : prev);
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch ministry team info (cached minimal fallback):', e);
      }
    }
  };

  const getEventColor = (ministryConnection?: string): string => {
    const colors = {
      'worship': 'bg-red-100 text-red-800 border-red-200',
      'children': 'bg-teal-100 text-teal-800 border-teal-200',
      'youth': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bible study': 'bg-amber-100 text-amber-800 border-amber-200',
      'prayer': 'bg-lime-100 text-lime-800 border-lime-200',
      'fellowship': 'bg-purple-100 text-purple-800 border-purple-200',
      'missions': 'bg-teal-100 text-teal-800 border-teal-200',
      'default': 'bg-stone-100 text-stone-800 border-stone-200'
    };
    
    return colors[ministryConnection as keyof typeof colors] || colors.default;
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-indigo-900 font-serif">Weekly Groups & Activities</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-indigo-700">Loading events...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!analysis || analysis.recurringEvents.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-indigo-900 font-serif">Weekly Groups & Activities</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-indigo-700">No recurring events found.</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }


  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-900 font-serif">
              <Calendar className="h-5 w-5" />
              Weekly Groups & Activities
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Stacked days layout */}
            <div className="space-y-4">
              {FULL_DAYS.map((dayName, index) => {
                const dayEvents = analysis.weeklyPatterns?.[index] || [];
                const hasEvents = dayEvents.length > 0;
                const isSunday = index === 0;
                
                // Cycle through our signature colors
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
                    key={dayName}
                    className="p-4 rounded-lg transition-all"
                    style={{ backgroundColor: colorScheme.bg }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        {dayName}
                      </h3>
                    </div>
                    
                    <div className="space-y-2 w-full">
                      {hasEvents ? (
                        dayEvents
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className="p-3 rounded bg-white text-sm cursor-pointer hover:shadow-sm transition-shadow w-full"
                              onClick={() => handleEventClick(event, index)}
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" style={{ color: colorScheme.bg }} />
                                <span className="text-xs font-mono" style={{ color: colorScheme.bg }}>
                                  {(() => {
                                    const [hours, minutes] = event.time.split(':');
                                    const hour = parseInt(hours);
                                    const minute = parseInt(minutes);
                                    const ampm = hour >= 12 ? 'PM' : 'AM';
                                    const displayHour = hour % 12 || 12;
                                    return minute > 0 ? `${displayHour}:${minutes}${ampm}` : `${displayHour}${ampm}`;
                                  })()}
                                </span>
                                <span className="font-medium text-sm" style={{ color: colorScheme.bg }}>{event.title}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" style={{ color: colorScheme.bg }} />
                                  <span className="text-xs" style={{ color: colorScheme.bg }}>{event.location}</span>
                                </div>
                              )}
                            </div>
                          ))
                      ) : (
                        <div className={`text-center py-6 w-full text-white ${isSunday ? 'text-base font-medium' : 'text-sm'}`}>
                          {isSunday ? (
                            "In addition to Sunday worship, we have these regular groups throughout the week"
                          ) : (
                            "No recurring events"
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-indigo-200">
            <Button variant="outline" onClick={onClose} className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: selectedEventColor }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white font-serif">
              <Calendar className="h-5 w-5" />
              Event Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-white">{selectedEvent.title}</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Every {FULL_DAYS[new Date(selectedEvent.start).getDay()]} at {new Intl.DateTimeFormat('en-US', {
                      timeZone: 'America/Chicago',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    }).format(selectedEvent.start)}
                  </span>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{selectedEvent.location}</span>
                  </div>
                )}
                
                {selectedEvent.ministryConnection && (
                  <div className="flex items-center gap-2 text-white">
                    <Badge variant="outline" className="text-xs capitalize border-white text-white">
                      {selectedEvent.ministryConnection}
                    </Badge>
                  </div>
                )}
              </div>
              
              
              {(selectedEvent.ministryInfo || selectedEvent.specialEventInfo || selectedEvent.specialEventImage || selectedEvent.specialEventNote) && (
                <div className="pt-4 border-t border-white/30">
                  
                  {selectedEvent.ministryInfo && (
                    <div className="bg-white/10 p-4 rounded-lg">
                      {selectedEvent.ministryInfo.imageUrl && (
                        <div className="mb-3">
                          <img
                            src={selectedEvent.ministryInfo.imageUrl}
                            alt={selectedEvent.ministryInfo.name}
                            className="w-full aspect-[1200/630] object-cover rounded-lg border"
                          />
                        </div>
                      )}
                      {selectedEvent.ministryInfo.description && (
                        <p className="text-sm text-white mb-3">{selectedEvent.ministryInfo.description}</p>
                      )}
                      {selectedEvent.ministryInfo.contactPerson && (
                        <div className="flex items-center gap-2 text-sm text-white">
                          <Users className="h-4 w-4" />
                          <span>Contact: {selectedEvent.ministryInfo.contactPerson}</span>
                        </div>
                      )}
                      {selectedEvent.ministryInfo.contactEmail && (
                        <div className="flex items-center gap-2 text-sm text-white mt-1">
                          <Mail className="h-3 w-3" />
                          <span>{selectedEvent.ministryInfo.contactEmail}</span>
                        </div>
                      )}
                      {selectedEvent.ministryInfo.contactPhone && (
                        <div className="flex items-center gap-2 text-sm text-white mt-1">
                          <Phone className="h-3 w-3" />
                          <span>{selectedEvent.ministryInfo.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedEvent.specialEventInfo && (
                    <div className="bg-white/10 p-4 rounded-lg">
                      {selectedEvent.specialEventInfo.imageUrl && (
                        <div className="mb-3">
                          <img
                            src={selectedEvent.specialEventInfo.imageUrl}
                            alt={selectedEvent.specialEventInfo.name}
                            className="w-full aspect-[1200/630] object-cover rounded-lg border"
                          />
                        </div>
                      )}
                      {selectedEvent.specialEventInfo.description && (
                        <p className="text-sm text-white mb-3">{selectedEvent.specialEventInfo.description}</p>
                      )}
                      {selectedEvent.specialEventInfo.contactPerson && (
                        <div className="flex items-center gap-2 text-sm text-white">
                          <Users className="h-4 w-4" />
                          <span>Contact: {selectedEvent.specialEventInfo.contactPerson}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fallback render for special event data saved directly on the event when specialEventInfo is not available */}
                  {!selectedEvent.specialEventInfo && (selectedEvent.specialEventImage || selectedEvent.specialEventNote) && (
                    <div className="bg-white/10 p-4 rounded-lg">
                      {selectedEvent.specialEventImage && (
                        <div className="mb-3">
                          <img
                            src={selectedEvent.specialEventImage}
                            alt={selectedEvent.title}
                            className="w-full aspect-[1200/630] object-cover rounded-lg border"
                          />
                        </div>
                      )}
                      {selectedEvent.specialEventNote && (
                        <p className="text-sm text-white mb-3">{selectedEvent.specialEventNote}</p>
                      )}
                      {selectedEvent.contactPerson && (
                        <div className="flex items-center gap-2 text-sm text-white">
                          <Users className="h-4 w-4" />
                          <span>Contact: {selectedEvent.contactPerson}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end pt-4 border-t border-white/30">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEventModalOpen(false)}
                  className="flex items-center gap-2 border-white text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
