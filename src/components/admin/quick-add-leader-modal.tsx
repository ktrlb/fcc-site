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

const ROLE_DEFINITIONS = {
  // General Board
  'Moderator': 'Presides at all meetings of the General Board and the congregation and serves as president of the corporation.',
  'Vice Moderator': 'In the absence of the Moderator, performs all duties of the Moderator. Serves as Chairperson of the Personnel Committee.',
  'Recording Secretary': 'Keeps and distributes minutes of all regular and special meetings of the congregation and the General Board.',
  'Treasurer': 'Provides oversight for the financial life of the congregation regarding receipt of all income and expenditures.',
  'Financial Secretary': 'Oversees the counting of receipts and coordinates with the bookkeeper to ensure accurate financial records.',
  'Outreach Representative': 'Serves as an advocate for the outreach ministry of the congregation and oversees the outreach budget.',
  'Stewardship Representative': 'Fosters faithful stewardship year-round and coordinates the annual stewardship campaign.',
  'Property Representative': 'Provides oversight of property and makes recommendations for repair and upkeep.',
  'MVT Member-at-Large': 'Participates in ongoing ministry visioning and discernment across all areas of ministry.',
  'Chair of Permanent Funds': 'Leads the team that oversees management of invested funds and allocation of distributions.',
  'La Reunion Board Member': 'Provides leadership and strategic visioning for the La Reunion Outreach Center & Food Pantry.',
  'Trustee': 'Acts as legal agent of the church in all business matters under direction of the General Board.',
  
  // Elders & Deacons
  'Elder': 'Oversees the spiritual life of the congregation, serves at the Lord\'s table, and assists in caregiving ministries.',
  'Chair of the Elders': 'Leads the Elders in overseeing spiritual life and pastoral functions of the congregation.',
  'Deacon': 'Facilitates worship and assists in greeting, communion preparation, serving, and receiving offerings.',
  'Chair of the Deacons': 'Leads the Deacons in facilitating worship and supporting the growth of the congregation.',
} as const;

interface QuickAddLeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: 'general-board' | 'elders' | 'deacons';
}

export function QuickAddLeaderModal({ isOpen, onClose, onSuccess, category }: QuickAddLeaderModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const categoryConfig = {
    'general-board': {
      title: 'Add to General Board',
      roles: [
        'Moderator',
        'Vice Moderator',
        'Recording Secretary',
        'Treasurer',
        'Financial Secretary',
        'Outreach Representative',
        'Stewardship Representative',
        'Property Representative',
        'MVT Member-at-Large',
        'Chair of Permanent Funds',
        'La Reunion Board Member',
        'Trustee',
        'Chair of the Elders',
        'Chair of the Deacons',
      ],
    },
    'elders': {
      title: 'Add Elder',
      roles: ['Elder', 'Chair of the Elders'],
    },
    'deacons': {
      title: 'Add Deacon',
      roles: ['Deacon', 'Chair of the Deacons'],
    },
  };

  const config = categoryConfig[category];

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      setSearchTerm('');
      setSelectedMemberId('');
      setSelectedRole('');
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
      const member = members.find(m => m.id === selectedMemberId);
      if (!member) {
        alert('Please select a member');
        return;
      }

      const displayName = member.preferredName || member.firstName;
      const roleDescription = ROLE_DEFINITIONS[selectedRole as keyof typeof ROLE_DEFINITIONS] || '';

      const response = await fetch('/api/admin/lay-leadership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: selectedMemberId,
          displayName: `${displayName} ${member.lastName}`,
          role: selectedRole,
          roleDescription: roleDescription,
          leadershipTypes: [category],
          isActive: true,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add leader');
      }
    } catch (error) {
      console.error('Error adding leader:', error);
      alert('Failed to add leader');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
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
            <div>
              <Label htmlFor="role">Select Role *</Label>
              <Select 
                value={selectedRole} 
                onValueChange={setSelectedRole}
                required
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {config.roles.map(role => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRole && ROLE_DEFINITIONS[selectedRole as keyof typeof ROLE_DEFINITIONS] && (
                <p className="text-sm text-gray-600 mt-2 p-3 bg-blue-50 rounded-md">
                  {ROLE_DEFINITIONS[selectedRole as keyof typeof ROLE_DEFINITIONS]}
                </p>
              )}
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
              disabled={loading || !selectedMemberId || !selectedRole}
              className="flex-1 bg-indigo-900 hover:bg-indigo-900/90 text-white"
            >
              {loading ? 'Adding...' : 'Add Leader'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

