# Quick Start: Deploy to GCP Cloud Run

The GitHub Actions workflow is **already configured** to automatically deploy to GCP Cloud Run when you push to `main`.

## Step 1: Authenticate with Google Cloud

```bash
gcloud auth login
```

## Step 2: Create GCP Project

```bash
# Generate a unique project ID
PROJECT_ID="nnp-web-$(date +%s | cut -c1-10)"
echo "Project ID: $PROJECT_ID"

# Create the project
gcloud projects create $PROJECT_ID --name="NNP Web"

# Set as active project
gcloud config set project $PROJECT_ID
```

## Step 3: Link Billing Account

```bash
# List available billing accounts
gcloud billing accounts list

# Link billing account (replace BILLING_ACCOUNT_ID with actual ID)
gcloud billing projects link $PROJECT_ID --billing-account=BILLING_ACCOUNT_ID
```

Or run the automated setup:
```bash
./scripts/setup-gcp-manual.sh $PROJECT_ID [BILLING_ACCOUNT_ID]
```

## Step 4: Create Service Account for GitHub Actions

```bash
./scripts/create-gcp-service-account.sh $PROJECT_ID
```

This will create `key.json` file.

## Step 5: Add GitHub Secrets

```bash
# Add the secrets to GitHub
gh secret set GCP_PROJECT_ID --body "$PROJECT_ID"
gh secret set GCP_SA_KEY < key.json
gh secret set AUTH_SECRET --body "$(openssl rand -base64 32)"

# Delete the key file for security
rm key.json
```

## Step 6: Deploy!

**Option A: Automatic (Recommended)**
Just push to `main` branch:
```bash
git push origin main
```

The GitHub Actions workflow will automatically:
- Build the Docker image
- Push to Container Registry
- Deploy to Cloud Run

**Option B: Manual**
```bash
gcloud builds submit --config cloudbuild.yaml
```

## Step 7: Configure Custom Domain

```bash
# Map the domain
gcloud run domain-mappings create \
  --service nnp-web \
  --domain votennp.com \
  --region us-central1

# Get DNS records
gcloud run domain-mappings describe \
  --domain votennp.com \
  --region us-central1
```

Then update DNS at your registrar with the provided records.

## Verify Deployment

After deployment, check:
- GitHub Actions: https://github.com/CariHQ/nnp-web/actions
- Cloud Run Console: https://console.cloud.google.com/run
- Service URL: `gcloud run services describe nnp-web --region us-central1 --format 'value(status.url)'`

## Troubleshooting

If the workflow fails:
1. Check that all GitHub secrets are set correctly
2. Verify service account has correct permissions
3. Check Cloud Build logs in GCP Console

