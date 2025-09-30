import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { members, families, familyMemberships } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { isAdminAuthenticated } from '@/lib/admin-auth';

interface ImportMember {
  firstName?: string;
  lastName?: string;
  preferredName?: string;
  pastNames?: string;
  nameSuffix?: string;
  email?: string;
  churchEmail?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  anniversaryDate?: string;
  memberSince?: string;
  membershipStatus?: string;
  baptismDate?: string;
  spouseName?: string;
  childrenNames?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allowDirectoryListing?: boolean;
  allowLayLeadership?: boolean;
  notes?: string;
  // Family info
  familyName?: string;
  familyAddress?: string;
  familyCity?: string;
  familyState?: string;
  familyZipCode?: string;
  familyPhone?: string;
  familyEmail?: string;
  familyNotes?: string;
  // Welcome team info
  firstVisitDate?: string;
  firstVisitService?: string;
  howDidYouHear?: string;
  previousChurch?: string;
  welcomeTeamNotes?: string;
}

function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseCSV(csvContent: string): ImportMember[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = parseCSVRow(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const members: ImportMember[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i]);
    if (values.length !== headers.length) continue;
    
    const member: ImportMember = {};
    
    // Map CSV columns to member fields
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (!value) return;
      
      switch (header) {
        // Basic name fields
        case 'firstname':
        case 'first name':
          member.firstName = value;
          break;
        case 'lastname':
        case 'last name':
          member.lastName = value;
          break;
        case 'middlename':
        case 'middle name':
          member.nameSuffix = value; // Using nameSuffix for middle name
          break;
        case 'nickname':
          member.preferredName = value;
          break;
        case 'maidenname':
        case 'maiden name':
          member.pastNames = value;
          break;
        
        // Contact information
        case 'email':
          member.email = value;
          break;
        case 'mobile':
          member.phone = value;
          break;
        case 'home':
          // If mobile is empty, use home as phone
          if (!member.phone) {
            member.phone = value;
          }
          break;
        
        // Address information
        case 'streetaddress':
        case 'street address':
          member.address = value;
          break;
        case 'city':
          member.city = value;
          break;
        case 'state':
          member.state = value;
          break;
        case 'zip':
          member.zipCode = value;
          break;
        case 'secondaryaddressifapplicableincludedetailswillnotreceivecorrespondencehere':
        case 'secondary address':
          // Store in notes for now
          member.notes = (member.notes || '') + ` Secondary Address: ${value}`;
          break;
        
        // Personal information
        case 'birthdate':
        case 'birth date':
          member.dateOfBirth = value;
          break;
        case 'anniversary':
          member.anniversaryDate = value;
          break;
        case 'joindate':
        case 'join date':
          member.memberSince = value;
          break;
        case 'status':
          member.membershipStatus = value;
          break;
        case 'dateofbaptism':
        case 'date of baptism':
          member.baptismDate = value;
          break;
        case 'baptised':
        case 'baptized':
          // Store baptism status in notes
          member.notes = (member.notes || '') + ` Baptized: ${value}`;
          break;
        
        // Family information
        case 'nonmemberspouse':
        case 'non-member spouse':
          member.spouseName = value;
          break;
        case 'familynotes':
        case 'family notes':
          member.familyNotes = value;
          break;
        
        // Privacy settings
        case 'includeondirectory':
        case 'include on directory':
          member.allowDirectoryListing = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
          break;
        case 'leadershiprole':
        case 'leadership role':
          member.allowLayLeadership = !!(value && value.trim() !== '');
          // Store the actual role in notes
          if (value && value.trim() !== '') {
            member.notes = (member.notes || '') + ` Leadership Role: ${value}`;
          }
          break;
        
        // Welcome team information
        case 'welcometeaminformationforkeepingtrackofvisitorsanddetailsaboutthemandtheirfamily':
        case 'welcome team information':
          member.welcomeTeamNotes = value;
          break;
        case 'dateoffirstvisit':
        case 'date of first visit':
          member.firstVisitDate = value;
          break;
        case 'service':
          member.firstVisitService = value;
          break;
        case 'otherserviceexchristmaseveashwednesday':
        case 'other service':
          // Store in welcome team notes
          member.welcomeTeamNotes = (member.welcomeTeamNotes || '') + ` Other Services: ${value}`;
          break;
        case 'nextsteps':
        case 'next steps':
          member.welcomeTeamNotes = (member.welcomeTeamNotes || '') + ` Next Steps: ${value}`;
          break;
        case 'welcometeamnotes':
        case 'welcome team notes':
          member.welcomeTeamNotes = (member.welcomeTeamNotes || '') + ` ${value}`;
          break;
        
        // Additional fields
        case 'legacydatabasereferenceid':
        case 'legacy database reference id':
          member.notes = (member.notes || '') + ` Legacy ID: ${value}`;
          break;
        case 'maritalstatus':
        case 'marital status':
          member.notes = (member.notes || '') + ` Marital Status: ${value}`;
          break;
        case 'wayfinderassigned':
        case 'wayfinder assigned':
          member.notes = (member.notes || '') + ` Wayfinder: ${value}`;
          break;
        case 'isindividualbackgroundchecked':
        case 'is individual background checked':
          member.notes = (member.notes || '') + ` Background Checked: ${value}`;
          break;
        case 'dateofmostrecentbackgroundcheck':
        case 'date of most recent background check':
          member.notes = (member.notes || '') + ` Background Check Date: ${value}`;
          break;
        case 'haswatchedmostcurrentsafesanctuarychildrensvolunteertrainingvideo':
        case 'safe sanctuary training':
          member.notes = (member.notes || '') + ` Safe Sanctuary Training: ${value}`;
          break;
        case '2025flocknumber':
        case '2025 flock number':
          member.notes = (member.notes || '') + ` 2025 Flock: ${value}`;
          break;
        case 'homebound':
          member.notes = (member.notes || '') + ` Homebound: ${value}`;
          break;
        case 'school':
          member.notes = (member.notes || '') + ` School: ${value}`;
          break;
        case 'graduationyear':
        case 'graduation year':
          member.notes = (member.notes || '') + ` Graduation Year: ${value}`;
          break;
        case 'deceaseddate':
        case 'deceased date':
          member.notes = (member.notes || '') + ` Deceased Date: ${value}`;
          break;
        case 'eldernotes':
        case 'elder notes':
          member.notes = (member.notes || '') + ` Elder Notes: ${value}`;
          break;
        case 'ministerialnotes':
        case 'ministerial notes':
          member.notes = (member.notes || '') + ` Ministerial Notes: ${value}`;
          break;
        case 'ifmilitarywhatisbranchrankifhomeboundwhatislocation':
        case 'military info':
          member.notes = (member.notes || '') + ` Military/Homebound Info: ${value}`;
          break;
      }
    });
    
    if (member.firstName && member.lastName) {
      members.push(member);
    }
  }
  
  return members;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Try different date formats
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{1,2}\/\d{1,2}\/\d{4}$/, // M/D/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
  ];
  
  for (const format of formats) {
    if (format.test(dateStr)) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const csvContent = await file.text();
    const importMembers = parseCSV(csvContent);
    
    if (importMembers.length === 0) {
      return NextResponse.json({ error: 'No valid members found in CSV' }, { status: 400 });
    }

    const results = {
      total: importMembers.length,
      created: 0,
      familiesCreated: 0,
      errors: [] as string[],
    };

    // Process each member
    for (const memberData of importMembers) {
      try {
        let primaryFamilyId = null;

        // Handle family creation/assignment
        if (memberData.familyName) {
          // Check if family already exists
          const existingFamily = await db
            .select()
            .from(families)
            .where(eq(families.familyName, memberData.familyName))
            .limit(1);

          if (existingFamily.length > 0) {
            primaryFamilyId = existingFamily[0].id;
          } else {
            // Create new family
            const [newFamily] = await db
              .insert(families)
              .values({
                familyName: memberData.familyName,
                address: memberData.familyAddress || memberData.address,
                city: memberData.familyCity || memberData.city,
                state: memberData.familyState || memberData.state,
                zipCode: memberData.familyZipCode || memberData.zipCode,
                phone: memberData.familyPhone || memberData.phone,
                email: memberData.familyEmail || memberData.email,
                familyNotes: memberData.familyNotes,
              })
              .returning();
            primaryFamilyId = newFamily.id;
            results.familiesCreated++;
          }
        }

        // Validate required fields
        if (!memberData.firstName || !memberData.lastName) {
          results.errors.push(`Skipping member: Missing required firstName or lastName`);
          continue;
        }

        // Create member
        const [newMember] = await db
          .insert(members)
          .values({
            firstName: memberData.firstName,
            lastName: memberData.lastName,
            preferredName: memberData.preferredName,
            pastNames: memberData.pastNames,
            nameSuffix: memberData.nameSuffix,
            email: memberData.email,
            churchEmail: memberData.churchEmail,
            phone: memberData.phone,
            address: memberData.address,
            city: memberData.city,
            state: memberData.state,
            zipCode: memberData.zipCode,
            dateOfBirth: parseDate(memberData.dateOfBirth || ''),
            anniversaryDate: parseDate(memberData.anniversaryDate || ''),
            memberSince: parseDate(memberData.memberSince || ''),
            membershipStatus: memberData.membershipStatus || 'Visitor',
            baptismDate: parseDate(memberData.baptismDate || ''),
            spouseName: memberData.spouseName,
            childrenNames: memberData.childrenNames ? JSON.stringify(memberData.childrenNames.split(',').map(c => c.trim())) : null,
            emergencyContact: memberData.emergencyContact,
            emergencyPhone: memberData.emergencyPhone,
            allowDirectoryListing: memberData.allowDirectoryListing ?? true,
            allowLayLeadership: memberData.allowLayLeadership ?? false,
            notes: memberData.notes,
            primaryFamilyId,
          })
          .returning();

        // If we created a family, set this member as head of household
        if (primaryFamilyId && !await db.select().from(families).where(eq(families.headOfHousehold1, newMember.id)).limit(1).then(r => r.length > 0)) {
          await db.update(families)
            .set({ headOfHousehold1: newMember.id })
            .where(eq(families.id, primaryFamilyId));
        }

        results.created++;

      } catch (error) {
        console.error(`Error creating member ${memberData.firstName} ${memberData.lastName}:`, error);
        results.errors.push(`${memberData.firstName} ${memberData.lastName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Successfully imported ${results.created} members and created ${results.familiesCreated} families.`,
    });

  } catch (error) {
    console.error('Error importing members:', error);
    return NextResponse.json(
      { error: 'Failed to import members' },
      { status: 500 }
    );
  }
}
