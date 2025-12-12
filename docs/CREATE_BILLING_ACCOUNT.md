# Creating a New Billing Account for NNP Party

Billing accounts cannot be created via the command line. You need to create them through the Google Cloud Console.

## Steps to Create a New Billing Account

1. **Go to Google Cloud Billing Console:**
   - Visit: https://console.cloud.google.com/billing
   - Or navigate: Menu → Billing

2. **Create New Billing Account:**
   - Click "Create Account" or "+ Link a billing account"
   - Fill in the details:
     - **Account name:** NNP Party (or your preferred name)
     - **Country/Region:** Select appropriate region
     - **Payment method:** Add credit card or other payment method
     - **Contact email:** Use NNP Party's email address

3. **Note the Billing Account ID:**
   - After creation, you'll see a billing account ID (format: `01XXXX-XXXXXX-XXXXXX`)
   - Copy this ID

4. **Link to Project:**
   ```bash
   PROJECT_ID="nnp-web-1765554113"  # Your project ID
   BILLING_ACCOUNT_ID="01XXXX-XXXXXX-XXXXXX"  # The new billing account ID
   gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT_ID
   ```

## Alternative: Create via gcloud (if you have permissions)

If you have the necessary permissions, you can try:
```bash
gcloud beta billing accounts create \
  --display-name="NNP Party" \
  --open
```

However, this typically requires special permissions and may not be available in all organizations.

## After Creating the Billing Account

Once you have the billing account ID, run:
```bash
./scripts/setup-gcp-manual.sh nnp-web-1765554113 BILLING_ACCOUNT_ID
```

Or link it manually:
```bash
gcloud billing projects link nnp-web-1765554113 --billing-account=BILLING_ACCOUNT_ID
```

