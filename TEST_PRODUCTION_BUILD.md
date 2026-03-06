# Test Production Build Locally

## Quick Test

```bash
cd fe

# Build in production mode
NODE_ENV=production pnpm build

# Check the built code doesn't reference localhost
grep -r "localhost:3000" .next/static/ || echo "✅ No localhost references in build"

# Start production server
pnpm start
```

## What Was Fixed

Updated `api/queries.ts` to prioritize production URL when `NODE_ENV=production`:

```typescript
export const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL || "https://admin.hehehihi.com"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
```

This ensures that even if `.env.local` exists, production builds will use the correct backend URL.

## Why Only NewMenuModal and Lightbox Failed

These components use native `<img>` tags instead of Next.js `Image` component:

- **NewMenuModal**: Line 103, 163 - uses `<img src={${API_URL}...}>`
- **ImageLightbox**: Line 153 - uses `<img src={imageSrc}>`

Native `<img>` tags don't go through Next.js image optimization, but the browser blocks requests to `localhost` in production for security.

## Verify After Deploy

Open browser console on deployed site and check:

```javascript
// Should log: https://admin.hehehihi.com
console.log(window.location.hostname);

// Check image sources in NewMenuModal/Gallery
document.querySelectorAll("img").forEach((img) => console.log(img.src));
// Should show: https://admin.hehehihi.com/api/media/...
// NOT: http://localhost:3000/api/media/...
```
