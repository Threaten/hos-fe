# Frontend Production Deployment Guide
# Issue: Images showing localhost:3000 in production

## Root Cause
`.env.local` contains localhost URLs and takes precedence over `.env.production`

## Solution

### Option 1: Platform Deployment (Vercel, Netlify, etc.)
Set these environment variables in your platform's dashboard:

```bash
NEXT_PUBLIC_API_URL=https://admin.hehehihi.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://admin.hehehihi.com/api/graphql
```

### Option 2: VPS Direct Build
Before building for production:

```bash
cd /Users/nghiahoang/Downloads/Projects/elementa-multi-tenant/fe

# Rename .env.local temporarily (it's only for local development)
mv .env.local .env.local.backup

# Build with production environment
npm run build
# or
pnpm build

# After build, restore .env.local for future local development
mv .env.local.backup .env.local
```

### Option 3: Manual Environment Override
Build with explicit environment variables:

```bash
NEXT_PUBLIC_API_URL=https://admin.hehehihi.com \
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://admin.hehehihi.com/api/graphql \
npm run build
```

## Verify Configuration

After building, check that the environment variables are correct:

```bash
# In your built app, check the API URL
grep -r "localhost:3000" .next/ || echo "✅ No localhost references found"

# Should return nothing if successful
```

## Important Notes

- `.env.local` is for LOCAL DEVELOPMENT ONLY
- `.env.production` is automatically used in production builds (if .env.local doesn't exist)
- `.env.local` always takes precedence over other .env files
- Both files are in `.gitignore` so they won't be deployed

## Test After Deployment

Visit your deployed site and open browser console. You should see:
- Image URLs like: `https://admin.hehehihi.com/api/media/...`
- NOT: `http://localhost:3000/api/media/...`

## Troubleshooting

If images still don't load:
1. Clear Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Check browser Network tab for actual API calls
4. Verify backend CORS allows your frontend domain
