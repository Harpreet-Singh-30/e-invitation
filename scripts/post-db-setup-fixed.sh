#!/bin/bash

# Post-Database Setup Script (Fixed for NVM)
# This script runs after PostgreSQL database is created
# It generates secrets, creates .env, installs deps, migrates, and seeds

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Post-Database Setup Script (NVM Compatible)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

# Load NVM if available
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "📦 Loading NVM..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "   ✅ NVM loaded"
fi

# Check if node is available now
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not available"
    echo
    echo "Please install Node.js 20+ using one of these methods:"
    echo
    echo "Option 1 - Using NVM (Recommended):"
    echo "  nvm install 20"
    echo "  nvm use 20"
    echo
    echo "Option 2 - Using apt:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    echo
    echo "Then run this script again:"
    echo "  bash scripts/post-db-setup-fixed.sh"
    exit 1
fi

echo "1️⃣  Checking PostgreSQL status..."
if systemctl is-active --quiet postgresql; then
    echo "   ✅ PostgreSQL is running"
else
    echo "   ❌ PostgreSQL is not running"
    exit 1
fi
echo

echo "2️⃣  Configuring environment..."

# Read database password from credentials file
if [ -f "server/.db-credentials" ]; then
    DB_PASSWORD=$(grep "Password:" server/.db-credentials | cut -d' ' -f2)
    echo "   ✅ Database password loaded"
else
    echo "   ❌ Database credentials not found!"
    echo "   Please run: sudo bash scripts/install-postgres.sh first"
    exit 1
fi

# Generate JWT secrets using Node.js
echo "   🔐 Generating JWT secrets..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

if [ -z "$JWT_SECRET" ] || [ -z "$JWT_REFRESH_SECRET" ]; then
    echo "   ❌ Failed to generate secrets"
    exit 1
fi

echo "   ✅ JWT_SECRET generated"
echo "   ✅ JWT_REFRESH_SECRET generated"

# Create .env file
cat > server/.env << EOF
# Database Configuration
DATABASE_URL="postgresql://wedding_admin:${DB_PASSWORD}@localhost:5432/wedding_saas?schema=public"

# JWT Configuration
JWT_SECRET="${JWT_SECRET}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
JWT_ACCESS_EXPIRY="1h"
JWT_REFRESH_EXPIRY="7d"

# Server Configuration
NODE_ENV="development"
PORT=3000

# CORS Configuration
CORS_ORIGIN="http://localhost:5173"

# Email Configuration (for future use)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT=587
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"
# EMAIL_FROM="noreply@wedding-saas.com"

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR="uploads"

# Feature Flags
ENABLE_EMAIL_VERIFICATION=false
ENABLE_PAYMENTS=false
EOF

echo "   ✅ .env file created at server/.env"
echo

echo "3️⃣  Installing dependencies..."
cd server
npm install --silent
echo "   ✅ Dependencies installed"
echo

echo "4️⃣  Running Prisma migrations..."
npx prisma migrate dev --name init --skip-generate
echo "   ✅ Database schema migrated"
echo

echo "5️⃣  Generating Prisma Client..."
npx prisma generate
echo "   ✅ Prisma Client generated"
echo

echo "6️⃣  Seeding database..."
npm run db:seed
echo "   ✅ Database seeded"
echo

echo "7️⃣  Testing database connection..."
npm run test:db
echo

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "🎉 Your NEW SaaS platform is ready!"
echo
echo "📝 Configuration saved:"
echo "   - Database: wedding_saas"
echo "   - Environment: server/.env"
echo "   - Credentials: server/.db-credentials"
echo
echo "🚀 Start development servers:"
echo
echo "   Terminal 1 (Backend):"
echo "   cd server && npm run dev"
echo
echo "   Terminal 2 (Frontend):"
echo "   cd web && npm run dev"
echo
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo
echo "👤 Test Credentials:"
echo "   Admin:     admin@wedding-saas.com / admin123"
echo "   Host:      test@example.com / test123"
echo "   Free User: free@example.com / free123"
echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
