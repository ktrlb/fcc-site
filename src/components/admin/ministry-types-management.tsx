"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Search } from "lucide-react";
import type { MinistryTeam } from "@/lib/schema";

interface MinistryTypesManagementProps {
  onDataUpdated: () => void;
}

interface MinistryType {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  createdAt: string;
}

interface OrphanedTag {
  tag: string;
  ministryCount: number;
  ministries: string[];
}

export function MinistryTypesManagement({ onDataUpdated }: MinistryTypesManagementProps) {
  const [ministries, setMinistries] = useState<MinistryTeam[]>([]);
  const [ministryTypes, setMinistryTypes] = useState<MinistryType[]>([]);
  const [orphanedTags, setOrphanedTags] = useState<OrphanedTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingType, setEditingType] = useState<MinistryType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: ""
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load ministry types from database
      const typesResponse = await fetch('/api/admin/ministry-types');
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        setMinistryTypes(typesData);
      }
      
      // Load ministries to find orphaned tags
      const ministriesResponse = await fetch('/api/admin/ministries');
      if (ministriesResponse.ok) {
        const ministriesData = await ministriesResponse.json();
        setMinistries(ministriesData);
        
        // Find orphaned tags (tags that don't fit current categories)
        const allTags = new Set<string>();
        ministriesData.forEach((ministry: MinistryTeam) => {
          if (ministry.categories) {
            ministry.categories.forEach(cat => allTags.add(cat));
          }
        });
        
        const mainCategories = new Set(ministriesData.map((m: MinistryTeam) => m.category).filter(Boolean));
        const orphaned = Array.from(allTags).filter(tag => !mainCategories.has(tag));
        
        const orphanedTagsData: OrphanedTag[] = orphaned.map(tag => ({
          tag,
          ministryCount: ministriesData.filter((m: MinistryTeam) => 
            m.categories && m.categories.includes(tag)
          ).length,
          ministries: ministriesData
            .filter((m: MinistryTeam) => m.categories && m.categories.includes(tag))
            .map((m: MinistryTeam) => m.name)
        }));
        
        setOrphanedTags(orphanedTagsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      if (editingType) {
        // Update existing type
        const response = await fetch(`/api/admin/ministry-types/${editingType.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update ministry type');
        }

        const updatedType = await response.json();
        setMinistryTypes(prev => prev.map(t => 
          t.id === editingType.id ? updatedType : t
        ));
      } else {
        // Create new type
        const response = await fetch('/api/admin/ministry-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create ministry type');
        }

        const newType = await response.json();
        setMinistryTypes(prev => [...prev, newType]);
      }
      
      setEditingType(null);
      setIsCreateModalOpen(false);
      setFormData({ name: "", description: "", color: "" });
      
      onDataUpdated();
    } catch (error) {
      console.error('Error saving ministry type:', error);
      alert(error instanceof Error ? error.message : 'Failed to save ministry type');
    }
  };

  const handleDelete = async (typeId: string) => {
    if (!confirm('Are you sure you want to delete this ministry type?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/ministry-types/${typeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete ministry type');
      }

      setMinistryTypes(prev => prev.filter(t => t.id !== typeId));
      onDataUpdated();
    } catch (error) {
      console.error('Error deleting ministry type:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete ministry type');
    }
  };

  const handleDeleteOrphanedTag = (tag: string) => {
    setOrphanedTags(prev => prev.filter(t => t.tag !== tag));
  };

  const filteredOrphanedTags = orphanedTags.filter(tag => 
    tag.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.ministries.some(ministry => ministry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading ministry types...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ministry Types Management</h2>
          <p className="text-gray-600">Manage ministry categories and their display in the quick filter</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </Button>
      </div>

      {/* Ministry Types List */}
      <Card>
        <CardHeader>
          <CardTitle>Ministry Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ministryTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{type.name}</h3>
                    {type.description && (
                      <Badge variant="outline">{type.description}</Badge>
                    )}
                    {type.color && (
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: type.color }}
                        title={`Color: ${type.color}`}
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingType(type);
                      setFormData({
                        name: type.name,
                        description: type.description || "",
                        color: type.color || ""
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(type.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orphaned Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Orphaned Tags</CardTitle>
          <p className="text-sm text-gray-600">Tags that don't fit into main categories</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orphaned tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredOrphanedTags.map((tag) => (
              <div key={tag.tag} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{tag.tag}</h3>
                    <Badge variant="outline">{tag.ministryCount} ministries</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Used by:</strong> {tag.ministries.join(", ")}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        // Convert orphaned tag to ministry type
                        const response = await fetch('/api/admin/ministry-types', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: tag.tag,
                            description: `Converted from orphaned tag`,
                            color: null
                          }),
                        });

                        if (response.ok) {
                          const newType = await response.json();
                          setMinistryTypes(prev => [...prev, newType]);
                          onDataUpdated();
                          handleDeleteOrphanedTag(tag.tag);
                        } else {
                          const error = await response.json();
                          alert(error.error || 'Failed to create ministry type');
                        }
                      } catch (error) {
                        console.error('Error promoting orphaned tag:', error);
                        alert('Failed to promote orphaned tag');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Promote
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteOrphanedTag(tag.tag)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredOrphanedTags.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No orphaned tags found matching your search.' : 'No orphaned tags found.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Modal */}
      {(editingType || isCreateModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingType ? 'Edit Ministry Type' : 'Add New Ministry Type'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter ministry type name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this ministry type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color (optional)
                </label>
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#ff0000 or red"
                  type="color"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSave}
                  disabled={!formData.name.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingType(null);
                    setIsCreateModalOpen(false);
                    setFormData({ name: "", description: "", color: "" });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
