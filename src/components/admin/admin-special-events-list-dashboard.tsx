'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Calendar, MapPin, User } from 'lucide-react';

interface SpecialEventItem {
  type: 'series' | 'individual';
  // Common fields
  title: string;
  description?: string;
  image?: string;
  contactPerson?: string;
  location?: string;
  featuredOnHomePage?: boolean;
  ministryTeamId?: string;
  specialEventId?: string;
  
  // Series-specific fields
  seriesName?: string;
  eventCount?: number;
  events?: Array<{
    id: string;
    googleEventId?: string;
    startTime: string;
    endTime: string;
    allDay: boolean;
  }>;
  firstEventDate?: string;
  lastEventDate?: string;
  
  // Individual event fields
  id?: string;
  googleEventId?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
}

export function AdminSpecialEventsListDashboard() {
  const [specialEvents, setSpecialEvents] = useState<SpecialEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    fetchSpecialEvents();
  }, [showPastEvents]);


  const fetchSpecialEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/calendar/special-events?includeExternal=true&includePast=${showPastEvents}`);
      if (!response.ok) {
        throw new Error('Failed to fetch special events');
      }
      const data = await response.json();
      // The new API returns items that are either series or individual
      // We need to adapt the data structure to work with the existing UI
      const events = data.items || [];
      console.log('Special Events List: Received', events.length, 'items from API:', events);
      setSpecialEvents(events);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching special events:', err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  // API already filters by endsBy/startTime, so just display what we receive
  const displayEvents = specialEvents;

  if (specialEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Special Events</h3>
        <p className="text-gray-600">
          Mark events as special in the Calendar Admin to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Special Events ({displayEvents.length})
          </h2>
          <p className="text-gray-600 mt-1">
            Events marked as special that can be featured on the homepage
            {displayEvents.filter(e => e.featuredOnHomePage).length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-medium">
                <Star className="h-4 w-4" />
                {displayEvents.filter(e => e.featuredOnHomePage).length} currently featured
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {displayEvents.length} special events
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPastEvents(!showPastEvents)}
          >
            {showPastEvents ? 'Hide Past Events' : 'Show Past Events'}
          </Button>
        </div>
      </div>

      <div className="space-y-4 max-w-6xl">
        {displayEvents.map(item => {
          const isSeries = item.type === 'series';
          const displayTitle = isSeries ? `${item.title} (${item.eventCount} sessions)` : item.title;
          
          return (
            <Card key={isSeries ? item.seriesName : item.id} className={`w-full transition-all duration-200 hover:shadow-lg ${item.featuredOnHomePage ? 'border-2 border-amber-400 bg-amber-50/30' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Event Image or Icon */}
                  <div className="flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={displayTitle}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {displayTitle}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {isSeries ? (
                              <span>
                                {new Date(item.firstEventDate!).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })} - {new Date(item.lastEventDate!).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            ) : (
                              <span>
                                {new Date(item.startTime!).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                          {item.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        {item.featuredOnHomePage && (
                          <Badge className="bg-amber-500 text-white border-amber-500">
                            <Star className="h-3 w-3 mr-1" />
                            Featured on Homepage
                          </Badge>
                        )}
                        {isSeries && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            Series ({item.eventCount} sessions)
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Event Description */}
                    {item.description && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    {/* Series Event Dates */}
                    {isSeries && item.events && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Event Dates:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.events.slice(0, 4).map((evt, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {new Date(evt.startTime).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </Badge>
                          ))}
                          {item.events.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.events.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {item.contactPerson && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{item.contactPerson}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/admin/calendar'}
                      title="Manage in Calendar Admin"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage in Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
