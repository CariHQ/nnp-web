# GCP Cloud Run Deployment Setup

This guide will help you set up a new GCP project and deploy the NNP Web application to Cloud Run with a separate billing account.

## Prerequisites

1. Google Cloud SDK (`gcloud`) installed
2. Access to create a new GCP project
3. A billing account (or permission to create one)

## Step 1: Create GCP Project and Billing Account

### Option A: Using the Setup Script

```bash
chmod +x scripts/setup-gcp.sh
./scripts/setup-gcp.sh
```

The script will:
- Create a new GCP project
- Prompt you to link a billing account
- Enable required APIs
- Provide next steps

### Option B: Manual Setup

1. **Create a new GCP project:**
   ```bash
   PROJECT_ID="nnp-web-$(date +%s)"
   gcloud projects create $PROJECT_ID --name="NNP Web"
   gcloud config set project $PROJECT_ID
   ```

2. **Create or select a billing account:**
   - Go to [GCP Billing Console](https://console.cloud.google.com/billing)
   - Create a new billing account for NNP Party
   - Note the billing account ID

3. **Link billing account:**
   ```bash
   gcloud billing projects link $PROJECT_ID --billing-account=BILLING_ACCOUNT_ID
   ```

4. **Enable required APIs:**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

## Step 2: Create Service Account for GitHub Actions

```bash
chmod +x scripts/create-gcp-service-account.sh
./scripts/create-gcp-service-account.sh $PROJECT_ID
```

This will create a service account and download a key file (`key.json`).

## Step 3: Add GitHub Secrets

Add the following secrets to your GitHub repository:

```bash
# Using GitHub CLI
gh secret set GCP_PROJECT_ID --body "YOUR_PROJECT_ID"
gh secret set GCP_SA_KEY < key.json
gh secret set AUTH_SECRET --body "your-auth-secret-key"
```

Or via GitHub web interface:
- Go to Settings → Secrets and variables → Actions
- Add:
  - `GCP_PROJECT_ID`: Your GCP project ID
  - `GCP_SA_KEY`: Contents of `key.json`
  - `AUTH_SECRET`: A random secret for authentication

**⚠️ Important:** Delete `key.json` after adding it to GitHub for security.

## Step 4: Deploy to Cloud Run

### Automatic Deployment (via GitHub Actions)

Once you push to the `main` branch, the GitHub Actions workflow will automatically:
1. Build the Docker image
2. Push to Container Registry
3. Deploy to Cloud Run

### Manual Deployment

```bash
# Build and deploy
gcloud builds submit --config cloudbuild.yaml

# Or build and deploy manually
docker build -t gcr.io/$PROJECT_ID/nnp-web:latest .
docker push gcr.io/$PROJECT_ID/nnp-web:latest
gcloud run deploy nnp-web \
  --image gcr.io/$PROJECT_ID/nnp-web:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

## Step 5: Configure Custom Domain

1. **Get the Cloud Run service URL:**
   ```bash
   gcloud run services describe nnp-web --region us-central1 --format 'value(status.url)'
   ```

2. **Map custom domain in Cloud Run:**
   ```bash
   gcloud run domain-mappings create \
     --service nnp-web \
     --domain votennp.com \
     --region us-central1
   ```

3. **Update DNS records:**
   
   Cloud Run will provide DNS records to add. Typically:
   - **Type:** CNAME
   - **Name:** @ (or votennp.com)
   - **Value:** The provided Cloud Run domain mapping

   Or if using A records:
   - Add the A records provided by Cloud Run

4. **Verify DNS:**
   ```bash
   gcloud run domain-mappings describe --domain votennp.com --region us-central1
   ```

## Step 6: Update DNS at Your Domain Registrar

1. Log in to your domain registrar (where you purchased `votennp.com`)
2. Go to DNS settings
3. Update the DNS records as provided by Cloud Run domain mapping
4. Wait for DNS propagation (can take up to 48 hours, usually much faster)

## Monitoring and Logs

- **View logs:**
  ```bash
  gcloud run services logs read nnp-web --region us-central1
  ```

- **View in console:**
  - [Cloud Run Console](https://console.cloud.google.com/run)
  - [Cloud Logging](https://console.cloud.google.com/logs)

## Cost Management

Cloud Run pricing:
- **Free tier:** 2 million requests/month, 360,000 GB-seconds, 180,000 vCPU-seconds
- **After free tier:** Pay per use (requests, CPU, memory, networking)

To set up billing alerts:
1. Go to [Billing Console](https://console.cloud.google.com/billing)
2. Select your billing account
3. Set up budget alerts

## Troubleshooting

### Build fails
- Check that all required APIs are enabled
- Verify service account has correct permissions
- Check Cloud Build logs in GCP Console

### Deployment fails
- Verify service account has `roles/run.admin`
- Check that the Docker image was built successfully
- Review Cloud Run logs

### DNS not working
- Verify domain mapping is active in Cloud Run
- Check DNS records are correct
- Wait for DNS propagation (use `dig` or `nslookup` to check)

## Security Notes

- The service account key (`key.json`) should be kept secure
- Never commit `key.json` to version control
- Rotate service account keys periodically
- Use least-privilege IAM roles

