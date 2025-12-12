#!/bin/bash

# Manual setup script - run this after authenticating with gcloud
# Usage: ./scripts/setup-gcp-manual.sh <PROJECT_ID> [BILLING_ACCOUNT_ID]

set -e

PROJECT_ID="${1:-}"
BILLING_ACCOUNT_ID="${2:-}"
REGION="us-central1"
SERVICE_NAME="nnp-web"

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Usage: $0 <PROJECT_ID> [BILLING_ACCOUNT_ID]"
    echo ""
    echo "First, authenticate:"
    echo "  gcloud auth login"
    echo ""
    echo "Then create a project:"
    echo "  PROJECT_ID=\"nnp-web-\$(date +%s | cut -c1-10)\""
    echo "  gcloud projects create \$PROJECT_ID --name=\"NNP Web\""
    echo ""
    echo "Then run this script:"
    echo "  $0 \$PROJECT_ID [BILLING_ACCOUNT_ID]"
    exit 1
fi

echo "🚀 Setting up GCP project for NNP Web"
echo "======================================"
echo "Project ID: $PROJECT_ID"
echo ""

# Set the project as active
echo "🔧 Setting active project..."
gcloud config set project $PROJECT_ID

# Link billing account if provided
if [ -n "$BILLING_ACCOUNT_ID" ]; then
    echo "💳 Linking billing account..."
    gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT_ID
else
    echo "⚠️  Billing account not provided. Listing available accounts:"
    gcloud billing accounts list
    echo ""
    read -p "Enter billing account ID (or press Enter to skip): " BILLING_ACCOUNT_ID
    if [ -n "$BILLING_ACCOUNT_ID" ]; then
        gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT_ID
    else
        echo "⚠️  Billing account not linked. You'll need to link it manually:"
        echo "   gcloud billing projects link $PROJECT_ID --billing-account=BILLING_ACCOUNT_ID"
    fi
fi

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com

echo ""
echo "✅ Project setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Create service account:"
echo "      ./scripts/create-gcp-service-account.sh $PROJECT_ID"
echo ""
echo "   2. Add GitHub secrets (see output from service account script)"
echo ""
echo "   3. Deploy:"
echo "      gcloud builds submit --config cloudbuild.yaml"
echo "      OR push to main branch to trigger GitHub Actions"
echo ""
echo "📋 Project ID: $PROJECT_ID"
echo "🌍 Region: $REGION"
echo "🚀 Service: $SERVICE_NAME"

