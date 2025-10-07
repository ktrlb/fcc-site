'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
}

interface AssignToRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roleId: string;
  roleName: string;
  roleDescription?: string;
}

export function AssignToRoleModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  roleId,
  roleName,
  roleDescription,
}: AssignToRoleModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [termStart, setTermStart] = useState('');
  const [termEnd, setTermEnd] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      setSearchTerm('');
      setSelectedMemberId('');
      setTermStart('');
      setTermEnd('');
    }
  }, [isOpen]);

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
      const response = await fetch('/api/admin/leadership-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId,
          memberId: selectedMemberId,
          termStart: termStart || null,
          termEnd: termEnd || null,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to assign person to role');
      }
    } catch (error) {
      console.error('Error assigning person:', error);
      alert('Failed to assign person');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Person to {roleName}</DialogTitle>
          {roleDescription && (
            <DialogDescription className="text-sm text-gray-600 mt-2 p-3 bg-blue-50 rounded-md">
              {roleDescription}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <fieldset className="border-0 p-0 m-0">
            <div>
              <Label htmlFor="member-search">Search for Member *</Label>
              <div className="space-y-2">
                <Input
                  id="member-search"
                  name="member-search"
                  placeholder="Type name to search..."
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
                      <SelectValue placeholder="Choose a member" />
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

          <fieldset className="border-0 p-0 m-0">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="termStart">Term Start (Optional)</Label>
                <Input
                  id="termStart"
                  name="termStart"
                  type="date"
                  value={termStart}
                  onChange={(e) => setTermStart(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div>
                <Label htmlFor="termEnd">Term End (Optional)</Label>
                <Input
                  id="termEnd"
                  name="termEnd"
                  type="date"
                  value={termEnd}
                  onChange={(e) => setTermEnd(e.target.value)}
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
              disabled={loading || !selectedMemberId}
              className="flex-1 bg-indigo-900 hover:bg-indigo-900/90 text-white"
            >
              {loading ? 'Assigning...' : 'Assign to Role'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

