"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Clock, MapPin, Phone } from "lucide-react";
import { MinistryPlaceholder } from "./ministry-placeholder";
import type { MinistryTeam } from "@/lib/schema";

interface Props {
  initialMinistries: MinistryTeam[];
}

export function MinistryDatabase({ initialMinistries }: Props) {
  const [ministries] = useState<MinistryTeam[]>(initialMinistries || []);
  const [filteredMinistries, setFilteredMinistries] = useState<MinistryTeam[]>(initialMinistries || []);
  
  // Generate categories dynamically from ministries
  const [categories] = useState(() => {
    const categorySet = new Set<string>();
    if (initialMinistries && Array.isArray(initialMinistries)) {
      initialMinistries.forEach(ministry => {
        if (ministry.categories && ministry.categories.length > 0) {
          ministry.categories.forEach(cat => categorySet.add(cat));
        }
      });
    }
    return Array.from(categorySet).sort();
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false); // Start with false since we have initial data
  const [error] = useState<string | null>(null);

  useEffect(() => {
    let results = ministries;
    if (selectedCategory !== "all") {
      results = results.filter((m) => {
        // Handle URL encoding issues with ampersands
        const selectedCategoryNormalized = selectedCategory.replace(/\u0026/g, '&');
        
        // Check legacy category field
        const ministryCategory = m.category?.replace(/\u0026/g, '&') || '';
        if (ministryCategory === selectedCategoryNormalized) {
          return true;
        }
        
        // Check new categories array field
        if (m.categories && m.categories.length > 0) {
          return m.categories.some(cat => {
            const normalizedCat = cat?.replace(/\u0026/g, '&') || '';
            return normalizedCat === selectedCategoryNormalized;
          });
        }
        
        return false;
      });
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter((m) =>
        m.name.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        (m.skillsNeeded || []).some((s) => s.toLowerCase().includes(term))
      );
    }
    setFilteredMinistries(results);
  }, [searchTerm, selectedCategory, ministries]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ministry opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
              <p className="text-red-600">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-serif mb-4">
              Ministry Database
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover ways to get involved in our church community. Find ministry opportunities that match your interests, skills, and availability.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Full Width Search Bar */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <Search className="text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search ministries by name, description, skills, or keywords..."
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
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-600">
                Showing {filteredMinistries.length} of {ministries.length} ministries
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredMinistries.length} Ministry {filteredMinistries.length === 1 ? 'Opportunity' : 'Opportunities'}
            </h2>
          </div>

          {filteredMinistries.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No ministries found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMinistries.map((ministry) => (
                <Card key={ministry.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative h-48 w-full">
                    {ministry.imageUrl ? (
                      <img
                        src={ministry.imageUrl}
                        alt={ministry.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                <MinistryPlaceholder
                  ministryName={ministry.name}
                  category={ministry.categories?.[0] || ministry.category || 'Other'}
                />
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{ministry.name}</CardTitle>
                      <div className="flex flex-wrap gap-1">
                        {/* Show legacy category */}
                        <Badge variant="secondary">{ministry.category}</Badge>
                        {/* Show additional categories */}
                        {ministry.categories && ministry.categories.map((cat, index) => (
                          <Badge key={index} variant="outline">{cat}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{ministry.description}</p>
                    
                    <div className="space-y-2">
                      {ministry.timeCommitment && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {ministry.timeCommitment}
                        </div>
                      )}
                      {ministry.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          {ministry.location}
                        </div>
                      )}
                      {ministry.meetingSchedule && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          {ministry.meetingSchedule}
                        </div>
                      )}
                    </div>

                    {ministry.skillsNeeded && ministry.skillsNeeded.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Skills Needed:</h4>
                        <div className="flex flex-wrap gap-1">
                          {ministry.skillsNeeded.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Contact:</h4>
                      <p className="text-sm text-gray-600">{ministry.contactPerson}</p>
                      {ministry.contactPhone && (
                        <div className="flex items-center text-sm text-blue-600 mt-1">
                          <Phone className="h-4 w-4 mr-1" />
                          <a href={`tel:${ministry.contactPhone}`} className="hover:underline">
                            {ministry.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
