import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, staffName, staffEmail } = body;

    // Validate required fields
    if (!name || !email || !message || !staffEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to staff member
    const { data, error } = await resend.emails.send({
      from: 'First Christian Church <noreply@fccgranbury.org>',
      to: [staffEmail],
      replyTo: email,
      subject: `Message from ${name} via FCC Website`,
      html: `
        <h2>New Message from FCC Website</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This message was sent through the FCC website contact form for ${staffName}.
        </p>
      `,
      text: `
New Message from FCC Website

From: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}

---
This message was sent through the FCC website contact form for ${staffName}.
      `,
    });

    if (error) {
      console.error('Error sending email to staff:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Send confirmation email to sender
    await resend.emails.send({
      from: 'First Christian Church <noreply@fccgranbury.org>',
      to: [email],
      subject: `Message Sent to ${staffName}`,
      html: `
        <h2>Thank you for contacting ${staffName}</h2>
        <p>Dear ${name},</p>
        <p>Your message has been sent to ${staffName} at First Christian Church of Granbury. They will respond to you directly at ${email}.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Blessings,<br>First Christian Church of Granbury</p>
      `,
      text: `
Thank you for contacting ${staffName}

Dear ${name},

Your message has been sent to ${staffName} at First Christian Church of Granbury. They will respond to you directly at ${email}.

Your message:
${message}

---
Blessings,
First Christian Church of Granbury
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in staff contact API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

