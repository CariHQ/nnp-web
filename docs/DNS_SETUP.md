# DNS Configuration for votennp.com

This guide explains how to configure DNS to point `votennp.com` to your GCP Cloud Run service.

## Prerequisites

- GCP Cloud Run service deployed and running
- Access to your domain registrar's DNS settings
- Domain `votennp.com` registered

## Step 1: Map Domain in Cloud Run

1. **Get your Cloud Run service URL:**
   ```bash
   gcloud run services describe nnp-web --region us-central1 --format 'value(status.url)'
   ```

2. **Create domain mapping:**
   ```bash
   gcloud run domain-mappings create \
     --service nnp-web \
     --domain votennp.com \
     --region us-central1
   ```

3. **Verify domain mapping:**
   ```bash
   gcloud run domain-mappings describe \
     --domain votennp.com \
     --region us-central1
   ```

   This will show you the DNS records you need to add.

## Step 2: Update DNS Records

Cloud Run will provide you with DNS records. Typically, you'll see:

### Option A: CNAME Record (Recommended)

- **Type:** CNAME
- **Name:** @ (or leave blank for root domain)
- **Value:** The provided Cloud Run domain (e.g., `ghs.googlehosted.com` or similar)
- **TTL:** 3600 (or default)

### Option B: A Records

If CNAME is not supported for the root domain, Cloud Run will provide A records:
- **Type:** A
- **Name:** @ (or leave blank)
- **Value:** IP addresses provided by Cloud Run
- **TTL:** 3600

### Option C: Subdomain (Alternative)

If you prefer to use a subdomain:
- **Type:** CNAME
- **Name:** www
- **Value:** The provided Cloud Run domain

## Step 3: Update DNS at Your Registrar

1. Log in to your domain registrar (where you purchased `votennp.com`)
2. Navigate to DNS Management / DNS Settings
3. Add or update the DNS records as provided by Cloud Run
4. Save changes

## Step 4: Verify DNS Propagation

Wait for DNS propagation (usually 5 minutes to 48 hours):

```bash
# Check DNS records
dig votennp.com
nslookup votennp.com

# Check if domain mapping is active
gcloud run domain-mappings describe \
  --domain votennp.com \
  --region us-central1
```

## Step 5: SSL Certificate

Cloud Run automatically provisions SSL certificates for custom domains. The certificate will be active once:
1. DNS records are correctly configured
2. DNS has propagated
3. Cloud Run has verified domain ownership

This process can take up to 24 hours.

## Troubleshooting

### DNS not resolving
- Verify DNS records are correct
- Check TTL and wait for propagation
- Use `dig` or `nslookup` to verify records

### SSL certificate not issued
- Ensure DNS is correctly configured
- Wait up to 24 hours for certificate provisioning
- Check Cloud Run domain mapping status

### Domain mapping shows "Pending"
- Verify DNS records are added correctly
- Wait for DNS propagation
- Re-check the DNS records provided by Cloud Run

## Common DNS Providers

### GoDaddy
1. Go to DNS Management
2. Add/Edit records
3. Select CNAME or A record
4. Enter values from Cloud Run

### Namecheap
1. Go to Domain List → Manage
2. Advanced DNS
3. Add new record
4. Enter values from Cloud Run

### Google Domains
1. Go to DNS settings
2. Add custom resource records
3. Enter values from Cloud Run

### Cloudflare
1. Go to DNS settings
2. Add record
3. Enter values from Cloud Run
4. **Important:** Set proxy status to "DNS only" (gray cloud) initially, then enable proxy after verification

## Additional Notes

- **WWW redirect:** You may want to set up www.votennp.com to redirect to votennp.com
- **HTTPS:** Cloud Run automatically provides HTTPS
- **Subdomains:** You can add additional subdomains using the same process

