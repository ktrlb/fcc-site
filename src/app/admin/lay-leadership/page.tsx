import { LayLeadershipDashboard } from '@/components/admin/lay-leadership-dashboard';
import { AdminLayout } from '@/components/admin/admin-layout';

export default function LayLeadershipPage() {
  return (
    <AdminLayout
      title="Lay Leadership Management"
      description="Manage lay leadership positions and members"
      onLogout={async () => {
        'use server';
        // Logout logic will be handled by the layout
      }}
    >
      <LayLeadershipDashboard />
    </AdminLayout>
  );
}
