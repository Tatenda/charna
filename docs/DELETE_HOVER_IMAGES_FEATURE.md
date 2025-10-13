# Delete Hover Images Feature

## Overview

Added the ability to delete individual hover images within a range or category when editing image metadata. Previously, you could only add new hover images but couldn't remove existing ones.

## What Changed

### Before ❌
- Could add new hover images
- Could NOT delete existing hover images
- Had to delete entire range/category and re-upload to change hover images

### After ✅
- Can add new hover images
- **Can now delete individual hover images**
- Can undo deletion before saving
- Works for both ranges (single hover image) and categories (multiple hover images)

## How to Use

### 1. Navigate to Edit Image

1. Go to **Admin Dashboard → Landing Page → Select Section** (e.g., "Our Ranges" or "Shop by Category")
2. Find the image you want to edit
3. Click the **"Edit"** button on the image card

### 2. Delete Hover Images

In the Image Metadata Editor modal:

1. Scroll to the **"Hover Images (for animation)"** section
2. Hover over the hover image you want to delete
3. Click the **red X button** that appears in the top-right corner
4. The image will be marked as "Deleted" with a red overlay
5. You can **undo** by clicking the **↺ button** before saving
6. Click **"Save Changes"** to permanently delete

### Visual Guide

```
┌──────────────────────────────────┐
│  Hover Images (for animation)    │
├──────────────────────────────────┤
│  Current Hover Images            │
│                                  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  │ 1  │ │ 2  │ │ 3  │ │ 4  │   │  ← Numbered hover images
│  │ ✗  │ │    │ │    │ │    │   │  ← Hover to see X button
│  └────┘ └────┘ └────┘ └────┘   │
│                                  │
│  After clicking X on image 1:   │
│                                  │
│  ┌────────┐ ┌────┐ ┌────┐       │
│  │ DELETED│ │ 2  │ │ 3  │       │  ← Marked as deleted
│  │   ↺    │ │    │ │    │       │  ← Click ↺ to undo
│  └────────┘ └────┘ └────┘       │
└──────────────────────────────────┘
```

## Features

### Smart Visual Feedback

**Before deletion:**
- Hover over image → Red X button appears
- Normal border and opacity

**After clicking delete:**
- Image gets red border and faded opacity (40%)
- "Deleted" label appears over the image
- Red X button changes to ↺ (undo) button
- Image stays visible until you save

**After clicking undo:**
- Image returns to normal state
- Can delete again if needed

### Works for Both Section Types

#### Ranges (Single Hover Image)
- Ranges typically have ONE hover image
- Delete it, and the range will have no hover effect
- Add a new one to replace it
- Saved as `metadata.hoverImage` (singular)

#### Categories (Multiple Hover Images)
- Categories can have MULTIPLE hover images for smooth animations
- Delete any or all of them
- The remaining images stay in order
- Saved as `metadata.hoverImages` (array)

### Undo Before Saving

- Deletions are **not permanent** until you click "Save Changes"
- Click the **↺ button** on a deleted image to restore it
- Close the modal without saving to cancel all changes

## Technical Details

### State Management

```typescript
// Track deleted images by their index
const [deletedHoverImageIndices, setDeletedHoverImageIndices] = useState<Set<number>>(new Set());

// Mark image as deleted
const removeExistingHoverImage = (index: number) => {
  const newDeleted = new Set(deletedHoverImageIndices);
  newDeleted.add(index);
  setDeletedHoverImageIndices(newDeleted);
};

// Undo deletion
const undoRemoveExistingHoverImage = (index: number) => {
  const newDeleted = new Set(deletedHoverImageIndices);
  newDeleted.delete(index);
  setDeletedHoverImageIndices(newDeleted);
};
```

### Save Logic

On save, the component:

1. **Filters out deleted images**
   ```typescript
   const filteredHoverImages = existingHoverImages.filter(
     (_: string, idx: number) => !deletedHoverImageIndices.has(idx)
   );
   ```

2. **Adds newly uploaded images**
   ```typescript
   const uploadedUrls = await uploadHoverImages();
   finalHoverImages = [...filteredHoverImages, ...uploadedUrls];
   ```

3. **Updates metadata based on section type**
   ```typescript
   // For ranges (singular)
   if (metadata.hoverImage !== undefined) {
     updatedMetadata = {
       ...metadata,
       hoverImage: finalHoverImages[0] || undefined,
     };
   }
   // For categories (array)
   else {
     updatedMetadata = {
       ...metadata,
       hoverImages: finalHoverImages.length > 0 ? finalHoverImages : undefined,
     };
   }
   ```

### UI Components

```tsx
{isDeleted ? (
  // Show undo button
  <Button
    variant="secondary"
    size="sm"
    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-100"
    onClick={() => undoRemoveExistingHoverImage(idx)}
    title="Undo delete"
  >
    ↺
  </Button>
) : (
  // Show delete button (appears on hover)
  <Button
    variant="destructive"
    size="sm"
    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
    onClick={() => removeExistingHoverImage(idx)}
    title="Delete"
  >
    <X className="h-3 w-3" />
  </Button>
)}
```

## Use Cases

### Update Range Hover Image

**Scenario:** You uploaded the wrong hover image for a range

**Solution:**
1. Edit the range
2. Delete the existing hover image
3. Upload a new one
4. Save

### Remove Animation from Category

**Scenario:** You want a category tile to be static (no hover animation)

**Solution:**
1. Edit the category
2. Delete all hover images
3. Save
4. Category will now only show the main image

### Reorder Hover Images

**Scenario:** Animation frames are in the wrong order

**Current workaround:**
1. Note the URLs of the images
2. Delete all hover images
3. Re-upload them in the correct order

**Future improvement:** Could add drag-and-drop reordering

### Clean Up Unused Images

**Scenario:** You uploaded 10 test hover images but only want to keep 3

**Solution:**
1. Edit the category
2. Delete the 7 unwanted images
3. Save
4. Only 3 remain (Note: deleted image files stay in Vercel Blob storage)

## Important Notes

### ⚠️ Deletion is Permanent After Saving

- Once you click "Save Changes", deleted images are removed from metadata
- The image **files** remain in Vercel Blob storage (not automatically deleted)
- You'll need to re-upload if you delete by mistake and save

### 🔄 Can Undo Before Saving

- Before clicking "Save Changes", all deletions can be undone
- Click the ↺ button to restore a deleted image
- Close modal without saving to cancel everything

### 💾 Doesn't Delete Files from Storage

- Deleting a hover image only removes it from the metadata
- The actual image file stays in Vercel Blob storage
- This prevents breaking links if the image is used elsewhere
- Could add a cleanup script to remove unused files later

### 📝 Works with Both Data Structures

The component intelligently handles:
- **Ranges**: `metadata.hoverImage` (string)
- **Categories**: `metadata.hoverImages` (array)

It automatically detects which format to use based on existing metadata.

## Files Modified

- `/components/admin/landing-page/ImageMetadataEditor.tsx`
  - Added state for tracking deleted images
  - Added delete/undo functions
  - Added delete button UI
  - Updated save logic to filter out deleted images
  - Handles both `hoverImage` and `hoverImages` formats

## Future Improvements

### Potential Enhancements

1. **Drag-and-Drop Reordering**
   - Allow dragging hover images to reorder animation frames
   - More intuitive than delete/re-upload

2. **Bulk Actions**
   - "Delete All" button
   - "Select Multiple" checkbox mode

3. **Preview Animation**
   - Show hover animation preview in the editor
   - See how it looks before saving

4. **Storage Cleanup**
   - Track unused image files
   - Provide admin tool to clean up Vercel Blob storage
   - Show storage usage stats

5. **Image Replacement**
   - Click "Replace" to swap one hover image for another
   - Avoids delete + upload workflow

## Testing

### Test Cases

✅ **Delete single hover image from range**
- Edit a range with hover image
- Delete the hover image
- Save
- Verify `metadata.hoverImage` is undefined

✅ **Delete one of multiple hover images from category**
- Edit a category with 3 hover images
- Delete the 2nd one
- Save
- Verify `metadata.hoverImages` contains only images 1 and 3

✅ **Undo deletion before saving**
- Delete a hover image
- Click undo (↺)
- Save
- Verify image is NOT deleted

✅ **Delete and add new in same edit**
- Delete existing hover image
- Upload new hover image
- Save
- Verify old is gone, new is present

✅ **Delete all hover images**
- Delete all hover images from a category
- Save
- Verify `metadata.hoverImages` is undefined

## Summary

This feature provides essential functionality for managing hover images in ranges and categories. Users can now:

- ✅ Delete individual hover images
- ✅ Undo deletions before saving
- ✅ See clear visual feedback
- ✅ Works seamlessly with both ranges and categories
- ✅ Maintains data integrity with smart metadata handling

The implementation is intuitive, with hover-to-reveal delete buttons and clear "Deleted" states that can be undone before committing changes.


