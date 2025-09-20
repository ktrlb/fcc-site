import { db } from '../src/lib/db';
import { ministryTeams } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

// Define the ministry category updates based on actual database names
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
    name: "Chi-Rho & CYF",
    categories: ["Discipleship & Education", "Children & Youth"]
  },
  {
    name: "Children's Ministry Teams",
    categories: ["Discipleship & Education", "Children & Youth"]
  },
  {
    name: "Youth Ministry Support Teams",
    categories: ["Discipleship & Education", "Children & Youth"]
  },
  {
    name: "Young Adult Outings",
    categories: ["Discipleship & Education", "Children & Youth"]
  },
  
  // Worship & Music Ministries
  {
    name: "Chancel Choir",
    categories: ["Worship & Music", "Fellowship"]
  },
  {
    name: "Praise Team",
    categories: ["Worship & Music", "Fellowship"]
  },
  {
    name: "Handbell Choir",
    categories: ["Worship & Music", "Fellowship"]
  },
  
  // Service & Outreach Ministries
  {
    name: "Compassionate Cooks",
    categories: ["Service & Outreach", "Community Care"]
  },
  {
    name: "Meals on Wheels",
    categories: ["Service & Outreach", "Community Care"]
  },
  {
    name: "Mission Granbury",
    categories: ["Service & Outreach", "Community Care"]
  },
  {
    name: "Paluxy River Children's Advocacy",
    categories: ["Service & Outreach", "Community Care"]
  },
  {
    name: "Ruth's Place Clinic & Outreach Center",
    categories: ["Service & Outreach", "Community Care"]
  },
  {
    name: "Salvation Army",
    categories: ["Service & Outreach", "Community Care"]
  },
  {
    name: "Scholarship Ministry",
    categories: ["Service & Outreach", "Leadership"]
  },
  {
    name: "Anjelita Best Food Pantry",
    categories: ["Service & Outreach", "Community Care"]
  },
  {
    name: "Pack the Pantry Volunteers",
    categories: ["Service & Outreach", "Community Care"]
  },
  
  // Fellowship & Community
  {
    name: "42 Dominoes",
    categories: ["Fellowship", "Recreation"]
  },
  {
    name: "Art Ministry",
    categories: ["Fellowship", "Creativity & Arts"]
  },
  {
    name: "Disciples Women's Card Writing Ministry",
    categories: ["Fellowship", "Community Care"]
  },
  {
    name: "Ladies Who Lunch",
    categories: ["Fellowship", "Social"]
  },
  {
    name: "Women's Book Club",
    categories: ["Fellowship", "Discipleship & Education"]
  },
  {
    name: "Pickleball",
    categories: ["Fellowship", "Recreation"]
  },
  {
    name: "Tai Chi",
    categories: ["Fellowship", "Health & Wellness"]
  },
  
  // Care & Support Ministries
  {
    name: "Prayer Shawl & Quilting Ministry",
    categories: ["Community Care", "Fellowship"]
  },
  {
    name: "Visiting Ministry",
    categories: ["Community Care", "Service & Outreach"]
  },
  {
    name: "Respite Care Ministry",
    categories: ["Community Care", "Service & Outreach"]
  },
  {
    name: "Bereavement Meals Team",
    categories: ["Community Care", "Service & Outreach"]
  },
  {
    name: "Medical Supply Closet",
    categories: ["Community Care", "Service & Outreach"]
  },
  
  // Education & Discipleship
  {
    name: "Centering Prayer Group",
    categories: ["Discipleship & Education", "Spiritual Growth"]
  },
  {
    name: "Contemplative Prayer",
    categories: ["Discipleship & Education", "Spiritual Growth"]
  },
  {
    name: "Disciples Class",
    categories: ["Discipleship & Education", "Fellowship"]
  },
  {
    name: "Disciples Men's Prayer Group & Breakfast",
    categories: ["Discipleship & Education", "Fellowship"]
  },
  {
    name: "Seekers Class",
    categories: ["Discipleship & Education", "Fellowship"]
  },
  
  // Health & Wellness
  {
    name: "Parkinson's Boxing Ministry",
    categories: ["Health & Wellness", "Community Care"]
  },
  
  // Administration & Leadership
  {
    name: "Property/Grounds Team",
    categories: ["Leadership", "Administration"]
  },
  {
    name: "Safety Team",
    categories: ["Leadership", "Administration"]
  },
  {
    name: "Welcome Team",
    categories: ["Leadership", "Hospitality"]
  },
  {
    name: "Wayfinding Team",
    categories: ["Leadership", "Hospitality"]
  },
  {
    name: "Kitchen Crew",
    categories: ["Leadership", "Hospitality"]
  },
  
  // Specialized Ministries
  {
    name: "Seasonal Ministry Teams",
    categories: ["Service & Outreach", "Leadership"]
  },
  {
    name: "Forward Training Center",
    categories: ["Service & Outreach", "Discipleship & Education"]
  },
  {
    name: "Library",
    categories: ["Discipleship & Education", "Fellowship"]
  }
];

async function updateMinistryCategories() {
  console.log('Starting ministry category updates (v2)...');
  
  try {
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
