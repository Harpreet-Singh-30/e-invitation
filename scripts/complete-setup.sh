#!/bin/bash
# ONE-COMMAND COMPLETE SETUP
# Run this script to set up everything: bash scripts/complete-setup.sh

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 COMPLETE SETUP - Wedding Invitation SaaS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will:"
echo "  1. Install PostgreSQL (requires sudo)"
echo "  2. Configure environment"
echo "  3. Install dependencies"
echo "  4. Run migrations"
echo "  5. Seed database"
echo "  6. Test connection"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

# Step 1: Install PostgreSQL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: PostgreSQL Installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL already installed"
    psql --version
else
    echo "📦 Installing PostgreSQL (requires sudo password)..."
    sudo bash scripts/install-postgres.sh
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2-7: Post-Installation Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run post-setup (no sudo needed)
bash scripts/post-db-setup.sh

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 COMPLETE SETUP FINISHED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Start Development:"
echo "   Terminal 1: cd server && npm run dev"
echo "   Terminal 2: cd web && npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Frontend:      http://localhost:5173"
echo "   Backend API:   http://localhost:3000"
echo "   Prisma Studio: http://localhost:5555 (run: npm run db:studio)"
echo ""
