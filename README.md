# New National Party Website

This is a [Next.js](https://nextjs.org) project with [Payload CMS](https://payloadcms.com) integration for content management.

## Features

- **Payload CMS** for content management
- **Hero Image Slider** - Rotating hero images managed through Payload CMS
- **Stripe Payment Integration** - View and manage Stripe payments in the CMS
- **SQLite** for local development
- **Turso** for production database

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```env
# Payload CMS Configuration
PAYLOAD_SECRET=your-secret-key-change-in-production
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Database Configuration (for production with Turso)
# Leave these empty for local development (SQLite will be used automatically)
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Node Environment
NODE_ENV=development
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the site
5. Open [http://localhost:3000/admin](http://localhost:3000/admin) to access Payload CMS admin panel

### First Time Setup

1. When you first access `/admin`, you'll be prompted to create an admin user
2. After creating your admin user, you can:
   - Upload media files
   - Create hero images for the slider
   - View Stripe payments (after setting up webhooks)

## Managing Hero Images

1. Go to `/admin` and navigate to **Hero Images** collection
2. Click **Create New** to add a new hero image
3. Fill in:
   - **Title**: The heading text for the slide
   - **Image**: Upload an image (will be related to Media collection)
   - **Caption**: Optional subtitle text
   - **Link**: Optional link URL
   - **Order**: Number to control display order (lower numbers appear first)
   - **Active**: Checkbox to enable/disable the slide
4. The hero slider will automatically rotate through active images every 5 seconds

## Stripe Payments Integration

### Setting Up Webhooks

To automatically sync Stripe payments to Payload CMS:

1. In your Stripe Dashboard, go to **Developers > Webhooks**
2. Add a new endpoint: `https://your-domain.com/api/stripe-webhook`
3. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.succeeded`
   - `charge.failed`
4. Copy the webhook signing secret and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Manual Sync

You can manually sync existing Stripe payments by calling:

```bash
POST /api/sync-stripe-payments
```

This will fetch the last 100 payments from Stripe and sync them to Payload CMS.

### Viewing Payments

All synced payments are available in the Payload CMS admin under **Stripe Payments** collection. You can view:
- Payment ID
- Amount
- Status
- Customer email
- Payment method
- Description
- Metadata

## Database Configuration

### Local Development

The project uses SQLite for local development. The database file (`payload.db`) will be created automatically in the project root when you first run the app.

### Production (Turso)

For production, configure Turso:

1. Create a Turso account and database at [turso.tech](https://turso.tech)
2. Get your database URL and auth token
3. Set environment variables:
   - `TURSO_DATABASE_URL`: Your Turso database URL
   - `TURSO_AUTH_TOKEN`: Your Turso auth token
   - `NODE_ENV=production`

The app will automatically use Turso when these environment variables are set in production.

## Project Structure

```
├── payload.config.ts          # Payload CMS configuration
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── payload/       # Payload API routes
│   │   │   ├── hero-images/   # Hero images API
│   │   │   └── stripe-webhook/ # Stripe webhook handler
│   │   └── admin/             # Payload admin interface
│   └── components/
│       └── hero.tsx           # Hero slider component
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Turso Documentation](https://docs.turso.tech)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## Deploy

This project can be deployed on platforms that support Next.js server-side rendering:
- Vercel
- Netlify
- Railway
- Any Node.js hosting platform

Make sure to set all environment variables in your hosting platform's environment settings.
