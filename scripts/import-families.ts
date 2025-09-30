import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from '../src/lib/db';
import { families, members, familyMemberships } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

interface ImportFamily {
  familyName: string;
  memberNames: string[];
}

async function importFamilies() {
  console.log('🚀 Starting Family Import Process...\n');

  // Read the CSV file
  const csvContent = readFileSync('./public/families.csv', 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`📊 Found ${records.length} family records to process\n`);
  console.log('Sample record:', records[0]);
  console.log('Column names:', Object.keys(records[0] || {}));

  const results = {
    totalRows: records.length,
    familiesCreated: 0,
    membersLinked: 0,
    membersNotFound: 0,
    errors: [] as string[],
    successfulFamilies: [] as string[],
    failedFamilies: [] as string[],
  };

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const familyName = (record as any)['Last Name'];
      const memberNamesString = (record as any)['﻿First Name']; // Note: BOM character in column name
      
      console.log(`Processing row ${i + 1}: ${familyName} family...`);
      
      if (!familyName || !memberNamesString) {
        const error = `Row ${i + 2}: Missing family name or member names`;
        results.errors.push(error);
        results.failedFamilies.push(error);
        console.log(`❌ ${error}`);
        continue;
      }

      // Parse member names (handle both single names and comma-separated lists)
      // The CSV parser already handles quotes, so we just need to split by comma
      let memberNames: string[] = [];
      memberNames = memberNamesString.split(',').map((name: string) => name.trim()).filter((name: string) => name.length > 0);

    if (memberNames.length === 0) {
      const error = `${familyName}: No valid member names found`;
      results.errors.push(error);
      results.failedFamilies.push(error);
      console.log(`❌ ${error}`);
      continue;
    }

    try {
      // Create the family
      const [newFamily] = await db
        .insert(families)
        .values({
          id: uuidv4(),
          familyName: familyName,
          isActive: true,
        })
        .returning();

      results.familiesCreated++;
      results.successfulFamilies.push(`${familyName} (${memberNames.length} members)`);
      console.log(`✅ Created family: ${familyName}`);

      // Try to link existing members to this family
      for (const memberName of memberNames) {
        try {
          // Search for existing members by first name and last name
          const existingMembers = await db
            .select()
            .from(members)
            .where(eq(members.lastName, familyName));

          // Find the best match by first name (exact match)
          const matchedMember = existingMembers.find(member => 
            member.firstName.toLowerCase() === memberName.toLowerCase() ||
            member.preferredName?.toLowerCase() === memberName.toLowerCase()
          );

          if (matchedMember) {
            // Check if this member is already linked to this family
            const existingLink = await db
              .select()
              .from(familyMemberships)
              .where(and(
                eq(familyMemberships.memberId, matchedMember.id),
                eq(familyMemberships.familyId, newFamily.id)
              ));

            if (existingLink.length === 0) {
              // Link the member to the family
              await db.insert(familyMemberships).values({
                id: uuidv4(),
                memberId: matchedMember.id,
                familyId: newFamily.id,
                relationship: 'member',
                isPrimary: memberNames.indexOf(memberName) === 0, // First member is primary
              });
              results.membersLinked++;
              console.log(`  🔗 Linked existing member: ${memberName} ${familyName}`);
            } else {
              console.log(`  ⚠️  Member already linked: ${memberName} ${familyName}`);
            }
          } else {
            // Don't create new members - just log that we couldn't find them
            console.log(`  ❌ No existing member found: ${memberName} ${familyName}`);
            results.membersNotFound++;
            results.errors.push(`No existing member found: ${memberName} ${familyName}`);
          }
        } catch (memberError) {
          const error = `Error processing member ${memberName} in family ${familyName}: ${memberError}`;
          results.errors.push(error);
          console.log(`  ❌ ${error}`);
        }
      }
    } catch (familyError) {
      const error = `Error creating family ${familyName}: ${familyError}`;
      results.errors.push(error);
      results.failedFamilies.push(error);
      console.log(`❌ ${error}`);
    }
    
    console.log(''); // Empty line for readability
  }

  // Generate final report
  console.log('\n' + '='.repeat(60));
  console.log('📋 FAMILY IMPORT REPORT');
  console.log('='.repeat(60));
  console.log(`📊 Total Rows Processed: ${results.totalRows}`);
  console.log(`✅ Families Created: ${results.familiesCreated}`);
  console.log(`🔗 Members Linked: ${results.membersLinked}`);
  console.log(`❌ Members Not Found: ${results.membersNotFound}`);
  console.log(`❌ Errors: ${results.errors.length}`);
  console.log(`✅ Success Rate: ${Math.round((results.familiesCreated / results.totalRows) * 100)}%`);

  if (results.successfulFamilies.length > 0) {
    console.log('\n🎉 SUCCESSFULLY CREATED FAMILIES:');
    console.log('-'.repeat(40));
    results.successfulFamilies.forEach((family, index) => {
      console.log(`${index + 1}. ${family}`);
    });
  }

  if (results.failedFamilies.length > 0) {
    console.log('\n❌ FAILED FAMILIES:');
    console.log('-'.repeat(40));
    results.failedFamilies.forEach((family, index) => {
      console.log(`${index + 1}. ${family}`);
    });
  }

  if (results.errors.length > 0) {
    console.log('\n⚠️  ERRORS:');
    console.log('-'.repeat(40));
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('🏁 Import process completed!');
  console.log('='.repeat(60));

  return results;
}

// Run the import
importFamilies()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
