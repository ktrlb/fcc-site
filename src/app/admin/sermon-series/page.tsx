"use client";

import { useState, useEffect } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminLayout } from "@/components/admin/admin-layout";
import { SermonSeriesSundaysDashboard } from "@/components/admin/sermon-series-sundays-dashboard";

export default function SermonSeriesAdminPage() {
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
    <AdminLayout 
      onLogout={handleLogout}
      title="Sermon Series & Sundays"
      description="Manage sermon series graphics and Sunday scheduling"
    >
      <div className="p-6">
        <SermonSeriesSundaysDashboard />
      </div>
    </AdminLayout>
  );
}
