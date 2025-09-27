import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ExternalLink } from "lucide-react";

export function EmailSignup() {
  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="p-8 border-0 shadow-none" style={{ backgroundColor: 'rgb(220 38 38)' }}>
          <CardContent className="p-0">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white rounded-full">
                  <Mail className="h-8 w-8" style={{ color: 'rgb(220 38 38)' }} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Stay Connected
              </h2>
              <p className="text-lg text-white">
                Sign up for our weekly newsletter to stay informed about upcoming events, 
                sermon series, and community news.
              </p>
            </div>

            {/* Constant Contact Signup Link */}
            <div className="text-center mb-8">
              <Button 
                asChild
                size="lg"
                className="bg-white text-red-600 hover:bg-white/10 hover:text-white border border-white transition-colors px-6 sm:px-8 md:px-12 py-3 sm:py-4 text-xl sm:text-2xl font-bold whitespace-normal text-center h-auto"
              >
                <a 
                  href="https://visitor.r20.constantcontact.com/manage/optin/ea?v=001VrJa7-wsPDsF5rztjUfffA%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center w-full h-full"
                >
                  <span>Subscribe to Our Newsletter</span>
                  <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                </a>
              </Button>
              <p className="text-sm text-white mt-4">
                You&apos;ll be redirected to our secure signup page
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-white mb-2">Weekly Newsletter</h4>
                <p className="text-sm text-white">
                  Get the latest news and updates from our community
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Event Reminders</h4>
                <p className="text-sm text-white">
                  Never miss important events and special services
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Prayer Requests</h4>
                <p className="text-sm text-white">
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
