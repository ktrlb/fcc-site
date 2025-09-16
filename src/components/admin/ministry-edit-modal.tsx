"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const CATEGORIES = [
  "Children & Youth",
  "Worship & Music", 
  "Outreach & Service",
  "Administration",
  "Hospitality",
  "Education",
  "Technology"
];

export function MinistryEditModal({ ministry, onClose, onSave }: MinistryEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    contactHeading: "",
    leader: "",
    leaderContact: "",
    type: [] as string[],
    regularMeetingType: "",
    regularMeetingTime: "",
    description: "",
    graphicImage: "",
    recurringType: "regular",
    category: "Children & Youth",
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

  useEffect(() => {
    if (ministry) {
      setFormData({
        name: ministry.name || "",
        contactHeading: ministry.contactHeading || "",
        leader: ministry.leader || "",
        leaderContact: ministry.leaderContact || "",
        type: ministry.type || [],
        regularMeetingType: ministry.regularMeetingType || "",
        regularMeetingTime: ministry.regularMeetingTime || "",
        description: ministry.description || "",
        graphicImage: ministry.graphicImage || "",
        recurringType: ministry.recurringType || "regular",
        category: ministry.category || "Children & Youth",
        contactPerson: ministry.contactPerson || "",
        contactEmail: ministry.contactEmail || "",
        contactPhone: ministry.contactPhone || "",
        meetingSchedule: ministry.meetingSchedule || "",
        location: ministry.location || "",
        skillsNeeded: ministry.skillsNeeded || [],
        timeCommitment: ministry.timeCommitment || "",
        isActive: ministry.isActive ?? true,
      });
    }
  }, [ministry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (ministry) {
        const response = await fetch(`/api/admin/ministries/${ministry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to update ministry');
        }
      } else {
        const response = await fetch('/api/admin/ministries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ministry Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                  placeholder="e.g., Contact Our Team"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leader Name *
                </label>
                <Input
                  value={formData.leader}
                  onChange={(e) => setFormData(prev => ({ ...prev, leader: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leader Contact *
                </label>
                <Input
                  value={formData.leaderContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, leaderContact: e.target.value }))}
                  placeholder="email@example.com or (555) 123-4567"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graphic Image URL
                </label>
                <Input
                  value={formData.graphicImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, graphicImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
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

            {/* Legacy Fields for Backward Compatibility */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Legacy Fields (for compatibility)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person (Legacy)
                  </label>
                  <Input
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email (Legacy)
                  </label>
                  <Input
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone (Legacy)
                  </label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Commitment (Legacy)
                  </label>
                  <Input
                    value={formData.timeCommitment}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeCommitment: e.target.value }))}
                    placeholder="e.g., 3-4 hours per week"
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
