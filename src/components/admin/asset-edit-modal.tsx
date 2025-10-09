"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Asset } from "@/lib/schema";

interface AssetEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
  onUpdate: (data: { name: string; description: string; categories: string[] }) => void;
}

export function AssetEditModal({ isOpen, onClose, asset, onUpdate }: AssetEditModalProps) {
  const [formData, setFormData] = useState({
    name: asset.name,
    description: asset.description || "",
    categories: asset.categories || [],
  });

  // Update form data when asset changes
  useEffect(() => {
    setFormData({
      name: asset.name,
      description: asset.description || "",
      categories: asset.categories || [],
    });
  }, [asset]);

  const imageCategories = [
    { value: "worship", label: "Worship" },
    { value: "youth-camp", label: "Youth Camp" },
    { value: "vbs", label: "VBS (Vacation Bible School)" },
    { value: "fellowship", label: "Fellowship" },
    { value: "service", label: "Service & Missions" },
    { value: "mission", label: "Mission" },
    { value: "general", label: "General" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview Image */}
          {asset.type === 'image' && asset.fileUrl && (
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={asset.fileUrl} 
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Name */}
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter asset name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter asset description"
              rows={3}
            />
          </div>

          {/* Categories (only for images) */}
          {asset.type === 'image' && (
            <div>
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {imageCategories.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-category-${category.value}`}
                      checked={formData.categories.includes(category.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            categories: [...prev.categories, category.value] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            categories: prev.categories.filter(c => c !== category.value) 
                          }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label 
                      htmlFor={`edit-category-${category.value}`} 
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Info (read-only) */}
          <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">File Name:</span>
              <span className="font-medium truncate ml-2">{asset.fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{asset.type}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

