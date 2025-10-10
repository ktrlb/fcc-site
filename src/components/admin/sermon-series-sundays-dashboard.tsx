'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { SermonSeries, Sunday } from '@/lib/schema';
import { SermonSeriesUploadModal } from './sermon-series-upload-modal';
import { SermonSeriesEditModal } from './sermon-series-edit-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  isSpecialEvent: boolean;
  specialEventName?: string;
  specialEventColor?: string;
  ministryTeamName?: string;
}

interface WeeklyPlanningGridProps {
  sermonSeries: SermonSeries[];
  onSundayUpdate: () => void;
}

function WeeklyPlanningGrid({ sermonSeries, onSundayUpdate }: WeeklyPlanningGridProps) {
  const [weekData, setWeekData] = useState<{[key: string]: {
    worshipEvents: CalendarEvent[];
    nonWorshipEvents: CalendarEvent[];
    sermonSeriesId?: string;
    sundayId?: string;
  }}>({});
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Generate next 12 weeks starting from this Sunday (Chicago timezone)
  const getNext12Weeks = () => {
    const weeks = [];
    
    // Get current date in Chicago timezone using Intl API
    const now = new Date();
    const chicagoTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Chicago"}));
    const currentDay = chicagoTime.getDay();
    
    // Calculate days until next Sunday
    // If today is Sunday (0), start with today
    // If today is Monday-Saturday (1-6), go to next Sunday
    const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;
    
    for (let i = 0; i < 12; i++) {
      const sundayDate = new Date(chicagoTime);
      sundayDate.setDate(chicagoTime.getDate() + daysUntilSunday + (i * 7));
      
      // Format the date in Chicago timezone to get the correct date string
      const year = sundayDate.getFullYear();
      const month = String(sundayDate.getMonth() + 1).padStart(2, '0');
      const day = String(sundayDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      // Verify the date represents a Sunday
      const testDate = new Date(dateString + 'T12:00:00'); // Add noon to avoid timezone issues
      const dayName = testDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        timeZone: 'America/Chicago' 
      });
      // Generated date for calendar display
      
      weeks.push({
        date: dateString,
        weekNumber: i + 1
      });
    }
    return weeks;
  };

  // Fetch all cached events once (uses CalendarCacheService - no live Google API calls)
  const fetchAllCachedEvents = async () => {
    try {
      // Force refresh the cache to get the latest events including future dates
      const response = await fetch('/api/calendar/events?forceRefresh=true');
      if (response.ok) {
        const data = await response.json();
        const events = data.events || [];
        // Successfully fetched events from calendar cache
        
        return events;
      }
      return [];
    } catch (error) {
      console.error('Error fetching cached events:', error);
      return [];
    }
  };

  // Filter events for a specific date from the cached events
  const filterEventsForDate = (allEvents: CalendarEvent[], targetDate: string) => {
    // Create date range in Chicago timezone to avoid timezone issues
    const startOfDay = new Date(targetDate + 'T00:00:00-06:00'); // Chicago timezone
    const endOfDay = new Date(targetDate + 'T23:59:59-06:00'); // Chicago timezone

    // Filtering events for the target date

    const eventsForDate = allEvents.filter((event: CalendarEvent) => {
      if (!event.start) return false;
      
      const eventDate = new Date(event.start);
      const isInRange = eventDate >= startOfDay && eventDate <= endOfDay;
      
      if (isInRange) {
        // Found matching event for the date
      }
      
      return isInRange;
    });
    
    // Total events found for the target date

    // More specific worship event filtering
    const worshipKeywords = ['worship', 'service', 'sunday school', 'bible study', 'sermon', 'church service'];
    const worshipEvents = eventsForDate.filter((event: CalendarEvent) => 
      worshipKeywords.some(keyword => 
        event.title.toLowerCase().includes(keyword)
      )
    );
    
    const nonWorshipEvents = eventsForDate.filter((event: CalendarEvent) => 
      !worshipKeywords.some(keyword => 
        event.title.toLowerCase().includes(keyword)
      )
    );

    return { 
      worshipEvents: worshipEvents.slice(0, 5), // Limit to 5 worship events
      nonWorshipEvents: nonWorshipEvents.slice(0, 8) // Limit to 8 other events
    };
  };

  // Load data for all weeks using cached events
  useEffect(() => {
    const loadWeekData = async () => {
      setLoading(true);
      const weeks = getNext12Weeks();
      const newWeekData: {[key: string]: any} = {};

      try {
        // Fetch all cached events once
        const allEvents = await fetchAllCachedEvents();
        
        // Load existing Sundays data
        const existingSundaysResponse = await fetch('/api/admin/sundays');
        const existingSundays = existingSundaysResponse.ok ? 
          (await existingSundaysResponse.json()).sundays || [] : [];

        // Process each week using cached data
        weeks.forEach((week, index) => {
          const events = filterEventsForDate(allEvents, week.date);
          const existingSunday = existingSundays.find((s: any) => s.date === week.date);
          
          newWeekData[week.date] = {
            ...events,
            sermonSeriesId: existingSunday?.sermonSeriesId || null,
            sundayId: existingSunday?.id || null
          };

          // Update progress
          const progress = Math.round(((index + 1) / weeks.length) * 100);
          setLoadingProgress(progress);
        });

        setWeekData(newWeekData);
      } catch (error) {
        console.error('Error loading week data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeekData();
  }, []);

  // Handle sermon series selection
  const handleSermonSeriesChange = async (date: string, sermonSeriesId: string) => {
    try {
      // Changing sermon series for the selected date
      
      // Check if Sunday already exists
      const existingResponse = await fetch(`/api/admin/sundays?date=${date}`);
      let sundayId = null;
      
      if (existingResponse.ok) {
        const data = await existingResponse.json();
        const existingSunday = data.sundays?.find((s: any) => s.date === date);
        sundayId = existingSunday?.id;
        // Found existing Sunday record
      }

      if (sundayId) {
        // Update existing Sunday
        // Updating existing Sunday record
        const updateResponse = await fetch(`/api/admin/sundays/${sundayId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            date,
            sermonSeriesId 
          })
        });
        
        if (updateResponse.ok) {
          // Successfully updated Sunday record
        } else {
          console.error('❌ Failed to update Sunday:', await updateResponse.text());
        }
      } else {
        // Create new Sunday
        // Creating new Sunday record
        const createResponse = await fetch('/api/admin/sundays', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            date, 
            sermonSeriesId,
            isActive: true 
          })
        });
        
        if (createResponse.ok) {
          // Successfully created Sunday record
        } else {
          console.error('❌ Failed to create Sunday:', await createResponse.text());
        }
      }

      // Update local state
      setWeekData(prev => ({
        ...prev,
        [date]: {
          ...prev[date],
          sermonSeriesId
        }
      }));

      // Calling onSundayUpdate callback
      onSundayUpdate();
    } catch (error) {
      console.error('❌ Failed to update sermon series:', error);
    }
  };

  const formatDate = (dateString: string) => {
    // Add time to avoid timezone issues - use noon Chicago time
    const date = new Date(dateString + 'T12:00:00-06:00'); // Chicago timezone offset
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: 'America/Chicago'
    });
    // Formatted date for display
    return formatted;
  };

  const formatTime = (date: Date | string | undefined) => {
    if (!date) {
      return 'Time TBD';
    }
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Time TBD';
      }
      
      return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Chicago'
      });
    } catch (error) {
      return 'Time TBD';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-32 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <div className="text-sm text-gray-600">
          Loading weekly planning data... {loadingProgress}%
        </div>
        <div className="w-64 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  const weeks = getNext12Weeks();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Week</th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sermon Series</th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Worship Events</th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Other Events</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, index) => {
            const weekDataForDate = weekData[week.date] || { worshipEvents: [], nonWorshipEvents: [], sermonSeriesId: null };
            const selectedSeries = sermonSeries.find(s => s.id === weekDataForDate.sermonSeriesId);
            
            return (
              <tr key={week.date} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">
                  <div>
                    <div className="font-medium">{formatDate(week.date)}</div>
                    <div className="text-sm text-gray-500">Week {index + 1}</div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <Select
                    value={weekDataForDate.sermonSeriesId || ''}
                    onValueChange={(value) => handleSermonSeriesChange(week.date, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                      {sermonSeries.map((series) => (
                        <SelectItem key={series.id} value={series.id}>
                          {series.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedSeries && (
                    <div className="mt-2 flex items-center gap-2">
                      {selectedSeries.imageUrl && (
                        <img
                          src={selectedSeries.imageUrl}
                          alt={selectedSeries.title}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <span className="text-sm text-gray-600">{selectedSeries.title}</span>
                    </div>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <div className="space-y-1">
                    {weekDataForDate.worshipEvents.length > 0 ? (
                      weekDataForDate.worshipEvents.map((event) => (
                        <div key={event.id} className="text-sm">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-gray-500">
                            {event.start ? formatTime(event.start) : 'Time TBD'}
                            {event.location && ` • ${event.location}`}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">No worship events</span>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <div className="space-y-1">
                    {weekDataForDate.nonWorshipEvents.length > 0 ? (
                      weekDataForDate.nonWorshipEvents.map((event) => (
                        <div key={event.id} className="text-sm">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-gray-500">
                            {event.start ? formatTime(event.start) : 'Time TBD'}
                            {event.location && ` • ${event.location}`}
                          </div>
                          {event.isSpecialEvent && event.specialEventName && (
                            <Badge 
                              className="text-xs mt-1"
                              style={{ 
                                backgroundColor: event.specialEventColor || '#dc2626',
                                color: 'white'
                              }}
                            >
                              {event.specialEventName}
                            </Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">No other events</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SermonSeriesSundaysDashboard() {
  const [sermonSeries, setSermonSeries] = useState<SermonSeries[]>([]);
  const [sundays, setSundays] = useState<Sunday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSermonSeries, setEditingSermonSeries] = useState<SermonSeries | null>(null);
  const [showSundayModal, setShowSundayModal] = useState(false);
  const [selectedSunday, setSelectedSunday] = useState<Sunday | null>(null);
  const [sundayEvents, setSundayEvents] = useState<CalendarEvent[]>([]);
  const [editingSunday, setEditingSunday] = useState<Partial<Sunday> | null>(null);
  const [sermonSeriesPage, setSermonSeriesPage] = useState(1);
  const [sermonSeriesPerPage] = useState(3); // Show 3 series per page

  // Fetch sermon series
  const fetchSermonSeries = async () => {
    try {
      const response = await fetch('/api/admin/sermon-series');
      if (response.ok) {
        const data = await response.json();
        setSermonSeries(data);
      }
    } catch (error) {
      console.error('Failed to fetch sermon series:', error);
    }
  };

  // Fetch Sundays
  const fetchSundays = async () => {
    try {
      const response = await fetch('/api/admin/sundays');
      if (response.ok) {
        const data = await response.json();
        setSundays(data.sundays || []);
      }
    } catch (error) {
      console.error('Failed to fetch Sundays:', error);
    }
  };

  // Fetch calendar events for a specific Sunday
  const fetchSundayEvents = async (date: string) => {
    try {
      const response = await fetch(`/api/calendar/events?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        setSundayEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch Sunday events:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSermonSeries(), fetchSundays()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSundayClick = async (sunday: Sunday) => {
    setSelectedSunday(sunday);
    setEditingSunday(sunday);
    await fetchSundayEvents(sunday.date);
    setShowSundayModal(true);
  };

  const handleCreateSunday = () => {
    setEditingSunday({
      date: new Date().toISOString().split('T')[0],
      isActive: true
    });
    setShowSundayModal(true);
  };

  const handleSaveSunday = async () => {
    if (!editingSunday) return;

    try {
      const url = editingSunday.id ? `/api/admin/sundays/${editingSunday.id}` : '/api/admin/sundays';
      const method = editingSunday.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSunday)
      });

      if (response.ok) {
        await fetchSundays();
        setShowSundayModal(false);
        setEditingSunday(null);
        setSelectedSunday(null);
      }
    } catch (error) {
      console.error('Failed to save Sunday:', error);
    }
  };

  const handleDeleteSunday = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Sunday?')) return;

    try {
      const response = await fetch(`/api/admin/sundays/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchSundays();
      }
    } catch (error) {
      console.error('Failed to delete Sunday:', error);
    }
  };

  const handleEditSermonSeries = (series: SermonSeries) => {
    setEditingSermonSeries(series);
    setShowEditModal(true);
  };

  const handleSaveSermonSeries = async (updatedSeries: Partial<SermonSeries>) => {
    if (!editingSermonSeries) return;

    try {
      const response = await fetch(`/api/admin/sermon-series/${editingSermonSeries.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSeries)
      });

      if (response.ok) {
        await fetchSermonSeries();
        setShowEditModal(false);
        setEditingSermonSeries(null);
      }
    } catch (error) {
      console.error('Failed to update sermon series:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUpcomingSundays = () => {
    const today = new Date();
    return sundays
      .filter(sunday => new Date(sunday.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 8); // Show next 8 Sundays
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sermon Series & Sundays</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowUploadModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Sermon Series
          </Button>
          <Button onClick={handleCreateSunday} variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Add Sunday
          </Button>
        </div>
      </div>

      {/* Sermon Series Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Sermon Series</h3>
        </div>
        <div className="w-full max-w-4xl border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sermonSeries
              .slice((sermonSeriesPage - 1) * sermonSeriesPerPage, sermonSeriesPage * sermonSeriesPerPage)
              .map((series) => (
                <Card key={series.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {series.imageUrl ? (
                      <img
                        src={series.imageUrl}
                        alt={series.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{series.title}</h3>
                    {series.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {series.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <Badge variant={series.isActive ? "default" : "secondary"}>
                        {series.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditSermonSeries(series)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          
          {/* Pagination Controls */}
          {sermonSeries.length > sermonSeriesPerPage && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setSermonSeriesPage(prev => Math.max(1, prev - 1))}
                disabled={sermonSeriesPage === 1}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {sermonSeriesPage} of {Math.ceil(sermonSeries.length / sermonSeriesPerPage)}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setSermonSeriesPage(prev => Math.min(Math.ceil(sermonSeries.length / sermonSeriesPerPage), prev + 1))}
                disabled={sermonSeriesPage >= Math.ceil(sermonSeries.length / sermonSeriesPerPage)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sundays Planning Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Sundays Planning - Next 12 Weeks</h3>
          <Button 
            onClick={async (event) => {
              try {
                // Refreshing calendar cache
                
                // Show loading state
                const button = event.target as HTMLButtonElement;
                const originalText = button.textContent;
                button.textContent = 'Refreshing...';
                button.disabled = true;
                
                const response = await fetch('/api/admin/calendar/refresh', { method: 'POST' });
                const data = await response.json();
                
                console.log('=== CALENDAR CACHE REFRESH RESPONSE ===');
                console.log('Response status:', response.status);
                console.log('Response data:', data);
                
                if (response.ok) {
                  console.log('Calendar cache refreshed successfully:', data);
                  console.log('=== CALENDAR CACHE REFRESH SUCCESS ===');
                  
                  // Show success message
                  button.textContent = 'Success! Reloading...';
                  button.className = 'bg-green-500 text-white';
                  
                  // Wait a moment then reload
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                } else {
                  console.error('Failed to refresh calendar cache:', data);
                  console.log('=== CALENDAR CACHE REFRESH FAILED ===');
                  
                  button.textContent = 'Failed!';
                  button.className = 'bg-red-500 text-white';
                  
                  alert('Failed to refresh calendar cache: ' + (data.error || 'Unknown error'));
                  
                  // Reset button after 3 seconds
                  setTimeout(() => {
                    button.textContent = originalText;
                    button.className = 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50';
                    button.disabled = false;
                  }, 3000);
                }
              } catch (error) {
                console.error('Error refreshing calendar cache:', error);
                console.log('=== CALENDAR CACHE REFRESH ERROR ===');
                
                const button = (event?.target as HTMLButtonElement) || document.createElement('button');
                button.textContent = 'Error!';
                button.className = 'bg-red-500 text-white';
                
                alert('Error refreshing calendar cache: ' + error);
                
                // Reset button after 3 seconds
                setTimeout(() => {
                  button.textContent = 'Refresh Calendar Cache';
                  button.className = 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50';
                  button.disabled = false;
                }, 3000);
              }
            }}
            variant="outline"
            size="sm"
          >
            Refresh Calendar Cache
          </Button>
        </div>
        <WeeklyPlanningGrid 
          sermonSeries={sermonSeries}
          onSundayUpdate={fetchSundays}
        />
      </div>

      {/* Sermon Series Upload Modal */}
      <SermonSeriesUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={fetchSermonSeries}
      />

      {/* Sunday Details Modal */}
      <Dialog open={showSundayModal} onOpenChange={setShowSundayModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedSunday ? 'Sunday Details' : 'Add New Sunday'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Sunday Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={editingSunday?.date || ''}
                  onChange={(e) => setEditingSunday(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="sermonSeries">Sermon Series</Label>
                <Select
                  value={editingSunday?.sermonSeriesId || ''}
                  onValueChange={(value) => setEditingSunday(prev => ({ ...prev, sermonSeriesId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sermon series" />
                  </SelectTrigger>
                  <SelectContent>
                    {sermonSeries.map((series) => (
                      <SelectItem key={series.id} value={series.id}>
                        {series.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Custom Title (Optional)</Label>
              <Input
                id="title"
                value={editingSunday?.title || ''}
                onChange={(e) => setEditingSunday(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., 'Easter Sunday', 'Christmas Eve'"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={editingSunday?.description || ''}
                onChange={(e) => setEditingSunday(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Special notes about this Sunday..."
                rows={3}
              />
            </div>

            {/* Calendar Events for this Sunday */}
            {selectedSunday && sundayEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Worship Schedule & Events</h3>
                <div className="space-y-2">
                  {sundayEvents.map((event) => (
                    <Card key={event.id} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">
                              {new Date(event.start).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                            {event.location && (
                              <>
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{event.location}</span>
                              </>
                            )}
                          </div>
                          <h4 className="font-medium">{event.title}</h4>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            {event.isSpecialEvent && event.specialEventName && (
                              <Badge 
                                style={{ 
                                  backgroundColor: event.specialEventColor || '#dc2626',
                                  color: 'white'
                                }}
                              >
                                {event.specialEventName}
                              </Badge>
                            )}
                            {event.ministryTeamName && (
                              <Badge variant="outline">{event.ministryTeamName}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <div>
              {selectedSunday && (
                <Button
                  variant="outline"
                  onClick={() => handleDeleteSunday(selectedSunday.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Sunday
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowSundayModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSunday}>
                {selectedSunday ? 'Update Sunday' : 'Create Sunday'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sermon Series Edit Modal */}
      <SermonSeriesEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingSermonSeries(null);
        }}
        sermonSeries={editingSermonSeries}
        onSave={handleSaveSermonSeries}
      />
    </div>
  );
}
