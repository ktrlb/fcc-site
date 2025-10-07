import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, category } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get the category label for display
    const categoryLabels: Record<string, string> = {
      general: 'General Question',
      visit: 'Planning to Visit',
      ministry: 'Ministry Interest',
      prayer: 'Prayer Request',
      support: 'Pastoral Care',
      solicitation: 'Business/Service Inquiry',
      other: 'Other',
    };

    const categoryLabel = categoryLabels[category] || category;

    // Send email to church staff (Karlie and office)
    const emailData = await resend.emails.send({
      from: 'FCC Website <noreply@fccgranbury.org>',
      to: ['karlie@fccgranbury.org', 'office@fccgranbury.org'],
      subject: `[FCC Website] ${categoryLabel}: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #312e81; border-bottom: 2px solid #312e81; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #312e81; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Category:</strong> ${categoryLabel}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-left: 4px solid #312e81;">
            <h3 style="color: #312e81; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>This message was sent from the First Christian Church website contact form.</p>
            <p>To respond, simply reply to this email.</p>
          </div>
        </div>
      `,
      // Also send a text version
      text: `
New Contact Form Submission

Contact Details:
Name: ${name}
Email: ${email}
Category: ${categoryLabel}
Subject: ${subject}

Message:
${message}

---
This message was sent from the First Christian Church website contact form.
To respond, simply reply to this email.
      `,
    });

    // Send confirmation email to the person who submitted the form
    // Different message for solicitations
    const isSolicitation = category === 'solicitation';
    
    await resend.emails.send({
      from: 'FCC Granbury <noreply@fccgranbury.org>',
      to: [email],
      subject: isSolicitation 
        ? 'Thank you for your inquiry - First Christian Church' 
        : 'Thank you for contacting First Christian Church',
      html: isSolicitation ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #312e81;">Thank You for Your Inquiry</h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for reaching out to First Christian Church regarding your services. We appreciate you thinking of us.</p>
          
          <p>Please know that we have received your information and will review it carefully. Our church currently works with established vendors and contractors who meet our ongoing needs. However, we will keep your information on file.</p>
          
          <p>If we determine that your services align with our ministry needs and budget, we will include you in our bidding and contract review process. Due to the volume of inquiries we receive, we are unable to respond individually to each submission.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #312e81; margin-top: 0;">Your Submission Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
          </div>
          
          <p>We wish you well in your business endeavors.</p>
          
          <p>Blessings,<br>
          First Christian Church Granbury</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #312e81;">Thank You for Contacting Us!</h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for reaching out to First Christian Church. We have received your message and will respond as soon as possible.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #312e81; margin-top: 0;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Category:</strong> ${categoryLabel}</p>
            <p><strong>Message:</strong> ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
          </div>
          
          <p>If you have any urgent needs, please call us at (817) 573-5431.</p>
          
          <p>Blessings,<br>
          First Christian Church Granbury</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This is an automated confirmation. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      emailId: emailData.data?.id 
    });

  } catch (error) {
    console.error('Error sending contact form email:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
