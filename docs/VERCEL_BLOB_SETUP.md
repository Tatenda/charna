# Vercel Blob Storage Setup Guide

This project now uses [Vercel Blob](https://vercel.com/docs/vercel-blob/server-upload) for image storage instead of local files.

## Setup Instructions

### 1. Create a Vercel Blob Store

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the **Storage** tab
4. Click **Connect Database**
5. Under **Create New**, select **Blob**
6. Click **Continue**
7. Name your store (e.g., "charna-images")
8. Select the environments where you want the token available
9. Click **Create a new Blob store**

### 2. Get Your Environment Variable

After creating the blob store, Vercel automatically creates the `BLOB_READ_WRITE_TOKEN` environment variable.

#### For Local Development:
```bash
# Pull environment variables from Vercel
vercel env pull

# Or manually add to your .env file:
BLOB_READ_WRITE_TOKEN="your-token-here"
```

#### For Production:
The environment variable is automatically available in your Vercel deployment.

### 3. Configure Next.js (Already Done)

The `next.config.js` file has been updated to support Vercel Blob images:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.public.blob.vercel-storage.com',
      port: '',
      pathname: '/**',
    },
  ],
}
```

## Benefits of Vercel Blob

✅ **Cloud Storage** - Images stored in Vercel's global CDN  
✅ **Automatic Optimization** - Built-in image optimization  
✅ **Scalable** - No file size limits like local storage  
✅ **Fast Delivery** - Global CDN for faster loading  
✅ **Reliable** - 99.9% uptime guarantee  
✅ **Secure** - Automatic HTTPS and access controls  

## Migration from Local Storage

The system now supports both local and Vercel Blob images:

- **New uploads** → Vercel Blob
- **Existing images** → Still work from local storage
- **Automatic detection** → Handles both URL types seamlessly

## Usage

### Upload Images
- Images are automatically uploaded to Vercel Blob
- URLs are stored in the database
- Images are accessible via CDN

### Display Images
- Next.js Image component handles both local and blob URLs
- Automatic optimization and lazy loading
- Responsive image serving

## Troubleshooting

### Images Not Loading
1. Check if `BLOB_READ_WRITE_TOKEN` is set
2. Verify the blob store is created in Vercel
3. Check browser console for CORS errors
4. Ensure Next.js config includes the remote pattern

### Upload Errors
1. Check file size (10MB limit)
2. Verify file type (images only)
3. Check network connectivity
4. Verify authentication (admin only)

## API Changes

The upload API now returns:
```json
{
  "message": "Files uploaded successfully",
  "files": [
    {
      "filename": "image_1234567890.jpg",
      "url": "https://abc123.public.blob.vercel-storage.com/image_1234567890.jpg",
      "originalName": "photo.jpg",
      "size": 1024000,
      "mimetype": "image/jpeg"
    }
  ]
}
```

## Next Steps

1. Set up your Vercel Blob store
2. Add the environment variable
3. Test image uploads
4. Monitor usage in Vercel Dashboard
