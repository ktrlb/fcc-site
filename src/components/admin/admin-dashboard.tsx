'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FileText, 
  Upload, 
  Star,
  ArrowRight,
  Activity
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  staffCount: number;
  ministriesCount: number;
  sermonSeriesCount: number;
  seasonalGuidesCount: number;
  specialEventsCount: number;
  assetsCount: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    staffCount: 0,
    ministriesCount: 0,
    sermonSeriesCount: 0,
    seasonalGuidesCount: 0,
    specialEventsCount: 0,
    assetsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [staffRes, ministriesRes, sermonSeriesRes, seasonalGuidesRes, specialEventsRes, assetsRes] = await Promise.all([
        fetch('/api/admin/staff'),
        fetch('/api/admin/ministries'),
        fetch('/api/admin/sermon-series'),
        fetch('/api/admin/seasonal-guides'),
        fetch('/api/admin/special-events-list'),
        fetch('/api/admin/assets')
      ]);

      const [staff, ministries, sermonSeries, seasonalGuides, specialEvents, assets] = await Promise.all([
        staffRes.ok ? staffRes.json() : [],
        ministriesRes.ok ? ministriesRes.json() : [],
        sermonSeriesRes.ok ? sermonSeriesRes.json() : [],
        seasonalGuidesRes.ok ? seasonalGuidesRes.json() : [],
        specialEventsRes.ok ? specialEventsRes.json() : [],
        assetsRes.ok ? assetsRes.json() : []
      ]);

      setStats({
        staffCount: Array.isArray(staff) ? staff.length : 0,
        ministriesCount: Array.isArray(ministries) ? ministries.length : 0,
        sermonSeriesCount: Array.isArray(sermonSeries) ? sermonSeries.length : 0,
        seasonalGuidesCount: Array.isArray(seasonalGuides) ? seasonalGuides.length : 0,
        specialEventsCount: Array.isArray(specialEvents) ? specialEvents.length : 0,
        assetsCount: Array.isArray(assets) ? assets.length : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardSections = [
    {
      title: 'Staff',
      description: 'Manage staff members and their information',
      href: '/admin/staff',
      icon: Users,
      count: stats.staffCount,
      color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      title: 'Ministries',
      description: 'Manage ministry teams and their details',
      href: '/admin/ministries',
      icon: Users,
      count: stats.ministriesCount,
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    },
    {
      title: 'Sermon Series & Sundays',
      description: 'Manage sermon series and Sunday content',
      href: '/admin/sermon-series',
      icon: FileText,
      count: stats.sermonSeriesCount,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      title: 'Seasonal Guides',
      description: 'Manage seasonal guides and resources',
      href: '/admin/seasonal-guides',
      icon: FileText,
      count: stats.seasonalGuidesCount,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      title: 'Calendar Admin',
      description: 'Manage calendar events and scheduling',
      href: '/admin/calendar',
      icon: Calendar,
      count: 0, // Calendar doesn't have a simple count
      color: 'bg-lime-50 text-lime-600 border-lime-200'
    },
    {
      title: 'Special Events List',
      description: 'View and manage special events',
      href: '/admin/special-events-list',
      icon: Star,
      count: stats.specialEventsCount,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      title: 'All Assets',
      description: 'Manage all files and media',
      href: '/admin/assets',
      icon: Upload,
      count: stats.assetsCount,
      color: 'bg-gray-50 text-gray-600 border-gray-200'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.href} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${section.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {section.count > 0 && (
                    <div className="text-2xl font-bold text-foreground">
                      {section.count}
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
                <Button asChild className="w-full">
                  <Link href={section.href} className="flex items-center justify-center">
                    Manage
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Add New Event
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/staff">
              <Users className="mr-2 h-4 w-4" />
              Add Staff Member
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/ministries">
              <Users className="mr-2 h-4 w-4" />
              Add Ministry
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/assets">
              <Upload className="mr-2 h-4 w-4" />
              Upload Asset
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
