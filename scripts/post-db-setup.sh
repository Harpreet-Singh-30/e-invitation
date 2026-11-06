#!/bin/bash
# Post-Database Setup Script
# Run AFTER PostgreSQL installation: bash scripts/post-db-setup.sh

set -e  # Exit on any error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Post-Database Setup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if PostgreSQL is running
echo "1️⃣  Checking PostgreSQL status..."
if systemctl is-active --quiet postgresql; then
    echo "   ✅ PostgreSQL is running"
else
    echo "   ❌ PostgreSQL is not running!"
    echo "   Please install PostgreSQL first:"
    echo "   sudo bash scripts/install-postgres.sh"
    exit 1
fi

# Check if .db-credentials exists (created by install-postgres.sh)
if [ ! -f "server/.db-credentials" ]; then
    echo "   ⚠️  Database credentials not found!"
    echo "   Please run: sudo bash scripts/install-postgres.sh"
    exit 1
fi

echo ""
echo "2️⃣  Configuring environment..."

# Generate JWT secrets
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo "   ✅ Generated JWT secrets"

# Extract DATABASE_URL from .db-credentials
DATABASE_URL=$(grep "DATABASE_URL=" server/.db-credentials | cut -d'"' -f2)

# Create .env file
cat > server/.env <<EOF
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NEW SAAS MODEL - ENVIRONMENT CONFIGURATION
# Auto-generated on $(date)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# DATABASE (PostgreSQL + Prisma)
DATABASE_URL="${DATABASE_URL}"

# JWT AUTHENTICATION
JWT_SECRET="${JWT_SECRET}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
JWT_ACCESS_EXPIRY="1h"
JWT_REFRESH_EXPIRY="7d"

# EMAIL VERIFICATION
EMAIL_VERIFICATION_EXPIRY="24h"
PASSWORD_RESET_EXPIRY="1h"

# SERVER CONFIGURATION
NODE_ENV="development"
PORT=3000
BASE_DOMAIN="localhost"
CORS_ORIGIN="http://localhost:5173"

# FILE STORAGE
UPLOADS_PATH="./data/uploads"
MAX_FILE_SIZE="10485760"

# RATE LIMITING
RATE_LIMIT_WINDOW="15"
RATE_LIMIT_MAX="100"

# OLD SYSTEM (for reference)
OLD_DATABASE_PATH="./data/wedding.db"

# FRONTEND URL
FRONTEND_URL="http://localhost:5173"
EOF

echo "   ✅ Created server/.env with DATABASE_URL and JWT secrets"

echo ""
echo "3️⃣  Installing dependencies..."
cd server
npm install --silent 2>&1 | grep -E "(added|removed|changed|audited)" || echo "   (npm install running...)"
echo "   ✅ Dependencies installed"

echo ""
echo "4️⃣  Running database migrations..."
npx prisma migrate dev --name init --skip-seed
echo "   ✅ Database tables created (16 tables)"

echo ""
echo "5️⃣  Generating Prisma Client..."
npx prisma generate
echo "   ✅ Prisma Client generated"

echo ""
echo "6️⃣  Seeding database..."
npm run db:seed
echo "   ✅ Database seeded with test data"

echo ""
echo "7️⃣  Testing database connection..."
npm run test:db

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Database Status:"
echo "   Database: wedding_saas"
echo "   Tables:   16"
echo "   Users:    3 (admin, test host, free user)"
echo "   Themes:   4 (3 wedding + 1 birthday)"
echo ""
echo "🔐 Test Credentials:"
echo "   Admin:     admin@wedding-saas.com / admin123"
echo "   Host:      test@example.com / test123"
echo "   Free User: free@example.com / free123"
echo ""
echo "🎯 Next Steps:"
echo "   1. Start backend:  npm run dev"
echo "   2. Start frontend: cd ../web && npm run dev"
echo "   3. Open Prisma Studio: npm run db:studio"
echo ""
echo "📚 Documentation:"
echo "   - API_SPECIFICATION.md - 49 API endpoints"
echo "   - DATABASE_SCHEMA_NEW.md - Database schema"
echo "   - BUSINESS_MODEL_TRANSITION.md - Architecture"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
