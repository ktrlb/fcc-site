"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import type { MinistryTeam } from "@/lib/schema";

interface KeywordManagementProps {
  onDataUpdated: () => void;
}

interface Keyword {
  id: string;
  name: string;
  fiveThingsCategory: string;
  ministries: string[];
}

const FIVE_THINGS_CATEGORIES = [
  { key: "prayer-worship", label: "Prayer & Worship" },
  { key: "study", label: "Study" },
  { key: "service", label: "Service" },
  { key: "presence", label: "Presence" },
  { key: "generosity", label: "Generosity" }
];

export function KeywordManagement({ onDataUpdated }: KeywordManagementProps) {
  const [ministries, setMinistries] = useState<MinistryTeam[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fiveThingsCategory: "",
    ministries: [] as string[]
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load ministries
      const ministriesResponse = await fetch('/api/admin/ministries');
      if (ministriesResponse.ok) {
        const ministriesData = await ministriesResponse.json();
        setMinistries(ministriesData);
      }

      // Generate keywords from existing categories
      const categorySet = new Set<string>();
      ministries.forEach(ministry => {
        if (ministry.categories && ministry.categories.length > 0) {
          ministry.categories.forEach(cat => categorySet.add(cat));
        }
        if (ministry.category) {
          categorySet.add(ministry.category);
        }
      });

      // Create keyword objects from categories
      const keywordData: Keyword[] = Array.from(categorySet).map((category, index) => ({
        id: `keyword-${index}`,
        name: category,
        fiveThingsCategory: "", // Will need to be set manually
        ministries: ministries.filter(m => 
          (m.categories && m.categories.includes(category)) ||
          m.category === category
        ).map(m => m.id)
      }));

      setKeywords(keywordData);
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
      // Here you would save the keyword assignments to the database
      // For now, we'll just update the local state
      if (editingKeyword) {
        setKeywords(prev => prev.map(k => 
          k.id === editingKeyword.id ? { ...k, ...formData } : k
        ));
      } else {
        const newKeyword: Keyword = {
          id: `keyword-${Date.now()}`,
          ...formData
        };
        setKeywords(prev => [...prev, newKeyword]);
      }
      
      setEditingKeyword(null);
      setIsCreateModalOpen(false);
      setFormData({ name: "", fiveThingsCategory: "", ministries: [] });
      onDataUpdated();
    } catch (error) {
      console.error('Error saving keyword:', error);
    }
  };

  const handleDelete = (keywordId: string) => {
    setKeywords(prev => prev.filter(k => k.id !== keywordId));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading keywords...</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Keyword Management</h2>
          <p className="text-gray-600">Manage ministry keywords and their assignments to the Five Things categories</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Keyword
        </Button>
      </div>

      {/* Keywords List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keywords.map((keyword) => (
              <div key={keyword.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{keyword.name}</h3>
                    {keyword.fiveThingsCategory && (
                      <Badge variant="outline">
                        {FIVE_THINGS_CATEGORIES.find(ft => ft.key === keyword.fiveThingsCategory)?.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Used by {keyword.ministries.length} ministries
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingKeyword(keyword);
                      setFormData({
                        name: keyword.name,
                        fiveThingsCategory: keyword.fiveThingsCategory,
                        ministries: keyword.ministries
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(keyword.id)}
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

      {/* Edit/Create Modal */}
      {(editingKeyword || isCreateModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingKeyword ? 'Edit Keyword' : 'Add New Keyword'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keyword Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter keyword name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Five Things Category
                </label>
                <Select
                  value={formData.fiveThingsCategory}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, fiveThingsCategory: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIVE_THINGS_CATEGORIES.map((category) => (
                      <SelectItem key={category.key} value={category.key}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Associated Ministries
                </label>
                <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
                  {ministries.map((ministry) => (
                    <label key={ministry.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.ministries.includes(ministry.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              ministries: [...prev.ministries, ministry.id]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              ministries: prev.ministries.filter(id => id !== ministry.id)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{ministry.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingKeyword(null);
                    setIsCreateModalOpen(false);
                    setFormData({ name: "", fiveThingsCategory: "", ministries: [] });
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
