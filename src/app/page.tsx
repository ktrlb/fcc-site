import { HeroSection } from "@/components/home/hero-section";
import { SeeYouOnSunday } from "@/components/home/see-you-on-sunday";
import { SpecialEvents } from "@/components/home/special-events";
import { FeaturedSpecialEvents } from "@/components/home/featured-special-events";
import { FeaturedAssets } from "@/components/home/featured-assets";
import { LearnMore } from "@/components/home/learn-more";
import { FindingYourPlace } from "@/components/home/finding-your-place";
import { ChildrenYouthMinistries } from "@/components/home/children-youth-ministries";
import { EmailSignup } from "@/components/home/email-signup";
import { Suspense } from "react";

// Revalidate every hour - balances freshness with performance
export const revalidate = 3600;

// Loading fallback component for the Sunday section
function SundayScheduleLoading() {
  return (
    <section className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-600 rounded-lg p-8 mb-12 animate-pulse">
            <div className="h-12 bg-white/20 rounded mb-6 max-w-md mx-auto"></div>
            <div className="h-8 bg-white/20 rounded mb-4 max-w-lg mx-auto"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mb-4"></div>
                  <div className="h-6 bg-white/20 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-teal-800 rounded-lg p-8 animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-4 max-w-sm"></div>
            <div className="h-6 bg-white/20 rounded mb-2 max-w-md"></div>
            <div className="h-6 bg-white/20 rounded max-w-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Wrap the dynamic Sunday section in Suspense so the rest of the page can render immediately */}
      <Suspense fallback={<SundayScheduleLoading />}>
        <SeeYouOnSunday />
      </Suspense>
      
      <FindingYourPlace />
      <ChildrenYouthMinistries />
      <SpecialEvents />
      <FeaturedSpecialEvents />
      <FeaturedAssets />
      <LearnMore />
      <EmailSignup />
    </div>
  );
}
