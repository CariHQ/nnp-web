#!/bin/bash

# Script to set up Workload Identity Federation for GitHub Actions
# This is more secure than service account keys

set -e

PROJECT_ID="${1:-}"
SERVICE_ACCOUNT_NAME="github-actions-deployer"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
POOL_NAME="github-actions-pool"
PROVIDER_NAME="github-provider"
REPO="CariHQ/nnp-web"

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Usage: $0 <PROJECT_ID>"
    exit 1
fi

echo "🔧 Setting up Workload Identity Federation for GitHub Actions..."
echo "Project: $PROJECT_ID"
echo ""

# Set the project
gcloud config set project $PROJECT_ID

# Create service account if it doesn't exist
echo "📝 Checking service account: $SERVICE_ACCOUNT_NAME"
if ! gcloud iam service-accounts describe $SERVICE_ACCOUNT_EMAIL &>/dev/null; then
    echo "Creating service account..."
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
        --display-name="GitHub Actions Cloud Run Deployer" \
        --description="Service account for deploying to Cloud Run from GitHub Actions"
fi

# Grant necessary permissions
echo "🔐 Granting permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/run.admin" --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/iam.serviceAccountUser" --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/storage.admin" --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/cloudbuild.builds.editor" --quiet

# Enable IAM API
echo "🔌 Enabling IAM API..."
gcloud services enable iamcredentials.googleapis.com --quiet

# Create Workload Identity Pool
echo "🏊 Creating Workload Identity Pool..."
if ! gcloud iam workload-identity-pools describe $POOL_NAME \
    --location="global" \
    --project=$PROJECT_ID &>/dev/null; then
    gcloud iam workload-identity-pools create $POOL_NAME \
        --location="global" \
        --display-name="GitHub Actions Pool" \
        --project=$PROJECT_ID
else
    echo "Pool already exists"
fi

# Create Workload Identity Provider
echo "🔗 Creating Workload Identity Provider..."
if ! gcloud iam workload-identity-pools providers describe $PROVIDER_NAME \
    --workload-identity-pool=$POOL_NAME \
    --location="global" \
    --project=$PROJECT_ID &>/dev/null; then
    gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
        --workload-identity-pool=$POOL_NAME \
        --location="global" \
        --issuer-uri="https://token.actions.githubusercontent.com" \
        --allowed-audiences="https://token.actions.githubusercontent.com" \
        --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
        --attribute-condition="assertion.repository=='${REPO}'" \
        --project=$PROJECT_ID
else
    echo "Provider already exists"
fi

# Get the provider resource name
PROVIDER_RESOURCE="projects/$PROJECT_ID/locations/global/workloadIdentityPools/$POOL_NAME/providers/$PROVIDER_NAME"

# Allow GitHub Actions to impersonate the service account
echo "🔓 Allowing GitHub Actions to impersonate service account..."
gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT_EMAIL \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/$PROJECT_ID/locations/global/workloadIdentityPools/$POOL_NAME/attribute.repository/${REPO}" \
    --project=$PROJECT_ID

echo ""
echo "✅ Workload Identity Federation setup complete!"
echo ""
echo "📋 Configuration for GitHub Actions:"
echo "   PROJECT_ID: $PROJECT_ID"
echo "   SERVICE_ACCOUNT: $SERVICE_ACCOUNT_EMAIL"
echo "   WORKLOAD_IDENTITY_PROVIDER: $PROVIDER_RESOURCE"
echo ""
echo "📝 Next steps:"
echo "   1. Update .github/workflows/deploy-gcp.yml to use Workload Identity"
echo "   2. Add GitHub secret:"
echo "      gh secret set GCP_PROJECT_ID --body \"$PROJECT_ID\""
echo "      gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER --body \"$PROVIDER_RESOURCE\""
echo "      gh secret set GCP_SERVICE_ACCOUNT --body \"$SERVICE_ACCOUNT_EMAIL\""

