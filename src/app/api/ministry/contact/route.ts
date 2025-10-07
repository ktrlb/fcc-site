import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { ministryTeams, members } from '@/lib/schema';
import { eq, or, ilike } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, ministryId, ministryName, contactPerson } = body;

    // Validate required fields
    if (!name || !email || !message || !ministryId) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Get ministry details from database
    const ministry = await db
      .select()
      .from(ministryTeams)
      .where(eq(ministryTeams.id, ministryId))
      .limit(1);

    if (!ministry || ministry.length === 0) {
      return NextResponse.json(
        { error: 'Ministry not found' },
        { status: 404 }
      );
    }

    const ministryData = ministry[0];

    // Try to find the contact person's email in the members database
    // Search by full name match or email
    let contactEmail = ministryData.contactEmail || null;
    
    if (!contactEmail && contactPerson) {
      // Try to find member by name
      const nameParts = contactPerson.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      
      const matchingMembers = await db
        .select({
          email: members.email,
          firstName: members.firstName,
          lastName: members.lastName,
        })
        .from(members)
        .where(
          or(
            ilike(members.firstName, firstName),
            ilike(members.lastName, lastName)
          )
        )
        .limit(5);
      
      // Find best match (exact first and last name)
      const exactMatch = matchingMembers.find(
        m => m.firstName?.toLowerCase() === firstName.toLowerCase() && 
             m.lastName?.toLowerCase() === lastName.toLowerCase()
      );
      
      if (exactMatch && exactMatch.email) {
        contactEmail = exactMatch.email;
      }
    }

    // Prepare email recipients
    const recipients = ['office@fccgranbury.org'];
    if (contactEmail) {
      recipients.push(contactEmail);
    }

    // Send email to contact person and office
    const emailData = await resend.emails.send({
      from: 'FCC Website <noreply@communications.fccgranbury.org>',
      to: recipients,
      subject: `Ministry Inquiry: ${ministryName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #312e81;">New Ministry Inquiry</h2>
          <p>Someone has reached out about <strong>${ministryName}</strong> through the ministry database.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #312e81; margin-top: 0;">Inquiry Details</h3>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Ministry:</strong> ${ministryName}</p>
            ${contactPerson ? `<p><strong>Ministry Contact:</strong> ${contactPerson}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
      text: `
New Ministry Inquiry: ${ministryName}

From: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Ministry: ${ministryName}
${contactPerson ? `Ministry Contact: ${contactPerson}` : ''}

Message:
${message}

---
Reply directly to this email to respond to ${name}.
      `,
      replyTo: email,
    });

    if (emailData.error) {
      console.error('Resend error:', emailData.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Send confirmation email to the person who submitted
    await resend.emails.send({
      from: 'FCC Granbury <noreply@communications.fccgranbury.org>',
      to: [email],
      subject: `Thank you for your interest in ${ministryName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #312e81;">Thank You for Reaching Out!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your interest in <strong>${ministryName}</strong> at First Christian Church Granbury.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #312e81; margin-top: 0;">Your Message Summary</h3>
            <p><strong>Ministry:</strong> ${ministryName}</p>
            ${contactPerson ? `<p><strong>Contact Person:</strong> ${contactPerson}</p>` : ''}
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap;">${message.substring(0, 300)}${message.length > 300 ? '...' : ''}</p>
          </div>
          
          <p>${contactPerson ? `${contactPerson} will` : 'Someone from our team will'} be in touch with you soon!</p>
          
          <p>If you have any urgent questions, please call us at (817) 573-5431.</p>
          
          <p>Blessings,<br>
          First Christian Church Granbury</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This is an automated confirmation. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      text: `
Thank You for Reaching Out!

Dear ${name},

Thank you for your interest in ${ministryName} at First Christian Church Granbury.

Your Message Summary:
Ministry: ${ministryName}
${contactPerson ? `Contact Person: ${contactPerson}` : ''}

Your Message:
${message.substring(0, 300)}${message.length > 300 ? '...' : ''}

${contactPerson ? `${contactPerson} will` : 'Someone from our team will'} be in touch with you soon!

If you have any urgent questions, please call us at (817) 573-5431.

Blessings,
First Christian Church Granbury

---
This is an automated confirmation. Please do not reply to this email.
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      contactEmailFound: !!contactEmail,
    });
  } catch (error) {
    console.error('Error sending ministry contact email:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

