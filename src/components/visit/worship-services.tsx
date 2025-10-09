import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { YouTubePlaylistEmbed } from "@/components/youtube/youtube-playlist-embed";
import { ImageCarousel } from "@/components/image-carousel";

export function WorshipServices() {
  const regularServices = [
    {
      time: "9:00 AM",
      name: "Modern Worship",
      description: "The Praise Team leads contemporary music in a casual atmosphere"
    },
    {
      time: "11:00 AM", 
      name: "Traditional Worship",
      description: "The Chancel Choir leads traditional hymns in a more liturgical service"
    }
  ];

  const specialServices = [
    "Outdoor Worship",
    "Candlelight Christmas Eve",
    "VBS Sunday", 
    "Christmas Cantata",
    "Children's Christmas Pageant"
  ];

  return (
    <section className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif italic">Let&apos;s Worship Together</h2>
          <p className="mt-6 text-xl text-white/95 max-w-3xl mx-auto leading-relaxed">
            Most Sundays, we worship together in two expressions of the same&nbsp;faith—Modern&nbsp;Worship&nbsp;at&nbsp;9am and Traditional&nbsp;Worship&nbsp;at&nbsp;11am.
          </p>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Both lift hearts in praise, share the bread and cup, and center us in God&apos;s&nbsp;word, each with its own musical style and&nbsp;atmosphere.
          </p>
        </div>

        {/* Two Services Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12 px-2">
          {regularServices.map((service, index) => {
            // Use red for Modern, indigo for Traditional
            const colors = [
              { bg: 'red-600', text: 'text-red-600', hex: '#dc2626' },
              { bg: 'indigo-900', text: 'text-indigo-900', hex: '#312e81' }
            ];
            const colorScheme = colors[index % colors.length];
            
            return (
                  <Card key={index} className="border-0 shadow-none overflow-hidden p-0" style={{ backgroundColor: colorScheme.hex }}>
                    <CardContent className="p-0 pb-0">
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="h-5 w-5" style={{ color: colorScheme.hex }} />
                          </div>
                          <h4 className="text-xl font-semibold text-white">{service.time}</h4>
                          <span className="bg-white text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Weekly
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">{service.name}</h3>
                        <p className="text-white/90 text-lg">{service.description}</p>
                      </div>
                      
                      {/* Show latest video for Modern Worship - Full Width to Edge */}
                      {service.name === "Modern Worship" && (
                        <div style={{ aspectRatio: '16/9', display: 'block', lineHeight: 0 }}>
                          <YouTubePlaylistEmbed apiEndpoint="/api/youtube/latest-modern" autoplay={false} className="w-full h-full block" />
                        </div>
                      )}
                      
                      {/* Show latest sermon video for Traditional Worship - Full Width to Edge */}
                      {service.name === "Traditional Worship" && (
                        <div style={{ aspectRatio: '16/9', display: 'block', lineHeight: 0 }}>
                          <YouTubePlaylistEmbed apiEndpoint="/api/youtube/latest-sermon" autoplay={false} className="w-full h-full block" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {/* Special Services - Full Width Below */}
        <div className="px-2">
          <Card className="border-0 shadow-none overflow-hidden p-0" style={{ backgroundColor: 'rgb(245 158 11)' }}>
            <CardContent className="p-0 pb-0">
              {/* Top section - Text content */}
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6" style={{ color: '#f59e0b' }} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3">Special Services Throughout the Year</h3>
                    <p className="text-white/90 text-lg mb-4">
                      We celebrate special occasions and seasons with unique worship experiences:
                    </p>
                    <ul className="space-y-2">
                      {specialServices.map((service, index) => (
                        <li key={index} className="flex items-center text-white">
                          <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom section - Image carousel at full width */}
              <div className="w-full">
                <ImageCarousel category="worship" />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
}
