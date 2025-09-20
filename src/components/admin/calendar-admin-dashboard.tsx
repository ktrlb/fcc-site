'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon, X, Star, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MiniCalendar } from '@/components/calendar/mini-calendar';
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
  };
  isSpecialEvent?: boolean;
  specialEventNote?: string;
  specialEventImage?: string;
  contactPerson?: string;
  featuredOnHomePage?: boolean;
}

interface CalendarAdminDashboardProps {
  onEventUpdated?: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarAdminDashboard({ onEventUpdated }: CalendarAdminDashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ministries, setMinistries] = useState<{
    id: string;
    name: string;
    description?: string;
  }[]>([]);
  const [specialEvents, setSpecialEvents] = useState<Array<{ 
    id: string; 
    name: string; 
    description?: string; 
    color?: string 
  }>>([]);

  useEffect(() => {
    fetchEvents();
    fetchMinistries();
    fetchSpecialEvents();
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
          };
          isSpecialEvent?: boolean;
          specialEventNote?: string;
          featuredOnHomePage?: boolean;
        }) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        
        // Store all events for the mini-calendar
        setAllEvents(events);
        
        // Use the analysis from the API response if available, otherwise analyze locally
        const analysis = data.analysis || analyzeEvents(events);
        
        // Filter out recurring events for the main calendar
        const nonRecurringEvents = events.filter((event: CalendarEvent) => {
          const eventDate = new Date(event.start);
          const dayOfWeek = eventDate.getDay();
          const time = eventDate.toTimeString().slice(0, 5);
          const location = event.location || '';
          
          // Check if this event matches any recurring pattern
          const isRecurring = analysis.recurringEvents.some((recurring: RecurringEvent) => 
            recurring.title === event.title && 
            recurring.dayOfWeek === dayOfWeek &&
            recurring.time === time &&
            (recurring.location || '') === location
          );
          
          return !isRecurring;
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

  const handleEventClick = async (event: CalendarEvent) => {
    // First set the basic event data
    setSelectedEvent(event);
    setIsModalOpen(true);
    
    // Then fetch any saved connections from the database
    try {
      const response = await fetch(`/api/admin/calendar-events/by-google-id/${event.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.event) {
          // Merge the saved connections with the Google Calendar event data
          setSelectedEvent({
            ...event,
            specialEventId: data.event.specialEventId,
            ministryTeamId: data.event.ministryTeamId,
            isSpecialEvent: data.event.isSpecialEvent,
            specialEventNote: data.event.specialEventNote,
            featuredOnHomePage: data.event.featuredOnHomePage,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch saved connections:', error);
    }
  };

  const handleSaveEvent = async (eventData: Partial<CalendarEvent>) => {
    if (!selectedEvent) return;

    try {
      console.log('Saving event data:', eventData);
      
      // For now, we'll always create a new database entry since we don't have a lookup by googleEventId
      // In the future, we could add a GET endpoint that searches by googleEventId
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
          startTime: selectedEvent.start,
          endTime: selectedEvent.end,
          allDay: selectedEvent.allDay,
          recurring: selectedEvent.recurring,
          specialEventId: eventData.specialEventId,
          ministryTeamId: eventData.ministryTeamId,
          isSpecialEvent: eventData.isSpecialEvent,
          specialEventNote: eventData.specialEventNote,
          specialEventImage: eventData.specialEventImage,
          contactPerson: eventData.contactPerson,
          featuredOnHomePage: eventData.featuredOnHomePage,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error('Failed to save event:', errorData);
        throw new Error(`Failed to save event in database: ${errorData.error || 'Unknown error'}`);
      }

      const savedEvent = await createResponse.json();
      console.log('Event saved in database:', savedEvent);
      
      // Update local state with the saved event data
      const updatedEvents = allEvents.map(event => 
        event.id === selectedEvent.id ? { ...event, ...savedEvent.event } : event
      );
      setAllEvents(updatedEvents);
      
      const updatedCalendarEvents = calendarEvents.map(event => 
        event.id === selectedEvent.id ? { ...event, ...savedEvent.event } : event
      );
      setCalendarEvents(updatedCalendarEvents);
      
      setIsModalOpen(false);
      setSelectedEvent(null);
      onEventUpdated?.();
      
      console.log('Event saved successfully');
    } catch (error) {
      console.error('Failed to save event:', error);
      // You might want to show an error message to the user here
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

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendar Admin</h2>
        <p className="text-gray-600">Click on any event to manage ministry connections and special event settings</p>
      </div>

      {/* Mini Calendar with Weekly Patterns */}
      <MiniCalendar 
        events={allEvents} 
        isAdminMode={true}
        onEventUpdated={onEventUpdated}
      />
      
      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Days of the week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
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
                            <div className="flex gap-1">
                              {event.isSpecialEvent && (
                                <Star className="h-3 w-3 text-yellow-600" />
                              )}
                              {event.ministryConnection && (
                                <Users className="h-3 w-3 text-green-600" />
                              )}
                            </div>
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
                    <div className="flex items-center gap-2">
                      {event.isSpecialEvent && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Special
                        </Badge>
                      )}
                      {event.ministryConnection && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {event.ministryConnection}
                        </Badge>
                      )}
                      {event.recurring && (
                        <Badge variant="outline">Recurring</Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Card>
      
      {/* Admin Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Event Admin Settings
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <AdminEventEditForm
              event={selectedEvent}
              ministries={ministries}
              specialEvents={specialEvents}
              onSave={handleSaveEvent}
              onCancel={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
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
    specialEventNote: event.specialEventNote || '',
    featuredOnHomePage: event.featuredOnHomePage || false,
    specialEventImage: event.specialEventImage || '',
    contactPerson: event.contactPerson || '',
  });

  // Update form data when event changes (when saved connections are loaded)
  useEffect(() => {
    setFormData({
      specialEventId: event.specialEventId || 'none',
      ministryTeamId: event.ministryTeamId || 'none',
      isSpecialEvent: event.isSpecialEvent || false,
      specialEventNote: event.specialEventNote || '',
      featuredOnHomePage: event.featuredOnHomePage || false,
      specialEventImage: event.specialEventImage || '',
      contactPerson: event.contactPerson || '',
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {event.start.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {event.start.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })} - {event.end.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
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
          <div className="mt-2 text-sm text-gray-600">
            <strong>Description:</strong> {event.description}
          </div>
        )}
      </div>

      {/* Admin Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ministryConnection">Special Event Type</Label>
            <Select 
              value={formData.specialEventId} 
              onValueChange={(value) => setFormData({ ...formData, specialEventId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select special event type" />
              </SelectTrigger>
              <SelectContent>
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
              <CalendarIcon className="h-4 w-4 text-blue-600" />
              Feature on Home Page
            </Label>
          </div>

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
                    <p className="text-sm text-gray-500 mb-2">Uploaded image:</p>
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
