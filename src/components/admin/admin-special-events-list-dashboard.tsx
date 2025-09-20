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
import { Star, Calendar, MapPin, User, Image as ImageIcon, Edit, Trash2, X } from 'lucide-react';

interface SpecialEvent {
  id: string;
  googleEventId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  specialEventNote?: string;
  specialEventImage?: string;
  contactPerson?: string;
  featuredOnHomePage: boolean;
  specialEventType?: {
    id: string;
    name: string;
    color?: string;
  };
  ministryTeam?: {
    id: string;
    name: string;
  };
}

export function AdminSpecialEventsListDashboard() {
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<SpecialEvent | null>(null);
  const [specialEventTypes, setSpecialEventTypes] = useState<Array<{ id: string; name: string; color?: string }>>([]);
  const [ministries, setMinistries] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    specialEventNote: '',
    contactPerson: '',
    specialEventImage: '',
    featuredOnHomePage: false,
    specialEventId: 'none',
    ministryTeamId: 'none',
  });

  useEffect(() => {
    fetchSpecialEvents();
    fetchSpecialEventTypes();
    fetchMinistries();
  }, []);

  const fetchSpecialEventTypes = async () => {
    try {
      const response = await fetch('/api/admin/special-events');
      if (response.ok) {
        const data = await response.json();
        setSpecialEventTypes(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch special event types:', error);
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
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/special-events-list');
      if (!response.ok) {
        throw new Error('Failed to fetch special events');
      }
      const data = await response.json();
      setSpecialEvents(data.events || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching special events:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (eventId: string, currentlyFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/calendar-events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featuredOnHomePage: !currentlyFeatured,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update featured status');
      }

      // Update local state
      setSpecialEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, featuredOnHomePage: !currentlyFeatured }
            : event
        )
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update featured status');
      console.error('Error updating featured status:', err);
    }
  };

  const handleEdit = (event: SpecialEvent) => {
    setEditingEvent(event);
    setFormData({
      specialEventNote: event.specialEventNote || '',
      contactPerson: event.contactPerson || '',
      specialEventImage: event.specialEventImage || '',
      featuredOnHomePage: event.featuredOnHomePage,
      specialEventId: event.specialEventType?.id || 'none',
      ministryTeamId: event.ministryTeam?.id || 'none',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (event: SpecialEvent) => {
    setDeletingEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingEvent) return;

    try {
      const response = await fetch(`/api/admin/calendar-events/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          specialEventNote: formData.specialEventNote,
          contactPerson: formData.contactPerson,
          specialEventImage: formData.specialEventImage,
          featuredOnHomePage: formData.featuredOnHomePage,
          specialEventId: formData.specialEventId === 'none' ? null : formData.specialEventId,
          ministryTeamId: formData.ministryTeamId === 'none' ? null : formData.ministryTeamId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      // Update local state
      setSpecialEvents(prev => 
        prev.map(event => 
          event.id === editingEvent.id 
            ? { 
                ...event, 
                specialEventNote: formData.specialEventNote,
                contactPerson: formData.contactPerson,
                specialEventImage: formData.specialEventImage,
                featuredOnHomePage: formData.featuredOnHomePage,
                specialEventType: formData.specialEventId !== 'none' 
                  ? specialEventTypes.find(t => t.id === formData.specialEventId)
                  : undefined,
                ministryTeam: formData.ministryTeamId !== 'none' 
                  ? ministries.find(m => m.id === formData.ministryTeamId)
                  : undefined,
              }
            : event
        )
      );

      setIsEditModalOpen(false);
      setEditingEvent(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      console.error('Error updating event:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;

    try {
      const response = await fetch(`/api/admin/calendar-events/${deletingEvent.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove from local state
      setSpecialEvents(prev => prev.filter(event => event.id !== deletingEvent.id));

      setIsDeleteModalOpen(false);
      setDeletingEvent(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      console.error('Error deleting event:', err);
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
          <h2 className="text-2xl font-bold text-gray-900">Special Events ({specialEvents.length})</h2>
          <p className="text-gray-600 mt-1">
            Events marked as special that can be featured on the homepage
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {specialEvents.filter(e => e.featuredOnHomePage).length} featured on homepage
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {specialEvents.map(event => (
          <Card key={event.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-medium line-clamp-2">
                  {event.title}
                </CardTitle>
                <div className="flex gap-2 ml-2">
                  {event.featuredOnHomePage && (
                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {event.specialEventType && (
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: event.specialEventType.color,
                        color: event.specialEventType.color 
                      }}
                    >
                      {event.specialEventType.name}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event.startTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}

              {event.contactPerson && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{event.contactPerson}</span>
                </div>
              )}

              {event.specialEventNote && (
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                  {event.specialEventNote}
                </div>
              )}

              {event.specialEventImage && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ImageIcon className="h-4 w-4" />
                  <span className="truncate">{event.specialEventImage}</span>
                </div>
              )}

              {event.ministryTeam && (
                <div className="text-sm">
                  <span className="text-gray-500">Ministry: </span>
                  <span className="font-medium">{event.ministryTeam.name}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t">
                <Button
                  variant={event.featuredOnHomePage ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFeatured(event.id, event.featuredOnHomePage)}
                  className={event.featuredOnHomePage ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {event.featuredOnHomePage ? 'Featured' : 'Feature'}
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(event)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Special Event
            </DialogTitle>
          </DialogHeader>
          
          {editingEvent && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{editingEvent.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(editingEvent.startTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
                {editingEvent.location && (
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {editingEvent.location}
                  </p>
                )}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                <div>
                  <Label htmlFor="specialEventType">Special Event Type</Label>
                  <Select
                    value={formData.specialEventId}
                    onValueChange={(value) => setFormData({ ...formData, specialEventId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {specialEventTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ministryTeam">Ministry Team</Label>
                  <Select
                    value={formData.ministryTeamId}
                    onValueChange={(value) => setFormData({ ...formData, ministryTeamId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ministry team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {ministries.sort((a, b) => a.name.localeCompare(b.name)).map(ministry => (
                        <SelectItem key={ministry.id} value={ministry.id}>
                          {ministry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Name of person to contact for this event"
                  />
                </div>

                <div>
                  <Label htmlFor="specialEventImage">Event Image URL</Label>
                  <Input
                    id="specialEventImage"
                    value={formData.specialEventImage}
                    onChange={(e) => setFormData({ ...formData, specialEventImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.specialEventImage && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">Image preview:</p>
                      <img 
                        src={formData.specialEventImage} 
                        alt="Event preview" 
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featuredOnHomePage"
                    checked={formData.featuredOnHomePage}
                    onChange={(e) => setFormData({ ...formData, featuredOnHomePage: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="featuredOnHomePage">Featured on Homepage</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Special Event
            </DialogTitle>
          </DialogHeader>
          
          {deletingEvent && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete this special event? This action cannot be undone.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold">{deletingEvent.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(deletingEvent.startTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleConfirmDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Event
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

