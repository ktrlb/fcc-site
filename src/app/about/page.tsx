import { AboutHero } from "@/components/about/about-hero";
import { MissionVision } from "@/components/about/mission-vision";
import { Staff } from "@/components/about/staff";
import { History } from "@/components/about/history";
import { LayLeadership } from "@/components/about/lay-leadership";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <MissionVision />
      <Staff />
      <History />
      <LayLeadership />
    </div>
  );
}
