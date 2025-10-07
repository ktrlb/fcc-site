'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AssignToRoleModal } from './assign-to-role-modal';
import { Edit, Trash2, User, UserPlus, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Assignment {
  id: string;
  memberId: string;
  displayName: string;
  termStart?: string;
  termEnd?: string;
  isActive: boolean;
}

interface Role {
  id: string;
  roleName: string;
  roleType: string;
  description?: string;
  ministryTeamId?: string;
  maxPositions: number;
  sortOrder: number;
  ministry?: {
    id: string;
    name: string;
  };
  assignments: Assignment[];
  currentAssignments: number;
}

const ROLE_TYPE_CONFIG = {
  'general-board': { label: 'General Board', color: 'bg-blue-600' },
  'elder': { label: 'Elders', color: 'bg-purple-600' },
  'deacon': { label: 'Deacons', color: 'bg-green-600' },
  'ministry-leader': { label: 'Ministry Leaders', color: 'bg-amber-600' },
  'volunteer': { label: 'Volunteers', color: 'bg-gray-600' },
};

export function LeadershipRolesDashboard() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    roleId: string;
    roleName: string;
    roleDescription?: string;
  }>({
    isOpen: false,
    roleId: '',
    roleName: '',
    roleDescription: '',
  });

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/leadership-roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('Remove this person from this role?')) return;

    try {
      const response = await fetch(`/api/admin/leadership-assignments?id=${assignmentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchRoles();
      } else {
        alert('Failed to remove assignment');
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      alert('Failed to remove assignment');
    }
  };

  const updateMaxPositions = async (roleId: string, maxPositions: number) => {
    try {
      const response = await fetch(`/api/admin/leadership-roles/${roleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxPositions }),
      });

      if (response.ok) {
        fetchRoles();
      } else {
        alert('Failed to update max positions');
      }
    } catch (error) {
      console.error('Failed to update max positions:', error);
      alert('Failed to update max positions');
    }
  };

  const toggleSection = (key: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading leadership roles...</p>
        </div>
      </div>
    );
  }

  // Group roles by type
  const rolesByType = roles.reduce((acc, role) => {
    if (!acc[role.roleType]) {
      acc[role.roleType] = [];
    }
    acc[role.roleType].push(role);
    return acc;
  }, {} as Record<string, Role[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Leadership Roles & Assignments</h2>
      </div>

      {/* Sections by Role Type */}
      <div className="space-y-4">
        {Object.entries(ROLE_TYPE_CONFIG).map(([typeKey, typeConfig]) => {
          const typeRoles = rolesByType[typeKey] || [];
          if (typeRoles.length === 0) return null;

          const isCollapsed = collapsedSections.has(typeKey);
          const totalAssignments = typeRoles.reduce((sum, r) => sum + r.currentAssignments, 0);
          const totalSlots = typeRoles.reduce((sum, r) => sum + r.maxPositions, 0);

          return (
            <div key={typeKey} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(typeKey)}
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  {isCollapsed ? (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{typeConfig.label}</h4>
                    <p className="text-sm text-gray-600">
                      {typeRoles.length} {typeRoles.length === 1 ? 'role' : 'roles'}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {totalAssignments} / {totalSlots} filled
                </Badge>
              </button>

              {!isCollapsed && (
                <div className="p-4 bg-white space-y-2">
                  {typeRoles.map((role) => (
                    <Card key={role.id} className="border-l-4" style={{ borderLeftColor: typeConfig.color.replace('bg-', '#') }}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Role Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-semibold text-gray-900">{role.roleName}</h5>
                                {role.ministry && (
                                  <Link 
                                    href={`/ministry-database?search=${encodeURIComponent(role.ministry.name)}`}
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Link>
                                )}
                              </div>
                              {role.description && (
                                <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                              )}
                              {role.ministry && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Ministry: {role.ministry.name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {role.currentAssignments} / {role.maxPositions}
                              </Badge>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newMax = prompt(`How many people can hold the "${role.roleName}" role?`, role.maxPositions.toString());
                                  if (newMax && !isNaN(parseInt(newMax))) {
                                    updateMaxPositions(role.id, parseInt(newMax));
                                  }
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                                title="Edit max positions"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Assigned People */}
                          {role.assignments.length > 0 && (
                            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                              {role.assignments.map((assignment) => (
                                <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                  <div>
                                    <p className="font-medium text-sm text-gray-900">{assignment.displayName}</p>
                                    {(assignment.termStart || assignment.termEnd) && (
                                      <p className="text-xs text-gray-500">
                                        {assignment.termStart && new Date(assignment.termStart).toLocaleDateString()}
                                        {assignment.termStart && assignment.termEnd && ' - '}
                                        {assignment.termEnd && new Date(assignment.termEnd).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add Person Button */}
                          {role.currentAssignments < role.maxPositions && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAssignModal({
                                isOpen: true,
                                roleId: role.id,
                                roleName: role.roleName,
                                roleDescription: role.description,
                              })}
                              className="w-full"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              {role.assignments.length === 0 ? 'Assign Person' : 'Add Another Person'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AssignToRoleModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal({ ...assignModal, isOpen: false })}
        onSuccess={fetchRoles}
        roleId={assignModal.roleId}
        roleName={assignModal.roleName}
        roleDescription={assignModal.roleDescription}
      />
    </div>
  );
}

