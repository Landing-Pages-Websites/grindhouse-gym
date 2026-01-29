# Grind House Gym Landing Pages

Two conversion-focused landing pages for Grind House Gym NYC locations.

## Project Structure

```
Grindhouse Gym/
├── brooklyn/
│   └── index.html          # Williamsburg landing page
├── manhattan/
│   └── index.html          # Flatiron landing page
├── shared/
│   ├── css/
│   │   └── style.css       # Shared styles
│   ├── js/
│   │   └── main.js         # Tracking & form handling
│   └── images/             # Shared assets (add images here)
└── README.md
```

## Landing Page Details

### Brooklyn (Williamsburg)
- **URL:** `/brooklyn/`
- **Phone:** (718) 963-0835
- **Address:** 203 Berry Street, Brooklyn, NY 11249
- **Hours:** Mon-Fri 5AM-10PM, Sat-Sun 7AM-8PM
- **Focus:** 30,000 sq ft, unlimited classes, personal saunas
- **Note:** NO ice baths/cold plunge at this location

### Manhattan (Flatiron)
- **URL:** `/manhattan/`
- **Phone:** (212) 994-9453
- **Address:** 47 West 17th Street, New York, NY 10011
- **Hours:** Mon-Fri 5AM-10PM, Sat-Sun 7AM-7PM
- **Focus:** Ice baths, cold plunge, sauna, steam room, recovery suite
- **Note:** NEW location with full recovery amenities

## Configuration

### Tracking (Pre-configured)
- **GTM ID:** GTM-M7VVF2K6
- **Customer ID:** 00ec32c9-e228-4853-85b5-ac1446a70a41

### Form Submission
Forms POST to: `https://analytics.gomega.ai/submission/submit`

Payload includes:
- All form fields (first_name, last_name, email, phone, reason)
- Full attribution data (UTM params, gclid, gbraid, wbraid, fbclid)
- Session and visitor IDs
- Facebook pixel data (fbp, fbc)
- Referrer and full URL

### Site IDs (Update when URLs assigned)
Update in each page's `<script>` block:
```javascript
window.SITE_ID = 'your-site-id-here';
```

## Required Updates Before Launch

### 1. Site IDs
Once URLs are assigned, update `window.SITE_ID` in both:
- `/brooklyn/index.html`
- `/manhattan/index.html`

### 2. Images
Add hero images and other assets to `/shared/images/`:
- `og-brooklyn.jpg` - Open Graph image for Brooklyn
- `og-manhattan.jpg` - Open Graph image for Manhattan
- `favicon.svg` / `favicon.png` - Site favicon

Current hero images use Unsplash placeholders. Replace with client images from:
https://drive.google.com/drive/folders/1l8T0iJDaHszrxI1J4uGpA91g9VsxH25o

### 3. Google Maps Embeds
The map iframes use approximate coordinates. Verify and update the embed URLs with exact locations.

### 4. HubSpot Integration
To add HubSpot form submission, add your portal ID to `/shared/js/main.js`:
```javascript
hubspotPortalId: 'YOUR_PORTAL_ID',
```

### 5. Meta Tags
Update canonical URLs and OG URLs once domains are assigned.

## Section Anchors (Google Ads Compatible)

Both pages use these stable anchor IDs:
- `#hero` - Hero section
- `#services` - Services/facilities
- `#expertise` - Why Choose Grind House
- `#testimonials` - Member reviews
- `#location` - Address, hours, map
- `#contact` - Lead capture form

## Form Fields

| Field | Type | Required | Options |
|-------|------|----------|---------|
| first_name | text | Yes | - |
| last_name | text | Yes | - |
| email | email | Yes | - |
| phone | tel | Yes | - |
| reason | select | Yes | "Interested in a membership", "Interested in a corporate rate/partnership", "Other" |

## Conversion Goals

1. **Phone Calls** - Tracked via GTM (phone_lead event)
2. **Form Submissions** - Tracked via GTM (lead_form_submit event)

## Mobile Features

- Mobile-first responsive design
- Sticky phone CTA bar on mobile (bottom of screen)
- Click-to-call on all phone numbers
- Touch-optimized form inputs

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile Safari iOS 13+
- Chrome Android 80+

## Performance

- No external JS frameworks
- System font fallbacks
- Lazy-loaded map embeds
- Minimal CSS (single file)
- Optimized for Core Web Vitals

## Deployment Checklist

- [ ] Upload all files to hosting
- [ ] Add client images from Google Drive
- [ ] Update Site IDs in both HTML files
- [ ] Verify GTM container is receiving data
- [ ] Test form submissions
- [ ] Test phone click tracking
- [ ] Verify Google Maps embeds
- [ ] Test on mobile devices
- [ ] Validate anchor links
- [ ] Check all CTAs work
- [ ] Update canonical URLs
