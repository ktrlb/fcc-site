"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [ministries] = useState<MinistryTeam[]>(initialMinistries || []);
  const [filteredMinistries, setFilteredMinistries] = useState<MinistryTeam[]>(initialMinistries || []);
  
  // Generate categories dynamically from ministries (only show categories that have ministries)
  const [categories] = useState(() => {
    const categorySet = new Set<string>();
    if (initialMinistries && Array.isArray(initialMinistries)) {
      initialMinistries.forEach(ministry => {
        if (ministry.categories && ministry.categories.length > 0) {
          ministry.categories.forEach(cat => categorySet.add(cat));
        }
        // Also check legacy category field
        if (ministry.category) {
          categorySet.add(ministry.category);
        }
      });
    }
    
    const categoriesList = Array.from(categorySet).sort();
    console.log('Available categories:', categoriesList);
    return categoriesList;
  });

  // Define category color mapping
  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: { bg: string; hex: string } } = {
      'worship': { bg: 'red-600', hex: '#dc2626' },
      'children': { bg: 'teal-800', hex: '#115e59' },
      'youth': { bg: 'indigo-900', hex: '#312e81' },
      'service & outreach': { bg: 'lime-700', hex: '#4d7c0f' },
      'fellowship': { bg: 'amber-500', hex: '#f59e0b' },
      'prayer': { bg: 'purple', hex: '#714E91' },
      'education': { bg: 'red-600', hex: '#dc2626' },
      'missions': { bg: 'teal-800', hex: '#115e59' },
      'administration': { bg: 'indigo-900', hex: '#312e81' },
      'music': { bg: 'amber-500', hex: '#f59e0b' },
      'hospitality': { bg: 'lime-700', hex: '#4d7c0f' },
      'care': { bg: 'purple', hex: '#714E91' },
      'partner organizations': { bg: 'stone-700', hex: '#44403c' },
      'Partner Organizations': { bg: 'stone-700', hex: '#44403c' }
    };
    
    // Try exact match first
    if (categoryColors[category.toLowerCase()]) {
      return categoryColors[category.toLowerCase()];
    }
    
    // Try partial matches
    const lowerCategory = category.toLowerCase();
    for (const [key, color] of Object.entries(categoryColors)) {
      if (lowerCategory.includes(key) || key.includes(lowerCategory)) {
        return color;
      }
    }
    
    // Default fallback
    return { bg: 'indigo-900', hex: '#312e81' };
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false); // Start with false since we have initial data
  const [error] = useState<string | null>(null);

  // Initialize search term from URL parameters
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

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
        (m.skillsNeeded || []).some((s) => s.toLowerCase().includes(term)) ||
        (m.categories || []).some((cat) => cat.toLowerCase().includes(term)) ||
        (m.category && m.category.toLowerCase().includes(term))
      );
    }
    setFilteredMinistries(results);
  }, [searchTerm, selectedCategory, ministries]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900 mx-auto"></div>
            <p className="mt-4 text-indigo-900">Loading ministry opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 py-16">
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
    <div className="min-h-screen bg-stone-50">

      {/* Search and Filter Section */}
      <div className="py-8 border-b" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Full Width Search Bar */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <Search className="text-white h-5 w-5" />
              <Input
                placeholder="Search ministries by name, description, skills, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-white/30 bg-white/10 text-white placeholder:text-white/70 focus:border-white focus:ring-white/50"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-base text-white/80">
                Showing {filteredMinistries.length} of {ministries.length} ministries
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "text-white border-2 border-white shadow-lg" : "border-2 border-white/50 text-white hover:bg-white/10 bg-white/10"}
              style={selectedCategory === "all" ? { backgroundColor: 'rgb(68 64 60)' } : {}}
            >
              All Categories
            </Button>
            {categories.map((category) => {
              const categoryColor = getCategoryColor(category);
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`capitalize ${selectedCategory === category ? "text-white border-2 border-white shadow-lg" : "text-white hover:bg-white/10 border-2 border-white/50 bg-white/10"}`}
                  style={selectedCategory === category ? 
                    { backgroundColor: categoryColor.hex, borderColor: 'white' } : 
                    { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.5)' }
                  }
                >
                  {category}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-indigo-900">
              {filteredMinistries.length} Ministry {filteredMinistries.length === 1 ? 'Opportunity' : 'Opportunities'}
            </h2>
          </div>

          {filteredMinistries.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-indigo-400" />
              <h3 className="mt-2 text-base font-medium text-indigo-900">No ministries found</h3>
              <p className="mt-1 text-base text-indigo-600">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMinistries.map((ministry, index) => {
                // Get color based on primary category
                const primaryCategory = ministry.categories?.[0] || ministry.category || 'Other';
                const colorScheme = getCategoryColor(primaryCategory);
                console.log(`Ministry: ${ministry.name}, Category: ${primaryCategory}, Color: ${colorScheme.hex}`);
                
                return (
                  <Card key={ministry.id} className="hover:shadow-lg transition-shadow overflow-hidden bg-white" style={{ borderColor: colorScheme.hex, borderWidth: '2px' }}>
                    <div className="relative h-48 w-full">
                      {ministry.imageUrl || ministry.graphicImage ? (
                        <img
                          src={ministry.imageUrl || ministry.graphicImage || undefined}
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
                    <CardHeader className="px-6 py-4" style={{ backgroundColor: colorScheme.hex }}>
                      <div className="space-y-3">
                        <CardTitle className="text-lg text-white">{ministry.name}</CardTitle>
                        <div className="flex flex-wrap gap-1">
                          {/* Show legacy category */}
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">{ministry.category}</Badge>
                          {/* Show additional categories */}
                          {ministry.categories && ministry.categories.map((cat, index) => (
                            <Badge key={index} variant="outline" className="bg-white/20 text-white border-white/30">{cat}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700 text-base">{ministry.description}</p>
                      
                      <div className="space-y-2">
                        {ministry.timeCommitment && (
                          <div className="flex items-center text-base text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {ministry.timeCommitment}
                          </div>
                        )}
                        {ministry.location && (
                          <div className="flex items-center text-base text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {ministry.location}
                          </div>
                        )}
                        {ministry.meetingSchedule && (
                          <div className="flex items-center text-base text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {ministry.meetingSchedule}
                          </div>
                        )}
                      </div>

                      {ministry.skillsNeeded && ministry.skillsNeeded.length > 0 && (
                        <div>
                          <h4 className="font-medium text-base text-gray-900 mb-2">Skills Needed:</h4>
                          <div className="flex flex-wrap gap-1">
                            {ministry.skillsNeeded.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-sm bg-gray-50 text-gray-700 border-gray-300">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-base text-gray-900 mb-2">Contact:</h4>
                        <p className="text-base text-gray-700">{ministry.contactPerson}</p>
                        {ministry.contactPhone && (
                          <div className="flex items-center text-base text-gray-700 mt-1">
                            <Phone className="h-4 w-4 mr-1" />
                            <a href={`tel:${ministry.contactPhone}`} className="hover:text-gray-900 transition-colors">
                              {ministry.contactPhone}
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
