import { GiveHero } from "@/components/give/give-hero";
import { WaysToDonate } from "@/components/give/ways-to-donate";
import { StewardshipView } from "@/components/give/stewardship-view";
import { GivingInfo } from "@/components/give/giving-info";

export default function GivePage() {
  return (
    <div className="min-h-screen">
      <GiveHero />
      <WaysToDonate />
      <StewardshipView />
      <GivingInfo />
    </div>
  );
}
