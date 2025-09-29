"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import type { MinistryTeam } from "@/lib/schema";
// Removed direct database imports - using API routes instead

interface MinistryEditModalProps {
  ministry?: MinistryTeam | null;
  onClose: () => void;
  onSave: () => void;
}

const RECURRING_TYPES = [
  { value: "regular", label: "Regular Group" },
  { value: "one-off", label: "One-off Group" },
  { value: "as-needed", label: "As-needed" },
];

// Categories will be loaded dynamically from the database

export function MinistryEditModal({ ministry, onClose, onSave }: MinistryEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    contactHeading: "",
    type: [] as string[],
    regularMeetingType: "",
    regularMeetingTime: "",
    description: "",
    graphicImage: "",
    recurringType: "regular",
    category: "Children",
    categories: [] as string[],
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    meetingSchedule: "",
    location: "",
    skillsNeeded: [] as string[],
    timeCommitment: "",
    isActive: true,
  });

  const [newType, setNewType] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load available categories from the database
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch('/api/admin/ministries');
        if (response.ok) {
          const data = await response.json();
          const ministries = Array.isArray(data) ? data : [];
          const categorySet = new Set<string>();
          
          ministries.forEach((ministry: any) => {
            if (ministry.categories && Array.isArray(ministry.categories) && ministry.categories.length > 0) {
              ministry.categories.forEach((cat: string) => categorySet.add(cat));
            }
            if (ministry.category) {
              categorySet.add(ministry.category);
            }
          });
          
          const categoriesList = Array.from(categorySet).sort();
          setAvailableCategories(categoriesList);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to a basic list if API fails
        setAvailableCategories([
          "Worship", "Children", "Youth", "Service & Outreach", "Fellowship", 
          "Prayer", "Education", "Missions", "Administration", "Music", 
          "Hospitality", "Care", "Partner Organizations", "Creativity & Arts"
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, []);

  useEffect(() => {
    if (ministry) {
      setFormData({
        name: ministry.name || "",
        contactHeading: ministry.contactHeading || "",
        type: ministry.type || [],
        regularMeetingType: ministry.regularMeetingType || "",
        regularMeetingTime: ministry.regularMeetingTime || "",
        description: ministry.description || "",
        graphicImage: ministry.graphicImage || "",
        recurringType: ministry.recurringType || "regular",
        category: ministry.category || "Children",
        categories: ministry.categories || [],
        contactPerson: ministry.contactPerson || "",
        contactEmail: ministry.contactEmail || "",
        contactPhone: ministry.contactPhone || "",
        meetingSchedule: ministry.meetingSchedule || "",
        location: ministry.location || "",
        skillsNeeded: ministry.skillsNeeded || [],
        timeCommitment: ministry.timeCommitment || "",
        isActive: ministry.isActive ?? true,
      });
      
      // Set image preview if ministry has an image
      if (ministry.imageUrl) {
        setImagePreview(ministry.imageUrl);
      }
    }
  }, [ministry]);

  const handleImageUpload = async (file: File) => {
    if (!ministry?.id) return;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`/api/admin/ministries/${ministry.id}/upload-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const result = await response.json();
      setImagePreview(result.imageUrl);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async () => {
    if (!ministry?.id) return;
    
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    setUploadingImage(true);
    try {
      const response = await fetch(`/api/admin/ministries/${ministry.id}/upload-image`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      
      setImagePreview(null);
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Preserve existing categories if user made no change
      const payload = {
        ...formData,
        category: formData.category || ministry?.category || "",
        categories: (formData.categories && formData.categories.length > 0)
          ? formData.categories
          : (ministry?.categories || []),
      };
      if (ministry) {
        const response = await fetch(`/api/admin/ministries/${ministry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('Failed to update ministry');
        }
        
        // Upload image if a new one was selected
        if (imageFile) {
          await handleImageUpload(imageFile);
        }
      } else {
        const response = await fetch('/api/admin/ministries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('Failed to create ministry');
        }
      }
      onSave();
    } catch (error) {
      console.error('Error saving ministry:', error);
      alert('Failed to save ministry');
    } finally {
      setIsLoading(false);
    }
  };

  const addType = () => {
    if (newType.trim() && !formData.type.includes(newType.trim())) {
      setFormData(prev => ({
        ...prev,
        type: [...prev.type, newType.trim()]
      }));
      setNewType("");
    }
  };

  const removeType = (typeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      type: prev.type.filter(t => t !== typeToRemove)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skillsNeeded.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsNeeded: [...prev.skillsNeeded, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skillsNeeded: prev.skillsNeeded.filter(s => s !== skillToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {ministry ? "Edit Ministry" : "Create New Ministry"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" data-lpignore="true" data-form-type="other">
            {/* Hidden fields to confuse browser autofill heuristics (prevents WebKit errors) */}
            <input type="text" name="fake-username" autoComplete="username" className="hidden" aria-hidden="true" tabIndex={-1} />
            <input type="password" name="fake-password" autoComplete="new-password" className="hidden" aria-hidden="true" tabIndex={-1} />
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ministry Name *
                </label>
                <Input
                  name="ministryName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  autoComplete="off"
                  data-form-type="other"
                  required
                />
              </div>
              <div>
                <label id="primaryCategoryLabel" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Category *
                </label>
                <Select
                  name="primaryCategory"
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, category: value }));
                  }}
                  disabled={loadingCategories}
                  autoComplete="off"
                  data-form-type="other"
                >
                  {/* Hidden helpers for autofill sibling traversal and a text node */}
                  <input type="text" tabIndex={-1} aria-hidden="true" className="hidden" name="_ignore_primary_category" autoComplete="off" />
                  {'\u200B'}
                  <span className="sr-only">Primary Category</span>
                  <SelectTrigger aria-labelledby="primaryCategoryLabel" id="primaryCategoryTrigger" form="__none">
                    <span className="sr-only">Primary Category</span>
                    <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent className="z-[100] relative">
                    {availableCategories.length > 0 ? (
                      availableCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label id="additionalCategoriesLabel" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Categories
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((cat, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              categories: prev.categories.filter((_, i) => i !== index)
                            }));
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                <Select
                  onValueChange={(value) => {
                    if (value && !formData.categories.includes(value) && value !== formData.category) {
                      setFormData(prev => ({
                        ...prev,
                        categories: [...prev.categories, value]
                      }));
                    }
                  }}
                  disabled={loadingCategories}
                  autoComplete="off"
                  data-form-type="other"
                >
                    {/* Hidden helpers for autofill sibling traversal and a text node */}
                    <input type="text" tabIndex={-1} aria-hidden="true" className="hidden" name="_ignore_additional_categories" autoComplete="off" />
                    {'\u200B'}
                    <span className="sr-only">Additional Categories</span>
                    <SelectTrigger aria-labelledby="additionalCategoriesLabel" id="additionalCategoriesTrigger" form="__none">
                      <span className="sr-only">Additional Categories</span>
                      <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Add additional category..."} />
                    </SelectTrigger>
                    <SelectContent className="z-[100] relative">
                      {availableCategories
                        .filter(cat => !formData.categories.includes(cat) && cat !== formData.category)
                        .map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Heading
                </label>
                <Input
                  value={formData.contactHeading}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactHeading: e.target.value }))}
                  placeholder="e.g., Outreach Chair, Team Lead"
                  autoComplete="off"
                  data-form-type="other"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Title/role of the contact person (e.g., &quot;Outreach Chair&quot; for partner organizations)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person Name *
                </label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  autoComplete="off"
                  data-form-type="other"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <Input
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  type="email"
                  placeholder="email@example.com (optional)"
                  autoComplete="off"
                  data-form-type="other"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  autoComplete="off"
                  data-form-type="other"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ministry Image
                </label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Ministry preview"
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleImageDelete}
                        disabled={uploadingImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Recommended size: 1200x630px. Images will be automatically resized for display.
                  </p>
                </div>
              </div>
            </div>

            {/* Meeting Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recurring Type *
                </label>
                <select
                  value={formData.recurringType}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurringType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {RECURRING_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Type
                </label>
                <Input
                  value={formData.regularMeetingType}
                  onChange={(e) => setFormData(prev => ({ ...prev, regularMeetingType: e.target.value }))}
                  placeholder="e.g., Weekly Bible Study"
                  autoComplete="off"
                  data-form-type="other"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Time
                </label>
                <Input
                  value={formData.regularMeetingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, regularMeetingTime: e.target.value }))}
                  placeholder="e.g., Sundays 9:00 AM"
                  autoComplete="off"
                  data-form-type="other"
                />
              </div>
            </div>

            {/* Type Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ministry Types (Tags)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="Add a type tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addType())}
                  autoComplete="off"
                  data-form-type="other"
                />
                <Button type="button" onClick={addType} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.type.map((type, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => removeType(type)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Needed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills Needed
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  autoComplete="off"
                  data-form-type="other"
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skillsNeeded.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Commitment
                  </label>
                <Input
                    value={formData.timeCommitment}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeCommitment: e.target.value }))}
                    placeholder="e.g., 3-4 hours per week"
                  autoComplete="off"
                  data-form-type="other"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Church, Community Center"
                  autoComplete="off"
                  data-form-type="other"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active Ministry
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : ministry ? "Update Ministry" : "Create Ministry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
