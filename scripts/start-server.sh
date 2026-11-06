#!/bin/bash

# Simple server startup script

echo "🚀 Starting Authentication Server..."
echo

# Load NVM
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

cd server
npm run dev
