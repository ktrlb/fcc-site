"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, LogOut, Eye, Search, FileText } from "lucide-react";
// Removed direct database imports - using API routes instead
import type { MinistryTeam } from "@/lib/schema";
import { MinistryEditModal } from "./ministry-edit-modal";
import { CSVManagement } from "./csv-management";
import { KeywordManagement } from "./keyword-management";
import { MinistryTypesManagement } from "./ministry-types-management";

export function AdminMinistryDashboard() {
  const [ministries, setMinistries] = useState<MinistryTeam[]>([]);
  const [filteredMinistries, setFilteredMinistries] = useState<MinistryTeam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingMinistry, setEditingMinistry] = useState<MinistryTeam | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showCSVManagement, setShowCSVManagement] = useState(false);
  const [showKeywordManagement, setShowKeywordManagement] = useState(false);
  const [showMinistryTypesManagement, setShowMinistryTypesManagement] = useState(false);

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
      ministry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ministry.contactHeading?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ministry Administration</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => window.open('/ministry-database', '_blank')}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View Public Site</span>
              <span className="sm:hidden">View Site</span>
            </Button>
            <Button
              onClick={() => setShowCSVManagement(!showCSVManagement)}
              variant="outline"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">CSV Tools</span>
              <span className="sm:hidden">CSV</span>
            </Button>
            <Button
              onClick={() => setShowKeywordManagement(!showKeywordManagement)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Manage Keywords</span>
              <span className="sm:hidden">Keywords</span>
            </Button>
            <Button
              onClick={() => setShowMinistryTypesManagement(!showMinistryTypesManagement)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Manage Types</span>
              <span className="sm:hidden">Types</span>
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Ministry</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>

        {/* CSV Management */}
        {showCSVManagement && (
          <div className="mb-8">
            <CSVManagement onDataUpdated={loadMinistries} />
          </div>
        )}

        {/* Keyword Management */}
        {showKeywordManagement && (
          <div className="mb-8">
            <KeywordManagement onDataUpdated={loadMinistries} />
          </div>
        )}

        {/* Ministry Types Management */}
        {showMinistryTypesManagement && (
          <div className="mb-8">
            <MinistryTypesManagement onDataUpdated={loadMinistries} />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <div className="text-2xl font-bold text-purple-600">
                {searchTerm 
                  ? filteredMinistries.filter(m => m.imageUrl).length
                  : ministries.filter(m => m.imageUrl).length
                }
              </div>
              <div className="text-gray-600">With Images</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">
                {searchTerm 
                  ? filteredMinistries.filter(m => !m.imageUrl).length
                  : ministries.filter(m => !m.imageUrl).length
                }
              </div>
              <div className="text-gray-600">Missing Images</div>
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
            <p className="text-sm text-gray-600">Thumbnails show ministry images - "No Image" indicates missing graphics</p>
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
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 gap-4"
                  >
                    <div className="flex gap-4 flex-1 min-w-0">
                      {/* Ministry Image Thumbnail */}
                      <div className="flex-shrink-0">
                        {ministry.imageUrl ? (
                          <img
                            src={ministry.imageUrl}
                            alt={`${ministry.name} thumbnail`}
                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-16 h-16 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs ${ministry.imageUrl ? 'hidden' : ''}`}>
                          <span>No Image</span>
                        </div>
                      </div>
                      
                      {/* Ministry Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg break-words">{ministry.name}</h3>
                          <Badge variant={ministry.isActive ? "default" : "secondary"}>
                            {ministry.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="break-words">{ministry.category}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 break-words">{ministry.description}</p>
                        <div className="text-sm text-gray-500 break-words">
                          <span className="font-medium">Contact:</span> {ministry.contactPerson}
                          {ministry.contactHeading && (
                            <span className="text-gray-400"> ({ministry.contactHeading})</span>
                          )}
                          <br />
                          {ministry.contactEmail && (
                            <>
                              <span className="font-medium">Email:</span> <span className="break-all">{ministry.contactEmail}</span>
                              {ministry.contactPhone && <span className="mx-1">•</span>}
                            </>
                          )}
                          {ministry.contactPhone && (
                            <span className="font-medium">Phone:</span>
                          )}
                          {ministry.contactPhone && ` ${ministry.contactPhone}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
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
