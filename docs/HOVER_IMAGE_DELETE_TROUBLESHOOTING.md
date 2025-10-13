# Hover Image Delete Button - Troubleshooting Guide

## Where to Find the Delete Button

The delete button for hover images appears in a **specific location** - let me walk you through it step by step:

### Step-by-Step Navigation

1. **Go to Admin Dashboard**
   - URL: `/admin`

2. **Click "Landing Page"** in the sidebar

3. **Click on a section** that has hover images:
   - **"Our Ranges"** section (for product ranges)
   - **"Shop by Category"** section (for categories)
   
4. **You'll see a grid of images** - these are your ranges or categories

5. **Click the "Edit" button** (✏️ icon) on ONE of the image cards
   - This opens the **ImageMetadataEditor modal**

6. **Scroll down in the modal** to find:
   - "Hover Images (for animation)" section

7. **This is where the delete buttons are!**

## What You Should See

### If the Range/Category Has Hover Images

When you open the Edit modal, you should see:

```
┌─────────────────────────────────────────┐
│ Edit Image Details                  [X] │
├─────────────────────────────────────────┤
│                                         │
│ Alt Text *                              │
│ [input field]                           │
│                                         │
│ Caption                                 │
│ [textarea]                              │
│                                         │
│ Link URL                                │
│ [input field]                           │
│                                         │
│ ────────────────────────────────────    │ ← border line
│                                         │
│ Hover Images (for animation)            │ ← THIS SECTION
│                                         │
│ Current Hover Images                    │
│ ┌────┐ ┌────┐ ┌────┐                  │
│ │ 1  │ │ 2  │ │ 3  │   ← hover images │
│ │ ❌ │ │    │ │    │   ← X appears    │
│ └────┘ └────┘ └────┘     on hover     │
│                                         │
│ Add More Hover Images                   │
│ [+ upload button]                       │
│                                         │
│ ──────────────────────────────────      │
│                                         │
│ [Cancel]              [Save Changes]    │
└─────────────────────────────────────────┘
```

### The Delete Button Behavior

- **Default State**: X button is **invisible** (opacity-0)
- **On Hover**: Move your mouse over a hover image thumbnail → X button appears in top-right corner
- **Button Style**: Small red circular button with white X icon
- **Position**: Absolute positioned at `-top-2 -right-2` (slightly outside the image)

## Checklist - Why You Might Not See It

### ❓ Are you editing a range/category that HAS hover images?

**Check:**
- Open the Edit modal
- Look for "Hover Images (for animation)" section
- If you see "Current Hover Images" with thumbnails → ✅ You have hover images
- If this section is empty or not showing → ❌ This range has no hover images yet

**Solution:** You need to have uploaded hover images first. The delete button only appears if hover images exist.

### ❓ Is the "Hover Images" section showing at all?

**This section only shows if:**
- You're editing a **range** (from "Our Ranges" section), OR
- You're editing a **category** (from "Shop by Category" section)

**This section will NOT show if:**
- You're editing a hero image
- You're editing an instagram image
- You're editing a capsule image

**Check:** What section are you in?
- `/admin/landing-page/sections/[some-id]`
- Look at the page title - does it say "Our Ranges" or "Shop by Category"?

### ❓ Are you actually hovering over the image thumbnail?

The button uses CSS class `opacity-0 group-hover:opacity-100`, which means:
- Parent div has `className="relative group"`
- Button has `opacity-0` by default
- When you hover over the parent (the image thumbnail), button becomes `opacity-100`

**Test:** Move your mouse cursor DIRECTLY over one of the small hover image thumbnails. The X button should fade in.

### ❓ Is the modal scrollable? Can you scroll down?

The modal has `className="max-h-[80vh] overflow-y-auto"`, so if there's a lot of content, you need to scroll.

**Check:** Try scrolling down in the modal to see if there's more content below.

## How to Add Hover Images (If You Don't Have Any)

If the "Current Hover Images" section is empty:

1. In the same modal, look for "Add More Hover Images"
2. Click the upload button (box with upload icon)
3. Select an image file
4. It will appear in the preview
5. Click "Save Changes"
6. Re-open the Edit modal
7. Now you should see "Current Hover Images" with the delete button

## Visual Debugging

### Add Console Logs

If you want to debug, you can temporarily add console logs. Edit `ImageMetadataEditor.tsx`:

```typescript
// Around line 273, add:
console.log('Metadata:', metadata);
console.log('Has hoverImages array?', metadata.hoverImages);
console.log('Has hoverImage single?', metadata.hoverImage);
console.log('hasHoverImages config?', hasHoverImages);
```

Then:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Edit" on a range
4. Check what's logged

### Check the DOM

1. Open the Edit modal
2. Right-click on the page → "Inspect Element"
3. Find the hover image thumbnails in the DOM
4. Look for elements with class `group relative`
5. Inside should be a `Button` with class `opacity-0 group-hover:opacity-100`
6. If the button doesn't exist in the DOM → code issue
7. If the button exists but doesn't appear on hover → CSS issue

## Expected Behavior

### ✅ Working Correctly

1. Click "Edit" on a range with hover images
2. Modal opens
3. Scroll to "Hover Images (for animation)" section
4. See numbered thumbnails (1, 2, 3, etc.)
5. Hover mouse over thumbnail
6. Red X button fades in at top-right corner of thumbnail
7. Click X → image fades out and shows "Deleted" overlay
8. Undo button (↺) appears
9. Click Save → hover image is removed from database

### ❌ Not Working

If you don't see the delete button:

**Scenario A:** No "Hover Images" section at all
- → You're editing the wrong type of section (not ranges/categories)

**Scenario B:** "Hover Images" section exists but is empty
- → This range/category has no hover images uploaded yet

**Scenario C:** Hover images show but no X button on hover
- → Possible CSS issue or JavaScript not loading
- → Check browser console for errors

## Quick Test

Want to test if it's working? Here's a quick test:

1. Go to `/admin/landing-page/sections/[id]` for "Our Ranges"
2. Click "Add Range" button
3. Upload a main image
4. Upload a hover image
5. Fill in range name, price, description
6. Click "Add Range"
7. Now click "Edit" on that range
8. Scroll to "Hover Images (for animation)"
9. You should see the hover image you uploaded
10. **Hover your mouse over it**
11. **Red X button should appear in top-right corner**

## Still Not Seeing It?

If you've gone through all the above and still don't see the delete button, please provide:

1. **Screenshot** of the Edit modal showing the Hover Images section
2. **URL** you're on (what section are you editing?)
3. **Browser console errors** (if any)
4. **Network tab** - any failed requests?

This will help diagnose the exact issue!

## Alternative: Use Browser DevTools to Force Show Button

Temporary workaround to test if the button exists:

1. Open Edit modal
2. Right-click on a hover image thumbnail → Inspect
3. Find the `<button>` element with class containing `opacity-0`
4. In DevTools, change `opacity-0` to `opacity-100`
5. The button should become visible
6. If it appears → CSS issue (hover not triggering)
7. If it doesn't appear → component not rendering the button

## Summary

The delete button **is there** in the code at lines 318-325 of `ImageMetadataEditor.tsx`. 

Most common reasons for not seeing it:
1. ❌ No hover images uploaded yet
2. ❌ Editing wrong section type (not ranges/categories)  
3. ❌ Not hovering directly over the thumbnail
4. ❌ Not scrolling down to see the Hover Images section

The button appears on **hover** with a fade-in transition.

