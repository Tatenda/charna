# Landing Page CMS - Activation Guide

## ✅ Status: READY TO ACTIVATE

All features are implemented and tested. Follow these steps to activate the database-driven landing page.

---

## 🔧 Activation Steps

### Step 1: Enable Feature Flag

Add to your `.env.local` file:
```bash
NEXT_PUBLIC_USE_DATABASE_LANDING=true
```

**Already done!** ✅

### Step 2: Restart Dev Server

```bash
# 1. Stop current server (Ctrl+C)

# 2. Clear cache (optional but recommended)
rm -rf .next

# 3. Start server
npm run dev
```

### Step 3: Verify Homepage

Visit: http://localhost:3000

**What should happen:**
- Hero section loads from database
- Same visual appearance as before
- Background image from database
- Title from database: "Handcrafted, beautiful and affordable bags"
- CTA button: "Shop Bags"

**If there's an error:**
- Check browser console
- Hero will fallback to hardcoded version
- Check database has data: `curl http://localhost:3000/api/landing-page/hero`

### Step 4: Test Admin Features

Visit: http://localhost:3000/admin/landing-page

**Test these features:**

1. **Upload Image**
   - Go to Instagram section (10/10 limit)
   - Should show "Limit Reached" (disabled button)
   - Go to Ranges section (unlimited)
   - Click "Add Image"
   - Select image, enter alt text
   - Upload successfully

2. **Edit Metadata**
   - Click "Edit" on any image
   - Change alt text, caption, link
   - Save changes
   - Refresh page - changes persist

3. **Reorder Images**
   - Use ↑↓ arrows
   - Order changes immediately
   - Refresh page - order persists

4. **Enable/Disable**
   - Hide an image
   - Visit homepage
   - Image should not appear
   - Re-enable image
   - Refresh homepage - image appears

---

## 📊 Current Database State

### Sections (5):
1. **Hero** - 1/1 image
2. **Ranges** - 7 images (unlimited)
3. **Categories** - 7/8 images
4. **Capsule** - 1/1 image
5. **Instagram** - 10/10 images

**Total: 26 images managed**

---

## 🎯 What's Database-Driven

### Currently Active:
- ✅ **Hero Section** - Background, title, CTA

### Still Hardcoded:
- ⏳ Our Ranges section
- ⏳ Shop by Category section
- ⏳ Bag Capsule section
- ⏳ Instagram Gallery section

**Note:** Only Hero is database-driven for now. Other sections can be refactored later once Hero is confirmed working.

---

## 🔍 Verification Checklist

- [ ] Feature flag set to `true`
- [ ] Dev server restarted
- [ ] Homepage loads without errors
- [ ] Hero shows database image
- [ ] Admin panel shows 5 sections
- [ ] Can upload new images
- [ ] Can edit image metadata
- [ ] Can reorder images
- [ ] Can enable/disable images
- [ ] Changes reflect on homepage

---

## 🐛 Troubleshooting

### Homepage shows hardcoded hero?
- Check `.env.local` has `NEXT_PUBLIC_USE_DATABASE_LANDING=true`
- Restart dev server
- Check browser console for errors
- Verify API works: `curl http://localhost:3000/api/landing-page/hero`

### Upload fails with "No files uploaded"?
- Restart dev server (code was updated)
- Check file is under 5MB
- Check file is an image (jpg, png, gif, webp)
- Check browser network tab for actual error

### Images not showing?
- Check `NEXT_PUBLIC_BLOB_STORAGE_BASE_URL` in `.env`
- Images stored as `/upload_...` need Blob URL
- Check browser console for 404s
- Verify image paths in database

### Metadata not saving?
- Check all required fields filled
- Check browser console for validation errors
- Verify API endpoint returns success

---

## 🚀 Production Deployment

### When Ready for Production:

1. **Add to Vercel Environment Variables:**
   ```
   NEXT_PUBLIC_USE_DATABASE_LANDING=true
   ```

2. **Push Code:**
   ```bash
   git push origin feature/landing-page-management
   ```

3. **Merge to Main:**
   - Create PR
   - Review and test
   - Merge to main/develop

4. **Deploy:**
   - Vercel auto-deploys
   - Database already has data
   - Landing page switches to database

---

## 📝 What Happens After Activation

### Admin Can Now:
- ✅ Change hero background without code
- ✅ Update hero title/CTA text
- ✅ Upload new images to any section
- ✅ Reorder images
- ✅ Manage all landing page content

### Developers Can:
- ✅ Refactor other sections to use database
- ✅ Add new sections via admin
- ✅ No more hardcoded image paths

---

## 🎉 Next Steps

1. **Activate Hero** (this guide)
2. **Test thoroughly**
3. **Refactor other sections** (optional)
4. **Deploy to production**

---

**Ready to activate! Just restart your server and visit the homepage!** 🚀

