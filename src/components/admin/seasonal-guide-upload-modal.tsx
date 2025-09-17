'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, X } from 'lucide-react';

interface SeasonalGuideUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export function SeasonalGuideUploadModal({ isOpen, onClose, onUploadSuccess }: SeasonalGuideUploadModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isFeatured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

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
    
    if (!file || !coverImage || !formData.title) {
      setError("Please fill in all required fields and select both PDF and cover image");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Create FormData to send files and metadata
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isFeatured', formData.isFeatured.toString());
      formDataToSend.append('pdf', file);
      formDataToSend.append('coverImage', coverImage);
      
      const response = await fetch("/api/admin/seasonal-guides", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create seasonal guide");
        return;
      }

      onUploadSuccess();
      handleClose();
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", description: "", isFeatured: false });
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload New Seasonal Guide
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter seasonal guide title (e.g., 'Advent 2024 Guide')"
                required
              />
            </div>

            {/* PDF Upload */}
            <div>
              <Label htmlFor="file">Seasonal Guide PDF *</Label>
              <div className="mt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf"
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
                      {file ? file.name : "Click to select PDF"}
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

            {/* Cover Image Upload */}
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

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter seasonal guide description (optional)"
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
                Only one seasonal guide can be featured at a time. Setting this as featured will unfeature any other seasonal guide.
              </p>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Seasonal Guide"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
