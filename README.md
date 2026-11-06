# Wedding Invitation Platform

A self-serve platform where couples can choose wedding templates, edit details, pay, and publish private subdomain sites to share with guests.

## Features

- 🎨 **Beautiful Templates** - Professionally designed wedding invitation templates
- 💰 **Flexible Payment** - Pre-book for ₹2,000 or buy directly for ₹3,000
- ✏️ **Easy Editor** - Form-based editor with live preview
- 🌐 **Subdomain Sites** - Each couple gets their own subdomain (e.g., rahul-priya.yourdomain.com)
- 📱 **WhatsApp Ready** - Perfect Open Graph previews for social sharing
- 🔒 **Exclusive** - Each template sold only once
- 🛡️ **Secure** - Token-based authentication, no passwords for customers

## Tech Stack

**Backend:**
- Node.js + Express + TypeScript
- SQLite (WAL mode) with better-sqlite3
- Sharp for image processing
- bcrypt for password hashing

**Frontend:**
- React 18 + TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Router for routing
- Axios for API calls

**Infrastructure:**
- Docker + Docker Compose
- Caddy as reverse proxy with automatic HTTPS
- Cloudflare for DNS and CDN (recommended)

## Quick Start (Development)

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- npm or yarn

### Setup

1. **Clone and navigate to the project:**
   ```bash
   cd /home/harpreet/E-invetation
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install web dependencies:**
   ```bash
   cd ../web
   npm install
   ```

4. **Create environment file:**
   ```bash
   cd ..
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Start development servers:**

   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd web
   npm run dev
   ```

6. **Access the application:**
   - Landing page: http://localhost:5173
   - Admin panel: http://localhost:5173/admin/login
   - API: http://localhost:3000

### Default Credentials
- Admin username: `admin`
- Admin password: `admin123`
- **⚠️ CHANGE THESE IN PRODUCTION!**

## Production Deployment

### With Docker Compose (Recommended)

1. **Build the frontend:**
   ```bash
   cd web
   npm install
   npm run build
   ```

2. **Update environment variables:**
   ```bash
   nano .env
   # Set production values
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

### DNS Setup (Cloudflare)

1. Point your domain's nameservers to Cloudflare
2. Create A record: `@` → Your server IP (proxied)
3. Create A record: `www` → Your server IP (proxied)
4. Create A record: `*` → Your server IP (proxied) for wildcard subdomains
5. Set SSL/TLS mode to "Full (strict)"
6. Install Cloudflare Origin Certificate in Caddy

### Database Initialization

The database is automatically initialized on first run with:
- Schema creation
- 3 default templates
- Default admin user

### Backup

Set up nightly backups (recommended):

```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

Create `backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup database
sqlite3 /data/wedding.db ".backup $BACKUP_DIR/wedding_$DATE.db"

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /data/uploads

# Keep only last 7 days
find $BACKUP_DIR -name "wedding_*.db" -mtime +7 -delete
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete
```

## Project Structure

```
wedding-platform/
├── docker-compose.yml
├── .env.example
├── proxy/
│   └── Caddyfile
├── server/
│   ├── src/
│   │   ├── index.ts          # Main Express app
│   │   ├── db/
│   │   │   ├── index.ts      # Database connection
│   │   │   └── schema.sql    # Database schema
│   │   ├── routes/
│   │   │   ├── public.ts     # Public API (templates, orders)
│   │   │   ├── edit.ts       # Editor API (token-protected)
│   │   │   └── admin.ts      # Admin API
│   │   ├── services/
│   │   │   ├── orders.ts     # Order state machine
│   │   │   └── render.ts     # HTML & OG tag injection
│   │   └── lib/
│   │       ├── slug.ts       # Slug validation
│   │       └── token.ts      # Token generation & hashing
│   ├── package.json
│   └── tsconfig.json
└── web/
    ├── src/
    │   ├── App.tsx           # Main app with routing
    │   ├── pages/
    │   │   ├── Landing.tsx   # Template gallery
    │   │   ├── Editor.tsx    # Customer editor
    │   │   ├── PublishedSite.tsx
    │   │   └── admin/
    │   │       ├── Login.tsx
    │   │       └── Dashboard.tsx
    │   └── templates/
    │       └── royal-maroon-01/
    │           └── Template.tsx
    ├── package.json
    └── vite.config.ts
```

## API Endpoints

### Public API
- `GET /api/templates` - List available templates
- `POST /api/orders` - Create a new order
- `POST /api/orders/:id/payment-proof` - Submit payment proof
- `POST /api/custom-request` - Request custom design

### Editor API (Token-Protected)
- `GET /api/edit/:token/site` - Load site data
- `PUT /api/edit/:token/site` - Save site data
- `POST /api/edit/:token/assets` - Upload image
- `POST /api/edit/:token/slug` - Check/claim subdomain
- `POST /api/edit/:token/publish` - Publish site

### Admin API
- `POST /admin/login` - Admin login
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/payments` - List pending payments
- `POST /admin/payments/:id/verify` - Verify payment
- `GET /admin/orders` - List orders
- `GET /admin/sites` - List published sites
- `POST /admin/sites/:id/toggle-online` - Take site offline

## Configuration

### Environment Variables

See `.env.example` for all available options. Key variables:

- `BASE_DOMAIN` - Your main domain
- `UPI_ID` - Your UPI ID for payments
- `JWT_SECRET` - Random string for tokens
- `ADMIN_PASSWORD_HASH` - bcrypt hash of admin password

### Adding Templates

1. Create template component in `web/src/templates/your-template/`
2. Add template schema defining editable fields
3. Register in database via seed or admin panel
4. Add poster image and preview data

## Pricing & Payment Flow

1. **Pre-book**: Customer pays ₹2,000 → Template reserved for 7 days
2. **Balance**: Customer pays ₹1,000 → Full ownership
3. **Full**: Customer pays ₹3,000 → Instant ownership

**Payment Verification (MVP):**
- Manual UPI verification via admin panel
- Customer submits UPI transaction ID
- Admin verifies in bank/UPI app
- System sends edit link after verification

**Future: Razorpay/Payment Gateway** (requires KYC)

## Security

- Edit tokens: 256-bit random, hashed with SHA-256
- Admin passwords: bcrypt with salt
- Input validation: Zod schemas
- Rate limiting: Express-rate-limit
- File uploads: Type check, size limit, EXIF stripping
- SQL injection: Parameterized queries
- XSS: Output escaping in templates

## Monitoring

- Health endpoint: `GET /healthz`
- Docker health checks
- Uptime monitoring (external service recommended)
- Log rotation
- Periodic reservation expiry job (runs hourly)

## Troubleshooting

### Database locked error
SQLite in WAL mode should handle concurrent reads. If issues persist, migrate to PostgreSQL.

### Subdomain not resolving
- Check DNS propagation (use `dig *.yourdomain.com`)
- Verify Cloudflare proxy is enabled
- Check Caddy config

### Images not uploading
- Check `UPLOADS_PATH` directory permissions
- Verify Sharp is installed (native binaries)
- Check file size limits

## Support & Contributing

For issues and feature requests, please contact the development team.

## License

Proprietary - All rights reserved

---

Built with ❤️ by NxtFusion
