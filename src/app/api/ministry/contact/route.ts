import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { ministryTeams, ministryLeaders, members } from '@/lib/schema';
import { eq } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, ministryId, ministryName, contactPerson, leaders } = body;

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

    // Fetch ministry leaders and their emails
    const leaderEmails: string[] = [];
    
    if (leaders && leaders.length > 0) {
      // Leaders is an array of member IDs
      for (const memberId of leaders) {
        const member = await db
          .select({ email: members.email })
          .from(members)
          .where(eq(members.id, memberId))
          .limit(1);
        
        if (member.length > 0 && member[0].email) {
          leaderEmails.push(member[0].email);
        }
      }
    }

    // Prepare email recipients: office@, karlie@, and all leader emails
    const recipients = ['office@fccgranbury.org', 'karlie@fccgranbury.org'];
    
    // Add leader emails
    leaderEmails.forEach(leaderEmail => {
      if (!recipients.includes(leaderEmail)) {
        recipients.push(leaderEmail);
      }
    });

    console.log('📧 Sending ministry contact email to:', recipients);

    // Send email to contact person and office
    const emailData = await resend.emails.send({
      from: 'FCC Website <noreply@communications.fccgranbury.org>',
      to: recipients,
      subject: `Ministry Inquiry: ${ministryName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #fafaf9;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                  <!-- Header with red background -->
                  <tr>
                    <td style="background-color: #dc2626; padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: bold; letter-spacing: -0.5px;">New Ministry Inquiry</h1>
                      <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 14px;">${ministryName}</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="color: #44403c; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                        Someone has reached out through the ministry database and would like to connect with you.
                      </p>
                      
                      <!-- Contact Info -->
                      <table role="presentation" style="width: 100%; margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 15px; background-color: #fafaf9; border-left: 4px solid #dc2626; border-radius: 4px;">
                            <p style="margin: 0 0 8px 0; color: #44403c; font-size: 15px;">
                              <strong style="color: #dc2626;">From:</strong> ${name}
                            </p>
                            <p style="margin: 0 0 8px 0; color: #44403c; font-size: 15px;">
                              <strong style="color: #dc2626;">Email:</strong> <a href="mailto:${email}" style="color: #44403c; text-decoration: underline;">${email}</a>
                            </p>
                            ${phone ? `
                            <p style="margin: 0; color: #44403c; font-size: 15px;">
                              <strong style="color: #dc2626;">Phone:</strong> ${phone}
                            </p>
                            ` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Message -->
                      <div style="margin-bottom: 25px;">
                        <h3 style="color: #dc2626; font-size: 16px; margin: 0 0 12px 0; font-weight: bold;">Their Message:</h3>
                        <div style="padding: 20px; background-color: #fafaf9; border-radius: 8px; border: 1px solid #e7e5e4;">
                          <p style="margin: 0; color: #44403c; white-space: pre-wrap; line-height: 1.6; font-size: 15px;">
                            ${message}
                          </p>
                        </div>
                      </div>
                      
                      <!-- Action Box -->
                      <table role="presentation" style="width: 100%; background-color: #fee2e2; border-radius: 8px; overflow: hidden;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0 0 12px 0; color: #991b1b; font-size: 15px; font-weight: bold;">
                              Reply to Respond
                            </p>
                            <p style="margin: 0; color: #7f1d1d; font-size: 14px;">
                              Hit reply to send ${name} a direct response
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #44403c; padding: 30px; text-align: center;">
                      <p style="color: #fafaf9; margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
                        First Christian Church Granbury
                      </p>
                      <p style="color: #d6d3d1; margin: 0; font-size: 13px; line-height: 1.6;">
                        2109 W. US Highway 377 | Granbury, TX 76049<br>
                        (817) 573-5431 | office@fccgranbury.org
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #fafaf9;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                  <!-- Header with red background -->
                  <tr>
                    <td style="background-color: #dc2626; padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">Thank You!</h1>
                      <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 15px;">We received your message</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="color: #44403c; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                        Dear ${name},
                      </p>
                      <p style="color: #44403c; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                        Thank you for your interest in <strong style="color: #dc2626;">${ministryName}</strong> at First Christian Church Granbury!
                      </p>
                      
                      <!-- Confirmation Box -->
                      <table role="presentation" style="width: 100%; background-color: #fee2e2; border-radius: 8px; overflow: hidden; margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #991b1b; font-size: 18px; font-weight: bold;">
                              ✓ Message Received
                            </p>
                            <p style="margin: 0; color: #7f1d1d; font-size: 15px; line-height: 1.5;">
                              ${contactPerson && contactPerson !== 'FCC' ? `${contactPerson} will` : 'Someone from our team will'} be in touch with you soon!
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Message Summary -->
                      <div style="padding: 20px; background-color: #fafaf9; border-radius: 8px; border: 1px solid #e7e5e4; margin-bottom: 25px;">
                        <p style="margin: 0 0 10px 0; color: #dc2626; font-size: 14px; font-weight: bold;">YOUR MESSAGE:</p>
                        <p style="margin: 0; color: #44403c; white-space: pre-wrap; line-height: 1.6; font-size: 14px;">
                          ${message.substring(0, 300)}${message.length > 300 ? '...' : ''}
                        </p>
                      </div>
                      
                      <!-- Contact Info -->
                      <div style="padding: 20px; background-color: #fafaf9; border-left: 4px solid #44403c; border-radius: 4px; margin-bottom: 25px;">
                        <p style="margin: 0 0 8px 0; color: #44403c; font-size: 14px;">
                          <strong style="color: #dc2626;">Have urgent questions?</strong>
                        </p>
                        <p style="margin: 0; color: #44403c; font-size: 14px;">
                          Call us at <strong>(817) 573-5431</strong>
                        </p>
                      </div>
                      
                      <p style="color: #44403c; font-size: 16px; margin: 20px 0 5px 0;">
                        Blessings,
                      </p>
                      <p style="color: #dc2626; font-size: 17px; font-weight: bold; margin: 0;">
                        First Christian Church Granbury
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #44403c; padding: 30px; text-align: center;">
                      <p style="color: #fafaf9; margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
                        First Christian Church Granbury
                      </p>
                      <p style="color: #d6d3d1; margin: 0 0 12px 0; font-size: 13px; line-height: 1.6;">
                        2109 W. US Highway 377 | Granbury, TX 76049<br>
                        (817) 573-5431 | office@fccgranbury.org
                      </p>
                      <p style="color: #a8a29e; margin: 0; font-size: 12px; font-style: italic;">
                        This is an automated confirmation. Please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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
      sentTo: recipients,
      leaderEmailsFound: leaderEmails.length,
    });
  } catch (error) {
    console.error('Error sending ministry contact email:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

