# GCP Deployment Troubleshooting

## Authentication Error: "Unauthenticated request"

If you see:
```
denied: Unauthenticated request. Unauthenticated requests do not have permission "artifactregistry.repositories.uploadArtifacts"
```

### Solution 1: Enable Container Registry API
```bash
gcloud services enable containerregistry.googleapis.com --project=nnp-web-1765554113
```

### Solution 2: Verify Service Account Permissions
The service account needs:
- `roles/storage.admin` (for Container Registry)
- `roles/run.admin` (for Cloud Run)

### Solution 3: Use Artifact Registry Instead
If Container Registry doesn't work, switch to Artifact Registry:

1. Create Artifact Registry repository:
```bash
gcloud artifacts repositories create nnp-web \
  --repository-format=docker \
  --location=us-central1 \
  --project=nnp-web-1765554113
```

2. Update workflow to use Artifact Registry:
```yaml
-t us-central1-docker.pkg.dev/$PROJECT_ID/nnp-web/$SERVICE_NAME:$GITHUB_SHA
```

3. Authenticate:
```yaml
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## Build Verification

✅ **Local build test:**
```bash
docker build -t nnp-web-test --target builder .
docker build -t nnp-web-final --target runner .
docker run --rm nnp-web-final test -f /app/server.js && echo "✅ OK"
```

✅ **Standalone build verification:**
- `server.js` exists in final image
- `.next/static` is copied
- `public` directory is copied
- `node_modules` from standalone are included

## Common Issues

1. **"next: not found"** → Use `npx next build` ✅ FIXED
2. **"server.js not found"** → Verify standalone build completes ✅ VERIFIED
3. **Authentication errors** → Enable APIs and check permissions
4. **Missing env vars** → All required vars are in workflow ✅ VERIFIED

