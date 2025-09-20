"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon, X, Users } from "lucide-react";
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

  useEffect(() => {
    fetchEvents();
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
        
        console.log('Enhanced events with ministry data:', events.slice(0, 3)); // Debug log
        
        // Store all events for the mini-calendar
        setAllEvents(events);
        
        // Use the analysis from the API response if available, otherwise analyze locally
        const analysis = data.analysis || analyzeEvents(events);
        
        console.log('Analysis results:', {
          totalEvents: events.length,
          recurringEvents: analysis.recurringEvents.length,
          recurringEventTitles: analysis.recurringEvents.map((r: RecurringEvent) => r.title)
        });
        
        console.log('Starting detailed event filtering...');
        console.log('First 5 events being filtered:', events.slice(0, 5).map((e: CalendarEvent) => e.title));
        
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
          
          // Debug: log first few events and specific events being filtered
          if (index < 5 || event.title === "Tai Chi" || event.title === "Open Pickleball Time") {
            console.log(`Filtering event "${event.title}" (index ${index}):`, { dayOfWeek, time, location });
          }
          
          // Check if this event matches any recurring pattern
          const isRecurring = analysis.recurringEvents.some((recurring: RecurringEvent) => {
            const titleMatch = recurring.title === event.title;
            const dayMatch = recurring.dayOfWeek === dayOfWeek;
            const timeMatch = recurring.time === time;
            const locationMatch = (recurring.location || '') === location;
            
            // Debug log for first few events and specific recurring events
            if (event.title === "Tai Chi" || event.title === "Open Pickleball Time" || 
                recurring.title === "Tai Chi" || recurring.title === "Open Pickleball Time") {
              console.log(`Checking event "${event.title}" against recurring "${recurring.title}":`, {
                event: { title: event.title, dayOfWeek, time, location },
                recurring: { title: recurring.title, dayOfWeek: recurring.dayOfWeek, time: recurring.time, location: recurring.location },
                matches: { titleMatch, dayMatch, timeMatch, locationMatch }
              });
            }
            
            return titleMatch && dayMatch && timeMatch && locationMatch;
          });
          
          const result = !isRecurring;
          
          // Debug: log result for first few events and specific events
          if (index < 5 || event.title === "Tai Chi" || event.title === "Open Pickleball Time") {
            console.log(`Event "${event.title}" (index ${index}) isRecurring: ${isRecurring}, will be ${result ? 'kept' : 'filtered out'}`);
          }
          
          return result;
        });
        
        console.log('Filtering results:', {
          totalEvents: events.length,
          nonRecurringEvents: nonRecurringEvents.length,
          filteredOut: events.length - nonRecurringEvents.length
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
    console.log('Event clicked:', event);
    console.log('Ministry connection:', event.ministryConnection);
    console.log('Ministry info:', event.ministryInfo);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar events...</p>
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
          <MiniCalendar events={allEvents} />
      
      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
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
          {DAYS.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const eventsForDate = getEventsForDate(date);
            const isCurrentDay = isToday(date);
            
            return (
              <div
                key={index}
                className={`
                  p-2 border border-gray-200 rounded-lg
                  ${date ? 'bg-white hover:bg-gray-50' : 'bg-gray-100'}
                  ${isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                  ${eventsForDate.length > 0 ? 'min-h-[120px]' : 'min-h-[60px]'}
                `}
                style={{
                  minHeight: eventsForDate.length > 0 ? `${Math.max(120, 60 + (eventsForDate.length * 24))}px` : '60px'
                }}
              >
                {date && (
                  <>
                    <div className={`
                      text-sm font-medium mb-1
                      ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}
                    `}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {eventsForDate.map(event => (
                        <div
                          key={event.id}
                          className="text-xs p-1 bg-blue-100 text-blue-800 rounded break-words cursor-pointer hover:bg-blue-200 transition-colors"
                          title={event.title}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="flex-1">{event.title}</span>
                            {event.ministryConnection && (
                              <Badge 
                                variant="secondary" 
                                className="text-[10px] px-1 py-0 h-4 bg-green-100 text-green-700 border-green-300"
                              >
                                {event.ministryConnection}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Events List */}
        {calendarEvents.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {calendarEvents
                .filter(event => event.start >= new Date())
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .slice(0, 10)
                .map(event => (
                  <div 
                    key={event.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">
                        {event.start.toLocaleDateString()} at {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {event.location && (
                        <p className="text-sm text-gray-500">{event.location}</p>
                      )}
                    </div>
                    {event.recurring && (
                      <Badge variant="secondary">Recurring</Badge>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </Card>
      
      {/* Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Event Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{selectedEvent.title}</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {selectedEvent.start.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {selectedEvent.start.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })} - {selectedEvent.end.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{selectedEvent.location}</span>
                  </div>
                )}
              </div>
              
              
       {selectedEvent.ministryConnection && (selectedEvent.ministryInfo || selectedEvent.specialEventInfo) && (
         <div className="pt-4 border-t border-gray-200">
           
           {selectedEvent.ministryInfo && (
             <div className="bg-green-50 p-4 rounded-lg">
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
                 <p className="text-sm text-gray-600 mb-3">{selectedEvent.ministryInfo.description}</p>
               )}
               {selectedEvent.ministryInfo.contactPerson && (
                 <div className="flex items-center gap-2 text-sm text-gray-600">
                   <Users className="h-4 w-4" />
                   <span>Contact: {selectedEvent.ministryInfo.contactPerson}</span>
                 </div>
               )}
               {selectedEvent.ministryInfo.contactEmail && (
                 <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                   <span className="text-xs">📧</span>
                   <span>{selectedEvent.ministryInfo.contactEmail}</span>
                 </div>
               )}
               {selectedEvent.ministryInfo.contactPhone && (
                 <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                   <span className="text-xs">📞</span>
                   <span>{selectedEvent.ministryInfo.contactPhone}</span>
                 </div>
               )}
             </div>
           )}
           
           {selectedEvent.specialEventInfo && (
             <div className="bg-blue-50 p-4 rounded-lg">
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
                 <p className="text-sm text-gray-600 mb-3">{selectedEvent.specialEventInfo.description}</p>
               )}
               {selectedEvent.specialEventInfo.contactPerson && (
                 <div className="flex items-center gap-2 text-sm text-gray-600">
                   <Users className="h-4 w-4" />
                   <span>Contact: {selectedEvent.specialEventInfo.contactPerson}</span>
                 </div>
               )}
             </div>
           )}
         </div>
       )}
              
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}