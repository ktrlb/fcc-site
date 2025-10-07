'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface AddMinistryLeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contactPersonName: string;
  role: string;
  ministryNames: string[];
}

export function AddMinistryLeaderModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  contactPersonName,
  role,
  ministryNames,
}: AddMinistryLeaderModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(contactPersonName);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      setSearchTerm(contactPersonName);
      setSelectedMemberId('');
    }
  }, [isOpen, contactPersonName]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const member = members.find(m => m.id === selectedMemberId);
      if (!member) {
        alert('Please select a member');
        return;
      }

      const displayName = member.preferredName || member.firstName;

      const response = await fetch('/api/admin/lay-leadership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: selectedMemberId,
          displayName: `${displayName} ${member.lastName}`,
          role: role,
          roleDescription: '', // No description needed for ministry leaders
          leadershipTypes: ['ministry-leaders'],
          isActive: true,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add ministry leader');
      }
    } catch (error) {
      console.error('Error adding ministry leader:', error);
      alert('Failed to add ministry leader');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add {contactPersonName} as Ministry Leader</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-sm text-gray-900 mb-1">Ministry Role:</h4>
            <p className="text-sm text-gray-700">{role}</p>
            {ministryNames.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">
                  {ministryNames.join(', ')}
                </p>
              </div>
            )}
          </div>

          <fieldset className="border-0 p-0 m-0">
            <div>
              <Label htmlFor="member-search">Match to Member in Database *</Label>
              <div className="space-y-2">
                <Input
                  id="member-search"
                  name="member-search"
                  placeholder="Search for this person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                  type="search"
                />
                <div role="combobox" aria-label="Select member">
                  <Select 
                    value={selectedMemberId} 
                    onValueChange={setSelectedMemberId}
                    required
                  >
                    <SelectTrigger id="member">
                      <SelectValue placeholder="Choose matching member" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {filteredMembers.map(member => {
                        const displayName = member.preferredName || member.firstName;
                        return (
                          <SelectItem key={member.id} value={member.id}>
                            {displayName} {member.lastName}
                            {member.preferredName && ` (${member.firstName})`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
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
              disabled={loading || !selectedMemberId}
              className="flex-1 bg-indigo-900 hover:bg-indigo-900/90 text-white"
            >
              {loading ? 'Adding...' : 'Add Ministry Leader'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

