'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, X } from 'lucide-react';
import { Staff } from '@/lib/schema';

interface StaffEditModalProps {
  staff: Staff;
  onClose: () => void;
  onStaffUpdated: (updatedStaff: Staff) => void;
}

export function StaffEditModal({ staff, onClose, onStaffUpdated }: StaffEditModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: staff.name,
    title: staff.title,
    bio: staff.bio,
    email: staff.email,
    sortOrder: staff.sortOrder || '0'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(staff.imageUrl);
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number } | null>(
    staff.focalPoint ? JSON.parse(staff.focalPoint) : null
  );
  const [showFocalPointSelector, setShowFocalPointSelector] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFocalPoint(null); // Reset focal point
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setShowFocalPointSelector(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFocalPointClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imagePreview) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setFocalPoint({ x, y });
  };

  const confirmFocalPoint = () => {
    console.log('Confirming focal point:', focalPoint);
    setShowFocalPointSelector(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', `staff-${Date.now()}`);
    formData.append('type', 'image');
    formData.append('description', 'Staff member photo');

    const response = await fetch('/api/admin/assets/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload error:', errorData);
      throw new Error(`Failed to upload image: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.fileUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let imageUrl = staff.imageUrl;
      
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          alert('Image upload failed, but staff member will be updated without new photo.');
        }
      }

      console.log('Submitting with focal point:', focalPoint);
      const response = await fetch(`/api/admin/staff/${staff.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          focalPoint,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update staff member');
      }

      const updatedStaff = await response.json();
      onStaffUpdated(updatedStaff.staff);
      onClose();
    } catch (error) {
      console.error('Error updating staff member:', error);
      alert(`Failed to update staff member: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Job title or position"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Staff member biography"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500">
              Lower numbers appear first. Use drag and drop on the main page to reorder easily.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Photo</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
              {imagePreview && !showFocalPointSelector && (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: focalPoint ? `${focalPoint.x}% ${focalPoint.y}%` : 'center'
                    }}
                  />
                </div>
              )}
            </div>
            
            {showFocalPointSelector && imagePreview && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">
                  Click on the image to set the focal point (where the image should be centered)
                </div>
                <div className="relative border-2 border-blue-300 rounded-lg overflow-hidden">
                  <div
                    className="relative cursor-crosshair max-h-64"
                    onClick={handleFocalPointClick}
                  >
                    <img
                      src={imagePreview}
                      alt="Select focal point"
                      className="w-full h-auto"
                    />
                    {focalPoint && (
                      <div
                        className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                        style={{
                          left: `${focalPoint.x}%`,
                          top: `${focalPoint.y}%`
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowFocalPointSelector(false);
                      setFocalPoint(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={confirmFocalPoint}
                    disabled={!focalPoint}
                  >
                    Confirm Focal Point
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Staff Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
