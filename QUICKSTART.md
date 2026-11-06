# Quick Start Guide - Wedding Invitation Platform Prototype

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 20+ installed
- Terminal access

### Step 1: Install Dependencies

```bash
# Navigate to project
cd /home/harpreet/E-invetation

# Install server dependencies
cd server
npm install

# Install web dependencies
cd ../web
npm install
```

### Step 2: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd /home/harpreet/E-invetation/server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /home/harpreet/E-invetation/web
npm run dev
```

### Step 3: Access the Application

- 🌐 **Landing Page:** http://localhost:5173
- 👑 **Admin Panel:** http://localhost:5173/admin/login
- 🔧 **API Server:** http://localhost:3000

### Step 4: Login to Admin

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 📝 Test the Complete Flow

### 1. Browse Templates (Customer)
1. Go to http://localhost:5173
2. View the 3 available templates
3. Click "Select" on any template

### 2. Create an Order
1. Fill in your details:
   - Email: test@example.com
   - Phone: 9876543210
   - Groom Name: Rahul
   - Bride Name: Priya
2. Choose "Reserve Now" (₹2,000) or "Buy Now" (₹3,000)
3. Click "Continue to Payment"
4. Note the Order ID and UPI payment details
5. Note the UPI reference ID shown (simulated payment)

### 3. Verify Payment (Admin)
1. Go to http://localhost:5173/admin/login
2. Login with admin/admin123
3. Click "Payments" tab
4. You'll see the pending payment
5. Click "Verify Payment" to approve it

### 4. Edit Your Site (Customer)
After payment verification, you'll see the edit token in server console logs:
```
Edit token for order X: <long-token-string>
Edit URL: http://localhost:5173/edit/<token>
```

1. Copy the edit URL from console and open it
2. Fill in wedding details:
   - Groom & Bride names
   - Tagline
   - Welcome message
3. Click "Save"

### 5. Claim Your Subdomain
1. In editor, scroll to "Choose Your URL"
2. Enter a slug like "rahul-priya"
3. Click "Check"
4. If available, click "Claim This URL"

### 6. Publish Your Site
1. Make sure payment is verified (order state = PURCHASED)
2. Click "Publish Site" button
3. Your site is now live!

### 7. View Published Site
The published site would be accessible at:
`http://<slug>.localhost:5173` (requires local DNS setup)

For development testing, the site data is accessible through the API.

---

## 🗂️ What's Included

### Backend Features ✅
- ✅ SQLite database with WAL mode
- ✅ Order state machine (DRAFT → PREBOOKED → PURCHASED → PUBLISHED)
- ✅ Template management with exclusivity
- ✅ Payment proof submission
- ✅ Manual payment verification
- ✅ Token-based edit authentication
- ✅ Slug validation and claiming
- ✅ Image upload with Sharp processing
- ✅ Admin authentication
- ✅ API rate limiting
- ✅ Subdomain routing logic
- ✅ Open Graph tag injection

### Frontend Features ✅
- ✅ Landing page with template gallery
- ✅ Order creation flow
- ✅ Payment instructions modal
- ✅ Editor with live preview
- ✅ Slug checking and claiming
- ✅ Admin dashboard
- ✅ Payment verification UI
- ✅ Published site renderer
- ✅ Royal Maroon template
- ✅ Responsive design

### DevOps ✅
- ✅ Docker Compose configuration
- ✅ Caddy reverse proxy setup
- ✅ Backup & restore scripts
- ✅ Environment configuration
- ✅ Health check endpoint

---

## 📊 Database Seeding

On first run, the system automatically creates:
- 3 default templates (Royal Maroon, Modern Floral, Classic Gold)
- Admin user (admin/admin123)
- Complete database schema

Database location: `server/data/wedding.db`

---

## 🔧 Configuration

### Environment Variables

Create `/home/harpreet/E-invetation/.env` (copy from `.env.example`):

```env
NODE_ENV=development
PORT=3000
BASE_DOMAIN=localhost
UPI_ID=yourname@upi
JWT_SECRET=development_secret_key
```

### Change Admin Password

Generate a new password hash:
```bash
cd server
node -e "console.log(require('bcrypt').hashSync('your_new_password', 10))"
```

Update in database or environment variable.

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Locked
Stop all running servers and restart.

### Module Not Found
```bash
# Reinstall dependencies
cd server && npm install
cd ../web && npm install
```

### Cannot Connect to API
Make sure backend is running on port 3000:
```bash
curl http://localhost:3000/healthz
```

---

## 📚 Next Steps

### Add More Templates
1. Create new template component in `web/src/templates/`
2. Add to database seed in `server/src/db/index.ts`
3. Register in `web/src/pages/PublishedSite.tsx`

### Add Email Service
1. Choose provider (SendGrid, Mailgun, AWS SES)
2. Add credentials to `.env`
3. Implement email service in `server/src/services/email.ts`
4. Send edit links after payment verification

### Deploy to Production
1. Set up Oracle Cloud VM or similar
2. Configure DNS with Cloudflare
3. Update `.env` with production values
4. Build frontend: `cd web && npm run build`
5. Start with Docker: `docker-compose up -d`

---

## 📞 Support

For issues or questions:
1. Check server logs in terminal
2. Check browser console for frontend errors
3. Review README.md for detailed documentation
4. Check database with: `sqlite3 server/data/wedding.db`

---

**Built with ❤️ for NxtFusion**

Date: November 6, 2026
