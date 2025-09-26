"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, ExternalLink, Download, Lock, Eye, EyeOff } from "lucide-react";

export default function DirectoryPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/directory/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError("Failed to verify password. Please try again.");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/directory');
      if (response.ok) {
        const directoryData = await response.json();
        
        // Create a temporary link to download the PDF
        const link = document.createElement('a');
        link.href = directoryData.fileUrl;
        link.download = directoryData.fileName || 'FCC_Church_Directory.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to download directory'}`);
      }
    } catch (error) {
      console.error('Error downloading directory:', error);
      alert('Failed to download directory. Please try again or contact the church office.');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen pt-24" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Users className="h-8 w-8" style={{ color: 'rgb(17 94 89)' }} />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white font-serif mb-4">Church Directory</h1>
            <p className="text-xl text-white/80">
              Access our church family directory
            </p>
          </div>

          <div className="p-8 rounded-lg mb-8" style={{ backgroundColor: 'rgb(17 94 89)' }}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Download Directory PDF</h2>
              <p className="text-white/90 mb-6">
                You can now download the church directory PDF. This directory contains contact 
                information for our church family members.
              </p>
              
              <Button 
                onClick={handleDownload}
                size="lg"
                className="inline-flex items-center mb-4 bg-white text-teal-800 hover:bg-white/10 hover:text-white border border-white"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Directory PDF
              </Button>
              
              <p className="text-sm text-white/80">
                Note: This directory is for church family use only. Please respect the privacy 
                of our members and do not share this information outside our church community.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => setIsAuthenticated(false)}
              variant="outline"
              className="bg-white text-indigo-900 hover:bg-white/10 hover:text-white border border-white"
            >
              Back to Directory Options
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white font-serif mb-4">Church Directory</h1>
          <p className="text-xl text-white/80">Access our family directory</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Breeze Directory */}
          <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(49 46 129)' }}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" style={{ color: 'rgb(49 46 129)' }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Live Directory (Breeze)</h2>
              <p className="text-white/90 mb-6">
                Access our always up-to-date digital directory through Breeze. 
                Request an account to view current member information.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white text-indigo-900 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-white/90 text-sm">
                  Click &quot;Request Breeze Access&quot; to fill out the signup form
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white text-indigo-900 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-white/90 text-sm">
                  Receive an email within 24-48 hours with account setup instructions
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white text-indigo-900 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-white/90 text-sm">
                  Access the complete, always-current directory
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-white text-indigo-900 hover:bg-white/10 hover:text-white border border-white">
                <a 
                  href="https://fccgranbury.breezechms.com/form/breeze-signup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  Request Breeze Access
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/30">
                <a 
                  href="https://fccgranbury.breezechms.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  Already have an account? Sign In
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          {/* PDF Directory */}
          <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgb(17 94 89)' }}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8" style={{ color: 'rgb(17 94 89)' }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">PDF Directory</h2>
              <p className="text-white/90 mb-6">
                Download a static PDF version of our church directory. 
                Contact the office for the password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Directory Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pr-10 bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:border-white focus:ring-white/50"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)', color: 'white' }}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white/70" />
                    ) : (
                      <Eye className="h-4 w-4 text-white/70" />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-white/90">{error}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full bg-white text-teal-800 hover:bg-white/10 hover:text-white border border-white">
                <Lock className="h-4 w-4 mr-2" />
                Access PDF Directory
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-white/90">
                Need the password? Contact the church office at{" "}
                <a 
                  href="mailto:office@fccgranbury.org" 
                  className="text-white hover:text-white/80 underline"
                >
                  office@fccgranbury.org
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgb(245 158 11)' }}>
          <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
          <p className="text-white/90">
            If you have questions about accessing the directory or need assistance with your Breeze account, 
            please contact the church office at <a href="mailto:office@fccgranbury.org" className="text-white hover:text-white/80 underline font-medium">office@fccgranbury.org</a> 
            or call <a href="tel:+18175735431" className="text-white hover:text-white/80 underline font-medium">(817) 573-5431</a>.
          </p>
        </div>
      </div>
    </div>
  );
}