# Seeding Production Database

The production Turso database needs to be seeded with the admin user before login will work.

## Option 1: Using npm script (Recommended)

```bash
TURSO_DATABASE_URL=$(gh secret get TURSO_DATABASE_URL) \
TURSO_AUTH_TOKEN=$(gh secret get TURSO_AUTH_TOKEN) \
npm run db:seed
```

## Option 2: Using the setup script

```bash
TURSO_DATABASE_URL=$(gh secret get TURSO_DATABASE_URL) \
TURSO_AUTH_TOKEN=$(gh secret get TURSO_AUTH_TOKEN) \
./scripts/setup-turso.sh
```

## Option 3: Manual Turso CLI

If you have the Turso CLI installed:

```bash
# Get database name from URL (e.g., libsql://db-name.turso.io)
turso db execute <database-name> < drizzle/0000_spotty_silver_surfer.sql

# Then run seed script
TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npm run db:seed
```

## Admin Credentials

After seeding:
- **Email**: `admin@votennp.com`
- **Password**: `admin123`
- **Login URL**: https://nnp-web-di6y2gst3a-uc.a.run.app/admin/login

⚠️ **Important**: Change the password after first login!

