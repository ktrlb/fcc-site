import { db } from '../src/lib/db';
import { members, families, familyMemberships } from '../src/lib/schema';
import { eq, isNull } from 'drizzle-orm';

async function cleanupMembers() {
  console.log('🧹 Starting Member Database Cleanup...\n');

  try {
    // First, let's see what we have
    const memberCount = await db.select().from(members);
    const familyCount = await db.select().from(families);
    const familyMembershipCount = await db.select().from(familyMemberships);

    console.log(`📊 Current Database State:`);
    console.log(`   Members: ${memberCount.length}`);
    console.log(`   Families: ${familyCount.length}`);
    console.log(`   Family Memberships: ${familyMembershipCount.length}\n`);

    // Delete family memberships first (foreign key constraint)
    console.log('🗑️  Deleting family memberships...');
    await db.delete(familyMemberships);
    console.log('✅ Family memberships deleted');

    // Delete families
    console.log('🗑️  Deleting families...');
    await db.delete(families);
    console.log('✅ Families deleted');

    // Delete all members
    console.log('🗑️  Deleting all members...');
    await db.delete(members);
    console.log('✅ All members deleted');

    // Verify cleanup
    const finalMemberCount = await db.select().from(members);
    const finalFamilyCount = await db.select().from(families);
    const finalFamilyMembershipCount = await db.select().from(familyMemberships);

    console.log('\n📊 Final Database State:');
    console.log(`   Members: ${finalMemberCount.length}`);
    console.log(`   Families: ${finalFamilyCount.length}`);
    console.log(`   Family Memberships: ${finalFamilyMembershipCount.length}`);

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('You can now reimport your member data properly.');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

// Run the cleanup
cleanupMembers()
  .then(() => {
    console.log('\n✅ Cleanup script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Cleanup script failed:', error);
    process.exit(1);
  });
