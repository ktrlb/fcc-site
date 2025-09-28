import { db } from '../src/lib/db';
import { specialEventTypes } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const defaultSpecialEvents = [
  {
    name: 'None',
    description: 'No special event type',
    color: '#6B7280',
    isDefault: true,
    sortOrder: '0',
  },
  {
    name: 'Holiday',
    description: 'Religious or national holidays',
    color: '#EF4444',
    isDefault: true,
    sortOrder: '1',
  },
  {
    name: 'Community Event',
    description: 'Community outreach or engagement events',
    color: '#10B981',
    isDefault: true,
    sortOrder: '2',
  },
  {
    name: 'Fundraiser',
    description: 'Fundraising events and campaigns',
    color: '#F59E0B',
    isDefault: true,
    sortOrder: '3',
  },
  {
    name: 'Conference',
    description: 'Conferences and large gatherings',
    color: '#8B5CF6',
    isDefault: true,
    sortOrder: '4',
  },
  {
    name: 'Retreat',
    description: 'Spiritual retreats and getaways',
    color: '#06B6D4',
    isDefault: true,
    sortOrder: '5',
  },
  {
    name: 'Concert',
    description: 'Musical performances and concerts',
    color: '#EC4899',
    isDefault: true,
    sortOrder: '6',
  },
  {
    name: 'Workshop',
    description: 'Educational workshops and seminars',
    color: '#84CC16',
    isDefault: true,
    sortOrder: '7',
  },
  {
    name: 'Special Meeting',
    description: 'Important meetings and assemblies',
    color: '#F97316',
    isDefault: true,
    sortOrder: '8',
  },
  {
    name: 'Celebration',
    description: 'Celebrations and parties',
    color: '#EF4444',
    isDefault: true,
    sortOrder: '9',
  },
  {
    name: 'Memorial Service',
    description: 'Memorial services and funerals',
    color: '#6B7280',
    isDefault: true,
    sortOrder: '10',
  },
  {
    name: 'Wedding',
    description: 'Wedding ceremonies and receptions',
    color: '#EC4899',
    isDefault: true,
    sortOrder: '11',
  },
  {
    name: 'Baptism',
    description: 'Baptism ceremonies',
    color: '#06B6D4',
    isDefault: true,
    sortOrder: '12',
  },
  {
    name: 'Dedication',
    description: 'Dedication ceremonies',
    color: '#8B5CF6',
    isDefault: true,
    sortOrder: '13',
  },
  {
    name: 'Graduation',
    description: 'Graduation ceremonies',
    color: '#10B981',
    isDefault: true,
    sortOrder: '14',
  },
  {
    name: 'Other',
    description: 'Other special events',
    color: '#6B7280',
    isDefault: true,
    sortOrder: '15',
  },
];

async function seedSpecialEvents() {
  console.log('🌱 Seeding special events...');
  
  try {
    // Check if special events already exist
    const existingEvents = await db.select().from(specialEventTypes);
    
    if (existingEvents.length > 0) {
      console.log(`✅ Special events already exist (${existingEvents.length} found)`);
      return;
    }
    
    // Insert default special events
    const results = await db.insert(specialEventTypes).values(defaultSpecialEvents).returning();
    
    console.log(`✅ Successfully seeded ${results.length} special events:`);
    results.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.name} (${event.color})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding special events:', error);
    throw error;
  }
}

// Run the seeding function
seedSpecialEvents()
  .then(() => {
    console.log('🎉 Special events seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Special events seeding failed:', error);
    process.exit(1);
  });

