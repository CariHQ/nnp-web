#!/bin/bash

# Script to set up GCP project and deploy to Cloud Run
# Run this script to create a new GCP project and set up Cloud Run

set -e

PROJECT_ID="nnp-web-$(date +%s)"
BILLING_ACCOUNT_ID=""
REGION="us-central1"
SERVICE_NAME="nnp-web"

echo "🚀 Setting up GCP project for NNP Web"
echo "======================================"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it from:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get billing account ID if not provided
if [ -z "$BILLING_ACCOUNT_ID" ]; then
    echo "📋 Available billing accounts:"
    gcloud billing accounts list
    echo ""
    read -p "Enter the billing account ID to use (or press Enter to set up later): " BILLING_ACCOUNT_ID
fi

# Create new project
echo "📦 Creating new GCP project: $PROJECT_ID"
gcloud projects create $PROJECT_ID --name="NNP Web"

# Set the project as active
echo "🔧 Setting active project..."
gcloud config set project $PROJECT_ID

# Link billing account if provided
if [ -n "$BILLING_ACCOUNT_ID" ]; then
    echo "💳 Linking billing account..."
    gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT_ID
else
    echo "⚠️  Billing account not linked. You'll need to link it manually:"
    echo "   gcloud billing projects link $PROJECT_ID --billing-account=BILLING_ACCOUNT_ID"
fi

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com

# Create Cloud Build trigger (optional - for automatic deployments)
echo "⚙️  Setting up Cloud Build..."
echo ""
echo "✅ Project setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Link billing account (if not done):"
echo "      gcloud billing projects link $PROJECT_ID --billing-account=BILLING_ACCOUNT_ID"
echo ""
echo "   2. Build and deploy:"
echo "      gcloud builds submit --config cloudbuild.yaml"
echo ""
echo "   3. Or use the GitHub Actions workflow (recommended)"
echo ""
echo "📋 Project ID: $PROJECT_ID"
echo "🌍 Region: $REGION"
echo "🚀 Service: $SERVICE_NAME"

