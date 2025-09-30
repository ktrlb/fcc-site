import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Facebook, Youtube, ExternalLink } from "lucide-react";

export function WhereToFindUs() {
  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-900 font-serif">Where to Find Us</h2>
          <p className="mt-4 text-lg text-indigo-900">Connect with us online and in person</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Location & Map */}
          <div className="px-2">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6 font-serif">Our Location</h3>
            <Card className="p-4 border-0 shadow-none" style={{ backgroundColor: 'rgb(17 94 89)' }}>
              <CardContent className="p-0">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6" style={{ color: '#115e59' }} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">First Christian Church Granbury</h4>
                    <p className="text-white mb-4">
                      2109 W US Hwy 377<br />
                      Granbury, TX 76048
                    </p>
                    <Button asChild variant="outline" className="bg-white text-teal-800 hover:bg-white/10 hover:text-white border border-white transition-colors">
                      <a 
                        href="https://maps.google.com/?q=2109+W+US+Hwy+377+Granbury+TX+76048"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Directions
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
                
                {/* Interactive Google Map */}
                <div className="rounded-lg overflow-hidden h-64">
                  <iframe
                    src="https://maps.google.com/maps?q=2109+W+US+Hwy+377,+Granbury,+TX+76048&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="First Christian Church Granbury Location"
                  />
                </div>
                <p className="text-center text-white mt-2 text-base" style={{ fontStyle: 'italic' }}>
                  The Church Next to Tractor Supply
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Social Media & Live Links */}
          <div className="px-2">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6 font-serif">Connect Online</h3>
            <div className="space-y-6">
              <Card className="p-4 border-0 shadow-none" style={{ backgroundColor: 'rgb(220 38 38)' }}>
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Facebook className="h-6 w-6" style={{ color: '#dc2626' }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">Facebook</h4>
                      <p className="text-white text-base">Stay updated with church news and events</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="bg-white text-red-600 hover:bg-white/10 hover:text-white border border-white transition-colors">
                      <a 
                        href="https://www.facebook.com/FCCGranbury"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        Visit
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 border-0 shadow-none" style={{ backgroundColor: 'rgb(49 46 129)' }}>
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Youtube className="h-6 w-6" style={{ color: '#312e81' }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">YouTube</h4>
                      <p className="text-white text-base">Watch sermons and special services</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="bg-white text-indigo-900 hover:bg-white/10 hover:text-white border border-white transition-colors">
                      <a 
                        href="https://www.youtube.com/@fccgranburytx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        Visit
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 border-0 shadow-none" style={{ backgroundColor: 'rgb(245 158 11)' }}>
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <ExternalLink className="h-6 w-6" style={{ color: '#f59e0b' }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">Live Streaming</h4>
                      <p className="text-white text-base">We stream our services live on Facebook and YouTube</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm" className="bg-white text-amber-500 hover:bg-white/10 hover:text-white border border-white transition-colors">
                        <a 
                          href="https://www.facebook.com/FCCGranbury"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center"
                        >
                          Facebook
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="bg-white text-amber-500 hover:bg-white/10 hover:text-white border border-white transition-colors">
                        <a 
                          href="https://www.youtube.com/@fccgranburytx"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center"
                        >
                          YouTube
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
