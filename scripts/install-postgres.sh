#!/bin/bash
# PostgreSQL Installation and Setup Script for NEW SaaS Model
# Run with: sudo bash scripts/install-postgres.sh

set -e  # Exit on any error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗄️  PostgreSQL Installation for Wedding Invitation SaaS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo "❌ Please run with sudo: sudo bash scripts/install-postgres.sh"
   exit 1
fi

echo "📦 Step 1: Updating package list..."
apt update -qq

echo "📥 Step 2: Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

echo "🚀 Step 3: Starting PostgreSQL service..."
systemctl start postgresql
systemctl enable postgresql

echo "✅ PostgreSQL installed and running!"
echo ""

# Generate a random password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

echo "🔐 Step 4: Creating database and user..."
sudo -u postgres psql <<EOF
-- Create database
CREATE DATABASE wedding_saas;

-- Create user with password
CREATE USER wedding_admin WITH PASSWORD '${DB_PASSWORD}';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE wedding_saas TO wedding_admin;
ALTER DATABASE wedding_saas OWNER TO wedding_admin;

-- Connect to database and grant schema permissions
\c wedding_saas
GRANT ALL ON SCHEMA public TO wedding_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO wedding_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO wedding_admin;

-- Display info
\l wedding_saas
\du wedding_admin
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ PostgreSQL Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Database Details:"
echo "   Database: wedding_saas"
echo "   User:     wedding_admin"
echo "   Password: ${DB_PASSWORD}"
echo ""
echo "⚠️  IMPORTANT: Save this password securely!"
echo ""
echo "📝 Next Steps:"
echo "   1. Copy the DATABASE_URL below to server/.env"
echo "   2. Run: cd server && npm install -D prisma @prisma/client"
echo "   3. Run: npx prisma migrate dev --name init"
echo "   4. Run: npx prisma generate"
echo "   5. Run: npm run db:seed"
echo ""
echo "🔗 DATABASE_URL:"
echo "   DATABASE_URL=\"postgresql://wedding_admin:${DB_PASSWORD}@localhost:5432/wedding_saas?schema=public\""
echo ""
echo "🧪 Test Connection:"
echo "   psql -U wedding_admin -d wedding_saas -h localhost"
echo "   (Enter password when prompted: ${DB_PASSWORD})"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Save credentials to a file (only readable by owner)
CREDS_FILE="/home/harpreet/E-invetation/server/.db-credentials"
cat > "$CREDS_FILE" <<EOF
# PostgreSQL Credentials - Generated $(date)
# DO NOT COMMIT THIS FILE TO GIT

DATABASE_URL="postgresql://wedding_admin:${DB_PASSWORD}@localhost:5432/wedding_saas?schema=public"

# Database: wedding_saas
# User: wedding_admin
# Password: ${DB_PASSWORD}
# Host: localhost
# Port: 5432
EOF

chmod 600 "$CREDS_FILE"
chown harpreet:harpreet "$CREDS_FILE"

echo "💾 Credentials saved to: server/.db-credentials"
echo "   (File is secure - only you can read it)"
echo ""
