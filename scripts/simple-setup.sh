#!/bin/bash

# Simple Manual Setup - No Password Complications

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Simple Manual Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "STEP 1: Reset database password"
echo "Run this command:"
echo
echo "sudo -u postgres psql -c \"ALTER USER wedding_admin WITH PASSWORD 'admin123';\""
echo
read -p "Press ENTER after running the above command..."
echo

# Test connection
echo "Testing connection..."
PGPASSWORD="admin123" psql -U wedding_admin -d wedding_saas -h localhost -c "SELECT 'SUCCESS' as test;" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Connection failed. Please make sure you ran the command above."
    exit 1
fi

echo "✅ Connection successful!"
echo

# Load NVM
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Generate JWT secrets
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Create .env file
cat > server/.env << EOF
DATABASE_URL="postgresql://wedding_admin:admin123@localhost:5432/wedding_saas?schema=public"
JWT_SECRET="${JWT_SECRET}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
JWT_ACCESS_EXPIRY="1h"
JWT_REFRESH_EXPIRY="7d"
NODE_ENV="development"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
MAX_FILE_SIZE=5242880
UPLOAD_DIR="uploads"
ENABLE_EMAIL_VERIFICATION=false
ENABLE_PAYMENTS=false
EOF

echo "✅ .env file created"
echo

cd server

echo "Installing dependencies..."
npm install --silent
echo "✅ Dependencies installed"
echo

echo "Running migrations..."
npx prisma migrate dev --name init --skip-generate
echo "✅ Migrations complete"
echo

echo "Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo

echo "Seeding database..."
npm run db:seed
echo "✅ Database seeded"
echo

echo "Testing database..."
npm run test:db
echo

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
