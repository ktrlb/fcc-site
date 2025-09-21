"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, FileText, Image, Video, Music } from "lucide-react";

interface AssetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export function AssetUploadModal({ isOpen, onClose, onUploadSuccess }: AssetUploadModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    isFeatured: false,
    title: "", // For structured content
  });
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const assetTypes = [
    { value: "sermon_series", label: "Sermon Series", icon: Image },
    { value: "seasonal_guide", label: "Seasonal Guide", icon: FileText },
    { value: "directory", label: "Church Directory", icon: FileText },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      
      setFile(selectedFile);
      setError("");
      
      // Auto-fill name if not provided
      if (!formData.name) {
        setFormData(prev => ({
          ...prev,
          name: selectedFile.name.replace(/\.[^/.]+$/, ""), // Remove extension
        }));
      }
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("Cover image size must be less than 10MB");
        return;
      }
      
      // Validate file type (images only)
      if (!selectedFile.type.startsWith('image/')) {
        setError("Cover image must be an image file");
        return;
      }
      
      setCoverImage(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation based on type
    if (formData.type === "sermon_series") {
      if (!file || !formData.title || !formData.type) {
        setError("Please fill in all required fields and select an image");
        return;
      }
    } else if (formData.type === "seasonal_guide") {
      if (!file || !coverImage || !formData.title || !formData.type) {
        setError("Please fill in all required fields and select both PDF and cover image");
        return;
      }
    } else {
      if (!file || !formData.name || !formData.type) {
        setError("Please fill in all required fields and select a file");
        return;
      }
    }

    setIsUploading(true);
    setError("");

    try {
      // For structured content, we'll handle it differently
      if (formData.type === "sermon_series" || formData.type === "seasonal_guide") {
        // Upload files directly to Vercel Blob without creating asset records
        const { uploadFile } = await import('@/lib/blob-storage');
        
        let fileUrl: string = '';
        let coverImageUrl: string | undefined;
        
        // Upload main file (image for sermon series, PDF for seasonal guide)
        const fileUploadResult = await uploadFile(file, formData.type === "sermon_series" ? "sermon-series" : "seasonal-guides");
        fileUrl = fileUploadResult.url;
        
        // Upload cover image for seasonal guide
        if (formData.type === "seasonal_guide" && coverImage) {
          const coverImageUploadResult = await uploadFile(coverImage, "seasonal-guides");
          coverImageUrl = coverImageUploadResult.url;
        }
        
        // Now create the structured content
        if (formData.type === "sermon_series") {
          const contentData = {
            title: formData.title,
            description: formData.description,
            isFeatured: formData.isFeatured,
            imageUrl: fileUrl,
          };
          const response = await fetch("/api/admin/sermon-series", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contentData),
          });
        } else if (formData.type === "seasonal_guide") {
          const contentData = {
            title: formData.title,
            description: formData.description,
            isFeatured: formData.isFeatured,
            pdfUrl: fileUrl,
            coverImageUrl: coverImageUrl,
          };
          
          const response = await fetch("/api/admin/seasonal-guides", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contentData),
          });
        }

        onUploadSuccess();
        handleClose();
      } else {
        // Regular asset upload
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("name", formData.name);
        uploadData.append("description", formData.description);
        uploadData.append("type", formData.type);
        uploadData.append("isFeatured", formData.isFeatured.toString());

        const response = await fetch("/api/admin/assets/upload", {
          method: "POST",
          body: uploadData,
        });

        if (response.ok) {
          onUploadSuccess();
          handleClose();
        } else {
          const data = await response.json();
          setError(data.error || "Upload failed");
        }
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", type: "", isFeatured: false, title: "" });
    setFile(null);
    setCoverImage(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = "";
    }
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    const assetType = assetTypes.find(t => t.value === type);
    return assetType ? assetType.icon : FileText;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Asset
          </DialogTitle>
          <DialogDescription>
            Upload seasonal guides, sermon series graphics, or other assets for your church website.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div>
            <Label htmlFor="file">
              {formData.type === "sermon_series" ? "Sermon Series Image *" : 
               formData.type === "seasonal_guide" ? "Seasonal Guide PDF *" : 
               "File *"}
            </Label>
            <div className="mt-1">
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
                accept={formData.type === "sermon_series" ? "image/*" : 
                       formData.type === "seasonal_guide" ? ".pdf" : 
                       ".pdf,.jpg,.jpeg,.png,.gif,.mp4,.mov,.doc,.docx,.txt"}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-20 border-dashed"
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {file ? file.name : 
                     formData.type === "sermon_series" ? "Click to select image" :
                     formData.type === "seasonal_guide" ? "Click to select PDF" :
                     "Click to select file"}
                  </p>
                  {file && (
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  )}
                </div>
              </Button>
            </div>
          </div>

          {/* Cover Image Upload - Only for Seasonal Guide */}
          {formData.type === "seasonal_guide" && (
            <div>
              <Label htmlFor="coverImage">Cover Image *</Label>
              <div className="mt-1">
                <input
                  ref={coverImageInputRef}
                  type="file"
                  id="coverImage"
                  onChange={handleCoverImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverImageInputRef.current?.click()}
                  className="w-full h-20 border-dashed"
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {coverImage ? coverImage.name : "Click to select cover image"}
                    </p>
                    {coverImage && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(coverImage.size)}
                      </p>
                    )}
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Asset Type */}
          <div>
            <Label htmlFor="type">Asset Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Title - Show for structured content types */}
          {(formData.type === "sermon_series" || formData.type === "seasonal_guide") && (
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={formData.type === "sermon_series" ? 
                  "Enter sermon series title (e.g., 'From Ruin to Renewal')" :
                  "Enter seasonal guide title (e.g., 'Advent 2024 Guide')"}
                required
              />
            </div>
          )}

          {/* Name - Only show for non-structured content */}
          {formData.type !== "sermon_series" && formData.type !== "seasonal_guide" && (
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter asset name"
                required
              />
            </div>
          )}

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={formData.type === "sermon_series" ? 
                "Enter sermon series description (optional)" :
                formData.type === "seasonal_guide" ? 
                "Enter seasonal guide description (optional)" :
                "Enter asset description"}
              rows={3}
            />
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
              Feature on home page
            </Label>
          </div>
          {formData.isFeatured && (
            <p className="text-xs text-gray-500">
              Only one asset of each type can be featured at a time. Setting this as featured will unfeature any other asset of the same type.
            </p>
          )}

          {/* Selected File Preview */}
          {file && (
            <Card className="bg-gray-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = getFileIcon(formData.type);
                    return <IconComponent className="h-8 w-8 text-blue-600" />;
                  })()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          </form>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 border-t pt-4 mt-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUploading || !file || !formData.name || !formData.type}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? "Uploading..." : "Upload Asset"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
