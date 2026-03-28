# 🚀 Quick Fix: Data Not Loading in Deployment

## Problem

Your frontend shows default data (like "houseofsenses.vn") instead of your actual backend data when deployed.

## Root Cause

**Missing environment variables** - Your deployed frontend doesn't know where your backend is!

---

## ✅ Solution (Step-by-Step)

### Step 1: Deploy Your Backend First

Your backend needs to be accessible via a URL. Deploy it to:

- **Railway** (recommended): `railway.app`
- **Render**: `render.com`
- **Heroku**: `heroku.com`
- **Vercel**: `vercel.com`

After deployment, you'll get a URL like:

```
https://your-backend-xyz123.railway.app
```

### Step 2: Configure Frontend Environment Variables

#### For Vercel:

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add these TWO variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-xyz123.railway.app
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-backend-xyz123.railway.app/api/graphql
```

4. Click **Save**
5. Go to **Deployments** tab → Click **Redeploy**

#### For Netlify:

1. Go to **Site Settings** → **Environment Variables**
2. Add the same two variables
3. Trigger a new deploy

#### For Other Platforms:

Same concept - find the environment variables section and add both variables.

---

## 🧪 Testing & Verification

### 1. Visit the Diagnostics Page

After deploying with environment variables, go to:

```
https://your-frontend-domain.com/diagnostics
```

This will show you:

- ✅ If environment variables are set correctly
- ✅ If backend is reachable
- ✅ If GraphQL is working

### 2. Check Browser Console

Open your deployed site and press `F12` to open Developer Tools.

**Look for these logs:**

```
🔗 GraphQL Endpoint: https://your-backend.com/api/graphql
🔍 Fetching tenant by slug: your-tenant
✅ Tenant data received: Found
```

**Bad signs (needs fixing):**

```
❌ Error fetching tenant: Failed to fetch
📡 GraphQL Endpoint: http://localhost:3000/api/graphql  ← Still using localhost!
```

### 3. Test Backend Directly

Open your backend URL in browser:

```
https://your-backend-xyz123.railway.app/api/graphql
```

You should see GraphQL Playground or a response.

---

## 🐛 Common Issues & Fixes

### Issue 1: Still Shows Default Data

**Cause:** Environment variables not set or wrong
**Fix:**

1. Double-check variable names are EXACTLY:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_GRAPHQL_ENDPOINT`
2. No trailing slashes
3. Must start with `https://` in production
4. Redeploy after adding variables

### Issue 2: CORS Error in Console

**Error:** `Access to fetch blocked by CORS policy`

**Fix:** Update backend CORS settings to allow your frontend domain.

In your backend, check the CORS configuration allows:

```javascript
// Example for your frontend domain
cors({
  origin: "https://your-frontend.vercel.app",
  credentials: true,
});
```

### Issue 3: "Failed to Fetch" Error

**Causes:**

- Backend not deployed/running
- Wrong backend URL
- Network issues

**Fix:**

1. Verify backend URL works in browser
2. Check backend logs for errors
3. Ensure backend is publicly accessible (not just localhost)

---

## 📋 Checklist Before Deployment

- [ ] Backend is deployed and accessible
- [ ] Backend URL copied (e.g., `https://your-app.railway.app`)
- [ ] Both environment variables added to deployment platform
- [ ] Environment variables use HTTPS (not HTTP)
- [ ] No trailing slashes in URLs
- [ ] Redeployed frontend after adding variables
- [ ] Tested `/diagnostics` page
- [ ] Checked browser console for errors

---

## 🎯 Quick Test Commands

Test your backend GraphQL from command line:

```bash
# Replace with your actual backend URL
curl -X POST https://your-backend.com/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'

# Should return: {"data":{"__typename":"Query"}}
```

---

## 📝 Example Configuration

### Local Development (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/api/graphql
```

### Production (Deployment Platform)

```bash
NEXT_PUBLIC_API_URL=https://admin.houseofsenses.vn
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://admin.houseofsenses.vn/api/graphql
```

---

## 🆘 Still Not Working?

1. **Check `/diagnostics` page** - Shows exactly what's wrong
2. **Look at browser console** (F12) - Shows detailed error messages
3. **Verify backend works** - Test the GraphQL endpoint directly
4. **Check deployment platform logs** - May show why variables aren't loading

---

## 📚 Related Files

- `DEPLOYMENT.md` - Full deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Detailed checklist
- `check-deployment.sh` - Local verification script
- `/diagnostics` - Built-in diagnostic page
