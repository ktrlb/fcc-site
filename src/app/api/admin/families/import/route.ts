import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { families, members, familyMemberships } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';

interface ImportFamily {
  familyName: string;
  memberNames: string[];
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const csvString = buffer.toString('utf-8');

    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const results = {
      totalRows: records.length,
      familiesCreated: 0,
      membersLinked: 0,
      errors: [] as string[],
      successfulFamilies: [] as string[],
      failedFamilies: [] as string[],
    };

    for (const record of records) {
      const familyName = (record as any)['Last Name'];
      const memberNamesString = (record as any)['First Name'];
      
      if (!familyName || !memberNamesString) {
        results.errors.push(`Skipping row: Missing family name or member names`);
        results.failedFamilies.push(`Row ${records.indexOf(record) + 2}: Missing data`);
        continue;
      }

      // Parse member names (handle both single names and comma-separated lists)
      const memberNames = memberNamesString
        .split(',')
        .map((name: string) => name.trim())
        .filter((name: string) => name.length > 0);

      if (memberNames.length === 0) {
        results.errors.push(`Skipping row: No valid member names found`);
        results.failedFamilies.push(`${familyName}: No valid member names`);
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

        // Try to link existing members to this family
        for (const memberName of memberNames) {
          try {
            // Search for existing members by first name and last name
            const existingMembers = await db
              .select()
              .from(members)
              .where(eq(members.lastName, familyName));

            // Find the best match by first name
            const matchedMember = existingMembers.find(member => 
              member.firstName.toLowerCase() === memberName.toLowerCase() ||
              member.preferredName?.toLowerCase() === memberName.toLowerCase()
            );

            if (matchedMember) {
              // Link the member to the family
              await db.insert(familyMemberships).values({
                id: uuidv4(),
                memberId: matchedMember.id,
                familyId: newFamily.id,
                relationship: 'member',
                isPrimary: memberNames.indexOf(memberName) === 0, // First member is primary
              });
              results.membersLinked++;
            } else {
              // Create a new member if not found
              const [newMember] = await db
                .insert(members)
                .values({
                  id: uuidv4(),
                  firstName: memberName,
                  lastName: familyName,
                  membershipStatus: 'Visitor',
                  isActive: true,
                  allowDirectoryListing: true,
                  allowLayLeadership: false,
                })
                .returning();

              // Link the new member to the family
              await db.insert(familyMemberships).values({
                id: uuidv4(),
                memberId: newMember.id,
                familyId: newFamily.id,
                relationship: 'member',
                isPrimary: memberNames.indexOf(memberName) === 0,
              });
              results.membersLinked++;
            }
          } catch (memberError) {
            results.errors.push(`Error processing member ${memberName} in family ${familyName}: ${memberError}`);
          }
        }
      } catch (familyError) {
        results.errors.push(`Error creating family ${familyName}: ${familyError}`);
        results.failedFamilies.push(`${familyName}: ${familyError}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error importing families:', error);
    return NextResponse.json(
      { error: 'Failed to import families', details: (error as Error).message },
      { status: 500 }
    );
  }
}
