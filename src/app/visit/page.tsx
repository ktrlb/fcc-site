import { VisitHero } from "@/components/visit/visit-hero";
import { WorshipServices } from "@/components/visit/worship-services";
import { WhereToFindUs } from "@/components/visit/where-to-find-us";
import { WhatToExpect } from "@/components/visit/what-to-expect";

export default function VisitPage() {
  return (
    <div className="min-h-screen">
      <VisitHero />
      <WorshipServices />
      <WhereToFindUs />
      <WhatToExpect />
    </div>
  );
}
