'use client';

import { CalendarAdminDashboard } from '@/components/admin/calendar-admin-dashboard';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function CalendarAdminPage() {
  const handleLogout = () => {
    // Handle logout logic here
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 pt-24 h-screen overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <CalendarAdminDashboard />
        </div>
      </div>
    </div>
  );
}
