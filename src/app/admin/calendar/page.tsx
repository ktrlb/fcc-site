'use client';

import { CalendarAdminDashboard } from '@/components/admin/calendar-admin-dashboard';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function CalendarAdminPage() {
  const handleLogout = () => {
    // Handle logout logic here
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="flex h-screen">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Calendar Management</h1>
            <p className="text-gray-600">Manage calendar events and recurring patterns</p>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <CalendarAdminDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
