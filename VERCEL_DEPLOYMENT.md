# Vercel Deployment Guide for Claude Blueprint

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- TiDB Cloud database (or any MySQL-compatible database)
- Manus LLM API credentials (or replace with direct Anthropic API)

## Step 1: Import GitHub Repository to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **blackdragonspear62/claude-blueprint**
4. Click **"Import"**

## Step 2: Configure Build Settings

Vercel should auto-detect the Next.js configuration, but verify:

- **Framework Preset**: Other (Custom)
- **Build Command**: `pnpm install && pnpm run build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

## Step 3: Set Environment Variables

Add these environment variables in Vercel dashboard (Settings → Environment Variables):

### Required Database Variables
```
DATABASE_URL=mysql://username:password@host:4000/database?ssl={"rejectUnauthorized":true}
```

### Required Auth Variables
```
JWT_SECRET=your-random-secret-key-here
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=blackdragonspear62
```

### Required LLM API Variables (Manus)
```
BUILT_IN_FORGE_API_KEY=your-manus-api-key
BUILT_IN_FORGE_API_URL=https://api.manus.im
```

**OR** if using direct Anthropic API, modify `server/_core/llm.ts` to use:
```
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### Optional OAuth Variables (if you want login functionality)
```
OAUTH_SERVER_URL=your-oauth-server-url
VITE_OAUTH_PORTAL_URL=your-oauth-portal-url
VITE_APP_ID=your-app-id
```

### Frontend Variables
```
VITE_APP_TITLE=Claude Blueprint - Autonomous City Designer
VITE_APP_LOGO=/favicon.png
```

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (5-10 minutes)
3. Vercel will provide a URL like `https://claude-blueprint.vercel.app`

## Step 5: Custom Domain (Optional)

1. Go to Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain: `claudeblueprint.xyz`
3. Follow DNS configuration instructions
4. Add these DNS records in Hostinger:
   - **Type**: CNAME
   - **Name**: @ (or www)
   - **Value**: cname.vercel-dns.com
   - **TTL**: 300

## Step 6: Test Deployment

1. Visit your Vercel URL
2. Click **"Start Building"** in Auto Mode
3. Verify city generation works
4. Check 3D visualization loads correctly

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure SSL is enabled for TiDB Cloud
- Test connection string locally first

### LLM API Not Working
- Verify API keys are correct
- Check API endpoint URLs
- Review `server/_core/llm.ts` for configuration

### Static Files Not Loading
- Ensure `client/public/` files are included in build
- Check `vercel.json` configuration
- Verify asset paths use absolute URLs

## Environment-Specific Notes

### Development
```bash
pnpm install
pnpm run dev
```

### Production Build (Local Test)
```bash
pnpm run build
pnpm start
```

## Support

For issues specific to:
- **Vercel deployment**: https://vercel.com/docs
- **TiDB Cloud**: https://docs.pingcap.com/tidbcloud
- **Claude AI API**: https://docs.anthropic.com

## Repository
https://github.com/blackdragonspear62/claude-blueprint
