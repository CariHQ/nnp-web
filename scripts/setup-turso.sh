#!/bin/bash

# Setup script for Turso database
# This script runs migrations and seeds the database

set -e

if [ -z "$TURSO_DATABASE_URL" ]; then
  echo "❌ Error: TURSO_DATABASE_URL is not set"
  echo "Usage: TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... ./scripts/setup-turso.sh"
  exit 1
fi

if [ -z "$TURSO_AUTH_TOKEN" ]; then
  echo "❌ Error: TURSO_AUTH_TOKEN is not set"
  echo "Usage: TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... ./scripts/setup-turso.sh"
  exit 1
fi

echo "📦 Setting up Turso database..."
echo ""

# Check if turso CLI is available
if ! command -v turso &> /dev/null; then
  echo "⚠️  Turso CLI not found. Using drizzle-kit for migrations..."
  echo "Running migrations with drizzle-kit..."
  TURSO_DATABASE_URL=$TURSO_DATABASE_URL TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN npx drizzle-kit push --config=drizzle.config.ts
else
  echo "✅ Turso CLI found. Applying migrations..."
  # Apply migrations using SQL files
  for migration in drizzle/*.sql; do
    if [ -f "$migration" ]; then
      echo "Applying migration: $(basename $migration)"
      turso db execute $(echo $TURSO_DATABASE_URL | sed 's|libsql://||' | cut -d'/' -f1) --file "$migration" || echo "⚠️  Migration may have already been applied"
    fi
  done
fi

echo ""
echo "🌱 Seeding database..."
TURSO_DATABASE_URL=$TURSO_DATABASE_URL TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN npm run db:seed

echo ""
echo "✅ Turso database setup complete!"
echo ""
echo "Admin credentials:"
echo "  Email: admin@votennp.com"
echo "  Password: admin123"
echo ""
echo "⚠️  IMPORTANT: Change the admin password after first login!"

