import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ExternalLink } from "lucide-react";

export function EmailSignup() {
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

            {/* Constant Contact Signup Link */}
            <div className="text-center mb-8">
              <Button 
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg"
              >
                <a 
                  href="https://visitor.r20.constantcontact.com/manage/optin/ea?v=001VrJa7-wsPDsF5rztjUfffA%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  Subscribe to Our Newsletter
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                You&apos;ll be redirected to our secure signup page
              </p>
            </div>

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
