"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Trash2, 
  Edit, 
  Eye,
  Download,
  Plus,
  BookOpen,
  Users,
  MoreVertical,
  Star,
  StarOff
} from "lucide-react";
import { Asset, SermonSeries, SeasonalGuide } from "@/lib/schema";
import { AssetUploadModal } from "./asset-upload-modal";
import { SeasonalGuideUploadModal } from "./seasonal-guide-upload-modal";
import { SermonSeriesUploadModal } from "./sermon-series-upload-modal";

interface AssetDashboardProps {
  onLogout: () => void;
}

export function AssetDashboard({ onLogout }: AssetDashboardProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [sermonSeries, setSermonSeries] = useState<SermonSeries[]>([]);
  const [seasonalGuides, setSeasonalGuides] = useState<SeasonalGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSeasonalGuideModalOpen, setIsSeasonalGuideModalOpen] = useState(false);
  const [isSermonSeriesModalOpen, setIsSermonSeriesModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
    fetchSermonSeries();
    fetchSeasonalGuides();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch("/api/admin/assets");
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
        setError(null);
      } else {
        const errorData = await response.json();
        console.error("Error fetching assets:", errorData);
        setError(errorData.error || "Failed to load assets");
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSermonSeries = async () => {
    try {
      const response = await fetch("/api/admin/sermon-series");
      if (response.ok) {
        const data = await response.json();
        setSermonSeries(data);
      }
    } catch (error) {
      console.error("Error fetching sermon series:", error);
    }
  };

  const fetchSeasonalGuides = async () => {
    try {
      const response = await fetch("/api/admin/seasonal-guides");
      if (response.ok) {
        const data = await response.json();
        setSeasonalGuides(data);
      }
    } catch (error) {
      console.error("Error fetching seasonal guides:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      const response = await fetch(`/api/admin/assets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAssets(assets.filter(asset => asset.id !== id));
      } else {
        alert("Failed to delete asset");
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      alert("Error deleting asset");
    }
  };

  const handleUploadSuccess = () => {
    fetchAssets(); // Refresh the assets list
    fetchSermonSeries();
    fetchSeasonalGuides();
  };

  const toggleSermonSeriesFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/sermon-series/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });

      if (response.ok) {
        fetchSermonSeries();
      } else {
        alert("Failed to update sermon series");
      }
    } catch (error) {
      console.error("Error updating sermon series:", error);
      alert("Error updating sermon series");
    }
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

  const deleteSermonSeries = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sermon series?")) return;

    try {
      const response = await fetch(`/api/admin/sermon-series/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSermonSeries();
      } else {
        alert("Failed to delete sermon series");
      }
    } catch (error) {
      console.error("Error deleting sermon series:", error);
      alert("Error deleting sermon series");
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

  const setupAssetsTable = async () => {
    try {
      const response = await fetch("/api/setup-assets-table", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        alert("Assets table created successfully! Refreshing...");
        fetchAssets(); // Try to load assets again
      } else {
        const errorData = await response.json();
        alert(`Failed to create assets table: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating assets table:", error);
      alert("Error creating assets table. Please try again.");
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean, type: string) => {
    try {
      const response = await fetch(`/api/admin/assets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          isFeatured: !currentFeatured,
          // If making featured, we need to unfeature others of the same type
          unfeatureOthers: !currentFeatured
        }),
      });

      if (response.ok) {
        fetchAssets(); // Refresh the list
      } else {
        alert("Failed to update featured status");
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
      alert("Error updating featured status");
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "seasonal_guide":
        return <FileText className="h-5 w-5" />;
      case "seasonal_guide_cover":
        return <Image className="h-5 w-5" />;
      case "sermon_series_image":
        return <Image className="h-5 w-5" />;
      case "sermon_series_description":
        return <FileText className="h-5 w-5" />;
      case "image":
        return <Image className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "seasonal_guide":
        return "bg-green-100 text-green-800";
      case "seasonal_guide_cover":
        return "bg-emerald-100 text-emerald-800";
      case "sermon_series_image":
        return "bg-blue-100 text-blue-800";
      case "sermon_series_description":
        return "bg-indigo-100 text-indigo-800";
      case "image":
        return "bg-purple-100 text-purple-800";
      case "document":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesFilter = filter === "all" || asset.type === filter;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatFileSize = (size: string | null) => {
    if (!size) return "Unknown";
    const bytes = parseInt(size);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6 pt-20">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage all website content and assets</p>
              </div>
              <Button onClick={onLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-red-600 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Assets Table Setup Required</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="bg-gray-50 p-4 rounded-md text-left">
                <h4 className="font-medium text-gray-900 mb-2">The assets table needs to be created in your existing database.</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Since your ministry database is already working, we just need to add the assets table to it.
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={fetchAssets} variant="outline">
                  Try Again
                </Button>
                <Button onClick={setupAssetsTable} className="bg-blue-600 hover:bg-blue-700">
                  Create Assets Table
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6 pt-20">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
              <p className="text-gray-600">Manage seasonal guides, sermon series, and other assets</p>
            </div>
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Management Sections */}
        <div className="space-y-8">
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
                        <p className="text-xs text-gray-500">Click to download</p>
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

          {/* Sermon Series Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Sermon Series
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">Manage current and upcoming sermon series</p>
                <Button 
                  onClick={() => setIsSermonSeriesModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload New Sermon Series
                </Button>
              </div>
        {sermonSeries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No sermon series uploaded yet</p>
            <p className="text-sm">Upload your first sermon series to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sermonSeries.map((series) => (
              <div key={series.id} className="border rounded-lg p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-medium text-gray-900 text-lg">{series.title}</h3>
                  <div className="flex items-center gap-2">
                    {series.isFeatured && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSermonSeriesFeatured(series.id, series.isFeatured)}
                        className="h-8 w-8 p-0"
                        title={series.isFeatured ? "Remove from home page" : "Feature on home page"}
                      >
                        {series.isFeatured ? (
                          <Star className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSermonSeries(series.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Delete sermon series"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {series.description && (
                  <p className="text-gray-600 mb-4">{series.description}</p>
                )}
                {series.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={series.imageUrl}
                      alt={series.title}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Created: {new Date(series.createdAt).toLocaleDateString()}</span>
                  <span className={series.isActive ? "text-green-600" : "text-red-600"}>
                    {series.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
            </CardContent>
          </Card>

          {/* Staff Section (Future) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff & Leadership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">Manage staff bios, photos, and leadership information</p>
                <Button 
                  disabled
                  className="bg-gray-400 text-white cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Staff management coming soon</p>
                <p className="text-sm">This feature will be available in a future update</p>
              </div>
            </CardContent>
          </Card>

          {/* General Assets Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                General Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">Manage general files, images, and documents</p>
                <Button 
                  onClick={() => setIsUploadModalOpen(true)}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload General Asset
                </Button>
              </div>
              <div className="text-center py-8 text-gray-500">
                <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No general assets uploaded yet</p>
                <p className="text-sm">Upload general files and documents here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {filteredAssets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Upload your first asset to get started"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getAssetIcon(asset.type)}
                      <div>
                        <CardTitle className="text-lg">{asset.name}</CardTitle>
                        <Badge className={getTypeColor(asset.type)}>
                          {asset.type.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(asset.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {asset.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {asset.description}
                    </p>
                  )}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>File:</span>
                      <span className="truncate max-w-32">{asset.fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{formatFileSize(asset.fileSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={asset.isActive ? "default" : "secondary"}>
                        {asset.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {asset.isFeatured && (
                      <div className="flex justify-between">
                        <span>Featured:</span>
                        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                          ⭐ Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant={asset.isFeatured ? "default" : "outline"}
                      onClick={() => toggleFeatured(asset.id, asset.isFeatured, asset.type)}
                      className={`w-full ${asset.isFeatured ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}`}
                    >
                      {asset.isFeatured ? '⭐ Unfeature' : '⭐ Feature on Home'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modals */}
      <AssetUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      
      <SeasonalGuideUploadModal
        isOpen={isSeasonalGuideModalOpen}
        onClose={() => setIsSeasonalGuideModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      
      <SermonSeriesUploadModal
        isOpen={isSermonSeriesModalOpen}
        onClose={() => setIsSermonSeriesModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
