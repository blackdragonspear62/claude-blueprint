# Vercel Deployment Guide for Claude Blueprint

## ⚠️ Important Note
This project uses a **custom Express + Vite setup**, not standard Next.js. Follow these exact steps for successful deployment.

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- TiDB Cloud database (or any MySQL-compatible database)
- Manus LLM API credentials

## Step 1: Import GitHub Repository to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **blackdragonspear62/claude-blueprint**
4. Click **"Import"**

## Step 2: Configure Build Settings

**CRITICAL**: Override Vercel's auto-detection with these exact settings:

```
Framework Preset: Other
Build Command: pnpm install && pnpm run build
Output Directory: dist
Install Command: pnpm install
Node.js Version: 22.x
```

## Step 3: Set Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

### 🔴 Required Variables

```bash
# Database (TiDB Cloud)
DATABASE_URL=mysql://username:password@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/database?ssl={"rejectUnauthorized":true}

# Security
JWT_SECRET=generate-random-32-char-string-here

# Owner Info
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=blackdragonspear62

# Manus LLM API
BUILT_IN_FORGE_API_KEY=your-manus-api-key
BUILT_IN_FORGE_API_URL=https://api.manus.im

# Frontend API Keys (same as backend)
VITE_FRONTEND_FORGE_API_KEY=your-manus-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

### 🟡 Optional Variables

```bash
# Branding
VITE_APP_TITLE=Claude Blueprint - Autonomous City Designer
VITE_APP_LOGO=/favicon.png

# OAuth (if you want login)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-app-id

# Analytics
VITE_ANALYTICS_ENDPOINT=your-analytics-url
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## Step 4: Generate JWT_SECRET

Run this command to generate a secure JWT secret:

```bash
openssl rand -base64 32
```

Or use this online: https://generate-secret.vercel.app/32

## Step 5: Get Database URL

### Option A: TiDB Cloud (Recommended)
1. Go to https://tidbcloud.com
2. Create free cluster
3. Get connection string from cluster details
4. Format: `mysql://username:password@host:4000/database?ssl={"rejectUnauthorized":true}`

### Option B: PlanetScale
1. Go to https://planetscale.com
2. Create database
3. Get connection string

### Option C: Railway MySQL
1. Go to https://railway.app
2. Add MySQL service
3. Get connection string

## Step 6: Deploy

1. Click **"Deploy"**
2. Wait 5-10 minutes for build
3. Check build logs for errors
4. Visit your deployment URL

## Step 7: Custom Domain (Optional)

### Add Domain to Vercel
1. Go to Project Settings → **Domains**
2. Add: `claudeblueprint.xyz`
3. Vercel will show DNS records to add

### Configure DNS in Hostinger
1. Login to Hostinger
2. Go to **Domains** → **claudeblueprint.xyz**
3. Click **DNS / Name Servers**
4. Add CNAME record:
   - **Type**: CNAME
   - **Name**: @ (or www)
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: 300

5. Wait 5-30 minutes for DNS propagation

## Troubleshooting

### Build Fails: "Cannot find module"
**Solution**: Ensure all dependencies are in `package.json` and `pnpm-lock.yaml` is committed

### Build Fails: "Command not found"
**Solution**: Check Node.js version is set to 22.x in Vercel settings

### Database Connection Error
**Solution**: 
- Verify `DATABASE_URL` format is correct
- Ensure SSL is enabled: `?ssl={"rejectUnauthorized":true}`
- Check database is accessible from external IPs

### LLM API Not Working
**Solution**:
- Verify `BUILT_IN_FORGE_API_KEY` is correct
- Check both backend and frontend API keys are set
- Test API key with curl:
  ```bash
  curl -H "Authorization: Bearer YOUR_KEY" https://api.manus.im/v1/models
  ```

### Static Files 404
**Solution**:
- Ensure `client/public/` files are in repo
- Check `outputDirectory` is set to `dist`
- Verify build command creates `dist` folder

### Runtime Error: "Cannot read property of undefined"
**Solution**:
- Check all required env vars are set
- Verify database tables exist (run migrations)
- Check server logs in Vercel dashboard

## Testing Locally Before Deploy

```bash
# Install dependencies
pnpm install

# Set environment variables in .env file
cp .env.example .env
# Edit .env with your values

# Run development server
pnpm run dev

# Test production build
pnpm run build
pnpm start
```

## Vercel-Specific Files

- `.node-version` - Specifies Node.js 22.x
- `vercel.json` - Build and routing configuration
- `.vercelignore` - Files to exclude from deployment

## Alternative: Deploy to Railway

If Vercel doesn't work, try Railway:

1. Go to https://railway.app
2. Import from GitHub
3. Add MySQL service
4. Set environment variables
5. Deploy

## Support

- **Vercel Docs**: https://vercel.com/docs
- **TiDB Cloud**: https://docs.pingcap.com/tidbcloud
- **GitHub Issues**: https://github.com/blackdragonspear62/claude-blueprint/issues

## Repository
https://github.com/blackdragonspear62/claude-blueprint

---

**Last Updated**: January 2026
