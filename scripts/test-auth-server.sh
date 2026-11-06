#!/bin/bash

# Test Authentication Server

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Testing Authentication Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

# Load NVM
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

cd server

echo "1️⃣  Installing zod dependency..."
npm install zod --save
echo

echo "2️⃣  Backing up old index.ts..."
if [ -f "src/index.ts" ]; then
    mv src/index.ts src/index-old.ts
    echo "   ✅ Backup created: src/index-old.ts"
fi
echo

echo "3️⃣  Activating new server..."
mv src/index-new.ts src/index.ts
echo "   ✅ New server activated: src/index.ts"
echo

echo "4️⃣  Starting server (press Ctrl+C to stop)..."
echo
npm run dev
