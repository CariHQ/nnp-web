#!/bin/bash

# Script to create a service account for GitHub Actions
# This service account will be used to deploy to Cloud Run

set -e

PROJECT_ID="${1:-}"
SERVICE_ACCOUNT_NAME="github-actions-deployer"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Usage: $0 <PROJECT_ID>"
    exit 1
fi

echo "🔧 Creating service account for GitHub Actions..."
echo "Project: $PROJECT_ID"
echo ""

# Set the project
gcloud config set project $PROJECT_ID

# Create service account
echo "📝 Creating service account: $SERVICE_ACCOUNT_NAME"
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --display-name="GitHub Actions Cloud Run Deployer" \
    --description="Service account for deploying to Cloud Run from GitHub Actions" || true

# Grant necessary permissions
echo "🔐 Granting permissions..."

# Cloud Run Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/run.admin"

# Service Account User (to deploy as the service account)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/iam.serviceAccountUser"

# Storage Admin (for Container Registry)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/storage.admin"

# Cloud Build Service Account (for building images)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/cloudbuild.builds.editor"

# Create and download key
echo "🔑 Creating service account key..."
gcloud iam service-accounts keys create key.json \
    --iam-account=$SERVICE_ACCOUNT_EMAIL

echo ""
echo "✅ Service account created successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Add the following to GitHub Secrets:"
echo "      GCP_PROJECT_ID: $PROJECT_ID"
echo "      GCP_SA_KEY: (contents of key.json)"
echo ""
echo "   2. To add the secret via GitHub CLI:"
echo "      gh secret set GCP_PROJECT_ID --body \"$PROJECT_ID\""
echo "      gh secret set GCP_SA_KEY < key.json"
echo ""
echo "   3. Keep key.json secure and delete it after adding to GitHub"
echo ""
echo "⚠️  The key.json file contains sensitive credentials. Handle with care!"

