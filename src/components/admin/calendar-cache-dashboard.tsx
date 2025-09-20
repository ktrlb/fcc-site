'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, Clock, Calendar, AlertCircle } from 'lucide-react';

interface CacheStats {
  totalEvents: number;
  lastUpdated: string | null;
  oldestEvent: string | null;
  newestEvent: string | null;
}

export function CalendarCacheDashboard() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/calendar/refresh');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        setMessage({ type: 'error', text: 'Failed to load cache stats' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading cache stats' });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCache = async () => {
    setIsRefreshing(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/calendar/refresh', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setMessage({ 
          type: 'success', 
          text: `Cache refreshed successfully! ${data.eventsCount} events cached.` 
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to refresh cache' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error refreshing cache' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getCacheAge = (lastUpdated: string | null) => {
    if (!lastUpdated) return 'Unknown';
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMs = now.getTime() - updated.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar Cache Management</h2>
          <p className="text-gray-600 mt-1">
            Manage Google Calendar data caching to reduce API calls and improve performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadStats}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            {isLoading ? 'Loading...' : 'Load Stats'}
          </Button>
          <Button
            onClick={refreshCache}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Cache'}
          </Button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <Database className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {message.text}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
              <p className="text-xs text-gray-500">Cached events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {getCacheAge(stats.lastUpdated)}
              </div>
              <p className="text-xs text-gray-500">
                {formatDate(stats.lastUpdated)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Oldest Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.oldestEvent ? new Date(stats.oldestEvent).toLocaleDateString() : 'None'}
              </div>
              <p className="text-xs text-gray-500">
                {stats.oldestEvent ? new Date(stats.oldestEvent).toLocaleTimeString() : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Newest Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.newestEvent ? new Date(stats.newestEvent).toLocaleDateString() : 'None'}
              </div>
              <p className="text-xs text-gray-500">
                {stats.newestEvent ? new Date(stats.newestEvent).toLocaleTimeString() : ''}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Cache Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How it works</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Calendar data is cached locally for 1 hour</li>
                <li>• API calls to Google Calendar are minimized</li>
                <li>• Cache automatically refreshes when expired</li>
                <li>• Manual refresh available for immediate updates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Faster page loads</li>
                <li>• Reduced Google API usage</li>
                <li>• Lower costs and rate limit issues</li>
                <li>• Better user experience</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Automatic Refresh</h4>
                <p className="text-sm text-blue-700 mt-1">
                  The cache will automatically refresh from Google Calendar when it's older than 1 hour. 
                  You can also manually refresh it using the button above.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
