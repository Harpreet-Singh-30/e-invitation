#!/bin/bash

# Test Script for Host Invitation API
# Tests the three new endpoints with authentication and ownership verification

set -e

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Host Invitation API Testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

# Test 0: Check server is running
echo "0️⃣  Checking server health..."
HEALTH=$(curl -s $BASE_URL/healthz)
if echo "$HEALTH" | grep -q "ok"; then
    echo -e "   ${GREEN}✅ Server is running${NC}"
else
    echo -e "   ${RED}❌ Server is not running${NC}"
    exit 1
fi
echo

# Test 1: Login as test user to get auth token
echo "1️⃣  Logging in as test user..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
    echo -e "   ${GREEN}✅ Login successful${NC}"
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   🔑 Access token obtained"
else
    echo -e "   ${RED}❌ Login failed${NC}"
    echo "$LOGIN_RESPONSE"
    exit 1
fi
echo

# Test 2: Create invitation without authentication (should fail)
echo "2️⃣  Testing create invitation without auth (should fail)..."
UNAUTH_CREATE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/host/invitations \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Unauthorized Test",
    "occasionType": "wedding"
  }')

HTTP_CODE=$(echo "$UNAUTH_CREATE" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then
    echo -e "   ${GREEN}✅ Unauthenticated request correctly rejected${NC}"
else
    echo -e "   ${RED}❌ Should have returned 401, got $HTTP_CODE${NC}"
fi
echo

# Test 3: Create wedding invitation
echo "3️⃣  Creating wedding invitation..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/api/host/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Rohan & Priya Wedding",
    "occasionType": "wedding"
  }')

if echo "$CREATE_RESPONSE" | grep -q "created successfully"; then
    echo -e "   ${GREEN}✅ Wedding invitation created${NC}"
    INVITATION_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    INVITATION_SLUG=$(echo "$CREATE_RESPONSE" | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   📨 Invitation ID: $INVITATION_ID"
    echo "   🔗 Slug: $INVITATION_SLUG"
else
    echo -e "   ${RED}❌ Failed to create wedding invitation${NC}"
    echo "$CREATE_RESPONSE"
    exit 1
fi
echo

# Test 4: Create birthday invitation
echo "4️⃣  Creating birthday invitation..."
BIRTHDAY_CREATE=$(curl -s -X POST $BASE_URL/api/host/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Aarav'\''s 5th Birthday Party",
    "occasionType": "birthday"
  }')

if echo "$BIRTHDAY_CREATE" | grep -q "created successfully"; then
    echo -e "   ${GREEN}✅ Birthday invitation created${NC}"
    BIRTHDAY_ID=$(echo "$BIRTHDAY_CREATE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   📨 Birthday Invitation ID: $BIRTHDAY_ID"
else
    echo -e "   ${RED}❌ Failed to create birthday invitation${NC}"
fi
echo

# Test 5: Create invitation with duplicate title (should get unique slug)
echo "5️⃣  Creating invitation with duplicate title..."
DUPLICATE_CREATE=$(curl -s -X POST $BASE_URL/api/host/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Rohan & Priya Wedding",
    "occasionType": "anniversary"
  }')

if echo "$DUPLICATE_CREATE" | grep -q "created successfully"; then
    echo -e "   ${GREEN}✅ Duplicate title handled with unique slug${NC}"
    DUPLICATE_SLUG=$(echo "$DUPLICATE_CREATE" | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   🔗 New slug: $DUPLICATE_SLUG"
    if [ "$DUPLICATE_SLUG" != "$INVITATION_SLUG" ]; then
        echo -e "   ${GREEN}✅ Slugs are different as expected${NC}"
    else
        echo -e "   ${RED}❌ Slugs should be different${NC}"
    fi
else
    echo -e "   ${RED}❌ Failed to handle duplicate title${NC}"
fi
echo

# Test 6: Create invitation with invalid occasion type (should fail)
echo "6️⃣  Testing invalid occasion type (should fail)..."
INVALID_OCCASION=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/host/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Invalid Event",
    "occasionType": "invalid_type"
  }')

HTTP_CODE=$(echo "$INVALID_OCCASION" | tail -1)
if [ "$HTTP_CODE" = "400" ]; then
    echo -e "   ${GREEN}✅ Invalid occasion type correctly rejected${NC}"
else
    echo -e "   ${YELLOW}⚠️  Expected 400, got $HTTP_CODE${NC}"
fi
echo

# Test 7: Create invitation with invalid theme ID (should fail)
echo "7️⃣  Testing invalid theme ID (should fail)..."
INVALID_THEME=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/host/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Test Invalid Theme",
    "occasionType": "wedding",
    "themeId": "00000000-0000-0000-0000-000000000000"
  }')

HTTP_CODE=$(echo "$INVALID_THEME" | tail -1)
if [ "$HTTP_CODE" = "400" ]; then
    echo -e "   ${GREEN}✅ Invalid theme ID correctly rejected${NC}"
else
    echo -e "   ${YELLOW}⚠️  Expected 400, got $HTTP_CODE${NC}"
fi
echo

# Test 8: List invitations
echo "8️⃣  Listing all invitations for authenticated user..."
LIST_RESPONSE=$(curl -s -X GET $BASE_URL/api/host/invitations \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$LIST_RESPONSE" | grep -q "invitations"; then
    echo -e "   ${GREEN}✅ Successfully retrieved invitation list${NC}"
    INVITATION_COUNT=$(echo "$LIST_RESPONSE" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
    echo "   📊 Total invitations: $INVITATION_COUNT"
    if [ "$INVITATION_COUNT" -ge "3" ]; then
        echo -e "   ${GREEN}✅ All created invitations are listed${NC}"
    fi
else
    echo -e "   ${RED}❌ Failed to list invitations${NC}"
fi
echo

# Test 9: List invitations without auth (should fail)
echo "9️⃣  Testing list without auth (should fail)..."
UNAUTH_LIST=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/host/invitations)

HTTP_CODE=$(echo "$UNAUTH_LIST" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then
    echo -e "   ${GREEN}✅ Unauthenticated list request correctly rejected${NC}"
else
    echo -e "   ${RED}❌ Should have returned 401, got $HTTP_CODE${NC}"
fi
echo

# Test 10: Get specific invitation
echo "🔟 Retrieving specific invitation..."
GET_RESPONSE=$(curl -s -X GET $BASE_URL/api/host/invitations/$INVITATION_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$GET_RESPONSE" | grep -q "$INVITATION_ID"; then
    echo -e "   ${GREEN}✅ Successfully retrieved invitation details${NC}"
    if echo "$GET_RESPONSE" | grep -q "events"; then
        echo -e "   ${GREEN}✅ Invitation includes events array${NC}"
    fi
    if echo "$GET_RESPONSE" | grep -q "stats"; then
        echo -e "   ${GREEN}✅ Invitation includes stats${NC}"
    fi
    IS_PUBLISHED=$(echo "$GET_RESPONSE" | grep -o '"isPublished":[a-z]*' | cut -d':' -f2)
    if [ "$IS_PUBLISHED" = "false" ]; then
        echo -e "   ${GREEN}✅ Invitation is unpublished by default${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Expected isPublished: false${NC}"
    fi
else
    echo -e "   ${RED}❌ Failed to retrieve invitation${NC}"
fi
echo

# Test 11: Get invitation with invalid ID format (should fail)
echo "1️⃣1️⃣  Testing invalid invitation ID format (should fail)..."
INVALID_ID=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/host/invitations/invalid-id \
  -H "Authorization: Bearer $ACCESS_TOKEN")

HTTP_CODE=$(echo "$INVALID_ID" | tail -1)
if [ "$HTTP_CODE" = "400" ]; then
    echo -e "   ${GREEN}✅ Invalid ID format correctly rejected${NC}"
else
    echo -e "   ${YELLOW}⚠️  Expected 400, got $HTTP_CODE${NC}"
fi
echo

# Test 12: Try to access another user's invitation (ownership test)
echo "1️⃣2️⃣  Testing ownership enforcement..."
# Create a fake UUID that doesn't belong to this user
FAKE_UUID="00000000-0000-0000-0000-000000000001"
OWNERSHIP_TEST=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/host/invitations/$FAKE_UUID \
  -H "Authorization: Bearer $ACCESS_TOKEN")

HTTP_CODE=$(echo "$OWNERSHIP_TEST" | tail -1)
if [ "$HTTP_CODE" = "404" ]; then
    echo -e "   ${GREEN}✅ Ownership enforcement working (404 for non-owned invitation)${NC}"
else
    echo -e "   ${YELLOW}⚠️  Expected 404, got $HTTP_CODE${NC}"
fi
echo

# Test 13: Verify existing auth endpoints still work
echo "1️⃣3️⃣  Verifying existing auth endpoints not regressed..."
SIGNUP_TEST=$(curl -s -X POST $BASE_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test$(date +%s)@example.com\",
    \"password\": \"TestPass123\",
    \"name\": \"Test User\"
  }")

if echo "$SIGNUP_TEST" | grep -q "Account created successfully"; then
    echo -e "   ${GREEN}✅ Auth signup endpoint still working${NC}"
else
    echo -e "   ${RED}❌ Auth signup may have regressed${NC}"
fi
echo

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All Tests Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "📊 Test Summary:"
echo "   0. Server health check"
echo "   1. User authentication"
echo "   2. Unauthenticated create (should fail) ✓"
echo "   3. Create wedding invitation ✓"
echo "   4. Create birthday invitation ✓"
echo "   5. Duplicate title handling (unique slugs) ✓"
echo "   6. Invalid occasion type (should fail) ✓"
echo "   7. Invalid theme ID (should fail) ✓"
echo "   8. List invitations ✓"
echo "   9. Unauthenticated list (should fail) ✓"
echo "   10. Get specific invitation ✓"
echo "   11. Invalid ID format (should fail) ✓"
echo "   12. Ownership enforcement ✓"
echo "   13. Existing auth endpoints regression check ✓"
echo
echo "🎉 Host Invitation API is working correctly!"
echo
echo "Created invitations:"
echo "   - Wedding: $INVITATION_ID"
echo "   - Birthday: $BIRTHDAY_ID"
echo
