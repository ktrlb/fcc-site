'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email?: string;
}

const BOARD_POSITIONS = [
  'Moderator',
  'Vice Moderator', 
  'Stewardship Rep',
  'Outreach Rep',
  'Property Rep',
  'Permanent Fund Rep',
  'Recording Secretary',
  'Chair of the Elders',
  'Chair of the Deacons',
  'Board Member',
] as const;

interface AddToGeneralBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultRole?: string;
  defaultLeadershipTypes?: string[];
  title?: string;
  searchName?: string; // Pre-fill search with this name
}

export function AddToGeneralBoardModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultRole = '',
  defaultLeadershipTypes = ['general-board'],
  title = 'Add Person to General Board',
  searchName = ''
}: AddToGeneralBoardModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchName);
  const [formData, setFormData] = useState({
    memberId: '',
    displayName: '',
    role: defaultRole,
    roleDescription: '',
    termStart: '',
    termEnd: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      setSearchTerm(searchName);
    }
  }, [isOpen, searchName]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members?limit=1000');
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const filteredMembers = members.filter(m => {
    const displayName = m.preferredName || m.firstName;
    const fullName = `${displayName} ${m.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleMemberSelect = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      const displayName = member.preferredName || member.firstName;
      setFormData({
        ...formData,
        memberId,
        displayName: `${displayName} ${member.lastName}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/lay-leadership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          leadershipTypes: defaultLeadershipTypes,
          isActive: true,
          termStart: formData.termStart || null,
          termEnd: formData.termEnd || null,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          memberId: '',
          displayName: '',
          role: '',
          roleDescription: '',
          termStart: '',
          termEnd: '',
        });
        setSearchTerm('');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add to General Board');
      }
    } catch (error) {
      console.error('Error adding to General Board:', error);
      alert('Failed to add to General Board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <fieldset className="border-0 p-0 m-0">
            <div>
              <Label htmlFor="member-search">Select Member *</Label>
              <div className="space-y-2">
                <Input
                  id="member-search"
                  name="member-search"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                  autoComplete="off"
                  type="search"
                />
                <div role="combobox" aria-label="Select member">
                  <Select 
                    value={formData.memberId} 
                    onValueChange={handleMemberSelect}
                    required
                  >
                    <SelectTrigger id="member">
                      <SelectValue placeholder="Choose a member" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {filteredMembers.map(member => {
                        const displayName = member.preferredName || member.firstName;
                        return (
                          <SelectItem key={member.id} value={member.id}>
                            {displayName} {member.lastName}
                            {member.preferredName && ` (${member.firstName})`}
                            {member.email && ` - ${member.email}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className="border-0 p-0 m-0">
            <div>
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="John Doe"
                required
                autoComplete="name"
              />
            </div>
          </fieldset>

          <fieldset className="border-0 p-0 m-0">
            <div>
              <Label htmlFor="role">Role/Position *</Label>
            {defaultLeadershipTypes.includes('general-board') && defaultRole === '' ? (
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select board position" />
                </SelectTrigger>
                <SelectContent>
                  {BOARD_POSITIONS.map(position => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Elder, Deacon, Board Member"
                required
                autoComplete="organization-title"
              />
            )}
            <p className="text-sm text-gray-500 mt-1">
              This will determine which sections they appear in (e.g., "Elder & Board Member" shows in both sections)
            </p>
            </div>
          </fieldset>

          <fieldset className="border-0 p-0 m-0">
            <div>
              <Label htmlFor="roleDescription">Role Description (Optional)</Label>
              <Textarea
                id="roleDescription"
                name="roleDescription"
                value={formData.roleDescription}
                onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })}
                placeholder="Brief description of their responsibilities..."
                rows={3}
                autoComplete="off"
              />
            </div>
          </fieldset>

          <fieldset className="border-0 p-0 m-0">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="termStart">Term Start (Optional)</Label>
                <Input
                  id="termStart"
                  name="termStart"
                  type="date"
                  value={formData.termStart}
                  onChange={(e) => setFormData({ ...formData, termStart: e.target.value })}
                  autoComplete="off"
                />
              </div>

              <div>
                <Label htmlFor="termEnd">Term End (Optional)</Label>
                <Input
                  id="termEnd"
                  name="termEnd"
                  type="date"
                  value={formData.termEnd}
                  onChange={(e) => setFormData({ ...formData, termEnd: e.target.value })}
                  autoComplete="off"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-900 hover:bg-indigo-900/90 text-white"
            >
              {loading ? 'Adding...' : 'Add to General Board'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

