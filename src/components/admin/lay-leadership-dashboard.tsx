'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayLeadershipUploadModal } from './lay-leadership-upload-modal';
import { LayLeadershipEditModal } from './lay-leadership-edit-modal';
import { QuickAddLeaderModal } from './quick-add-leader-modal';
import { AddMinistryLeaderModal } from './add-ministry-leader-modal';
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

export function LayLeadershipDashboard() {
  const [layLeaders, setLayLeaders] = useState<LayLeader[]>([]);
  const [ministryLeaders, setMinistryLeaders] = useState<MinistryLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLeader, setEditingLeader] = useState<LayLeader | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddCategory, setQuickAddCategory] = useState<'general-board' | 'elders' | 'deacons'>('general-board');
  const [showMinistryLeaderModal, setShowMinistryLeaderModal] = useState(false);
  const [ministryLeaderConfig, setMinistryLeaderConfig] = useState<{
    contactPersonName: string;
    role: string;
    ministryNames: string[];
  }>({
    contactPersonName: '',
    role: '',
    ministryNames: [],
  });

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
      const response = await fetch('/api/ministries');
      if (response.ok) {
        const data = await response.json();
        // Get all ministries with contact persons
        const ministriesWithContacts = (data.ministries || [])
          .filter((m: any) => m.contactPerson && m.contactPerson.trim());
        
        // Group by contact person name
        const groupedByPerson = new Map<string, any[]>();
        ministriesWithContacts.forEach((m: any) => {
          const name = m.contactPerson.trim();
          if (!groupedByPerson.has(name)) {
            groupedByPerson.set(name, []);
          }
          groupedByPerson.get(name)!.push({
            id: m.id,
            name: m.name,
            contactHeading: m.contactHeading,
          });
        });
        
        // Convert to array format with all ministries per person
        const leaders = Array.from(groupedByPerson.entries()).map(([personName, ministries]) => {
          // Get email from first ministry that has it
          const firstMinistryWithEmail = ministriesWithContacts.find(
            (m: any) => m.contactPerson.trim() === personName && m.contactEmail
          );
          
          return {
            id: personName, // Use name as ID since it's grouped
            contactPerson: personName,
            contactEmail: firstMinistryWithEmail?.contactEmail,
            ministries: ministries,
          };
        }).sort((a, b) => a.contactPerson.localeCompare(b.contactPerson));
        
        setMinistryLeaders(leaders);
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

      {/* Ministry Leaders Section - Multiple Contacts */}
      {ministryLeaders.filter(leader => {
        const hasMultipleContacts = leader.contactPerson.includes('&') || leader.contactPerson.includes(' and ');
        const isAlreadyAdded = layLeaders.some(ll => 
          ll.displayName.toLowerCase().includes(leader.contactPerson.toLowerCase()) ||
          leader.contactPerson.toLowerCase().includes(ll.displayName.toLowerCase())
        );
        return hasMultipleContacts && !isAlreadyAdded;
      }).length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Ministries with Multiple Contacts</h3>
          <p className="text-sm text-gray-600 mb-3">
            ⚠️ These have multiple people listed - add each individually.
          </p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {ministryLeaders
              .filter(leader => {
                const hasMultipleContacts = leader.contactPerson.includes('&') || leader.contactPerson.includes(' and ');
                const isAlreadyAdded = layLeaders.some(ll => 
                  ll.displayName.toLowerCase().includes(leader.contactPerson.toLowerCase()) ||
                  leader.contactPerson.toLowerCase().includes(ll.displayName.toLowerCase())
                );
                return hasMultipleContacts && !isAlreadyAdded;
              })
              .sort((a, b) => {
                const aName = a.ministries[0]?.name || '';
                const bName = b.ministries[0]?.name || '';
                return aName.localeCompare(bName);
              })
              .map((leader) => (
              <div key={leader.id} className="flex items-center justify-between p-2 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 h-[60px]">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-orange-700 text-sm truncate">{leader.contactPerson}</h4>
                  <p className="text-xs text-gray-600 truncate">
                    {leader.ministries.map(m => m.name).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ministry Leaders Section - Single Contacts */}
      {ministryLeaders.filter(leader => {
        const isSingleContact = !leader.contactPerson.includes('&') && !leader.contactPerson.includes(' and ');
        const isAlreadyAdded = layLeaders.some(ll => 
          ll.displayName.toLowerCase() === leader.contactPerson.toLowerCase()
        );
        return isSingleContact && !isAlreadyAdded;
      }).length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Ministry Leaders Not Yet Added</h3>
          <p className="text-sm text-gray-600 mb-3">
            Click "Add" to match them with a member in the database.
          </p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {ministryLeaders
              .filter(leader => {
                const isSingleContact = !leader.contactPerson.includes('&') && !leader.contactPerson.includes(' and ');
                const isAlreadyAdded = layLeaders.some(ll => 
                  ll.displayName.toLowerCase() === leader.contactPerson.toLowerCase()
                );
                return isSingleContact && !isAlreadyAdded;
              })
              .sort((a, b) => {
                // Sort by first ministry name alphabetically
                const aName = a.ministries[0]?.name || '';
                const bName = b.ministries[0]?.name || '';
                return aName.localeCompare(bName);
              })
              .map((leader) => (
              <div key={leader.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 h-[60px]">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{leader.contactPerson}</h4>
                  <p className="text-xs text-gray-600 truncate">
                    {leader.ministries.map(m => m.name).join(', ')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const role = leader.ministries.length === 1 && leader.ministries[0].contactHeading
                      ? leader.ministries[0].contactHeading
                      : leader.ministries.map(m => m.name).join(' & ') + ' Leader';
                    setMinistryLeaderConfig({
                      contactPersonName: leader.contactPerson,
                      role: role,
                      ministryNames: leader.ministries.map(m => m.name),
                    });
                    setShowMinistryLeaderModal(true);
                  }}
                  className="ml-2 flex-shrink-0"
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

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
            
            // Regular rendering for other types
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

                {/* Section Content */}
                {!isCollapsed && (
                  <div className="p-4 space-y-3 bg-white">
                    {leaders.map((leader, index) => (
          <Card 
            key={leader.id} 
            className={`w-full transition-all duration-200 ${
              draggedIndex === index ? 'opacity-50 scale-95' : 'hover:shadow-lg'
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="relative w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {leader.imageUrl ? (
                      <img 
                        src={leader.imageUrl} 
                        alt={leader.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {leader.displayName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {leader.role}
                        </Badge>
                        {categorizeLeader(leader.role).map((cat) => {
                          const typeInfo = LEADERSHIP_TYPES.find(t => t.key === cat);
                          return (
                            <Badge key={cat} variant="outline" className="text-xs text-gray-600 border-gray-300">
                              {typeInfo?.label}
                            </Badge>
                          );
                        })}
                        {!leader.isActive && (
                          <Badge variant="outline" className="text-gray-500">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      {leader.roleDescription && (
                        <p className="text-sm text-gray-600 mt-1">
                          {leader.roleDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        {leader.publicEmail && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {leader.publicEmail}
                          </div>
                        )}
                        {leader.publicPhone && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {leader.publicPhone}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
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
                </div>
              </div>
            </CardContent>
          </Card>
                    ))}
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

      <AddMinistryLeaderModal
        isOpen={showMinistryLeaderModal}
        onClose={() => setShowMinistryLeaderModal(false)}
        onSuccess={fetchLayLeaders}
        contactPersonName={ministryLeaderConfig.contactPersonName}
        role={ministryLeaderConfig.role}
        ministryNames={ministryLeaderConfig.ministryNames}
      />
    </div>
  );
}
