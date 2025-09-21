import { Suspense } from "react";
import { MinistryDatabase } from "@/components/ministry/ministry-database";
import { getMinistryTeams } from "@/lib/ministry-queries";

export default async function MinistryDatabasePage() {
  const ministries = await getMinistryTeams();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ height: '450px' }}>
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"
          style={{
            backgroundImage: "url('/images/mission-database-background-header.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ transform: 'translateY(50px)' }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              Ministry Database
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Discover ways to get involved in our church community. Find ministry opportunities that match your interests, skills, and availability.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ministry opportunities...</p>
          </div>
        </div>
      </div>}>
        <MinistryDatabase initialMinistries={ministries} />
      </Suspense>
    </div>
  );
}
