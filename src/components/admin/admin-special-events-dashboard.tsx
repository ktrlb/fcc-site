'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Palette } from 'lucide-react';

interface SpecialEvent {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  color: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: string;
  createdAt: string;
  updatedAt: string;
}

export function AdminSpecialEventsDashboard() {
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialEvent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  });

  useEffect(() => {
    fetchSpecialEvents();
  }, []);

  const fetchSpecialEvents = async () => {
    try {
      const response = await fetch('/api/admin/special-events');
      if (response.ok) {
        const data = await response.json();
        setSpecialEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch special events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingEvent 
        ? `/api/admin/special-events/${editingEvent.id}`
        : '/api/admin/special-events';
      
      const method = editingEvent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSpecialEvents();
        setIsModalOpen(false);
        setEditingEvent(null);
        setFormData({ name: '', description: '', color: '#3B82F6' });
      }
    } catch (error) {
      console.error('Failed to save special event:', error);
    }
  };

  const handleEdit = (event: SpecialEvent) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description || '',
      color: event.color,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (event: SpecialEvent) => {
    if (event.isDefault) {
      alert('Cannot delete default special events');
      return;
    }

    if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
      try {
        const response = await fetch(`/api/admin/special-events/${event.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchSpecialEvents();
        }
      } catch (error) {
        console.error('Failed to delete special event:', error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Special Events</h1>
          <p className="text-gray-600 mt-2">Manage special event types for calendar events</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Special Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {specialEvents.map((event) => (
          <Card key={event.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: event.color }}
                  />
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  {event.isDefault && (
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  )}
                  {!event.isActive && (
                    <Badge variant="outline" className="text-xs">Inactive</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {event.description && (
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Palette className="h-3 w-3" />
                  <span>{event.color}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(event)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  {!event.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(event)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Special Event' : 'Create Special Event'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEvent ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
