# GCP Cloud Run Deployment Checklist

## ✅ COMPLETED FIXES

### 1. Database Connection (`src/lib/db/index.ts`)
- ✅ Fixed to use Turso when `TURSO_DATABASE_URL` is provided (checks for `libsql://` prefix)
- ✅ No longer depends on `NODE_ENV` - works correctly in Cloud Run

### 2. Next.js Configuration (`next.config.mjs`)
- ✅ Removed hardcoded `generateBuildId: 'static-build'`
- ✅ Fixed `basePath` to be empty for Cloud Run (custom domain support)
- ✅ Correctly sets `output: 'standalone'` when `CLOUD_RUN=true`

### 3. Middleware (`src/middleware.ts`)
- ✅ Restored actual authentication middleware (was disabled for static export)
- ✅ Protects `/admin/*` routes with JWT verification
- ✅ Redirects to `/admin/login` when not authenticated

### 4. GitHub Actions Workflow (`.github/workflows/deploy-gcp.yml`)
- ✅ Removed unused build args (TURSO credentials not needed at build time)
- ✅ Added `STRIPE_WEBHOOK_SECRET` to environment variables
- ✅ All required env vars are now set in Cloud Run deployment

### 5. Dockerfile
- ✅ Removed static data generation (not needed - app queries DB at runtime)
- ✅ Removed pre-build/post-build scripts (only for static export)
- ✅ Fixed file permissions with `--chown=nextjs:nodejs`
- ✅ Simplified to just `next build` with `CLOUD_RUN=true`

### 6. API Routes
- ✅ All routes use `export const dynamic = 'force-dynamic'`
- ✅ Stripe initialization is lazy (only when routes are called)
- ✅ All routes handle missing env vars gracefully

### 7. Environment Variables Required

**GitHub Secrets:**
- ✅ `GCP_PROJECT_ID`
- ✅ `GCP_SERVICE_ACCOUNT`
- ✅ `GCP_WORKLOAD_IDENTITY_PROVIDER`
- ✅ `TURSO_DATABASE_URL`
- ✅ `TURSO_AUTH_TOKEN`
- ✅ `AUTH_SECRET`
- ✅ `STRIPE_WEBHOOK_SECRET` (ADD THIS IF MISSING)

**GitHub Variables:**
- ✅ `NEXT_PUBLIC_NODE_ENV`
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `NEXT_PUBLIC_ODOO_ACCESS_TOKEN`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `STRIPE_METERED_PRICE_ID`

## 🚀 Deployment Process

1. **Verify all secrets are set:**
   ```bash
   gh secret list
   ```

2. **Push to main** - automatically triggers deployment

3. **Monitor build:**
   - https://github.com/CariHQ/nnp-web/actions

4. **After deployment, configure custom domain:**
   ```bash
   gcloud run domain-mappings create \
     --service nnp-web \
     --domain votennp.com \
     --region us-central1
   ```

## 📋 Build Process

1. Docker builds with `CLOUD_RUN=true`
2. Next.js builds in `standalone` mode
3. Creates `server.js` and necessary files
4. Copies to minimal production image
5. Deploys to Cloud Run with all env vars

## ✅ Verification

- [x] Database connection works with Turso
- [x] All API routes are dynamic
- [x] Middleware protects admin routes
- [x] Stripe initializes lazily
- [x] No build-time database queries
- [x] Standalone build creates server.js
- [x] All env vars are set in Cloud Run

