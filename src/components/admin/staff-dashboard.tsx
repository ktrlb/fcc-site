'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StaffUploadModal } from './staff-upload-modal';
import { StaffEditModal } from './staff-edit-modal';
import { Edit, Trash2, User, Mail, Briefcase, GripVertical } from 'lucide-react';
import { Staff } from '@/lib/schema';

export function StaffDashboard() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/admin/staff');
      if (response.ok) {
        const data = await response.json();
        setStaff(data.staff);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffUpdated = (updatedStaff: Staff) => {
    setStaff(prev => prev.map(member => 
      member.id === updatedStaff.id ? updatedStaff : member
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
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newStaff = [...staff];
    const draggedStaff = newStaff[draggedIndex];
    newStaff.splice(draggedIndex, 1);
    newStaff.splice(dropIndex, 0, draggedStaff);

    // Update sort order for all affected staff
    const updatedStaff = newStaff.map((member, index) => ({
      ...member,
      sortOrder: index.toString()
    }));

    setStaff(updatedStaff);
    setDraggedIndex(null);

    // Update the database with new sort orders
    try {
      await Promise.all(
        updatedStaff.map((member, index) =>
          fetch(`/api/admin/staff/${member.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...member,
              sortOrder: index.toString()
            })
          })
        )
      );
      console.log('Staff order updated successfully');
    } catch (error) {
      console.error('Failed to update staff order:', error);
      // Revert on error
      fetchStaff();
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/staff/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchStaff();
      } else {
        alert('Failed to delete staff member');
      }
    } catch (error) {
      console.error('Error deleting staff member:', error);
      alert('Failed to delete staff member');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading staff members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <StaffUploadModal onStaffAdded={fetchStaff} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member, index) => (
          <Card 
            key={member.id} 
            className={`overflow-hidden transition-all duration-200 ${
              draggedIndex === index ? 'opacity-50 scale-95' : 'hover:shadow-lg'
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div 
                  className="cursor-move p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </div>
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                    style={{
                      objectPosition: member.focalPoint ? 
                        (() => {
                          try {
                            const focal = JSON.parse(member.focalPoint);
                            console.log(`Focal point for ${member.name}:`, focal);
                            return `${focal.x}% ${focal.y}%`;
                          } catch (error) {
                            console.log(`Error parsing focal point for ${member.name}:`, error, member.focalPoint);
                            return 'center';
                          }
                        })() : 'center'
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-gray-600">{member.title}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="truncate">{member.email}</span>
              </div>
              
              <p className="text-sm text-gray-700 line-clamp-3">
                {member.bio}
              </p>

              <div className="flex items-center justify-between">
                <Badge variant={member.isActive ? "default" : "secondary"}>
                  {member.isActive ? "Active" : "Inactive"}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingStaff(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {staff.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first staff member.</p>
          <StaffUploadModal onStaffAdded={fetchStaff} />
        </div>
      )}

      {editingStaff && (
        <StaffEditModal
          staff={editingStaff}
          onClose={() => setEditingStaff(null)}
          onStaffUpdated={handleStaffUpdated}
        />
      )}
    </div>
  );
}
