import { NextRequest, NextResponse } from 'next/server';
import { getMinistryTeamsWithLeaders } from '@/lib/ministry-queries';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ministries = await getMinistryTeamsWithLeaders(true); // Include inactive for admin export
    
    // Convert ministries to CSV format
    const csvHeaders = [
      'id',
      'name',
      'type',
      'regularMeetingType',
      'regularMeetingTime',
      'description',
      'graphicImage',
      'recurringType',
      'category',
      'categories',
      'leaders',
      'meetingSchedule',
      'location',
      'skillsNeeded',
      'timeCommitment',
      'isActive',
      'imageUrl',
      'createdAt',
      'updatedAt'
    ];

    // Create CSV content
    const csvRows = [csvHeaders.join(',')];
    
    ministries.forEach(ministry => {
      const row = csvHeaders.map(header => {
        let value: any;
        
        // Special handling for leaders field
        if (header === 'leaders') {
          // Format leaders as "FirstName LastName (Role)|FirstName LastName (Role)"
          if (ministry.leaders && ministry.leaders.length > 0) {
            value = ministry.leaders
              .filter(l => l.member)
              .map(l => {
                const firstName = l.member!.preferredName || l.member!.firstName;
                const lastName = l.member!.lastName;
                const role = l.role ? ` (${l.role})` : '';
                return `${firstName} ${lastName}${role}`;
              })
              .join('|');
          } else {
            value = '';
          }
        } else {
          value = ministry[header as keyof typeof ministry];
          
          // Handle array fields (convert to pipe-separated string)
          if (Array.isArray(value)) {
            value = value.join('|');
          }
          
          // Handle boolean values
          if (typeof value === 'boolean') {
            value = value ? 'true' : 'false';
          }
          
          // Handle dates
          if (value instanceof Date) {
            value = value.toISOString();
          }
          
          // Handle null/undefined
          if (value === null || value === undefined) {
            value = '';
          }
        }
        
        // Escape commas and quotes in CSV
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        
        return stringValue;
      });
      
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    
    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="ministries-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
    
  } catch (error) {
    console.error('Error exporting ministries:', error);
    return NextResponse.json({ error: 'Failed to export ministries' }, { status: 500 });
  }
}
