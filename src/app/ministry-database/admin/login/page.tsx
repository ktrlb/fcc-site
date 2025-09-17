"use client";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/ministry-database/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ministry Database Administration
          </p>
        </div>
        <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
