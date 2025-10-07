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
import { UserPlus } from 'lucide-react';

interface Family {
  id: string;
  familyName: string;
  members?: Array<{
    firstName: string;
    lastName: string;
    preferredName?: string;
  }>;
}

interface AddMemberModalProps {
  onMemberAdded: () => void;
}

const MEMBERSHIP_STATUSES = [
  'Attender',
  'Does Not Attend (Member Left Church)',
  'Does Not Attend (Member Moved)',
  'Does Not Attend (Visitor Disengaged)',
  'Does Not Attend (Youth Aged Out)',
  'Member (Active)',
  'Member (Inactive)',
  'Small Group Participant',
  'Visitor',
  'Volunteer Only',
];

const FAMILY_RELATIONSHIPS = [
  'head',
  'spouse',
  'child',
  'parent',
  'sibling',
  'other',
];

export function AddMemberModal({ onMemberAdded }: AddMemberModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [families, setFamilies] = useState<Family[]>([]);
  const [familySearch, setFamilySearch] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    email: '',
    phone: '',
    membershipStatus: 'Visitor',
    familyId: '',
    relationship: 'head',
    isPrimary: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchFamilies();
    }
  }, [isOpen]);

  const fetchFamilies = async () => {
    try {
      const response = await fetch('/api/admin/families?includeMembers=true');
      if (response.ok) {
        const data = await response.json();
        setFamilies(data.families || []);
      }
    } catch (error) {
      console.error('Failed to fetch families:', error);
    }
  };

  const filteredFamilies = families.filter(f =>
    f.familyName.toLowerCase().includes(familySearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create member
      const memberResponse = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          preferredName: formData.preferredName || null,
          email: formData.email || null,
          phone: formData.phone || null,
          membershipStatus: formData.membershipStatus,
          isActive: true,
          allowDirectoryListing: false,
          allowLayLeadership: false,
        }),
      });

      if (!memberResponse.ok) {
        throw new Error('Failed to create member');
      }

      const memberData = await memberResponse.json();
      const newMemberId = memberData.member.id;

      // Add to family if selected
      if (formData.familyId) {
        await fetch('/api/admin/family-memberships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberId: newMemberId,
            familyId: formData.familyId,
            relationship: formData.relationship,
            isPrimary: formData.isPrimary,
          }),
        });
      }

      onMemberAdded();
      setIsOpen(false);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        preferredName: '',
        email: '',
        phone: '',
        membershipStatus: 'Visitor',
        familyId: '',
        relationship: 'head',
        isPrimary: true,
      });
      setFamilySearch('');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Add Member
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <fieldset className="border-0 p-0 m-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    autoComplete="given-name"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border-0 p-0 m-0">
              <div>
                <Label htmlFor="preferredName">Preferred Name / Nickname (Optional)</Label>
                <Input
                  id="preferredName"
                  name="preferredName"
                  value={formData.preferredName}
                  onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                  placeholder="e.g., Bob instead of Robert"
                  autoComplete="nickname"
                />
              </div>
            </fieldset>

            <fieldset className="border-0 p-0 m-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    autoComplete="tel"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="border-0 p-0 m-0">
              <div>
                <Label htmlFor="membershipStatus">Membership Status *</Label>
                <Select 
                  value={formData.membershipStatus} 
                  onValueChange={(value) => setFormData({ ...formData, membershipStatus: value })}
                  required
                >
                  <SelectTrigger id="membershipStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBERSHIP_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </fieldset>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Add to Family (Optional)</h4>
              
              <fieldset className="border-0 p-0 m-0">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="family-search">Search for Family</Label>
                    <Input
                      id="family-search"
                      name="family-search"
                      placeholder="Type family name..."
                      value={familySearch}
                      onChange={(e) => setFamilySearch(e.target.value)}
                      autoComplete="off"
                      type="search"
                    />
                  </div>

                  <div>
                    <Label htmlFor="familyId">Select Family</Label>
                    <Select 
                      value={formData.familyId || undefined} 
                      onValueChange={(value) => setFormData({ ...formData, familyId: value })}
                    >
                      <SelectTrigger id="familyId">
                        <SelectValue placeholder="Choose a family (optional)" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {filteredFamilies.map(family => {
                          const memberNames = family.members
                            ?.map(m => (m.preferredName || m.firstName))
                            .join(', ') || '';
                          
                          return (
                            <SelectItem key={family.id} value={family.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{family.familyName}</span>
                                {memberNames && (
                                  <span className="text-xs text-gray-500">{memberNames}</span>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {formData.familyId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, familyId: '' })}
                        className="mt-1 text-xs text-gray-500"
                      >
                        Clear family selection
                      </Button>
                    )}
                  </div>

                  {formData.familyId && (
                    <div>
                      <Label htmlFor="relationship">Relationship to Family</Label>
                      <Select 
                        value={formData.relationship} 
                        onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                      >
                        <SelectTrigger id="relationship">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FAMILY_RELATIONSHIPS.map(rel => (
                            <SelectItem key={rel} value={rel}>
                              {rel.charAt(0).toUpperCase() + rel.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </fieldset>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? 'Adding...' : 'Add Member'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

