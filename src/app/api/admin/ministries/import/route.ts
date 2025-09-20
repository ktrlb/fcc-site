import { NextRequest, NextResponse } from 'next/server';
import { getMinistryTeams, createMinistryTeam, updateMinistryTeam } from '@/lib/ministry-queries';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import type { NewMinistryTeam } from '@/lib/schema';

interface ImportResult {
  success: boolean;
  created: number;
  updated: number;
  errors: string[];
  details: {
    row: number;
    action: 'created' | 'updated' | 'error';
    message: string;
    ministryName?: string;
  }[];
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

    const csvText = await file.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file must have at least a header row and one data row' }, { status: 400 });
    }

    // Parse header row
    const headers = parseCSVLine(lines[0]);
    const requiredHeaders = ['id', 'name', 'contactPerson', 'description'];
    
    // Validate required headers
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      return NextResponse.json({ 
        error: `Missing required headers: ${missingHeaders.join(', ')}` 
      }, { status: 400 });
    }

    // Get existing ministries for updates
    const existingMinistries = await getMinistryTeams();
    const existingMinistryMap = new Map(existingMinistries.map(m => [m.id, m]));

    const result: ImportResult = {
      success: true,
      created: 0,
      updated: 0,
      errors: [],
      details: []
    };

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const values = parseCSVLine(line);
        const ministryData: Record<string, string | string[] | boolean | Date | null> = {};
        
        // Map CSV values to ministry data
        headers.forEach((header, index) => {
          let value: string | string[] | boolean | Date | null = values[index] || '';
          
          // Handle array fields (pipe-separated)
          if (['type', 'categories', 'skillsNeeded'].includes(header)) {
            value = value ? value.split('|').filter((v: string) => v.trim()) : [];
          }
          
          // Handle boolean fields
          else if (['isActive'].includes(header)) {
            value = value.toLowerCase() === 'true';
          }
          
          // Handle date fields
          else if (['createdAt', 'updatedAt'].includes(header)) {
            value = value ? new Date(value) : new Date();
          }
          
          ministryData[header] = value;
        });

        // Validate required fields
        if (!ministryData.name || !ministryData.contactPerson || !ministryData.description) {
          throw new Error('Missing required fields: name, contactPerson, or description');
        }

        const ministryId = ministryData.id as string;
        const existingMinistry = ministryId ? existingMinistryMap.get(ministryId) : null;

        if (existingMinistry) {
          // Update existing ministry
          await updateMinistryTeam(ministryId, ministryData);
          result.updated++;
          result.details.push({
            row: i + 1,
            action: 'updated',
            message: 'Ministry updated successfully',
            ministryName: ministryData.name as string
          });
        } else {
          // Create new ministry (remove id if it's empty or invalid)
          if (!ministryId || ministryId.trim() === '') {
            delete ministryData.id;
          }
          await createMinistryTeam(ministryData as NewMinistryTeam);
          result.created++;
          result.details.push({
            row: i + 1,
            action: 'created',
            message: 'Ministry created successfully',
            ministryName: ministryData.name as string
          });
        }

      } catch (error) {
        result.success = false;
        result.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        result.details.push({
          row: i + 1,
          action: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error importing ministries:', error);
    return NextResponse.json({ 
      error: 'Failed to import ministries',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}
