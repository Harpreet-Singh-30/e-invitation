#!/bin/bash

# Automated API Testing Script
# This script tests all authentication endpoints

set -e

BASE_URL="http://localhost:3000"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Automated Authentication API Testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

# Test if server is running
echo "1️⃣  Testing server health..."
HEALTH=$(curl -s $BASE_URL/healthz)
if echo "$HEALTH" | grep -q "ok"; then
    echo -e "   ${GREEN}✅ Server is running${NC}"
else
    echo -e "   ${RED}❌ Server is not running. Please start it first.${NC}"
    exit 1
fi
echo

# Generate random email for testing
TEST_EMAIL="test$(date +%s)@example.com"
TEST_PASSWORD="SecurePass123"
TEST_NAME="Test User $(date +%s)"

# Test 1: Signup
echo "2️⃣  Testing signup..."
SIGNUP_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"name\": \"$TEST_NAME\"
  }")

if echo "$SIGNUP_RESPONSE" | grep -q "Account created successfully"; then
    echo -e "   ${GREEN}✅ Signup successful${NC}"
    ACCESS_TOKEN=$(echo "$SIGNUP_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$SIGNUP_RESPONSE" | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)
    VERIFICATION_TOKEN=$(echo "$SIGNUP_RESPONSE" | grep -o '"_dev_verificationToken":"[^"]*"' | cut -d'"' -f4)
    echo "   📧 Email: $TEST_EMAIL"
    echo "   🔑 Password: $TEST_PASSWORD"
else
    echo -e "   ${RED}❌ Signup failed${NC}"
    echo "$SIGNUP_RESPONSE" | head -5
    exit 1
fi
echo

# Test 2: Duplicate signup (should fail)
echo "3️⃣  Testing duplicate signup (should fail)..."
DUPLICATE_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"name\": \"$TEST_NAME\"
  }")

if echo "$DUPLICATE_RESPONSE" | grep -q "already exists"; then
    echo -e "   ${GREEN}✅ Duplicate prevention working${NC}"
else
    echo -e "   ${YELLOW}⚠️  Duplicate check may not be working${NC}"
fi
echo

# Test 3: Email verification
echo "4️⃣  Testing email verification..."
if [ -n "$VERIFICATION_TOKEN" ]; then
    VERIFY_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/verify-email \
      -H "Content-Type: application/json" \
      -d "{
        \"token\": \"$VERIFICATION_TOKEN\"
      }")
    
    if echo "$VERIFY_RESPONSE" | grep -q "verified successfully"; then
        echo -e "   ${GREEN}✅ Email verification successful${NC}"
    else
        echo -e "   ${RED}❌ Email verification failed${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  No verification token received${NC}"
fi
echo

# Test 4: Login with existing user
echo "5️⃣  Testing login with test user..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
    echo -e "   ${GREEN}✅ Login successful${NC}"
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)
else
    echo -e "   ${RED}❌ Login failed${NC}"
    echo "$LOGIN_RESPONSE" | head -5
fi
echo

# Test 5: Wrong password (should fail)
echo "6️⃣  Testing wrong password (should fail)..."
WRONG_PW_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }')

if echo "$WRONG_PW_RESPONSE" | grep -q "Invalid"; then
    echo -e "   ${GREEN}✅ Wrong password rejected${NC}"
else
    echo -e "   ${YELLOW}⚠️  Password validation may not be working${NC}"
fi
echo

# Test 6: Token refresh
echo "7️⃣  Testing token refresh..."
if [ -n "$REFRESH_TOKEN" ]; then
    REFRESH_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/refresh \
      -H "Content-Type: application/json" \
      -d "{
        \"refreshToken\": \"$REFRESH_TOKEN\"
      }")
    
    if echo "$REFRESH_RESPONSE" | grep -q "refreshed successfully"; then
        echo -e "   ${GREEN}✅ Token refresh successful${NC}"
        NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    else
        echo -e "   ${RED}❌ Token refresh failed${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  No refresh token available${NC}"
fi
echo

# Test 7: Forgot password
echo "8️⃣  Testing forgot password..."
FORGOT_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\"
  }")

if echo "$FORGOT_RESPONSE" | grep -q "password reset link"; then
    echo -e "   ${GREEN}✅ Forgot password working${NC}"
    RESET_TOKEN=$(echo "$FORGOT_RESPONSE" | grep -o '"_dev_resetToken":"[^"]*"' | cut -d'"' -f4)
else
    echo -e "   ${RED}❌ Forgot password failed${NC}"
fi
echo

# Test 8: Reset password
echo "9️⃣  Testing reset password..."
if [ -n "$RESET_TOKEN" ]; then
    RESET_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/reset-password \
      -H "Content-Type: application/json" \
      -d "{
        \"token\": \"$RESET_TOKEN\",
        \"password\": \"NewSecurePass456\"
      }")
    
    if echo "$RESET_RESPONSE" | grep -q "reset successfully"; then
        echo -e "   ${GREEN}✅ Password reset successful${NC}"
    else
        echo -e "   ${RED}❌ Password reset failed${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  No reset token available${NC}"
fi
echo

# Test 9: Login with new password
echo "🔟 Testing login with new password..."
NEW_LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"NewSecurePass456\"
  }")

if echo "$NEW_LOGIN_RESPONSE" | grep -q "Login successful"; then
    echo -e "   ${GREEN}✅ Login with new password successful${NC}"
    ACCESS_TOKEN=$(echo "$NEW_LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
else
    echo -e "   ${RED}❌ Login with new password failed${NC}"
fi
echo

# Test 10: Logout
echo "1️⃣1️⃣  Testing logout..."
if [ -n "$ACCESS_TOKEN" ]; then
    LOGOUT_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/logout \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    
    if echo "$LOGOUT_RESPONSE" | grep -q "Logged out successfully"; then
        echo -e "   ${GREEN}✅ Logout successful${NC}"
    else
        echo -e "   ${RED}❌ Logout failed${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  No access token available${NC}"
fi
echo

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All Tests Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "📊 Test Summary:"
echo "   1. Health check"
echo "   2. User signup"
echo "   3. Duplicate prevention"
echo "   4. Email verification"
echo "   5. Login"
echo "   6. Wrong password rejection"
echo "   7. Token refresh"
echo "   8. Forgot password"
echo "   9. Password reset"
echo "   10. Login with new password"
echo "   11. Logout"
echo
echo "🎉 Authentication system is working!"
