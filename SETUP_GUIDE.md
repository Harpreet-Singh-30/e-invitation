# 🚀 NEW SAAS MODEL - SETUP GUIDE

**Date:** November 6, 2026, 14:51 IST  
**Branch:** `feature/new-saas-model`  
**Phase:** 1 - Foundation Setup

---

## ✅ COMPLETED STEPS

### 1. Git Repository Initialized ✅
- Initial commit created with OLD prototype
- Tagged as `v0.1.0-old-model`
- Branch `feature/new-saas-model` created and active
- All existing work secured with version control

---

## 🔧 NEXT STEPS: PostgreSQL + Prisma Setup

### Step 1: Install PostgreSQL

**On Ubuntu/Debian:**
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
# Should show: psql (PostgreSQL) 14.x or higher
```

**On macOS:**
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

**On Windows:**
Download from: https://www.postgresql.org/download/windows/

---

### Step 2: Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE wedding_saas;
CREATE USER wedding_admin WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE wedding_saas TO wedding_admin;
ALTER DATABASE wedding_saas OWNER TO wedding_admin;

# Grant schema permissions (PostgreSQL 15+)
\c wedding_saas
GRANT ALL ON SCHEMA public TO wedding_admin;

# Exit PostgreSQL
\q
```

**Test the connection:**
```bash
psql -U wedding_admin -d wedding_saas -h localhost
# Enter password when prompted
# If successful, you'll see: wedding_saas=>
```

---

### Step 3: Install Prisma in Server Directory

```bash
cd /home/harpreet/E-invetation/server

# Install Prisma CLI and Client
npm install -D prisma
npm install @prisma/client

# Initialize Prisma (creates prisma/ directory)
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema file
- `.env` - Environment variables (DATABASE_URL)

---

### Step 4: Configure Database Connection

Edit `server/.env` (or create if doesn't exist):

```env
# Database
DATABASE_URL="postgresql://wedding_admin:your_secure_password_here@localhost:5432/wedding_saas?schema=public"

# JWT Secrets (generate random strings)
JWT_SECRET="generate-64-char-random-string-here"
JWT_REFRESH_SECRET="generate-another-64-char-random-string-here"
JWT_ACCESS_EXPIRY="1h"
JWT_REFRESH_EXPIRY="7d"

# Email Verification
EMAIL_VERIFICATION_EXPIRY="24h"
PASSWORD_RESET_EXPIRY="1h"

# Server
NODE_ENV="development"
PORT=3000
BASE_DOMAIN="localhost"
CORS_ORIGIN="http://localhost:5173"

# OLD SQLite (keep for reference)
OLD_DATABASE_PATH="./data/wedding.db"
UPLOADS_PATH="./data/uploads"
```

**Generate secure random strings:**
```bash
# On Linux/Mac:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Run twice to get two different secrets
```

---

### Step 5: Copy Prisma Schema from Documentation

Replace the content of `server/prisma/schema.prisma` with the schema from **DATABASE_SCHEMA_NEW.md** (lines 700-1200).

Or use this command:
```bash
cd /home/harpreet/E-invetation
# I'll create the schema.prisma file for you in next step
```

---

### Step 6: Run Database Migration

```bash
cd /home/harpreet/E-invetation/server

# Create and apply migration
npx prisma migrate dev --name init

# This will:
# 1. Create all 16 tables in PostgreSQL
# 2. Create prisma/migrations/ directory
# 3. Generate Prisma Client
```

**Expected output:**
```
✔ Generated Prisma Client
✔ The following migration has been created and applied:
  migrations/
    └─ 20261106_init/
       └─ migration.sql

✔ Done in 3.42s
```

---

### Step 7: Generate Prisma Client

```bash
npx prisma generate
```

This generates the TypeScript client at `node_modules/@prisma/client`

---

### Step 8: Verify Database Setup

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Opens at http://localhost:5555
# You should see all 16 empty tables
```

**Or verify via psql:**
```bash
psql -U wedding_admin -d wedding_saas -c "\dt"
# Should list all 16 tables
```

---

### Step 9: Create Seed Script

Create `server/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wedding-saas.com' },
    update: {},
    create: {
      email: 'admin@wedding-saas.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'admin',
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Create test host user
  const hostPassword = await bcrypt.hash('test123', 12);
  const host = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash: hostPassword,
      name: 'Test Host',
      phone: '+91-9876543210',
      role: 'host',
      subscriptionTier: 'pro',
      emailVerified: true,
    },
  });
  console.log('✅ Test host created:', host.email);

  // 3. Create themes (from OLD templates)
  const royalMaroon = await prisma.theme.upsert({
    where: { slug: 'royal-maroon' },
    update: {},
    create: {
      name: 'Royal Maroon',
      slug: 'royal-maroon',
      category: 'wedding',
      previewImageUrl: '/themes/royal-maroon-preview.jpg',
      templateComponent: 'RoyalMaroonTemplate',
      defaultColors: {
        primary: '#7f1d1d',
        secondary: '#f59e0b',
        background: '#fffbeb',
      },
      priceTier: 'premium',
      isActive: true,
    },
  });
  console.log('✅ Theme created:', royalMaroon.name);

  const modernFloral = await prisma.theme.upsert({
    where: { slug: 'modern-floral' },
    update: {},
    create: {
      name: 'Modern Floral',
      slug: 'modern-floral',
      category: 'wedding',
      previewImageUrl: '/themes/modern-floral-preview.jpg',
      templateComponent: 'ModernFloralTemplate',
      defaultColors: {
        primary: '#f43f5e',
        secondary: '#c084fc',
        background: '#fdf2f8',
      },
      priceTier: 'free',
      isActive: true,
    },
  });
  console.log('✅ Theme created:', modernFloral.name);

  const classicGold = await prisma.theme.upsert({
    where: { slug: 'classic-gold' },
    update: {},
    create: {
      name: 'Classic Gold',
      slug: 'classic-gold',
      category: 'wedding',
      previewImageUrl: '/themes/classic-gold-preview.jpg',
      templateComponent: 'ClassicGoldTemplate',
      defaultColors: {
        primary: '#d97706',
        secondary: '#eab308',
        background: '#fdfbf7',
      },
      priceTier: 'premium',
      isActive: true,
    },
  });
  console.log('✅ Theme created:', classicGold.name);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Add to `server/package.json`:**
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "scripts": {
    "db:seed": "npx prisma db seed"
  }
}
```

**Run seed:**
```bash
npm run db:seed
```

---

### Step 10: Update TypeScript Config

In `server/tsconfig.json`, ensure Prisma paths are included:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*", "prisma/seed.ts"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 🧪 VERIFY SETUP

### Test Database Connection

Create `server/src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

**Test script** (`server/src/test-db.ts`):

```typescript
import prisma from './lib/prisma';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    const userCount = await prisma.user.count();
    const themeCount = await prisma.theme.count();
    
    console.log('✅ Database connected!');
    console.log(`   Users: ${userCount}`);
    console.log(`   Themes: ${themeCount}`);
    
    const themes = await prisma.theme.findMany();
    console.log('\n📋 Available themes:');
    themes.forEach(theme => {
      console.log(`   - ${theme.name} (${theme.priceTier})`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

**Run test:**
```bash
cd /home/harpreet/E-invetation/server
npx tsx src/test-db.ts
```

---

## 📚 REFERENCE

**Documentation:**
- DATABASE_SCHEMA_NEW.md - Complete schema with 16 tables
- API_SPECIFICATION.md - API endpoints (49 total)
- BUSINESS_MODEL_TRANSITION.md - Architecture comparison

**Prisma Docs:**
- https://www.prisma.io/docs/getting-started
- https://www.prisma.io/docs/concepts/components/prisma-schema
- https://www.prisma.io/docs/concepts/components/prisma-client

---

## ⚠️ TROUBLESHOOTING

### Issue: "relation does not exist"
**Solution:** Run migrations again
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Issue: "password authentication failed"
**Solution:** Check DATABASE_URL in .env, verify PostgreSQL user exists

### Issue: "Can't reach database server"
**Solution:** 
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Issue: Prisma Client outdated
**Solution:**
```bash
npx prisma generate
```

---

## ✅ CHECKLIST

Before proceeding to Phase 2:

- [ ] PostgreSQL installed and running
- [ ] Database `wedding_saas` created
- [ ] User `wedding_admin` created with permissions
- [ ] Prisma installed in server directory
- [ ] `prisma/schema.prisma` populated with NEW schema
- [ ] `server/.env` configured with DATABASE_URL and secrets
- [ ] Migrations created and applied (`npx prisma migrate dev`)
- [ ] Prisma Client generated
- [ ] Seed data created (admin, host, 3 themes)
- [ ] Test connection successful
- [ ] Prisma Studio accessible (`npx prisma studio`)

---

**Next Phase:** JWT Authentication System (Task #6)

After database setup, we'll create:
- `/server/src/lib/jwt.ts` - Token generation and verification
- `/server/src/middleware/auth.ts` - Authentication middleware
- `/server/src/routes/auth.ts` - Auth endpoints (signup, login, refresh)

---

**Questions or Issues?**
Check AUDIT_REPORT.md section "PostgreSQL + Prisma Setup" for detailed guidance.
