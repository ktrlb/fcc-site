import { db } from '../src/lib/db';
import { ministryTeams } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

// Define the ministry category updates
const ministryCategoryUpdates: Array<{
  name: string;
  categories: string[];
}> = [
  // Youth & Children Ministries
  {
    name: "JYF (Junior Youth Fellowship)",
    categories: ["Discipleship & Education", "Children & Youth"]
  },
  {
    name: "Children's Sunday School",
    categories: ["Discipleship & Education", "Children & Youth"]
  },
  {
    name: "Youth Group",
    categories: ["Discipleship & Education", "Children & Youth"]
  },
  {
    name: "Vacation Bible School",
    categories: ["Discipleship & Education", "Children & Youth"]
  },
  
  // Worship & Music Ministries
  {
    name: "Choir",
    categories: ["Worship & Music", "Fellowship"]
  },
  {
    name: "Praise Team",
    categories: ["Worship & Music", "Fellowship"]
  },
  {
    name: "Bell Choir",
    categories: ["Worship & Music", "Fellowship"]
  },
  {
    name: "Worship Committee",
    categories: ["Worship & Music", "Leadership"]
  },
  
  // Service & Outreach Ministries
  {
    name: "Mission Committee",
    categories: ["Service & Outreach", "Leadership"]
  },
  {
    name: "Food Pantry",
    categories: ["Service & Outreach", "Community Care"]
  },
  {
    name: "Habitat for Humanity",
    categories: ["Service & Outreach", "Community Care"]
  },
  {
    name: "Community Garden",
    categories: ["Service & Outreach", "Fellowship"]
  },
  
  // Fellowship & Community
  {
    name: "Fellowship Committee",
    categories: ["Fellowship", "Leadership"]
  },
  {
    name: "Men's Fellowship",
    categories: ["Fellowship", "Discipleship & Education"]
  },
  {
    name: "Women's Fellowship",
    categories: ["Fellowship", "Discipleship & Education"]
  },
  {
    name: "Coffee Hour",
    categories: ["Fellowship", "Hospitality"]
  },
  
  // Care & Support Ministries
  {
    name: "Pastoral Care Team",
    categories: ["Community Care", "Leadership"]
  },
  {
    name: "Prayer Shawl & Quilting Ministry",
    categories: ["Community Care", "Fellowship"]
  },
  {
    name: "Stephen Ministry",
    categories: ["Community Care", "Discipleship & Education"]
  },
  {
    name: "Bereavement Committee",
    categories: ["Community Care", "Service & Outreach"]
  },
  
  // Education & Discipleship
  {
    name: "Adult Sunday School",
    categories: ["Discipleship & Education", "Fellowship"]
  },
  {
    name: "Bible Study Groups",
    categories: ["Discipleship & Education", "Fellowship"]
  },
  {
    name: "New Member Classes",
    categories: ["Discipleship & Education", "Leadership"]
  },
  {
    name: "Confirmation Classes",
    categories: ["Discipleship & Education", "Children & Youth"]
  },
  
  // Administration & Leadership
  {
    name: "Board of Elders",
    categories: ["Leadership", "Spiritual Guidance"]
  },
  {
    name: "Board of Deacons",
    categories: ["Leadership", "Community Care"]
  },
  {
    name: "Finance Committee",
    categories: ["Leadership", "Administration"]
  },
  {
    name: "Property Committee",
    categories: ["Leadership", "Administration"]
  }
];

async function updateMinistryCategories() {
  console.log('Starting ministry category updates...');
  
  try {
    // First, let's see what ministries currently exist
    const existingMinistries = await db.select().from(ministryTeams);
    console.log(`Found ${existingMinistries.length} existing ministries:`);
    existingMinistries.forEach(ministry => {
      console.log(`- ${ministry.name} (current categories: ${ministry.categories || 'none'})`);
    });
    
    console.log('\n---\n');
    
    // Update each ministry with new categories
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const update of ministryCategoryUpdates) {
      const [existingMinistry] = await db
        .select()
        .from(ministryTeams)
        .where(eq(ministryTeams.name, update.name))
        .limit(1);
      
      if (existingMinistry) {
        await db
          .update(ministryTeams)
          .set({
            categories: update.categories,
            updatedAt: new Date()
          })
          .where(eq(ministryTeams.id, existingMinistry.id));
        
        console.log(`✅ Updated "${update.name}" with categories: ${update.categories.join(', ')}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Ministry "${update.name}" not found in database`);
        skippedCount++;
      }
    }
    
    console.log('\n---\n');
    console.log(`Update complete! Updated ${updatedCount} ministries, skipped ${skippedCount} ministries not found.`);
    
    // Show final state
    console.log('\nFinal ministry categories:');
    const finalMinistries = await db.select().from(ministryTeams);
    finalMinistries.forEach(ministry => {
      if (ministry.categories && ministry.categories.length > 0) {
        console.log(`- ${ministry.name}: ${ministry.categories.join(', ')}`);
      }
    });
    
  } catch (error) {
    console.error('Error updating ministry categories:', error);
  } finally {
    process.exit(0);
  }
}

// Run the update
updateMinistryCategories();
