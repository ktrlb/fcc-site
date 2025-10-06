'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayLeadershipUploadModal } from './lay-leadership-upload-modal';
import { LayLeadershipEditModal } from './lay-leadership-edit-modal';
import { Edit, Trash2, User, Mail, Briefcase, GripVertical } from 'lucide-react';

interface LayLeader {
  id: string;
  memberId: string;
  displayName: string;
  role: string;
  roleDescription?: string;
  bio?: string;
  imageUrl?: string;
  focalPoint?: string;
  publicEmail?: string;
  publicPhone?: string;
  isActive: boolean;
  sortOrder: number;
  termStart?: string;
  termEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export function LayLeadershipDashboard() {
  const [layLeaders, setLayLeaders] = useState<LayLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLeader, setEditingLeader] = useState<LayLeader | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fetchLayLeaders = async () => {
    try {
      const response = await fetch('/api/admin/lay-leadership');
      if (response.ok) {
        const data = await response.json();
        setLayLeaders(data.layLeaders || []);
      }
    } catch (error) {
      console.error('Failed to fetch lay leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaderUpdated = (updatedLeader: LayLeader) => {
    setLayLeaders(prev => prev.map(leader => 
      leader.id === updatedLeader.id ? updatedLeader : leader
    ));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newLayLeaders = [...layLeaders];
    const draggedLeader = newLayLeaders[draggedIndex];
    newLayLeaders.splice(draggedIndex, 1);
    newLayLeaders.splice(dropIndex, 0, draggedLeader);

    setLayLeaders(newLayLeaders);
    setDraggedIndex(null);

    // Update sort order in database
    try {
      await fetch('/api/admin/lay-leadership/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layLeaders: newLayLeaders.map((leader, index) => ({
            id: leader.id,
            sortOrder: index
          }))
        })
      });
    } catch (error) {
      console.error('Failed to update sort order:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lay leader?')) return;

    try {
      const response = await fetch(`/api/admin/lay-leadership/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLayLeaders(prev => prev.filter(leader => leader.id !== id));
      } else {
        alert('Failed to delete lay leader');
      }
    } catch (error) {
      console.error('Failed to delete lay leader:', error);
      alert('Failed to delete lay leader');
    }
  };

  useEffect(() => {
    fetchLayLeaders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading lay leaders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lay Leadership Management</h2>
        <LayLeadershipUploadModal onLeaderAdded={fetchLayLeaders} />
      </div>

      <div className="space-y-4 max-w-4xl">
        {layLeaders.map((leader, index) => (
          <Card 
            key={leader.id} 
            className={`w-full transition-all duration-200 ${
              draggedIndex === index ? 'opacity-50 scale-95' : 'hover:shadow-lg'
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="relative w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {leader.imageUrl ? (
                      <img 
                        src={leader.imageUrl} 
                        alt={leader.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {leader.displayName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {leader.role}
                        </Badge>
                        {!leader.isActive && (
                          <Badge variant="outline" className="text-gray-500">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      {leader.roleDescription && (
                        <p className="text-sm text-gray-600 mt-1">
                          {leader.roleDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        {leader.publicEmail && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {leader.publicEmail}
                          </div>
                        )}
                        {leader.publicPhone && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {leader.publicPhone}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLeader(leader)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(leader.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {layLeaders.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No lay leaders yet</h3>
              <p className="text-sm">Add your first lay leader to get started.</p>
            </div>
          </Card>
        )}
      </div>

      {editingLeader && (
        <LayLeadershipEditModal
          leader={editingLeader}
          onClose={() => setEditingLeader(null)}
          onLeaderUpdated={handleLeaderUpdated}
        />
      )}
    </div>
  );
}
