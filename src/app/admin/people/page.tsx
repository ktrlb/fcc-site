'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { CSVImportModal } from '@/components/admin/csv-import-modal';
import { FamilyImportModal } from '@/components/admin/family-import-modal';
import { checkAdminAuth } from '@/lib/admin-auth-client';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email?: string;
  phone?: string;
  membershipStatus: string;
  isActive: boolean;
  allowDirectoryListing: boolean;
  allowLayLeadership: boolean;
  createdAt: string;
  familyName?: string;
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

export default function AdminPeoplePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await checkAdminAuth();
      if (!auth) {
        router.push('/admin');
        return;
      }
      setIsAuthenticated(true);
      fetchMembers();
    };
    checkAuth();
  }, [router]);

  const fetchMembers = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/members?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
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

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="flex h-screen">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">People Management</h1>
            <p className="text-gray-600">Manage church members and families</p>
          </div>
          
          <div className="flex-1 p-6 overflow-auto">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:w-64">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Statuses</option>
                    {MEMBERSHIP_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={fetchMembers}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Search
                </button>
              </div>
              
                     {/* Import Section */}
                     <div className="flex justify-between items-center">
                       <div>
                         <h3 className="text-lg font-medium text-gray-900">Member Management</h3>
                         <p className="text-sm text-gray-600">Manage church members and families</p>
                       </div>
                       <div className="flex space-x-2">
                         <CSVImportModal onImportComplete={fetchMembers} />
                         <FamilyImportModal onImportComplete={fetchMembers} />
                       </div>
                     </div>
            </div>

            {/* Members Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading members...</div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Members ({members.length})
                  </h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <li key={member.id} className="px-4 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {member.firstName[0]}{member.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {member.preferredName || member.firstName} {member.lastName}
                              </p>
                              {!member.isActive && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.membershipStatus)}`}>
                                {member.membershipStatus}
                              </span>
                              {member.familyName && (
                                <span className="ml-2 text-sm text-gray-500">
                                  {member.familyName}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {member.email && <span>{member.email}</span>}
                              {member.phone && (
                                <span className="ml-2">{member.phone}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {member.allowDirectoryListing && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Directory
                            </span>
                          )}
                          {member.allowLayLeadership && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Leadership
                            </span>
                          )}
                          <button
                            onClick={() => router.push(`/admin/people/${member.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {members.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No members found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
