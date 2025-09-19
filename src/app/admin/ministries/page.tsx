"use client";

import { useState, useEffect } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminMinistryDashboard } from "@/components/admin/admin-ministry-dashboard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function MinistriesAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/admin/assets");
      if (response.ok) {
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="flex h-screen">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Ministry Management</h1>
            <p className="text-gray-600">Manage ministry teams and opportunities</p>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <AdminMinistryDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
