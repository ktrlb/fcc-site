"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Clock, MapPin, Phone, Mail } from "lucide-react";
import type { MinistryTeam } from "@/lib/schema";

interface MinistryCategory {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
}

interface Props {
  initialMinistries: MinistryTeam[];
  initialCategories: MinistryCategory[];
}

export function MinistryDatabase({ initialMinistries, initialCategories }: Props) {
  const [ministries] = useState<MinistryTeam[]>(initialMinistries);
  const [filteredMinistries, setFilteredMinistries] = useState<MinistryTeam[]>(initialMinistries);
  const [categories] = useState<MinistryCategory[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setFilteredMinistries(initialMinistries);
    setIsLoading(false);
  }, [initialMinistries]);

  useEffect(() => {
    let results = ministries;
    if (selectedCategory !== "all") {
      results = results.filter((m) => m.category === selectedCategory);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search ministries, skills, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className="capitalize"
                >
                  {category.name}
                </Button>
              ))}
            </div>
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
                <Card key={ministry.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{ministry.name}</CardTitle>
                      <Badge variant="secondary">{ministry.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{ministry.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {ministry.timeCommitment}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {ministry.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {ministry.meetingSchedule}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Skills Needed:</h4>
                      <div className="flex flex-wrap gap-1">
                        {ministry.skillsNeeded?.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Contact:</h4>
                      <p className="text-sm text-gray-600">{ministry.contactPerson}</p>
                      <div className="flex items-center text-sm text-blue-600 mt-1">
                        <Mail className="h-4 w-4 mr-1" />
                        <a href={`mailto:${ministry.contactEmail}`} className="hover:underline">
                          {ministry.contactEmail}
                        </a>
                      </div>
                      {ministry.contactPhone && (
                        <div className="flex items-center text-sm text-blue-600 mt-1">
                          <Phone className="h-4 w-4 mr-1" />
                          <a href={`tel:${ministry.contactPhone}`} className="hover:underline">
                            {ministry.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>

                    <Button className="w-full mt-4">
                      Get Involved
                    </Button>
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
