'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Search, X } from 'lucide-react';
import { format } from 'date-fns';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email?: string;
}

interface LayLeadershipUploadModalProps {
  onLeaderAdded: () => void;
}

export function LayLeadershipUploadModal({ onLeaderAdded }: LayLeadershipUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    memberId: '',
    displayName: '',
    role: '',
    roleDescription: '',
    bio: '',
    imageUrl: '',
    focalPoint: '',
    publicEmail: '',
    publicPhone: '',
    isActive: true,
    sortOrder: 0,
    termStart: undefined as Date | undefined,
    termEnd: undefined as Date | undefined,
  });

  const handleOpen = async () => {
    setIsOpen(true);
    // Fetch members for the dropdown
    try {
      const response = await fetch('/api/admin/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/lay-leadership', {
        method: 'POST',
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
        onLeaderAdded();
        setIsOpen(false);
        setFormData({
          memberId: '',
          displayName: '',
          role: '',
          roleDescription: '',
          bio: '',
          imageUrl: '',
          focalPoint: '',
          publicEmail: '',
          publicPhone: '',
          isActive: true,
          sortOrder: 0,
          termStart: undefined,
          termEnd: undefined,
        });
      } else {
        alert('Failed to create lay leader');
      }
    } catch (error) {
      console.error('Error creating lay leader:', error);
      alert('Failed to create lay leader');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberSelect = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setFormData({
        ...formData,
        memberId,
        displayName: member.preferredName 
          ? `${member.preferredName} ${member.lastName}`
          : `${member.firstName} ${member.lastName}`,
      });
      setMemberSearchTerm(
        member.preferredName 
          ? `${member.preferredName} ${member.lastName}`
          : `${member.firstName} ${member.lastName}`
      );
      setIsMemberDropdownOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMemberDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter members based on search term
  const filteredMembers = members.filter(member => {
    if (!memberSearchTerm) return true;
    const fullName = member.preferredName 
      ? `${member.preferredName} ${member.lastName}`
      : `${member.firstName} ${member.lastName}`;
    const searchLower = memberSearchTerm.toLowerCase();
    return (
      fullName.toLowerCase().includes(searchLower) ||
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      (member.preferredName && member.preferredName.toLowerCase().includes(searchLower)) ||
      (member.email && member.email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <>
      <Button onClick={handleOpen} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add Lay Leader
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Lay Leader</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <Label htmlFor="memberId">Member</Label>
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search members by name or email..."
                    value={memberSearchTerm}
                    onChange={(e) => {
                      setMemberSearchTerm(e.target.value);
                      setIsMemberDropdownOpen(true);
                    }}
                    onFocus={() => setIsMemberDropdownOpen(true)}
                    className="pl-10 pr-10"
                  />
                  {memberSearchTerm && (
                    <button
                      onClick={() => {
                        setMemberSearchTerm('');
                        setFormData({ ...formData, memberId: '', displayName: '' });
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {isMemberDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredMembers.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        No members found
                      </div>
                    ) : (
                      filteredMembers.slice(0, 20).map((member) => {
                        const fullName = member.preferredName 
                          ? `${member.preferredName} ${member.lastName}`
                          : `${member.firstName} ${member.lastName}`;
                        return (
                          <button
                            key={member.id}
                            onClick={() => handleMemberSelect(member.id)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <div className="font-medium">{fullName}</div>
                            {member.email && (
                              <div className="text-sm text-gray-500">{member.email}</div>
                            )}
                          </button>
                        );
                      })
                    )}
                    {filteredMembers.length > 20 && (
                      <div className="px-3 py-2 text-gray-500 text-sm border-t">
                        Showing first 20 of {filteredMembers.length} results
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

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
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Lay Leader'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
