#!/bin/bash

# Fix Migration Issue - Grant CREATEDB and Run Migration

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Fixing Migration Issue"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "STEP 1: Grant CREATEDB permission"
echo "Run this command:"
echo
echo "sudo -u postgres psql -c \"ALTER USER wedding_admin CREATEDB;\""
echo
read -p "Press ENTER after running the above command..."
echo

# Load NVM
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

cd server

echo "🗄️ Running Prisma migrations..."
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo "✅ Migrations complete!"
    echo
    
    echo "🌱 Seeding database..."
    npm run db:seed
    echo
    
    echo "🧪 Testing database..."
    npm run test:db
    echo
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Setup Complete!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo
    echo "🚀 Start development servers:"
    echo
    echo "   Terminal 1: cd server && npm run dev"
    echo "   Terminal 2: cd web && npm run dev"
    echo
    echo "👤 Test Credentials:"
    echo "   admin@wedding-saas.com / admin123"
    echo "   test@example.com / test123"
    echo
else
    echo "❌ Migration failed"
    exit 1
fi
