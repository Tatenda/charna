# Contact Page CMS

## Overview

The Contact Page CMS provides a structured, user-friendly interface for editing all sections of the Contact page without needing to edit code or JSON directly.

## Tracked Sections

### 1. Hero Section
- **Title**: Main heading (e.g., "Contact Us")
- **Description**: Subheading text below the title

### 2. Location Card
- **Title**: Card heading (e.g., "Visit Our Workshop")
- **City**: Location city (e.g., "Johannesburg")
- **Country**: Location country (e.g., "South Africa")

### 3. Email Card
- **Title**: Card heading (e.g., "Email Us")
- **General Email**: For general and order queries (e.g., info@charna.co.za)
- **Wholesale Email**: For wholesale inquiries (e.g., wholesale@charna.co.za)

### 4. Phone Card
- **Title**: Card heading (e.g., "Call or Chat")
- **Cell Number**: Phone number (e.g., "072 356 0321")
- **WhatsApp Number**: WhatsApp contact (e.g., "27723560321")

### 5. Contact Form
- **Heading**: Form section title (e.g., "Send Us a Message")

### 6. Workshop Section
- **Description**: Text describing the workshop and visitor policy

### 7. Workshop Hours (Managed via JSON)
Currently managed via JSON. Structure:
```json
"workshopHours": [
  { "day": "Monday - Friday", "hours": "9:00 AM - 5:00 PM" },
  { "day": "Saturday", "hours": "10:00 AM - 3:00 PM" },
  { "day": "Sunday", "hours": "Closed" }
]
```

### 8. FAQ Section (Managed via JSON)
Currently managed via JSON. Structure:
```json
"faq": [
  {
    "question": "Do you ship internationally?",
    "answer": "Yes, we ship to select international destinations..."
  }
]
```

### 9. Social Media CTA
- **Heading**: Call-to-action heading
- **Description**: Supporting text for the social media section
- **Social Links**: Managed via JSON (Instagram, Facebook, Pinterest URLs)

## Content Structure

The Contact page content is stored as JSON with this structure:

```json
{
  "hero": {
    "title": "Contact Us",
    "description": "We'd love to hear from you..."
  },
  "location": {
    "title": "Visit Our Workshop",
    "city": "Johannesburg",
    "country": "South Africa"
  },
  "email": {
    "title": "Email Us",
    "generalEmail": "info@charna.co.za",
    "wholesaleEmail": "info@charna.co.za"
  },
  "phone": {
    "title": "Call or Chat",
    "cell": "072 356 0321",
    "whatsapp": "27723560321"
  },
  "formHeading": "Send Us a Message",
  "workshopDescription": "We welcome visitors...",
  "workshopHours": [...],
  "faq": [...],
  "socialCTA": {
    "heading": "Connect With Us on Social Media",
    "description": "Follow our journey...",
    "socialLinks": [...]
  }
}
```

## How to Use

1. Navigate to `/admin/page-content`
2. Click "Edit Content" for the Contact page
3. Use the structured form with tabs:
   - **Hero**: Edit page title and description
   - **Contact Info**: Edit location, email, and phone details
   - **Form**: Edit form heading
   - **Workshop**: Edit workshop description
   - **FAQ**: Edit FAQs (JSON mode)
   - **Social Media**: Edit social media CTA
4. Toggle between "Form" (structured) and "JSON" (raw) modes
5. Click "Save Changes"

## Form vs JSON Mode

- **Form Mode**: User-friendly interface with individual fields for each section
- **JSON Mode**: Advanced editing for workshop hours, FAQs, and social links

Both modes edit the same underlying data, so you can switch between them seamlessly.

## Frontend Integration

To use the CMS content in the contact page:

```typescript
import { useState, useEffect } from 'react';

export default function Contact() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch('/api/page-content/contact')
      .then(res => res.json())
      .then(data => setContent(data.content));
  }, []);

  if (!content) return <div>Loading...</div>;

  return (
    <div>
      <h1>{content.hero.title}</h1>
      <p>{content.hero.description}</p>
      
      <div>
        <h3>{content.location.title}</h3>
        <p>{content.location.city}, {content.location.country}</p>
      </div>
      
      {/* Render other sections using content object */}
    </div>
  );
}
```
