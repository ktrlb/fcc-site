# Email Integration Setup Guide

## Overview
This guide will help you set up email functionality for the FCC church website using Resend.

## Features
- Contact form for website visitors
- Automatic email notifications to church staff
- Confirmation emails to form submitters
- Privacy protection - no public exposure of staff emails
- Categorized inquiries (General, Visit Planning, Ministry Interest, Prayer Requests, etc.)

## Setup Steps

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Key
1. In your Resend dashboard, go to "API Keys"
2. Create a new API key
3. Copy the API key (starts with `re_`)

### 3. Set Up Domain (Optional but Recommended)
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `fccgranbury.org`)
3. Follow DNS setup instructions
4. Wait for verification (can take up to 24 hours)

### 4. Environment Variables
Add these to your `.env.local` file:

```env
# Email Configuration
RESEND_API_KEY=re_your_api_key_here
CHURCH_EMAIL=info@fccgranbury.org
```

### 5. Test the Integration
1. Visit `/contact` on your website
2. Fill out and submit the contact form
3. Check that you receive:
   - Email notification as church staff
   - Confirmation email as the submitter

## Email Templates

### Staff Notification Email
- Professional HTML format
- Includes all form details
- Categorized by inquiry type
- Easy to reply to

### Confirmation Email
- Sent to form submitter
- Confirms receipt of their message
- Provides church contact info for urgent needs
- Professional branding

## Contact Categories
- **General Question**: Basic inquiries
- **Planning to Visit**: First-time visitors
- **Ministry Interest**: Getting involved in ministries
- **Prayer Request**: Prayer needs
- **Pastoral Care**: Spiritual support needs
- **Other**: Miscellaneous inquiries

## Privacy & Security
- Form submissions are sent directly to church email
- No public exposure of staff contact information
- Visitor contact info is only used to respond to their inquiry
- No marketing or third-party sharing

## Troubleshooting

### Common Issues
1. **Emails not sending**: Check API key and domain verification
2. **Spam folder**: Check spam/junk folders for test emails
3. **Domain not verified**: Use default Resend domain for testing

### Testing Without Domain Setup
If you haven't set up a custom domain, Resend will use their default domain for testing:
- Change `from: 'FCC Website <noreply@fccgranbury.org>'` to `from: 'FCC Website <noreply@resend.dev>'`
- This works for testing but emails may go to spam

## Cost
- **Free tier**: 3,000 emails/month, 100 emails/day
- **Paid plans**: Start at $20/month for higher limits
- Perfect for church website contact forms

## Next Steps
1. Set up your Resend account
2. Add environment variables
3. Test the contact form
4. Set up custom domain for better deliverability
5. Train staff on responding to inquiries

## Support
- Resend documentation: [resend.com/docs](https://resend.com/docs)
- Contact form component: `src/components/contact/contact-form.tsx`
- API route: `src/app/api/contact/route.ts`
- Contact page: `src/app/contact/page.tsx`
