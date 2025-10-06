'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

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

interface LayLeadershipEditModalProps {
  leader: LayLeader;
  onClose: () => void;
  onLeaderUpdated: (leader: LayLeader) => void;
}

export function LayLeadershipEditModal({ leader, onClose, onLeaderUpdated }: LayLeadershipEditModalProps) {
  const [formData, setFormData] = useState({
    displayName: leader.displayName,
    role: leader.role,
    roleDescription: leader.roleDescription || '',
    bio: leader.bio || '',
    imageUrl: leader.imageUrl || '',
    focalPoint: leader.focalPoint || '',
    publicEmail: leader.publicEmail || '',
    publicPhone: leader.publicPhone || '',
    isActive: leader.isActive,
    sortOrder: leader.sortOrder,
    termStart: leader.termStart ? new Date(leader.termStart) : undefined,
    termEnd: leader.termEnd ? new Date(leader.termEnd) : undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/lay-leadership/${leader.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          termStart: formData.termStart?.toISOString(),
          termEnd: formData.termEnd?.toISOString(),
        }),
      });

      if (response.ok) {
        const updatedLeader = await response.json();
        onLeaderUpdated(updatedLeader);
        onClose();
      } else {
        alert('Failed to update lay leader');
      }
    } catch (error) {
      console.error('Error updating lay leader:', error);
      alert('Failed to update lay leader');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lay Leader</DialogTitle>
        </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Elder, Deacon, Trustee"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="roleDescription">Role Description</Label>
            <Textarea
              id="roleDescription"
              value={formData.roleDescription}
              onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })}
              placeholder="Brief description of their role and responsibilities"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Public biography for the leadership page"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publicEmail">Public Email</Label>
              <Input
                id="publicEmail"
                type="email"
                value={formData.publicEmail}
                onChange={(e) => setFormData({ ...formData, publicEmail: e.target.value })}
                placeholder="Email to display publicly"
              />
            </div>

            <div>
              <Label htmlFor="publicPhone">Public Phone</Label>
              <Input
                id="publicPhone"
                value={formData.publicPhone}
                onChange={(e) => setFormData({ ...formData, publicPhone: e.target.value })}
                placeholder="Phone to display publicly"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="termStart">Term Start</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.termStart ? format(formData.termStart, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.termStart}
                    onSelect={(date) => setFormData({ ...formData, termStart: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="termEnd">Term End</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.termEnd ? format(formData.termEnd, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.termEnd}
                    onSelect={(date) => setFormData({ ...formData, termEnd: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="URL for leader photo"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
