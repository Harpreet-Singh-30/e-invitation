# 🎯 COPY-PASTE DATABASE SETUP COMMANDS

## PostgreSQL is already installed! ✅

Just run these commands in your terminal:

---

## OPTION 1: One-Command Setup (Recommended)

```bash
cd /home/harpreet/E-invetation
sudo bash scripts/install-postgres.sh && bash scripts/post-db-setup.sh
```

This will:
1. Create database & user
2. Generate JWT secrets
3. Create .env file
4. Install dependencies
5. Run migrations
6. Seed database
7. Test connection

---

## OPTION 2: Manual Step-by-Step

### Step 1: Create Database (requires sudo)

```bash
sudo -u postgres psql <<'EOF'
-- Create database
CREATE DATABASE wedding_saas;

-- Create user with password (change YOUR_PASSWORD)
CREATE USER wedding_admin WITH PASSWORD 'secure_password_123';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE wedding_saas TO wedding_admin;
ALTER DATABASE wedding_saas OWNER TO wedding_admin;

-- Connect and grant schema permissions
\c wedding_saas
GRANT ALL ON SCHEMA public TO wedding_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO wedding_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO wedding_admin;

-- Verify
\l wedding_saas
\du wedding_admin
\q
EOF
```

### Step 2: Generate JWT Secrets

```bash
cd /home/harpreet/E-invetation/server

# Generate two random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Save both outputs - you'll need them!
```

### Step 3: Create .env File

```bash
cd /home/harpreet/E-invetation/server
cp .env.template .env
nano .env
```

**Edit .env and set:**
```env
DATABASE_URL="postgresql://wedding_admin:secure_password_123@localhost:5432/wedding_saas?schema=public"
JWT_SECRET="<paste-first-random-hex-here>"
JWT_REFRESH_SECRET="<paste-second-random-hex-here>"
```

### Step 4: Install Dependencies

```bash
cd /home/harpreet/E-invetation/server
npm install
```

### Step 5: Run Migrations

```bash
npx prisma migrate dev --name init
```

### Step 6: Seed Database

```bash
npm run db:seed
```

### Step 7: Test Connection

```bash
npm run test:db
```

---

## OPTION 3: Automated (Easiest!)

Since PostgreSQL is already installed, you can skip the postgres installation and just run:

```bash
cd /home/harpreet/E-invetation

# Create database manually (paste the Step 1 SQL above), then:
bash scripts/post-db-setup.sh
```

---

## ✅ After Setup, You'll Have:

- ✅ PostgreSQL database `wedding_saas` with 16 tables
- ✅ 3 test users (admin, host, free)
- ✅ 4 themes (Royal Maroon, Modern Floral, Classic Gold, Birthday Joy)
- ✅ 1 sample invitation with 3 events
- ✅ 2 sample guests with RSVP data

## 🔐 Test Login Credentials:

```
Admin:     admin@wedding-saas.com / admin123
Host:      test@example.com / test123
Free User: free@example.com / free123
```

---

## 🚀 Start Development:

```bash
# Terminal 1: Backend
cd /home/harpreet/E-invetation/server
npm run dev

# Terminal 2: Frontend  
cd /home/harpreet/E-invetation/web
npm run dev

# Terminal 3: Database GUI (optional)
cd /home/harpreet/E-invetation/server
npm run db:studio
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Prisma Studio: http://localhost:5555

---

## 💡 Quick Test:

After setup, verify everything works:

```bash
cd /home/harpreet/E-invetation/server
npm run test:db
```

You should see:
- ✅ Database connected
- Users: 3
- Themes: 4
- Invitations: 1
- Events: 3

---

**Choose your option above and run the commands!** 🚀
