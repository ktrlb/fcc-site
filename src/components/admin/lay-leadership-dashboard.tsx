'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayLeadershipUploadModal } from './lay-leadership-upload-modal';
import { LayLeadershipEditModal } from './lay-leadership-edit-modal';
import { QuickAddLeaderModal } from './quick-add-leader-modal';
import { Edit, Trash2, User, Mail, Briefcase, GripVertical, ChevronDown, ChevronRight, UserPlus } from 'lucide-react';

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

interface MinistryLeader {
  id: string;
  contactPerson: string;
  contactEmail?: string;
  ministries: Array<{
    id: string;
    name: string;
    contactHeading?: string;
  }>;
}

const LEADERSHIP_TYPES = [
  { key: 'general-board', label: 'General Board', description: 'Board members and trustees' },
  { key: 'elders', label: 'Elders', description: 'Spiritual leadership' },
  { key: 'deacons', label: 'Deacons', description: 'Service and support' },
  { key: 'ministry-leaders', label: 'Ministry Leaders', description: 'Ministry team contacts' },
  { key: 'volunteers', label: 'Volunteers', description: 'Active volunteers and helpers' },
] as const;

const BOARD_POSITIONS = [
  'Moderator',
  'Vice Moderator',
  'Recording Secretary',
  'Treasurer',
  'Stewardship Representative',
  'Outreach Representative',
  'Property Representative',
  'Chair of the Elders',
  'Chair of the Deacons',
  'Trustee',
  'Chair of Permanent Funds',
] as const;

const VOLUNTEER_ROLES = [
  'Church Historian',
  'Communication Coordinator',
  'Recycling Volunteer',
] as const;

export function LayLeadershipDashboard() {
  const [layLeaders, setLayLeaders] = useState<LayLeader[]>([]);
  const [ministryLeaders, setMinistryLeaders] = useState<MinistryLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLeader, setEditingLeader] = useState<LayLeader | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(['general-board', 'elders', 'deacons', 'ministry-leaders', 'volunteers'])
  );
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddCategory, setQuickAddCategory] = useState<'general-board' | 'elders' | 'deacons' | 'volunteers'>('general-board');

  const fetchLayLeaders = async () => {
    try {
      const response = await fetch('/api/admin/lay-leadership');
      if (response.ok) {
        const data = await response.json();
        setLayLeaders(data.layLeaders || []);
      }
    } catch (error) {
      console.error('Failed to fetch lay leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMinistryLeaders = async () => {
    try {
      const response = await fetch('/api/admin/ministries');
      if (response.ok) {
        const ministries = await response.json();
        console.log('📊 Total ministries fetched for lay leadership:', ministries.length);
        
        // Format ALL ministries for display (including those without leaders)
        const formattedLeaders = ministries.map((ministry: any) => {
          let leaderNames = '';
          
          if (ministry.leaders && ministry.leaders.length > 0) {
            leaderNames = ministry.leaders
              .filter((l: any) => l.member)
              .map((l: any) => {
                const firstName = l.member.preferredName || l.member.firstName;
                const lastName = l.member.lastName;
                return `${firstName} ${lastName}`;
              })
              .join(', ');
          }
          
          return {
            id: ministry.id,
            contactPerson: leaderNames,
            ministries: [{ id: ministry.id, name: ministry.name, isActive: ministry.isActive }],
          };
        }).sort((a: any, b: any) => a.ministries[0].name.localeCompare(b.ministries[0].name));
        
        console.log('📋 Formatted ministry leaders:', formattedLeaders.length);
        setMinistryLeaders(formattedLeaders);
      }
    } catch (error) {
      console.error('Failed to fetch ministry leaders:', error);
    }
  };

  const handleLeaderUpdated = (updatedLeader: LayLeader) => {
    setLayLeaders(prev => prev.map(leader => 
      leader.id === updatedLeader.id ? updatedLeader : leader
    ));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newLayLeaders = [...layLeaders];
    const draggedLeader = newLayLeaders[draggedIndex];
    newLayLeaders.splice(draggedIndex, 1);
    newLayLeaders.splice(dropIndex, 0, draggedLeader);

    setLayLeaders(newLayLeaders);
    setDraggedIndex(null);

    // Update sort order in database
    try {
      await fetch('/api/admin/lay-leadership/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layLeaders: newLayLeaders.map((leader, index) => ({
            id: leader.id,
            sortOrder: index
          }))
        })
      });
    } catch (error) {
      console.error('Failed to update sort order:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lay leader?')) return;

    try {
      const response = await fetch(`/api/admin/lay-leadership/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLayLeaders(prev => prev.filter(leader => leader.id !== id));
      } else {
        alert('Failed to delete lay leader');
      }
    } catch (error) {
      console.error('Failed to delete lay leader:', error);
      alert('Failed to delete lay leader');
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

  // Categorize leaders by their role (a person can appear in multiple categories)
  const categorizeLeader = (role: string): string[] => {
    const roleLower = role.toLowerCase();
    const categories: string[] = [];
    
    // Check for volunteer roles first (highest priority for specific volunteer roles)
    if (
      roleLower.includes('historian') ||
      roleLower.includes('communication coordinator') ||
      roleLower.includes('recycling') ||
      roleLower === 'church historian' ||
      roleLower === 'communication coordinator' ||
      roleLower === 'recycling volunteer'
    ) {
      categories.push('volunteers');
      return categories; // Return early for volunteers
    }
    
    // Check for keywords in role to determine categories
    if (roleLower.includes('board') || roleLower.includes('trustee') || roleLower.includes('moderator')) {
      categories.push('general-board');
    }
    if (roleLower.includes('elder')) {
      categories.push('elders');
    }
    if (roleLower.includes('deacon')) {
      categories.push('deacons');
    }
    if (roleLower.includes('ministry') || roleLower.includes('worship') || roleLower.includes('music') || 
        roleLower.includes('outreach') || roleLower.includes('education') || roleLower.includes('chair')) {
      categories.push('ministry-leaders');
    }
    
    // If no specific category, put in volunteers
    if (categories.length === 0) {
      categories.push('volunteers');
    }
    
    return categories;
  };

  // Group leaders by category (leaders can appear in multiple categories)
  const leadersByType = LEADERSHIP_TYPES.reduce((acc, type) => {
    acc[type.key] = layLeaders.filter(leader => {
      const categories = categorizeLeader(leader.role);
      return categories.includes(type.key);
    });
    return acc;
  }, {} as Record<string, LayLeader[]>);

  useEffect(() => {
    fetchLayLeaders();
    fetchMinistryLeaders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading lay leaders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lay Leadership Management</h2>
        <LayLeadershipUploadModal onLeaderAdded={fetchLayLeaders} />
      </div>

      {/* Quick Add Sections */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Add Leaders</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">General Board</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">
                Moderator, Vice Moderator, Stewardship Rep, Outreach Rep, Property Rep, Permanent Fund Rep, Recording Secretary, Chair of Elders, Chair of Deacons
              </p>
              <Button
                onClick={() => {
                  setQuickAddCategory('general-board');
                  setShowQuickAddModal(true);
                }}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Board Member
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Elders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">
                Spiritual leadership (~14 elders)
              </p>
              <Button
                onClick={() => {
                  setQuickAddCategory('elders');
                  setShowQuickAddModal(true);
                }}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Elder
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Deacons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">
                Service and support ministries
              </p>
              <Button
                onClick={() => {
                  setQuickAddCategory('deacons');
                  setShowQuickAddModal(true);
                }}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Deacon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Existing Lay Leaders Section - Organized by Type */}
      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Current Lay Leaders</h3>
        <div className="space-y-6">
          {LEADERSHIP_TYPES.map((type) => {
            const leaders = leadersByType[type.key] || [];
            const isCollapsed = collapsedSections.has(type.key);
            
            // Special rendering for General Board with defined slots
            if (type.key === 'general-board') {
              return (
                <div key={type.key} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(type.key)}
                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isCollapsed ? (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{type.label}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {leaders.length} / {BOARD_POSITIONS.length} positions filled
                    </Badge>
                  </button>

                  {!isCollapsed && (
                    <div className="p-4 bg-white">
                      <div className="grid gap-2">
                        {BOARD_POSITIONS.map((position) => {
                          const assignedLeader = leaders.find(l => l.role === position);
                          
                          return (
                            <div key={position} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 text-sm">{position}</h5>
                                {assignedLeader ? (
                                  <p className="text-sm text-gray-600">{assignedLeader.displayName}</p>
                                ) : (
                                  <p className="text-sm text-gray-400 italic">Vacant</p>
                                )}
                              </div>
                              {assignedLeader ? (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingLeader(assignedLeader)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(assignedLeader.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setQuickAddCategory('general-board');
                                    setShowQuickAddModal(true);
                                  }}
                                >
                                  <UserPlus className="w-4 w-4 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            
            // Special rendering for Volunteers with defined roles
            if (type.key === 'volunteers') {
              return (
                <div key={type.key} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(type.key)}
                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isCollapsed ? (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{type.label}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {leaders.length} {leaders.length === 1 ? 'volunteer' : 'volunteers'}
                    </Badge>
                  </button>

                  {!isCollapsed && (
                    <div className="p-4 bg-white">
                      <div className="grid gap-2">
                        {/* Prepopulated volunteer roles */}
                        {VOLUNTEER_ROLES.map((role) => {
                          const assignedLeader = leaders.find(l => l.role === role);
                          
                          return (
                            <div key={role} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 text-sm">{role}</h5>
                                {assignedLeader ? (
                                  <p className="text-sm text-gray-600">{assignedLeader.displayName}</p>
                                ) : (
                                  <p className="text-sm text-gray-400 italic">Vacant</p>
                                )}
                              </div>
                              {assignedLeader ? (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingLeader(assignedLeader)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(assignedLeader.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setQuickAddCategory('volunteers');
                                    setShowQuickAddModal(true);
                                  }}
                                >
                                  <UserPlus className="w-4 w-4 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>
                          );
                        })}
                        
                        {/* Other volunteer roles not in the predefined list */}
                        {leaders
                          .filter(l => !VOLUNTEER_ROLES.includes(l.role as any))
                          .map((leader) => (
                            <div key={leader.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 text-sm">{leader.role}</h5>
                                <p className="text-sm text-gray-600">{leader.displayName}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingLeader(leader)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(leader.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        
                        {/* Add new custom volunteer role button */}
                        <div className="flex items-center justify-center p-3 mt-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setQuickAddCategory('volunteers');
                              setShowQuickAddModal(true);
                            }}
                            className="w-full"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Custom Volunteer Role
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            
            // Special rendering for Ministry Leaders - always show, simplified table view
            if (type.key === 'ministry-leaders') {
              return (
                <div key={type.key} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(type.key)}
                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isCollapsed ? (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{type.label}</h4>
                        <p className="text-sm text-gray-600">View all ministry team leaders</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {ministryLeaders.length} {ministryLeaders.length === 1 ? 'ministry' : 'ministries'}
                    </Badge>
                  </button>

                  {!isCollapsed && (
                    <div className="p-6 bg-white">
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                          <strong>Note:</strong> To add or edit ministry leaders, visit the{' '}
                          <button
                            type="button"
                            className="font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                            onClick={() => window.location.href = '/admin/ministries'}
                          >
                            Ministry Database Admin
                          </button>
                          . This is a read-only view.
                        </p>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left p-3 font-semibold text-gray-900">Ministry Name</th>
                              <th className="text-left p-3 font-semibold text-gray-900">Leader(s)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ministryLeaders.length === 0 ? (
                              <tr>
                                <td colSpan={2} className="text-center p-6 text-gray-500 italic">
                                  No ministries found. Visit the Ministry Database Admin to create ministries.
                                </td>
                              </tr>
                            ) : (
                              ministryLeaders.map((ministry) => (
                                <tr key={ministry.id} className="border-b hover:bg-gray-50 transition-colors">
                                  <td className="p-3 font-medium text-gray-900">{ministry.ministries[0]?.name || 'Unknown Ministry'}</td>
                                  <td className="p-3">
                                    {ministry.contactPerson ? (
                                      <span className="text-gray-700">{ministry.contactPerson}</span>
                                    ) : (
                                      <span className="text-gray-400 italic">No leaders assigned</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            
            // Regular rendering for other types (Elders, Deacons)
            if (leaders.length === 0) return null;
            
            return (
              <div key={type.key} className="border rounded-lg overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(type.key)}
                  className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    {isCollapsed ? (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{type.label}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {leaders.length} {leaders.length === 1 ? 'person' : 'people'}
                  </Badge>
                </button>

                {/* Section Content - Simple Table */}
                {!isCollapsed && (
                  <div className="p-6 bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-3 font-semibold text-gray-900">Name</th>
                            <th className="text-left p-3 font-semibold text-gray-900">Role</th>
                            <th className="text-left p-3 font-semibold text-gray-900">Contact</th>
                            <th className="text-right p-3 font-semibold text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaders.map((leader) => (
                            <tr key={leader.id} className="border-b hover:bg-gray-50 transition-colors">
                              <td className="p-3 font-medium text-gray-900">{leader.displayName}</td>
                              <td className="p-3 text-gray-700">{leader.role}</td>
                              <td className="p-3 text-sm text-gray-600">
                        {leader.publicEmail && (
                          <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    <span className="truncate max-w-[200px]">{leader.publicEmail}</span>
                          </div>
                        )}
                        {leader.publicPhone && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Briefcase className="w-3 h-3" />
                            {leader.publicPhone}
                          </div>
                        )}
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLeader(leader)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(leader.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
              </div>
                  </div>
                )}
              </div>
            );
          })}

          {layLeaders.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No lay leaders yet</h3>
                <p className="text-sm">Add your first lay leader to get started.</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {editingLeader && (
        <LayLeadershipEditModal
          leader={editingLeader}
          onClose={() => setEditingLeader(null)}
          onLeaderUpdated={handleLeaderUpdated}
        />
      )}

      <QuickAddLeaderModal
        isOpen={showQuickAddModal}
        onClose={() => setShowQuickAddModal(false)}
        onSuccess={fetchLayLeaders}
        category={quickAddCategory}
      />
    </div>
  );
}
