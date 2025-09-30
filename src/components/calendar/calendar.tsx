"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon, X, Users, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MiniCalendar } from "./mini-calendar";
import { analyzeEvents, RecurringEvent } from "@/lib/event-analyzer";

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
}

interface CalendarProps {
  events?: CalendarEvent[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar({ events = [] }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Check if screen is mobile-sized
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 500);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const fetchEvents = async () => {
    try {
      setError(null);
      const response = await fetch('/api/calendar/events');
      if (response.ok) {
        const data = await response.json();
        // Convert ISO strings back to Date objects and preserve ministry info
        const events = (data.events || []).map((event: {
          id: string;
          title: string;
          start: string;
          end: string;
          description?: string;
          location?: string;
          allDay: boolean;
          recurring?: boolean;
          ministryConnection?: string;
          ministryInfo?: {
            id: string;
            name: string;
            description?: string;
            imageUrl?: string;
            contactPerson?: string;
            contactEmail?: string;
            contactPhone?: string;
          };
        }) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        
        
        // Store all events for the mini-calendar
        setAllEvents(events);
        
        // Debug: Check if events have ministry info
        const eventsWithMinistry = events.filter((e: CalendarEvent) => e.ministryInfo);
        console.log(`Events with ministry info: ${eventsWithMinistry.length}/${events.length}`);
        if (eventsWithMinistry.length > 0) {
          console.log('Sample event with ministry info:', eventsWithMinistry[0]);
        }
        
        // Get recurring patterns for the displayed month from cache
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        
        let recurringPatterns: any[] = [];
        try {
          const recurringResponse = await fetch(`/api/recurring-events?month=${month}&year=${year}`);
          if (recurringResponse.ok) {
            const recurringData = await recurringResponse.json();
            recurringPatterns = recurringData.recurringEvents || [];
            console.log(`Using ${recurringPatterns.length} cached recurring patterns for filtering`);
          } else {
            console.warn('Failed to fetch recurring patterns, falling back to live analysis');
            // Fallback to live analysis
            const currentMonthEvents = events.filter((event: CalendarEvent) => {
              const eventDate = new Date(event.start);
              const eventMonth = eventDate.getMonth();
              const eventYear = eventDate.getFullYear();
              return eventMonth === month && eventYear === year;
            });
            const analysis = analyzeEvents(currentMonthEvents);
            recurringPatterns = analysis.recurringEvents;
          }
        } catch (error) {
          console.error('Error fetching recurring patterns:', error);
          // Fallback to live analysis
          const currentMonthEvents = events.filter((event: CalendarEvent) => {
            const eventDate = new Date(event.start);
            const eventMonth = eventDate.getMonth();
            const eventYear = eventDate.getFullYear();
            return eventMonth === month && eventYear === year;
          });
          const analysis = analyzeEvents(currentMonthEvents);
          recurringPatterns = analysis.recurringEvents;
        }
        
        
        
        // Filter out recurring events for the main calendar
         const nonRecurringEvents = events.filter((event: CalendarEvent, index: number) => {
          // Convert to Chicago timezone for consistent filtering
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
          const location = event.location || '';
          
          // Special handling for Sunday events
          if (dayOfWeek === 0) { // Sunday
            const title = event.title.toLowerCase();
            const isStandardSundayEvent = (
              (title.includes('modern worship') && time === '09:00') ||
              (title.includes('sunday school') && time === '10:00') ||
              (title.includes('traditional worship') && time === '11:00')
            );
            
            // Debug logging
            if (isStandardSundayEvent) {
              console.log('Hiding standard Sunday event:', event.title, 'at', time);
            }
            
            // Hide standard Sunday events, show everything else
            return !isStandardSundayEvent;
          }
          
          // Check if this event matches any recurring pattern
          const isRecurring = recurringPatterns.some((recurring: any) => {
            const titleMatch = recurring.title === event.title;
            const dayMatch = recurring.dayOfWeek === dayOfWeek;
            const timeMatch = recurring.time === time;
            const locationMatch = (recurring.location || '') === (location || '');
            
            
            return titleMatch && dayMatch && timeMatch && locationMatch;
          });
          
          const result = !isRecurring;
          
          
          return result;
        });
        
        
        setCalendarEvents(nonRecurringEvents);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load calendar events');
      }
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      setError('Network error: Unable to connect to calendar service');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked for modal:', {
      title: event.title,
      ministryConnection: event.ministryConnection,
      ministryInfo: event.ministryInfo,
      specialEventInfo: event.specialEventInfo
    });
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading calendar events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 mb-2">
              <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Calendar Unavailable</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button 
              onClick={fetchEvents}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
          {/* Mini Calendar with Weekly Patterns */}
          <MiniCalendar events={allEvents} currentMonth={currentDate} />
      
      <Card className="p-6 bg-white">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-900 font-serif">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {DAYS.map((day, index) => {
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
                className="p-3 text-center text-base font-medium text-white rounded-lg"
                style={{ backgroundColor: colorScheme.bg }}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className={`grid gap-1 ${isMobile ? 'grid-cols-7' : 'grid-cols-7'}`}>
          {days.map((date, index) => {
            const eventsForDate = getEventsForDate(date);
            const isCurrentDay = isToday(date);
            
            return (
              <div
                key={index}
                className={`
                  ${isMobile 
                    ? `p-3 border border-indigo-200 rounded-lg cursor-pointer transition-colors
                       ${date ? 'hover:bg-indigo-50' : ''}
                       ${date ? (eventsForDate.length > 0 ? 'bg-stone-700' : 'bg-stone-400') : 'bg-stone-100'}
                       ${isCurrentDay ? 'ring-2 ring-red-500' : ''}`
                    : `p-2 border border-indigo-200 rounded-lg
                       ${date ? 'hover:bg-indigo-50' : ''}
                       ${date ? 'bg-stone-700' : 'bg-stone-100'}
                       ${isCurrentDay ? 'ring-2 ring-red-500' : ''}
                       ${eventsForDate.length > 0 ? 'min-h-[120px]' : 'min-h-[60px]'}`
                  }
                `}
                style={!isMobile ? {
                  minHeight: eventsForDate.length > 0 ? `${Math.max(120, 60 + (eventsForDate.length * 24))}px` : '60px'
                } : {}}
                onClick={isMobile && date ? () => {
                  if (eventsForDate.length > 0) {
                    setSelectedEvent(null); // Clear any existing selected event
                    setSelectedDate(date);
                    setIsModalOpen(true);
                  }
                } : undefined}
              >
                {date && (
                  <>
                    <div className={`
                      text-lg font-bold mb-1
                      ${isCurrentDay ? 'text-red-500' : 'text-white'}
                    `}>
                      {date.getDate()}
                    </div>
                    {!isMobile && (
                      <div className="space-y-1">
                        {eventsForDate.map(event => {
                          // Get the day of week for this event to determine color
                          const eventDate = new Date(event.start);
                          const dayOfWeek = eventDate.getDay();
                          const colorSchemes = [
                            { bg: 'rgb(220 38 38)', name: 'red-600' },      // Sunday - Red
                            { bg: 'rgb(17 94 89)', name: 'teal-800' },      // Monday - Teal
                            { bg: 'rgb(49 46 129)', name: 'indigo-900' },   // Tuesday - Indigo
                            { bg: 'rgb(245 158 11)', name: 'amber-500' },   // Wednesday - Amber
                            { bg: 'rgb(77 124 15)', name: 'lime-700' },     // Thursday - Lime
                            { bg: 'rgb(113 78 145)', name: 'purple' },      // Friday - Purple
                            { bg: 'rgb(220 38 38)', name: 'red-600' }       // Saturday - Red
                          ];
                          const colorScheme = colorSchemes[dayOfWeek];
                          
                          return (
                            <div
                              key={event.id}
                              className="text-base p-2 bg-white rounded break-words cursor-pointer hover:bg-gray-50 transition-colors border"
                              title={event.title}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="flex-1 font-bold" style={{ color: colorScheme.bg }}>{event.title}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Events List */}
      </Card>
      
      {/* Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setSelectedDate(null);
          setSelectedEvent(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-stone-700 font-serif">
              <CalendarIcon className="h-5 w-5" />
              {selectedEvent ? 'Event Details' : 'Events for ' + (selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Chicago' }) || '')}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-xl text-stone-700">{selectedEvent.title}</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-stone-700">
                  <Clock className="h-4 w-4" />
                  <span className="text-base">
                    {selectedEvent.start.toLocaleDateString('en-US', {
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
                    {selectedEvent.start.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'America/Chicago'
                    })} - {selectedEvent.end.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'America/Chicago'
                    })}
                  </span>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-stone-700">
                    <MapPin className="h-4 w-4" />
                    <span className="text-base">{selectedEvent.location}</span>
                  </div>
                )}
              </div>
              
              
       {(selectedEvent.ministryInfo || selectedEvent.specialEventInfo) && (
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
         </div>
       )}
              
              <div className="flex justify-end pt-4 border-t border-indigo-200">
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
          ) : selectedDate && (
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map(event => {
                // Get the day of week for this event to determine color
                const eventDate = new Date(event.start);
                const dayOfWeek = eventDate.getDay();
                const colorSchemes = [
                  { bg: 'rgb(220 38 38)', name: 'red-600' },      // Sunday - Red
                  { bg: 'rgb(17 94 89)', name: 'teal-800' },      // Monday - Teal
                  { bg: 'rgb(49 46 129)', name: 'indigo-900' },   // Tuesday - Indigo
                  { bg: 'rgb(245 158 11)', name: 'amber-500' },   // Wednesday - Amber
                  { bg: 'rgb(77 124 15)', name: 'lime-700' },     // Thursday - Lime
                  { bg: 'rgb(113 78 145)', name: 'purple' },      // Friday - Purple
                  { bg: 'rgb(220 38 38)', name: 'red-600' }       // Saturday - Red
                ];
                const colorScheme = colorSchemes[dayOfWeek];
                
                return (
                  <div
                    key={event.id}
                    className="p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors bg-white"
                    onClick={() => {
                      setSelectedEvent(event);
                      setSelectedDate(null);
                    }}
                  >
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold" style={{ color: colorScheme.bg }}>{event.title}</h3>
                      <div className="flex items-center gap-2 text-stone-700">
                        <Clock className="h-4 w-4" />
                        <span className="text-base">
                          {event.start.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: 'America/Chicago'
                          })} - {event.end.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: 'America/Chicago'
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-stone-700">
                          <MapPin className="h-4 w-4" />
                          <span className="text-base">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}