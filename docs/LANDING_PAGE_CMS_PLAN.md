# Landing Page CMS - Implementation Plan

## 📋 Overview
Transform the landing page from hardcoded images to a fully dynamic CMS-managed system where all images and content can be managed from the admin dashboard.

## 🎯 Goals
- **Database-Driven**: All landing page images stored in database
- **Admin Management**: Full CRUD interface for managing sections
- **Flexible**: Easy to add/remove/reorder images
- **Performance**: Optimized loading with Vercel Blob Storage
- **SEO**: Maintain proper alt text and metadata

---

## 📊 Database Schema

### New Models

#### 1. `LandingPageSection`
```prisma
model LandingPageSection {
  id          Int      @id @default(autoincrement())
  name        String   @unique // "hero", "ranges", "categories", "capsule", "instagram"
  title       String?  // Section heading
  subtitle    String?  // Section subheading
  enabled     Boolean  @default(true)
  order       Int      @default(0)
  settings    Json?    // Additional settings (colors, layout, etc.)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  images      LandingPageImage[]
}
```

#### 2. `LandingPageImage`
```prisma
model LandingPageImage {
  id          Int      @id @default(autoincrement())
  sectionId   Int
  section     LandingPageSection @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  
  imageUrl    String   // Vercel Blob URL
  altText     String
  caption     String?
  linkUrl     String?  // Optional link destination
  
  order       Int      @default(0)
  enabled     Boolean  @default(true)
  
  metadata    Json?    // Additional data (category, hover images, etc.)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([sectionId, order])
}
```

---

## 🔧 API Endpoints

### `/api/admin/landing-page/sections`
- **GET**: List all sections with images
- **POST**: Create new section
- **PUT**: Update section settings

### `/api/admin/landing-page/sections/[id]`
- **GET**: Get single section with images
- **PUT**: Update section
- **DELETE**: Delete section

### `/api/admin/landing-page/images`
- **POST**: Upload new image to section
- **PUT**: Update image (reorder, edit metadata)
- **DELETE**: Remove image

### `/api/landing-page/[sectionName]`
- **GET**: Public endpoint to fetch section data for frontend

---

## 🖼️ Landing Page Sections Breakdown

### 1. Hero Section
**Database Fields:**
```json
{
  "name": "hero",
  "title": "Handcrafted, beautiful and affordable bags",
  "images": [
    {
      "imageUrl": "/image_1757230274214.png",
      "altText": "Hero Background",
      "order": 0,
      "metadata": {
        "position": "center",
        "overlay": "dark"
      }
    }
  ],
  "settings": {
    "ctaText": "Shop Bags",
    "ctaLink": "/browse?category=work",
    "backgroundColor": "#000000"
  }
}
```

### 2. Our Ranges Section
**Database Fields:**
```json
{
  "name": "ranges",
  "title": "Our Ranges",
  "images": [
    {
      "imageUrl": "/Retro Range - Navy Blue.png",
      "altText": "Retro Range - Navy",
      "order": 0,
      "metadata": {
        "rangeName": "Retro Range",
        "price": 2399,
        "description": "Bring the retro style to your laptop bag",
        "hoverImage": "/Retro Range - Olive.png",
        "category": "work"
      }
    }
    // ... more ranges
  ]
}
```

### 3. Shop by Category Section
**Database Fields:**
```json
{
  "name": "categories",
  "title": "Discover",
  "subtitle": "Shop by Category",
  "images": [
    {
      "imageUrl": "/Business Collection.png",
      "altText": "Business Collection",
      "linkUrl": "/browse?category=work",
      "order": 0,
      "metadata": {
        "categoryName": "Business",
        "description": "Professional Excellence",
        "hoverImages": [
          "/Business 1.png",
          "/Business 2.png",
          "/Business 3.png"
        ],
        "gridSpan": "col-span-2 row-span-2"
      }
    }
    // ... more categories
  ]
}
```

### 4. Bag Capsule Section
**Database Fields:**
```json
{
  "name": "capsule",
  "title": "Bag Capsule",
  "images": [
    {
      "imageUrl": "/navy-backpack-capsule.png",
      "altText": "Premium Navy Leather Backpack",
      "order": 0,
      "metadata": {
        "fullscreen": true
      }
    }
  ]
}
```

### 5. Instagram Gallery Section
**Database Fields:**
```json
{
  "name": "instagram",
  "title": "Charna on the #Gram",
  "images": [
    {
      "imageUrl": "/green-backpack.jpg",
      "altText": "Instagram post",
      "order": 0
    }
    // ... up to 10 images
  ],
  "settings": {
    "instagramHandle": "@charna.co",
    "instagramUrl": "https://www.instagram.com/charna.co",
    "layout": "grid",
    "columns": 5
  }
}
```

---

## 🎨 Admin Dashboard Components

### 1. Landing Page Manager (`/admin/landing-page`)
**Layout:**
```
┌─────────────────────────────────────┐
│  Landing Page Management            │
├─────────────────────────────────────┤
│  [+ Add Section]                    │
├─────────────────────────────────────┤
│  📸 Hero Section          [Edit] [↑↓]│
│    1 image                          │
├─────────────────────────────────────┤
│  🎒 Our Ranges            [Edit] [↑↓]│
│    7 images                         │
├─────────────────────────────────────┤
│  🏷️ Categories            [Edit] [↑↓]│
│    8 images                         │
└─────────────────────────────────────┘
```

### 2. Section Editor (`/admin/landing-page/sections/[id]`)
**Features:**
- Section title/subtitle editor
- Image grid with drag-to-reorder
- Individual image cards with:
  - Preview thumbnail
  - Alt text field
  - Link URL field
  - Metadata editor (JSON or form)
  - Delete button
  - Reorder handles
- Upload new images
- Section settings (colors, layout)

### 3. Image Upload Modal
**Features:**
- Drag-and-drop upload
- Multiple file selection
- Auto-upload to Vercel Blob
- Alt text prompt
- Metadata form (category-specific)
- Preview before save

---

## 🚀 Implementation Steps

### Phase 1: Database Setup
1. ✅ Create new branch: `feature/landing-page-cms`
2. Add Prisma models
3. Run migration
4. Create seed data for existing images

### Phase 2: API Development
1. Build section CRUD endpoints
2. Build image CRUD endpoints
3. Add image upload integration with Vercel Blob
4. Add validation and error handling

### Phase 3: Admin UI
1. Create landing page management page
2. Build section list view
3. Build section editor
4. Build image upload component
5. Add drag-and-drop reordering
6. Add preview functionality

### Phase 4: Frontend Integration
1. Create landing page data hook (`useLandingPageSection`)
2. Refactor Hero component to use database images
3. Refactor Our Ranges section
4. Refactor Categories section
5. Refactor Capsule section
6. Refactor Instagram section
7. Add loading states
8. Add error handling

### Phase 5: Testing & Polish
1. Test all CRUD operations
2. Test image uploads
3. Test reordering
4. Performance optimization
5. SEO verification
6. Mobile responsiveness check

---

## 📁 File Structure

```
/pages/admin/landing-page/
  ├── index.tsx                 # Section list/overview
  └── sections/
      └── [id].tsx             # Section editor

/pages/api/admin/landing-page/
  ├── sections/
  │   ├── index.ts             # GET/POST sections
  │   └── [id].ts              # GET/PUT/DELETE section
  └── images/
      ├── index.ts             # POST image
      ├── [id].ts              # PUT/DELETE image
      └── upload.ts            # Upload to Vercel Blob

/pages/api/landing-page/
  └── [sectionName].ts         # Public API

/components/admin/landing-page/
  ├── SectionList.tsx          # List all sections
  ├── SectionEditor.tsx        # Edit section
  ├── ImageGrid.tsx            # Image management grid
  ├── ImageCard.tsx            # Individual image card
  ├── ImageUploadModal.tsx     # Upload new images
  └── SectionSettings.tsx      # Section settings form

/hooks/
  └── useLandingPageSection.ts # Fetch section data
```

---

## 🔑 Key Features

### 1. Image Management
- ✅ Upload to Vercel Blob
- ✅ Drag-and-drop reordering
- ✅ Alt text and metadata
- ✅ Multiple images per section
- ✅ Hover image support (for category tiles)

### 2. Section Management
- ✅ Enable/disable sections
- ✅ Reorder sections
- ✅ Custom settings per section
- ✅ Duplicate section functionality

### 3. Content Flexibility
- ✅ Rich metadata support (JSON)
- ✅ Dynamic grid layouts
- ✅ Category-specific fields
- ✅ Link management

### 4. Performance
- ✅ Optimized image loading
- ✅ Lazy loading for sections
- ✅ CDN delivery via Vercel Blob
- ✅ Image optimization

---

## 🎯 Success Criteria

- [ ] All hardcoded images moved to database
- [ ] Admin can add/edit/delete any landing page image
- [ ] Admin can reorder sections and images
- [ ] Changes reflect immediately on landing page
- [ ] No performance degradation
- [ ] Mobile-responsive admin interface
- [ ] SEO maintained (alt text, metadata)
- [ ] Error handling and validation
- [ ] Backup/restore functionality

---

## 🔄 Migration Strategy

### Step 1: Create Initial Data
```typescript
// scripts/migrate-landing-page-images.ts
// Extract all existing images and create database records
```

### Step 2: Parallel Running
- Keep both hardcoded and database versions
- Use feature flag to switch between them
- Test thoroughly

### Step 3: Full Cutover
- Remove hardcoded images
- Database becomes single source of truth
- Document new workflow

---

## 🛡️ Security Considerations

1. **Admin Only**: All write operations require admin authentication
2. **File Validation**: Validate file types and sizes
3. **XSS Protection**: Sanitize user inputs (alt text, captions)
4. **Rate Limiting**: Prevent upload abuse
5. **Backup**: Regular database backups before major changes

---

## 📝 Notes

- Start with Hero and Instagram sections (simplest)
- Our Ranges section is most complex (hover images, metadata)
- Consider caching strategy for landing page data
- Add image compression before upload
- Version control for landing page changes (optional future enhancement)

---

**Branch**: `feature/landing-page-cms`  
**Priority**: High  
**Estimated Effort**: 3-5 days  
**Dependencies**: Vercel Blob, Prisma, Admin Auth

