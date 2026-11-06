#!/bin/bash

# Reset Database Password Script

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Resetting Database Password"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

# Generate a new secure password
NEW_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-25)

echo "📝 New password generated: $NEW_PASSWORD"
echo

# Reset the password in PostgreSQL
echo "🔧 Updating password in PostgreSQL..."
sudo -u postgres psql << EOF
ALTER USER wedding_admin WITH PASSWORD '$NEW_PASSWORD';
EOF

echo "   ✅ Password updated in database"
echo

# Update the credentials file
cat > server/.db-credentials << EOF
# PostgreSQL Credentials - Updated $(date)
# DO NOT COMMIT THIS FILE TO GIT

DATABASE_URL="postgresql://wedding_admin:${NEW_PASSWORD}@localhost:5432/wedding_saas?schema=public"

# Database: wedding_saas
# User: wedding_admin
# Password: ${NEW_PASSWORD}
# Host: localhost
# Port: 5432
EOF

echo "   ✅ Credentials file updated"
echo

# Test the connection
echo "🧪 Testing connection..."
PGPASSWORD="$NEW_PASSWORD" psql -U wedding_admin -d wedding_saas -h localhost -c "SELECT 'Connection successful!' as status;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "   ✅ Connection test passed!"
    echo
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Password Reset Complete!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo
    echo "📋 New Database URL:"
    echo "   postgresql://wedding_admin:${NEW_PASSWORD}@localhost:5432/wedding_saas"
    echo
    echo "🚀 Now run the setup script:"
    echo "   bash scripts/post-db-setup-fixed.sh"
    echo
else
    echo "   ❌ Connection test failed"
    exit 1
fi
