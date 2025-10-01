import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Calendar, Download } from "lucide-react";
import { getFeaturedSeasonalGuide } from "@/lib/content-queries";
import Image from "next/image";
import { GroupsModalWrapper } from "./groups-modal-wrapper";

export async function SpecialEvents() {
  // Get featured seasonal guide from database
  const seasonalGuide = await getFeaturedSeasonalGuide();

  const regularGroups = [
    "Sunday School Classes",
    "Bible Study Groups",
    "Prayer Groups",
    "Women's Fellowship",
    "Men's Ministry",
    "Youth Group",
    "Children's Ministry"
  ];

  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4 font-serif">
            Special Events & Seasonal Guide
          </h2>
          <p className="text-2xl text-black max-w-3xl mx-auto">
            Stay connected with our community through special events and regular fellowship opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Seasonal Guide */}
          <Card className="md:col-span-2 lg:col-span-2 p-8 !bg-red-600 border-0 shadow-none" style={{ backgroundColor: 'rgb(220 38 38)' }}>
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <FileText className="h-8 w-8 text-white mr-3" />
                <h3 className="text-2xl font-bold text-white">Seasonal Guide</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-white text-lg">
                  Download our comprehensive seasonal guide to stay informed about upcoming events, 
                  special services, and community activities throughout the year.
                </p>
                
                <div className="bg-white/10 p-6 rounded-lg border border-white/20" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2 text-white">What&apos;s Inside:</h4>
                      <ul className="space-y-2 text-white text-lg">
                        <li>• Special service schedules</li>
                        <li>• Community outreach opportunities</li>
                        <li>• Fellowship events</li>
                        <li>• Study group schedules</li>
                        <li>• Volunteer opportunities</li>
                      </ul>
                    </div>
                    {seasonalGuide?.coverImageUrl && (
                      <div className="flex-shrink-0 w-full md:w-auto">
                        <div className="relative w-48 h-64 rounded-lg overflow-hidden shadow-md mx-auto md:mx-0">
                          <Image
                            src={seasonalGuide.coverImageUrl}
                            alt={seasonalGuide.title}
                            fill
                            className="object-cover"
                            style={{ aspectRatio: '8.5/11' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  asChild
                  className="w-full bg-white text-red-600 hover:bg-white/10 hover:text-white border border-white transition-colors"
                >
                  <a 
                    href={seasonalGuide?.pdfUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Seasonal Guide (PDF)
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Regular Groups */}
          <Card className="!bg-teal-800 border-0 shadow-none overflow-hidden py-0" style={{ backgroundColor: 'rgb(17 94 89)' }}>
            <CardContent className="p-0">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/images/assorted-images/fcc-life-together.jpg"
                  alt="Life together fellowship"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-8">
                <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-white mr-3" />
                <h3 className="text-2xl font-bold text-white">Regular Groups</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-white">
                  Join one of our many regular groups that meet throughout the week.
                </p>
                
                <ul className="space-y-3">
                  {regularGroups.map((group, index) => (
                    <li key={index} className="flex items-center text-white">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      {group}
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3 mt-4">
                  <GroupsModalWrapper>
                    <Button 
                      variant="outline" 
                      className="w-full bg-white text-teal-800 hover:bg-white/10 hover:text-white border border-white transition-colors"
                    >
                      View Weekly Groups
                    </Button>
                  </GroupsModalWrapper>
                  <Button 
                    variant="outline" 
                    className="w-full bg-white text-teal-800 hover:bg-white/10 hover:text-white border border-white transition-colors"
                    asChild
                  >
                    <a href="/calendar">View Full Calendar</a>
                  </Button>
                </div>
              </div>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" variant="outline" className="w-full sm:w-auto bg-indigo-900 text-white hover:bg-indigo-700 hover:text-white border-0 transition-colors" asChild>
            <a href="/calendar">View Full Calendar</a>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto bg-indigo-900 text-white hover:bg-indigo-700 hover:text-white border-0 transition-colors" asChild>
            <a href="/ministry-database">Explore Ministries at FCC</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
