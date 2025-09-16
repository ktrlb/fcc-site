import { MinistryDatabase } from "@/components/ministry/ministry-database";
import { getMinistryTeams, getMinistryCategories } from "@/lib/ministry-queries";

export default async function MinistryDatabasePage() {
  const [ministries, categories] = await Promise.all([
    getMinistryTeams(),
    getMinistryCategories(),
  ]);

  return (
    <div className="min-h-screen">
      <MinistryDatabase initialMinistries={ministries} initialCategories={categories} />
    </div>
  );
}
