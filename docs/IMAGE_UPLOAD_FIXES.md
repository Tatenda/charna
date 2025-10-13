# Image Upload Fixes & Troubleshooting Guide

## Summary of Fixes

This document outlines the fixes applied to resolve NaN validation bugs and improve image upload error handling.

## 1. NaN Validation Bug Fixes

### Problem
Number input fields (like 'Price' in the Range Upload Modal and metadata fields in Image Metadata Editor) didn't validate input before parsing. This allowed `NaN` values to be stored in the database when users entered non-numeric text or empty strings.

### Files Fixed

#### `/components/admin/landing-page/RangeUploadModal.tsx`
- **Added validation** before saving: Validates that price is a valid number greater than 0
- **Fixed parsing**: Uses the validated `priceNum` variable instead of parsing again
- **Location**: Lines 124-133, Line 160

```typescript
// Validate price is a valid number
const priceNum = parseInt(price, 10);
if (isNaN(priceNum) || priceNum <= 0) {
  toast({
    title: 'Invalid price',
    description: 'Please enter a valid price greater than 0',
    variant: 'destructive',
  });
  return;
}
```

#### `/components/admin/landing-page/ImageMetadataEditor.tsx`
- **Fixed onChange handler** for number inputs: Now validates input before setting state
- **Added validation** in handleSave: Validates all required metadata fields and checks for NaN
- **Locations**: 
  - Lines 274-284: Input validation on change
  - Lines 91-113: Save-time validation

```typescript
// On change - only update if valid
onChange={(e) => {
  const val = e.target.value;
  if (val === '') {
    handleMetadataChange(field.key, '');
  } else {
    const numVal = parseInt(val, 10);
    if (!isNaN(numVal)) {
      handleMetadataChange(field.key, numVal);
    }
  }
}}

// On save - validate all required fields
for (const field of sectionConfig.metadataFields) {
  if (field.required) {
    const value = metadata[field.key];
    // Check for missing values
    if (value === undefined || value === null || value === '') {
      // Show error toast
      return;
    }
    // Check for NaN in number fields
    if (field.type === 'number' && (typeof value === 'number' && isNaN(value))) {
      // Show error toast
      return;
    }
  }
}
```

## 2. Image Upload Error Handling Improvements

### Problem
Image uploads could fail silently or with unclear error messages, making it difficult to diagnose issues like the 404 error for uploaded images.

### Files Fixed

#### `/pages/api/admin/upload.ts`
- **Enhanced logging**: Added detailed console logs for each step of the upload process
- **Better error handling**: Improved error messages and stack traces
- **Upload validation**: Returns error if no files were successfully uploaded
- **Locations**: Throughout the file (lines 61-140)

**Key improvements:**
```typescript
console.log(`[Upload] Processing file:`, {
  originalFilename: file.originalFilename,
  generatedFilename: filename,
  size: file.size,
  mimetype: file.mimetype,
})

console.log(`[Upload] Successfully uploaded to Vercel Blob:`, {
  url: blob.url,
  pathname: blob.pathname,
})
```

#### Upload Modal Components
Updated all upload modal components with better error handling:

1. **`/components/admin/landing-page/RangeUploadModal.tsx`**
2. **`/components/admin/landing-page/ImageUploadModal.tsx`**
3. **`/components/admin/landing-page/CategoryUploadModal.tsx`**
4. **`/components/admin/landing-page/ImageMetadataEditor.tsx`**

**Key improvements in all modals:**
- Detailed error logging with file names and response status
- Better error message extraction from API responses
- Validation that upload response contains a URL
- Added console logging for successful uploads

```typescript
if (!uploadRes.ok) {
  const errorData = await uploadRes.json().catch(() => ({ message: 'Unknown error' }));
  const errorMessage = errorData.error || errorData.message || 'Failed to upload image';
  console.error('Upload failed:', {
    status: uploadRes.status,
    statusText: uploadRes.statusText,
    error: errorData,
    fileName: file.name,
  });
  throw new Error(errorMessage);
}

const url = data.files?.[0]?.url || data.url;

if (!url) {
  console.error('No URL in upload response:', data);
  throw new Error('Upload succeeded but no URL was returned');
}
```

## 3. Troubleshooting Image 404 Errors

### Understanding the Issue

The 404 error for the URL:
```
https://allh29lyumanfwa1.public.blob.vercel-storage.com/1FCA156B-07B9-4EB4-B6CB-90243D3F1240_1758358612678.png
```

This filename pattern (`1FCA156B-07B9-4EB4-B6CB-90243D3F1240_1758358612678.png`) doesn't match the expected pattern from our upload API (`upload_${timestamp}_${randomString}.${extension}`).

### Possible Causes

1. **File never actually uploaded**: The upload might have failed, but the error was not properly caught
2. **Wrong blob storage instance**: The URL might be pointing to the wrong Vercel Blob storage
3. **Expired or deleted blob**: The file was uploaded but later deleted or expired
4. **Direct filename used**: Something bypassed our upload API and used the original filename

### How to Debug

With the new logging in place, you can now:

1. **Check server logs** when uploading:
   - Look for `[Upload] Processing file:` to see original and generated filenames
   - Look for `[Upload] Successfully uploaded to Vercel Blob:` to confirm upload succeeded
   - Check for any error logs with `[Upload] Error uploading file:`

2. **Check browser console** when uploading:
   - Look for `Main image uploaded:` or `Hover image uploaded:` messages
   - Check for any error messages with upload details

3. **Verify Vercel Blob configuration**:
   - Ensure `BLOB_READ_WRITE_TOKEN` is set in environment variables
   - Check that the blob storage URL matches `NEXT_PUBLIC_BLOB_STORAGE_BASE_URL`

### Next Steps for Current 404

To fix the existing 404 image:

1. **Check the database**: Look at the `LandingPageImage` table and find entries with this URL
2. **Verify the blob exists**: Use Vercel CLI or dashboard to list blobs in your storage
3. **Re-upload the image**: Delete the database entry and re-upload through the admin interface
4. **Monitor the logs**: With new logging, you'll see exactly what's happening during upload

### Environment Variables to Check

```bash
# Required for uploads
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx

# Required for image display
NEXT_PUBLIC_BLOB_STORAGE_BASE_URL=https://allh29lyumanfwa1.public.blob.vercel-storage.com
```

## Testing the Fixes

### Test NaN Validation

1. **Range Upload Modal**:
   - Try entering non-numeric text in the Price field
   - Try entering negative numbers
   - Verify validation error appears

2. **Image Metadata Editor**:
   - For ranges section, try editing the price field with invalid values
   - Verify the field doesn't accept NaN values
   - Verify save button shows error for invalid numbers

### Test Upload Error Handling

1. **Simulate upload failure**:
   - Temporarily remove `BLOB_READ_WRITE_TOKEN` from environment
   - Try uploading an image
   - Check that detailed error appears in console and user sees helpful message

2. **Check successful upload**:
   - Upload a new image
   - Check browser console for upload success logs
   - Verify the URL is logged and accessible

## Summary

These fixes ensure:
- ✅ No more NaN values in the database
- ✅ Clear validation messages for users
- ✅ Detailed logging for debugging upload issues
- ✅ Better error messages when uploads fail
- ✅ URL validation after successful uploads

