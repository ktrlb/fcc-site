"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Integrate with Constant Contact API
    // For now, we'll just simulate a successful subscription
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Thank You for Subscribing!
          </h2>
          <p className="text-xl text-blue-100">
            You&apos;ll receive our weekly newsletter and important updates about our community.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="p-8">
          <CardContent className="p-0">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Stay Connected
              </h2>
              <p className="text-lg text-gray-600">
                Sign up for our weekly newsletter to stay informed about upcoming events, 
                sermon series, and community news.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Weekly Newsletter</h4>
                <p className="text-sm text-gray-600">
                  Get the latest news and updates from our community
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Event Reminders</h4>
                <p className="text-sm text-gray-600">
                  Never miss important events and special services
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Prayer Requests</h4>
                <p className="text-sm text-gray-600">
                  Stay connected with our prayer community
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
