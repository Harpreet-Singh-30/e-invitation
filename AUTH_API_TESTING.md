# 🧪 Testing Authentication APIs

This guide shows how to test all 7 authentication endpoints using `curl`.

## Prerequisites

1. **Start the server:**
   ```bash
   bash scripts/test-auth-server.sh
   ```

2. **In a new terminal**, run these tests

---

## 📋 Test Sequence

### 1. Health Check

```bash
curl http://localhost:3000/healthz
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-11-06T...",
  "environment": "development",
  "database": "connected"
}
```

---

### 2. Signup (Create Account)

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

**Expected Response:**
```json
{
  "message": "Account created successfully. Please verify your email.",
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "host",
    "subscriptionTier": "free",
    "isEmailVerified": false,
    "createdAt": "2026-11-06T..."
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "_dev_verificationToken": "token-here"
}
```

**Save the tokens:**
```bash
export ACCESS_TOKEN="<paste-access-token>"
export REFRESH_TOKEN="<paste-refresh-token>"
export VERIFICATION_TOKEN="<paste-verification-token>"
```

---

### 3. Verify Email

```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"$VERIFICATION_TOKEN\"
  }"
```

**Expected Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "host",
    "subscriptionTier": "free",
    "isEmailVerified": true,
    "createdAt": "2026-11-06T..."
  }
}
```

---

### 4. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

---

### 5. Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }"
```

**Expected Response:**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "new-access-token"
}
```

---

### 6. Forgot Password

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

**Expected Response:**
```json
{
  "message": "If an account exists with this email, a password reset link has been sent.",
  "_dev_resetToken": "reset-token-here"
}
```

**Save the reset token:**
```bash
export RESET_TOKEN="<paste-reset-token>"
```

---

### 7. Reset Password

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"$RESET_TOKEN\",
    \"password\": \"NewSecurePass456\"
  }"
```

**Expected Response:**
```json
{
  "message": "Password reset successfully. Please log in with your new password."
}
```

---

### 8. Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 🧪 Test with Existing Users

### Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wedding-saas.com",
    "password": "admin123"
  }'
```

### Login as Test Host (Pro Tier)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Login as Free User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "free@example.com",
    "password": "free123"
  }'
```

---

## ❌ Error Scenarios

### Invalid Email Format
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "SecurePass123",
    "name": "Test User"
  }'
```

**Expected:** 400 Bad Request with validation errors

### Weak Password
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "weak",
    "name": "Test User"
  }'
```

**Expected:** 400 Bad Request with password requirements

### Duplicate Email
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wedding-saas.com",
    "password": "SecurePass123",
    "name": "Duplicate User"
  }'
```

**Expected:** 400 Bad Request - "User already exists"

### Wrong Password
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wedding-saas.com",
    "password": "wrongpassword"
  }'
```

**Expected:** 401 Unauthorized - "Invalid email or password"

### Invalid Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "invalid-token"
  }'
```

**Expected:** 401 Unauthorized - "Invalid token"

---

## 🔧 Using Postman

1. Import these requests into Postman
2. Create an environment with:
   - `BASE_URL`: http://localhost:3000
   - `ACCESS_TOKEN`: (set after login)
   - `REFRESH_TOKEN`: (set after login)
3. Use `{{BASE_URL}}` and `{{ACCESS_TOKEN}}` in requests

---

## ✅ Success Criteria

All 7 endpoints should:
- ✅ Return correct status codes (200, 201, 400, 401)
- ✅ Return proper JSON responses
- ✅ Validate input correctly
- ✅ Generate valid JWT tokens
- ✅ Store/update data in database
- ✅ Handle errors gracefully

---

## 📊 Database Verification

After testing, verify data in database:

```bash
cd server && npx prisma studio
```

Open http://localhost:5555 and check:
- New user created in `users` table
- Email verified (isEmailVerified = true)
- Tokens stored correctly
- Password hashed (not plain text)
