import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { AdminMinistryDashboard } from '@/components/admin/admin-ministry-dashboard';

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/ministry-database/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <AdminMinistryDashboard />
    </div>
  );
}
