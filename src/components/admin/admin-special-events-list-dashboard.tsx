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
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  specialEventNote?: string;
  specialEventImage?: string;
  contactPerson?: string;
  isActive: boolean;
  sortOrder: number;
  isFeatured?: boolean;
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
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    allDay: false,
    specialEventNote: '',
    contactPerson: '',
    specialEventImage: '',
    specialEventId: 'none',
    ministryTeamId: 'none',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/admin/special-event-image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
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

  const handleSave = async () => {
    try {
      if (!editingEvent) return;

      setIsUploading(true);
      let imageUrl = formData.specialEventImage;

      // Upload image if a new file was selected
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          alert('Image upload failed, but event will be updated without new image.');
        }
      }

      const response = await fetch(`/api/admin/special-events-list/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          specialEventImage: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      await fetchSpecialEvents();
      handleCloseModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      console.error('Error updating event:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (event: SpecialEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      startTime: event.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : '',
      endTime: event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '',
      allDay: event.allDay,
      specialEventNote: event.specialEventNote || '',
      contactPerson: event.contactPerson || '',
      specialEventImage: event.specialEventImage || '',
      specialEventId: event.specialEventType?.id || 'none',
      ministryTeamId: event.ministryTeam?.id || 'none',
    });
    setImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
    setImageFile(null);
    // Clean up any object URLs
    if (formData.specialEventImage && formData.specialEventImage.startsWith('blob:')) {
      URL.revokeObjectURL(formData.specialEventImage);
    }
  };

  const handleDelete = (event: SpecialEvent) => {
    setDeletingEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingEvent) return;

    try {
      const response = await fetch(`/api/admin/special-events-list/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          startTime: formData.startTime,
          endTime: formData.endTime,
          allDay: formData.allDay,
          specialEventNote: formData.specialEventNote,
          contactPerson: formData.contactPerson,
          specialEventImage: formData.specialEventImage,
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
                title: formData.title,
                description: formData.description,
                location: formData.location,
                startTime: formData.startTime,
                endTime: formData.endTime,
                allDay: formData.allDay,
                specialEventNote: formData.specialEventNote,
                contactPerson: formData.contactPerson,
                specialEventImage: formData.specialEventImage,
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
      const response = await fetch(`/api/admin/special-events-list/${deletingEvent.id}`, {
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

  // Filter events based on past/future
  const now = new Date();
  const upcomingEvents = specialEvents.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate >= now;
  });
  
  const pastEvents = specialEvents.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate < now;
  });

  const displayEvents = showPastEvents ? specialEvents : upcomingEvents;

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
            {!showPastEvents && pastEvents.length > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({pastEvents.length} past events hidden)
              </span>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            Events marked as special that can be featured on the homepage
            {displayEvents.filter(e => e.isFeatured).length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-medium">
                <Star className="h-4 w-4" />
                {displayEvents.filter(e => e.isFeatured).length} currently featured
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {displayEvents.length} special events
          </div>
          {pastEvents.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPastEvents(!showPastEvents)}
            >
              {showPastEvents ? 'Hide Past Events' : `Show Past Events (${pastEvents.length})`}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4 max-w-6xl">
        {displayEvents.map(event => {
          const eventDate = new Date(event.startTime);
          const isPastEvent = eventDate < now;
          
          return (
            <Card key={event.id} className={`w-full transition-all duration-200 hover:shadow-lg ${isPastEvent ? 'opacity-75' : ''} ${event.isFeatured ? 'border-2 border-amber-400 bg-amber-50/30' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Event Image or Icon */}
                  <div className="flex-shrink-0">
                    {event.specialEventImage ? (
                      <img
                        src={event.specialEventImage}
                        alt={event.title}
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
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {eventDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        {event.isFeatured && (
                          <Badge className="bg-amber-500 text-white border-amber-500">
                            <Star className="h-3 w-3 mr-1" />
                            Featured on Homepage
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
                        {isPastEvent && (
                          <Badge variant="outline" className="text-gray-500 border-gray-300">
                            Past Event
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Event Description */}
                    {event.specialEventNote && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {event.specialEventNote}
                      </p>
                    )}

                    {/* Additional Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {event.contactPerson && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{event.contactPerson}</span>
                        </div>
                      )}
                      {event.ministryTeam && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Ministry:</span>
                          <span className="font-medium">{event.ministryTeam.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
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
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                    <MapPin className="inline h-4 w-4 mr-1" /> {editingEvent.location}
                  </p>
                )}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the event"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Event location"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={formData.allDay}
                    onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="allDay">All Day Event</Label>
                </div>

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
                  <Label htmlFor="specialEventImage">Event Image</Label>
                  <Input
                    type="file"
                    id="specialEventImage"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        // Create a preview URL for immediate display
                        const previewUrl = URL.createObjectURL(file);
                        setFormData({ ...formData, specialEventImage: previewUrl });
                      }
                    }}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a new image or keep the current one
                  </p>
                  
                  {/* Image Preview */}
                  {(formData.specialEventImage || imageFile) && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-2">Image preview:</p>
                      <div className="relative inline-block">
                        <img 
                          src={formData.specialEventImage} 
                          alt="Event preview" 
                          className="w-32 h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {imageFile && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>


                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Saving...' : 'Save Changes'}
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

