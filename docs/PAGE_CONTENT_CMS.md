# Page Content CMS

## Overview

The Page Content CMS allows you to manage static page content (like About Us, Contact, etc.) through an admin interface without needing to edit code.

## Features

- ✅ Create and edit content for static pages
- ✅ SEO metadata management (title, description)
- ✅ Publish/draft status toggle
- ✅ Flexible JSON-based content storage
- ✅ Admin interface for easy content management

## Pages Available

- **About Us** (`about-us`) - Edit the About Us page content
- **Contact** (`contact`) - Edit Contact page content
- **Shipping & Returns** (`shipping-returns`) - Edit shipping policy
- **FAQ** (`faq`) - Edit frequently asked questions
- **Privacy Policy** (`privacy`) - Edit privacy policy
- **Terms & Conditions** (`terms`) - Edit terms and conditions

## How to Use

### Accessing the CMS

1. Log in to the admin panel
2. Navigate to "Page Content Management" in the admin menu
3. Select the page you want to edit

### Editing Content

1. Click "Edit Content" or "Create Content" for the desired page
2. Fill in the page title and metadata
3. Edit the content JSON to structure your page content
4. Toggle the "Published" switch to publish or save as draft
5. Click "Save Changes"

### Content JSON Structure

The content is stored as JSON, allowing flexible structure for different pages. Example:

```json
{
  "hero": {
    "title": "Welcome to Charna.",
    "description": "Premium handcrafted leather goods"
  },
  "sections": [
    {
      "type": "text",
      "title": "Our Story",
      "content": "Charna was founded with a vision..."
    },
    {
      "type": "image",
      "src": "image-url.jpg",
      "alt": "Our workshop"
    }
  ]
}
```

## API Endpoints

### Admin Endpoints (Authenticated)

- `GET /api/admin/page-content` - List all page contents
- `GET /api/admin/page-content/[pageName]` - Get specific page content
- `PUT /api/admin/page-content/[pageName]` - Update page content
- `DELETE /api/admin/page-content/[pageName]` - Delete page content

### Public Endpoints

- `GET /api/page-content/[pageName]` - Get published page content for frontend

## Database Schema

```prisma
model PageContent {
  id                Int      @id @default(autoincrement())
  pageName          String   @unique
  title             String?
  content           Json
  metaTitle         String?
  metaDescription   String?
  enabled           Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

## Next Steps

To use the CMS content in your frontend pages:

1. Fetch the page content from `/api/page-content/[pageName]`
2. Parse the JSON content structure
3. Render the content according to your page template
4. Use the SEO metadata for the page `<head>`

## Example: Fetching Content in a Page

```typescript
// pages/story.tsx
import { useState, useEffect } from 'react';

export default function Story() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch('/api/page-content/about-us')
      .then(res => res.json())
      .then(data => setContent(data.content));
  }, []);

  if (!content) return <div>Loading...</div>;

  return (
    <div>
      <h1>{content.hero.title}</h1>
      <p>{content.hero.description}</p>
      {/* Render other content sections */}
    </div>
  );
}
```
