import { MinistryDatabase } from "@/components/ministry/ministry-database";
import { getMinistryTeams } from "@/lib/ministry-queries";

export default async function MinistryDatabasePage() {
  const ministries = await getMinistryTeams();

  return (
    <div className="min-h-screen">
      <MinistryDatabase initialMinistries={ministries} />
    </div>
  );
}
