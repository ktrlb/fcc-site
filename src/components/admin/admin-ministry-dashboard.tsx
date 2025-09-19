"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, LogOut, Eye, Search } from "lucide-react";
// Removed direct database imports - using API routes instead
import type { MinistryTeam } from "@/lib/schema";
import { MinistryEditModal } from "./ministry-edit-modal";

export function AdminMinistryDashboard() {
  const [ministries, setMinistries] = useState<MinistryTeam[]>([]);
  const [filteredMinistries, setFilteredMinistries] = useState<MinistryTeam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingMinistry, setEditingMinistry] = useState<MinistryTeam | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadMinistries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/ministries');
      if (!response.ok) {
        throw new Error('Failed to fetch ministries');
      }
      const data = await response.json();
      setMinistries(data);
      setFilteredMinistries(data);
    } catch (error) {
      console.error('Error loading ministries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMinistries();
  }, []);

  // Filter ministries based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMinistries(ministries);
      return;
    }

    const filtered = ministries.filter((ministry) =>
      ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.leaderContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMinistries(filtered);
  }, [searchTerm, ministries]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this ministry?')) {
      try {
        const response = await fetch(`/api/admin/ministries/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete ministry');
        }
        await loadMinistries();
      } catch (error) {
        console.error('Error deleting ministry:', error);
        alert('Failed to delete ministry');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/ministry-database/admin/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ministries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ministry Administration</h1>
            <p className="text-gray-600">Manage ministry teams and opportunities</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => window.open('/ministry-database', '_blank')}
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Public Site
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Ministry
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                {searchTerm ? filteredMinistries.length : ministries.length}
              </div>
              <div className="text-gray-600">
                {searchTerm ? 'Matching Ministries' : 'Total Ministries'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {searchTerm 
                  ? filteredMinistries.filter(m => m.isActive).length
                  : ministries.filter(m => m.isActive).length
                }
              </div>
              <div className="text-gray-600">Active Ministries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">
                {searchTerm 
                  ? filteredMinistries.filter(m => !m.isActive).length
                  : ministries.filter(m => !m.isActive).length
                }
              </div>
              <div className="text-gray-600">Inactive Ministries</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <div className="flex items-center gap-3">
                <Search className="text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search ministries by name, description, leader, contact, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-600">
                Showing {filteredMinistries.length} of {ministries.length} ministries
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ministries List */}
        <Card>
          <CardHeader>
            <CardTitle>Ministry Teams</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMinistries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? (
                  <>
                    No ministries found matching &quot;{searchTerm}&quot;.
                    <br />
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                      className="mt-2"
                    >
                      Clear Search
                    </Button>
                  </>
                ) : (
                  "No ministries found. Create your first ministry team."
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMinistries.map((ministry) => (
                  <div
                    key={ministry.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{ministry.name}</h3>
                        <Badge variant={ministry.isActive ? "default" : "secondary"}>
                          {ministry.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{ministry.category}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{ministry.description}</p>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Leader:</span> {ministry.leader} • 
                        <span className="font-medium ml-2">Contact:</span> {ministry.leaderContact}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingMinistry(ministry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(ministry.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit/Create Modal */}
      {(editingMinistry || isCreateModalOpen) && (
        <MinistryEditModal
          ministry={editingMinistry}
          onClose={() => {
            setEditingMinistry(null);
            setIsCreateModalOpen(false);
          }}
          onSave={() => {
            loadMinistries();
            setEditingMinistry(null);
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
