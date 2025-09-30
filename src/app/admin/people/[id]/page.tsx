'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { checkAdminAuth } from '@/lib/admin-auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  pastNames?: string;
  nameSuffix?: string;
  email?: string;
  churchEmail?: string;
  phone?: string;
  socialMedia?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  anniversaryDate?: string;
  memberSince?: string;
  membershipStatus: string;
  baptismDate?: string;
  spouseName?: string;
  childrenNames?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  communicationPreferences?: string;
  optOutCommunications?: string;
  isActive: boolean;
  allowDirectoryListing: boolean;
  allowLayLeadership: boolean;
  notes?: string;
  customFields?: string;
  createdAt: string;
  updatedAt: string;
  familyName?: string;
  familyAddress?: string;
  familyCity?: string;
  familyState?: string;
  familyZipCode?: string;
  familyPhone?: string;
  familyEmail?: string;
  familyNotes?: string;
  welcomeTeamInfo?: any;
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

export default function MemberDetailPage() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await checkAdminAuth();
      if (!auth) {
        router.push('/admin');
        return;
      }
      setIsAuthenticated(true);
      fetchMember();
    };
    checkAuth();
  }, [router, memberId]);

  const fetchMember = async () => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}`);
      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
      } else {
        console.error('Failed to fetch member');
      }
    } catch (error) {
      console.error('Error fetching member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!member) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(member),
      });

      if (response.ok) {
        setIsEditing(false);
        await fetchMember(); // Refresh data
      } else {
        console.error('Failed to save member');
      }
    } catch (error) {
      console.error('Error saving member:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Member (Active)':
        return 'bg-green-100 text-green-800';
      case 'Visitor':
        return 'bg-blue-100 text-blue-800';
      case 'Attender':
        return 'bg-yellow-100 text-yellow-800';
      case 'Member (Inactive)':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || loading) {
    return <div>Loading...</div>;
  }

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="flex h-screen">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin/people')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to People
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {member.preferredName || member.firstName} {member.lastName}
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(member.membershipStatus)}>
                      {member.membershipStatus}
                    </Badge>
                    {!member.isActive && (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Member
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={member.firstName}
                        onChange={(e) => setMember({ ...member, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={member.lastName}
                        onChange={(e) => setMember({ ...member, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferredName">Preferred Name</Label>
                      <Input
                        id="preferredName"
                        value={member.preferredName || ''}
                        onChange={(e) => setMember({ ...member, preferredName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameSuffix">Name Suffix</Label>
                      <Input
                        id="nameSuffix"
                        value={member.nameSuffix || ''}
                        onChange={(e) => setMember({ ...member, nameSuffix: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Jr., Sr., III, etc."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="membershipStatus">Membership Status</Label>
                    <Select
                      value={member.membershipStatus}
                      onValueChange={(value) => setMember({ ...member, membershipStatus: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MEMBERSHIP_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={member.email || ''}
                      onChange={(e) => setMember({ ...member, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="churchEmail">Church Email</Label>
                    <Input
                      id="churchEmail"
                      type="email"
                      value={member.churchEmail || ''}
                      onChange={(e) => setMember({ ...member, churchEmail: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={member.phone || ''}
                      onChange={(e) => setMember({ ...member, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={member.address || ''}
                      onChange={(e) => setMember({ ...member, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={member.city || ''}
                        onChange={(e) => setMember({ ...member, city: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={member.state || ''}
                        onChange={(e) => setMember({ ...member, state: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={member.zipCode || ''}
                        onChange={(e) => setMember({ ...member, zipCode: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Family Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Family Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {member.familyName && (
                    <div>
                      <Label>Family</Label>
                      <p className="text-sm text-gray-600">{member.familyName}</p>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="spouseName">Spouse Name</Label>
                    <Input
                      id="spouseName"
                      value={member.spouseName || ''}
                      onChange={(e) => setMember({ ...member, spouseName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="childrenNames">Children Names</Label>
                    <Textarea
                      id="childrenNames"
                      value={member.childrenNames || ''}
                      onChange={(e) => setMember({ ...member, childrenNames: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter children names, one per line"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Important Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={member.dateOfBirth ? member.dateOfBirth.split('T')[0] : ''}
                      onChange={(e) => setMember({ ...member, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="anniversaryDate">Anniversary Date</Label>
                    <Input
                      id="anniversaryDate"
                      type="date"
                      value={member.anniversaryDate ? member.anniversaryDate.split('T')[0] : ''}
                      onChange={(e) => setMember({ ...member, anniversaryDate: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="memberSince">Member Since</Label>
                    <Input
                      id="memberSince"
                      type="date"
                      value={member.memberSince ? member.memberSince.split('T')[0] : ''}
                      onChange={(e) => setMember({ ...member, memberSince: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="baptismDate">Baptism Date</Label>
                    <Input
                      id="baptismDate"
                      type="date"
                      value={member.baptismDate ? member.baptismDate.split('T')[0] : ''}
                      onChange={(e) => setMember({ ...member, baptismDate: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowDirectoryListing"
                      checked={member.allowDirectoryListing}
                      onChange={(e) => setMember({ ...member, allowDirectoryListing: e.target.checked })}
                      disabled={!isEditing}
                      className="rounded"
                    />
                    <Label htmlFor="allowDirectoryListing">Allow Directory Listing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowLayLeadership"
                      checked={member.allowLayLeadership}
                      onChange={(e) => setMember({ ...member, allowLayLeadership: e.target.checked })}
                      disabled={!isEditing}
                      className="rounded"
                    />
                    <Label htmlFor="allowLayLeadership">Allow Lay Leadership</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={member.notes || ''}
                    onChange={(e) => setMember({ ...member, notes: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Internal notes about this member..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
