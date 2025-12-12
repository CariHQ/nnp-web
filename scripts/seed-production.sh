#!/bin/bash

# Seed production Turso database
# This script seeds the production database with admin user and sample data

set -e

echo "🌱 Seeding production Turso database..."
echo ""

if [ -z "$TURSO_DATABASE_URL" ]; then
  echo "❌ Error: TURSO_DATABASE_URL is not set"
  echo "Get it from: gh secret get TURSO_DATABASE_URL"
  exit 1
fi

if [ -z "$TURSO_AUTH_TOKEN" ]; then
  echo "❌ Error: TURSO_AUTH_TOKEN is not set"
  echo "Get it from: gh secret get TURSO_AUTH_TOKEN"
  exit 1
fi

echo "✅ Turso credentials found"
echo "Running seed script..."
echo ""

TURSO_DATABASE_URL=$TURSO_DATABASE_URL TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN npm run db:seed

echo ""
echo "✅ Production database seeded successfully!"
echo ""
echo "Admin credentials:"
echo "  Email: admin@votennp.com"
echo "  Password: admin123"
echo ""
echo "⚠️  IMPORTANT: Change the password after first login!"

