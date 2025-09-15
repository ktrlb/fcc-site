import { HeroSection } from "@/components/home/hero-section";
import { SeeYouOnSunday } from "@/components/home/see-you-on-sunday";
import { SpecialEvents } from "@/components/home/special-events";
import { LearnMore } from "@/components/home/learn-more";
import { FindingYourPlace } from "@/components/home/finding-your-place";
import { EmailSignup } from "@/components/home/email-signup";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SeeYouOnSunday />
      <SpecialEvents />
      <LearnMore />
      <FindingYourPlace />
      <EmailSignup />
    </div>
  );
}
