"use client";

import { useState, useEffect } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SeasonalGuidesAdminPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Seasonal Guides Management</h1>
            <p className="text-gray-600">Manage seasonal guides and resources</p>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Seasonal Guides</h2>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Guide
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Guides Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Seasonal guides management interface coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
