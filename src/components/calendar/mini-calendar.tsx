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
import { ChevronDown, ChevronUp, Clock, MapPin, Users, Calendar, X, Settings, Star } from 'lucide-react';
import { RecurringEvent, analyzeEvents, getWeeklySchedule } from '@/lib/event-analyzer';

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
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function MiniCalendar({ events, isAdminMode = false, onEventUpdated }: MiniCalendarProps) {
  const [analysis, setAnalysis] = useState<{
    recurringEvents: RecurringEvent[];
    uniqueEvents: CalendarEvent[];
    weeklyPatterns: { [dayOfWeek: number]: RecurringEvent[] };
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    if (events.length > 0) {
      const eventAnalysis = analyzeEvents(events);
      setAnalysis(eventAnalysis);
    }
  }, [events]);

  useEffect(() => {
    if (isAdminMode) {
      fetchMinistries();
      fetchSpecialEvents();
    }
  }, [isAdminMode]);

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

  const handleEventClick = async (recurringEvent: RecurringEvent) => {
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

    if (originalEvent) {
      console.log('Mini-calendar event clicked:', {
        title: originalEvent.title,
        ministryConnection: originalEvent.ministryConnection,
        ministryInfo: originalEvent.ministryInfo,
        specialEventInfo: originalEvent.specialEventInfo
      });
      
      // First set the basic event data
      setSelectedEvent(originalEvent);
      setIsModalOpen(true);
      
      // Then fetch any saved connections from the database
      try {
        const response = await fetch(`/api/admin/calendar-events/by-google-id/${originalEvent.id}`);
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
          }
        }
      } catch (error) {
        console.error('Failed to fetch saved connections:', error);
      }
    }
  };

  const handleSaveEvent = async (eventData: Partial<CalendarEvent>) => {
    if (!selectedEvent) return;

    try {
      
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
          recurringDescription: eventData.recurringDescription,
          endsBy: eventData.endsBy,
          featuredOnHomePage: eventData.featuredOnHomePage,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error('Failed to save event:', errorData);
        return;
      }

      const savedEvent = await createResponse.json();
      
      // Close the modal and refresh
      setIsModalOpen(false);
      setSelectedEvent(null);
      onEventUpdated?.();
    } catch (error) {
      console.error('Failed to save event:', error);
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
      'default': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return colors[event.ministryConnection as keyof typeof colors] || colors.default;
  };

  const getMinistryIcon = (ministry?: string) => {
    switch (ministry) {
      case 'children': return '👶';
      case 'youth': return '👥';
      case 'worship': return '🎵';
      case 'bible study': return '📖';
      case 'prayer': return '🙏';
      case 'fellowship': return '☕';
      case 'missions': return '🌍';
      default: return '📅';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Weekly Recurring Events
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Weekly Grid - Taller to show all events */}
          <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-7'}`}>
            {DAYS.map((day, index) => {
              const dayEvents = analysis.weeklyPatterns[index] || [];
              const hasEvents = dayEvents.length > 0;
              const isSunday = index === 0;
              
              
              return (
                <div
                  key={day}
                  className={`p-3 rounded-lg border-2 transition-all min-h-[120px] md:min-h-[200px] ${
                    hasEvents 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  } ${isSunday ? 'border-gold-300 bg-yellow-50' : ''}`}
                >
                  <div className="text-sm font-semibold text-gray-700 mb-3 text-center">
                    {day}
                    {isSunday && (
                      <div className="text-xs text-blue-600 font-normal mt-1">
                        🎵 Worship Services
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {isSunday ? (
                      <>
                        {/* Standard Sunday Schedule */}
                        <div className="space-y-1">
                          <div className="p-1 rounded border bg-blue-100 border-blue-300 text-xs">
                            <span className="font-medium text-xs">9am Worship</span>
                          </div>
                          
                          <div className="p-1 rounded border bg-green-100 border-green-300 text-xs">
                            <span className="font-medium text-xs">10am Sunday School</span>
                          </div>
                          
                          <div className="p-1 rounded border bg-blue-100 border-blue-300 text-xs">
                            <span className="font-medium text-xs">11am Worship</span>
                          </div>
                        </div>
                        
                        {/* Other Sunday Events */}
                        {dayEvents.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-yellow-300">
                            <div className="text-xs font-medium text-gray-600 mb-1">Other Events:</div>
                            {dayEvents
                              .sort((a: RecurringEvent, b: RecurringEvent) => a.time.localeCompare(b.time))
                              .map((event: RecurringEvent, eventIndex: number) => (
                                <div
                                  key={eventIndex}
                                  className={`p-1 rounded border text-xs cursor-pointer hover:shadow-sm transition-shadow ${getEventColor(event)}`}
                                  onClick={() => handleEventClick(event)}
                                >
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500 font-mono">{formatTime(event.time)}</span>
                                    <span className="font-medium text-xs break-words">{event.title}</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    ) : hasEvents ? (
                      dayEvents
                        .sort((a: RecurringEvent, b: RecurringEvent) => a.time.localeCompare(b.time))
                        .map((event: RecurringEvent, eventIndex: number) => (
                          <div
                            key={eventIndex}
                            className={`p-1 rounded border text-xs cursor-pointer hover:shadow-sm transition-shadow ${getEventColor(event)}`}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500 font-mono">{formatTime(event.time)}</span>
                              <span className="font-medium text-xs break-words">{event.title}</span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center text-gray-400 text-xs py-4">
                        No recurring events
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ministry Connections Summary */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Ministry Connections Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from(new Set(analysis.recurringEvents
                  .map(e => e.ministryConnection)
                  .filter(Boolean)
                )).map((ministry, index) => (
                  <div key={index} className="p-3 rounded-lg border bg-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getMinistryIcon(ministry)}</span>
                      <span className="font-medium text-sm capitalize">{ministry}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {analysis.recurringEvents.filter(e => e.ministryConnection === ministry).length} recurring events
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pattern Analysis */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">Pattern Analysis</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">Total Recurring Events</div>
                    <div className="text-2xl font-bold text-blue-700">{analysis.recurringEvents.length}</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-900">Average Confidence</div>
                    <div className="text-2xl font-bold text-green-700">
                      {Math.round(analysis.recurringEvents.reduce((acc, e) => acc + e.confidence, 0) / analysis.recurringEvents.length * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={isAdminMode ? "max-w-2xl max-h-[90vh] overflow-y-auto" : "max-w-md"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
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
                  <h3 className="font-semibold text-lg text-gray-900">{selectedEvent.title}</h3>
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
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            Every {days[dayOfWeek]} at {new Date(selectedEvent.start).toLocaleTimeString('en-US', {
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
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">
                              {new Date(selectedEvent.start).toLocaleDateString('en-US', {
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
                              {new Date(selectedEvent.start).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })} - {new Date(selectedEvent.end).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </>
                      );
                    }
                  })()}
                  
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
                
                
                {(selectedEvent.ministryInfo || selectedEvent.specialEventInfo) && (
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
            )
          )}
        </DialogContent>
      </Dialog>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(event.start).toLocaleDateString('en-US', {
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
              {new Date(event.start).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })} - {new Date(event.end).toLocaleTimeString('en-US', {
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
                <p className="text-sm text-gray-500 mt-1">
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
                <p className="text-sm text-gray-500 mt-1">
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
