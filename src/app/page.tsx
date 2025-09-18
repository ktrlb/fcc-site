import { HeroSection } from "@/components/home/hero-section";
import { SeeYouOnSunday } from "@/components/home/see-you-on-sunday";
import { SpecialEvents } from "@/components/home/special-events";
import { FeaturedAssets } from "@/components/home/featured-assets";
import { LearnMore } from "@/components/home/learn-more";
import { FindingYourPlace } from "@/components/home/finding-your-place";
import { EmailSignup } from "@/components/home/email-signup";

export default async function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SeeYouOnSunday />
      <SpecialEvents />
      <FeaturedAssets />
      <LearnMore />
      <FindingYourPlace />
      <EmailSignup />
    </div>
  );
}
