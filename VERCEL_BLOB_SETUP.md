# Vercel Blob Setup Guide for FCC Site

This guide will help you set up Vercel Blob for object storage of your church website assets.

## 🚀 Why Vercel Blob?

- **Native Integration**: Works seamlessly with Vercel deployments
- **Simple Setup**: No complex AWS configuration needed
- **Great Pricing**: Generous free tier, pay-as-you-scale
- **Fast CDN**: Global edge network for fast file delivery
- **Developer Friendly**: Simple API, great documentation

## 1. Enable Vercel Blob

### Step 1: Go to Vercel Dashboard
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your FCC site project

### Step 2: Enable Blob Storage
1. Go to the **Storage** tab in your project dashboard
2. Click **"Create Database"** or **"Add Integration"**
3. Select **"Blob"** from the available options
4. Click **"Continue"** and follow the setup wizard

### Step 3: Get Your Environment Variables
After enabling Blob, Vercel will automatically add these environment variables to your project:
- `BLOB_READ_WRITE_TOKEN` - Your API token for blob operations

## 2. Configure Environment Variables

### For Local Development
Add this to your `.env.local` file:

```env
# Vercel Blob (automatically set in production)
BLOB_READ_WRITE_TOKEN="your-blob-token-here"
```

### For Production
Vercel automatically sets the `BLOB_READ_WRITE_TOKEN` in your production environment, so no additional configuration is needed!

## 3. Test the Setup

### Option 1: Test via Admin Panel
1. Start your development server: `npm run dev`
2. Go to `/admin` and log in
3. Try uploading an asset through the admin interface

### Option 2: Test via API
```bash
curl -X POST http://localhost:3000/api/admin/assets/upload \
  -F "file=@/path/to/test-image.jpg" \
  -F "name=Test Image" \
  -F "type=image" \
  -F "isFeatured=false"
```

## 4. File Organization

Your Vercel Blob storage will be organized as follows:
```
blob-storage/
├── images/
│   ├── seasonal_guide/
│   ├── sermon_series_image/
│   └── general/
├── videos/
│   └── general/
├── documents/
│   ├── seasonal_guide/
│   └── general/
└── general/
    └── general/
```

## 5. Pricing

### Free Tier
- **1GB storage**
- **1GB bandwidth per month**
- Perfect for getting started!

### Paid Plans
- **$0.15 per GB storage per month**
- **$0.40 per GB bandwidth**
- Scales automatically with your usage

## 6. Features You Get

✅ **Automatic CDN**: Files are served from edge locations worldwide  
✅ **Public URLs**: Direct access to uploaded files  
✅ **File Metadata**: Automatic file size, type, and upload date tracking  
✅ **Secure**: Files are only accessible via your application  
✅ **Scalable**: Handles everything from small images to large videos  

## 7. Production Deployment

### Automatic Setup
When you deploy to Vercel:
1. Vercel automatically detects the `@vercel/blob` package
2. Environment variables are automatically configured
3. Your blob storage is ready to use immediately!

### No Additional Configuration Needed
Unlike AWS S3, there's no need to:
- Create buckets
- Set up IAM users
- Configure permissions
- Set up CORS policies

## 8. Monitoring Usage

### View Storage Usage
1. Go to your Vercel project dashboard
2. Click on the **Storage** tab
3. View your current usage and costs

### View Files
1. In the Storage tab, click on your Blob database
2. Browse uploaded files
3. View file details and metadata

## 9. Troubleshooting

### Common Issues:

1. **"BLOB_READ_WRITE_TOKEN is not defined"**
   - Make sure you've enabled Blob storage in your Vercel project
   - Check that the environment variable is set in your `.env.local`

2. **Upload fails in development**
   - Ensure you have the `BLOB_READ_WRITE_TOKEN` in your local environment
   - Check that your file size is under 10MB

3. **Files not accessible**
   - Vercel Blob URLs are public by default
   - Check that the URL is correctly stored in your database

### Debug Mode
Add this to see detailed logs:
```javascript
// In your upload route
console.log('Upload result:', uploadResult);
```

## 10. Migration from Local Storage

If you have existing files in your `public/uploads` folder:
1. Upload them through the admin interface
2. Update any hardcoded URLs in your database
3. Remove the old files from `public/uploads`

## 11. Best Practices

1. **Organize by Type**: Use the automatic folder organization
2. **Validate Files**: The system validates file types and sizes
3. **Monitor Usage**: Keep an eye on your storage and bandwidth usage
4. **Clean Up**: Delete unused assets to save storage costs
5. **Optimize Images**: Consider compressing images before upload

## 12. Advanced Features

### Custom File Names
The system automatically generates unique filenames with timestamps to prevent conflicts.

### File Validation
- Maximum file size: 10MB
- Allowed types: PDF, JPG, PNG, GIF, WebP, MP4, MOV, DOC, DOCX, TXT, MD

### Metadata Storage
Each file stores:
- Original filename
- Upload timestamp
- File type and size
- Upload folder path

## Support

If you encounter issues:
1. Check the [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
2. Verify your environment variables are set correctly
3. Test with a simple file upload first
4. Check the Vercel dashboard for usage and errors

## Next Steps

1. **Enable Blob Storage** in your Vercel project
2. **Add the environment variable** to your local `.env.local`
3. **Test file uploads** through your admin panel
4. **Deploy to production** and enjoy seamless file storage!

Your church website now has enterprise-grade file storage with zero configuration complexity! 🎉
