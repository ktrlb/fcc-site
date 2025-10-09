"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Star, StarOff, Trash2 } from "lucide-react";
import { SeasonalGuide } from "@/lib/schema";
import { SeasonalGuideUploadModal } from "./seasonal-guide-upload-modal";

interface SeasonalGuidesDashboardProps {
  onLogout: () => void;
}

export function SeasonalGuidesDashboard({ onLogout }: SeasonalGuidesDashboardProps) {
  const [seasonalGuides, setSeasonalGuides] = useState<SeasonalGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeasonalGuideModalOpen, setIsSeasonalGuideModalOpen] = useState(false);

  useEffect(() => {
    fetchSeasonalGuides();
  }, []);

  const fetchSeasonalGuides = async () => {
    try {
      const response = await fetch("/api/admin/seasonal-guides");
      if (response.ok) {
        const data = await response.json();
        setSeasonalGuides(data);
      }
    } catch (error) {
      console.error("Error fetching seasonal guides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchSeasonalGuides();
  };

  const toggleSeasonalGuideFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/seasonal-guides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });

      if (response.ok) {
        fetchSeasonalGuides();
      } else {
        alert("Failed to update seasonal guide");
      }
    } catch (error) {
      console.error("Error updating seasonal guide:", error);
      alert("Error updating seasonal guide");
    }
  };

  const deleteSeasonalGuide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this seasonal guide?")) return;

    try {
      const response = await fetch(`/api/admin/seasonal-guides/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSeasonalGuides();
      } else {
        alert("Failed to delete seasonal guide");
      }
    } catch (error) {
      console.error("Error deleting seasonal guide:", error);
      alert("Error deleting seasonal guide");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seasonal guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seasonal Guides Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Seasonal Guides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Manage seasonal guides, devotionals, and special publications</p>
            <Button 
              onClick={() => setIsSeasonalGuideModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload New Seasonal Guide
            </Button>
          </div>
          {seasonalGuides.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No seasonal guides uploaded yet</p>
              <p className="text-sm">Upload your first seasonal guide to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {seasonalGuides.map((guide) => (
                <div key={guide.id} className="border rounded-lg p-6 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-medium text-gray-900 text-lg">{guide.title}</h3>
                    <div className="flex items-center gap-2">
                      {guide.isFeatured && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleSeasonalGuideFeatured(guide.id, guide.isFeatured)}
                          className="h-8 w-8 p-0"
                          title={guide.isFeatured ? "Remove from home page" : "Feature on home page"}
                        >
                          {guide.isFeatured ? (
                            <Star className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <StarOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSeasonalGuide(guide.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Delete seasonal guide"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {guide.description && (
                    <p className="text-gray-600 mb-4">{guide.description}</p>
                  )}
                  <div className="flex gap-4 mb-4">
                    {guide.coverImageUrl && (
                      <div className="w-32">
                        <img
                          src={guide.coverImageUrl}
                          alt={`${guide.title} cover`}
                          className="w-full h-40 object-cover rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Cover Image</p>
                      </div>
                    )}
                    {guide.pdfUrl && (
                      <div className="flex-1 flex items-center justify-center bg-gray-100 rounded p-4">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">PDF Document</p>
                          <a 
                            href={guide.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Click to view
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Created: {new Date(guide.createdAt).toLocaleDateString()}</span>
                    <span className={guide.isActive ? "text-green-600" : "text-red-600"}>
                      {guide.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <SeasonalGuideUploadModal
        isOpen={isSeasonalGuideModalOpen}
        onClose={() => setIsSeasonalGuideModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}

