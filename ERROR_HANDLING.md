# Error Handling Setup

## How It Works

All errors (except 404s) redirect to `/somethingwentwrong` on the main domain.

### Example Behavior

- **Error on `red-bistro.localhost:3001/menu`**  
  → Redirects to `localhost:3001/somethingwentwrong`

- **Error on `blue-bistro.hehehihi.com/gallery`**  
  → Redirects to `hehehihi.com/somethingwentwrong`

- **404 errors**  
  → Show the 404 page (not redirected)

## Error Handlers

1. **`app/error.tsx`** - Catches global app errors
2. **`app/(main)/error.tsx`** - Catches main route errors
3. **`app/tenant/error.tsx`** - Catches tenant route errors

All redirect to `/somethingwentwrong` on the base domain (no subdomain).

## The Error Page

- **Location:** `app/somethingwentwrong/page.tsx`
- **Layout:** `app/somethingwentwrong/layout.tsx`
- **Features:**
  - No navbar
  - No footer
  - No breadcrumbs
  - Just a clean error display with animated glitch effect
  - "Back to Home" button

## Testing

To test error handling:

```tsx
// Add this to any page to trigger an error
throw new Error("Test error");
```

It should redirect to `localhost:3001/somethingwentwrong` (or your production domain).
