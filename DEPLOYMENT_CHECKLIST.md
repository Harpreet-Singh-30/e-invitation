# Production Deployment Checklist

Use this checklist before deploying to production.

## ☑️ Pre-Deployment Configuration

### 1. Environment Setup

```bash
cd /home/harpreet/E-invetation
cp .env.example .env
nano .env
```

Update these CRITICAL variables:

- [ ] `NODE_ENV=production`
- [ ] `BASE_DOMAIN=youractual domain.com` (replace yourdomain.com)
- [ ] `BASE_URL=https://youractualdomain.com`
- [ ] `JWT_SECRET=` (generate with: `openssl rand -hex 32`)
- [ ] `UPI_ID=yourname@upi` (your actual UPI ID)
- [ ] `ADMIN_PASSWORD_HASH=` (see step 2)

### 2. Change Admin Password

Generate a secure password hash:

```bash
cd server
npm install bcrypt
node -e "console.log(require('bcrypt').hashSync('YourStrongPassword123!', 10))"
```

Copy the output to `ADMIN_PASSWORD_HASH` in `.env`

**⚠️ CRITICAL:** Change from default `admin123`!

### 3. Email Service Setup

Choose ONE provider and configure:

#### Option A: SendGrid (Recommended)
- [ ] Sign up at sendgrid.com (free tier: 100 emails/day)
- [ ] Create API key
- [ ] Add to `.env`:
  ```
  EMAIL_PROVIDER=sendgrid
  SENDGRID_API_KEY=your_api_key
  EMAIL_FROM=noreply@yourdomain.com
  ```

#### Option B: SMTP (Gmail, etc.)
- [ ] Enable "Less secure app access" or create app password
- [ ] Add to `.env`:
  ```
  EMAIL_PROVIDER=smtp
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your@email.com
  SMTP_PASS=your_password
  EMAIL_FROM=noreply@yourdomain.com
  ```

### 4. Domain and DNS

- [ ] Purchase domain (₹700-1000/year)
- [ ] Create Cloudflare account (free)
- [ ] Point nameservers to Cloudflare
- [ ] Wait for DNS propagation (up to 24 hours)

Add these DNS records in Cloudflare:
- [ ] A record: `@` → Your server IP (Proxied ✅)
- [ ] A record: `www` → Your server IP (Proxied ✅)
- [ ] A record: `*` → Your server IP (Proxied ✅) **[IMPORTANT for subdomains]**

Cloudflare SSL/TLS settings:
- [ ] Set SSL/TLS mode to "Full (strict)"
- [ ] Generate Origin Certificate (15 year validity)
- [ ] Download certificate and key
- [ ] Save as `proxy/certs/origin.pem` and `proxy/certs/origin-key.pem`

### 5. Server Setup (Oracle Always Free VM)

- [ ] Create Oracle Cloud account
- [ ] Provision VM (Ubuntu 22.04, 1 OCPU, 1GB RAM)
- [ ] Configure security list: Allow ports 80, 443
- [ ] SSH into server
- [ ] Install Docker and Docker Compose:
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  ```
- [ ] Reboot server: `sudo reboot`

### 6. Upload Code to Server

```bash
# On your local machine
cd /home/harpreet/E-invetation
tar -czf wedding-platform.tar.gz --exclude=node_modules --exclude=dist --exclude=.git .

# Upload to server
scp wedding-platform.tar.gz ubuntu@YOUR_SERVER_IP:~

# On server
ssh ubuntu@YOUR_SERVER_IP
mkdir -p ~/wedding-platform
cd ~/wedding-platform
tar -xzf ../wedding-platform.tar.gz
```

### 7. Build Frontend

```bash
# On your local machine OR on server
cd web
npm install
npm run build

# Verify dist folder created
ls -la dist/
```

### 8. Backup Configuration

```bash
# On server
mkdir -p /backups
chmod +x scripts/backup.sh
chmod +x scripts/restore.sh

# Test backup
./scripts/backup.sh

# Add to crontab for daily 2 AM backups
crontab -e
# Add this line:
0 2 * * * cd /home/ubuntu/wedding-platform && ./scripts/backup.sh >> /var/log/wedding-backup.log 2>&1
```

## 🚀 Deployment

### 1. Start Application

```bash
cd ~/wedding-platform
docker-compose up -d
```

### 2. Check Status

```bash
# View logs
docker-compose logs -f

# Check if services are running
docker-compose ps

# Test health endpoint
curl http://localhost:3000/healthz
```

### 3. Verify External Access

```bash
# From another machine
curl https://yourdomain.com/healthz
```

Should return: `{"status":"ok","timestamp":"..."}`

## ✅ Post-Deployment Testing

### 1. Landing Page
- [ ] Visit https://yourdomain.com
- [ ] Templates load correctly
- [ ] Images display properly
- [ ] "Select" buttons work

### 2. Order Creation
- [ ] Can create an order
- [ ] Payment instructions display
- [ ] UPI ID is correct

### 3. Admin Login
- [ ] Visit https://yourdomain.com/admin/login
- [ ] Login with new password (not admin123)
- [ ] Dashboard loads
- [ ] Can see pending payments

### 4. Payment Verification
- [ ] Create a test order
- [ ] Verify in admin panel
- [ ] Check edit token in logs: `docker-compose logs app | grep "Edit token"`
- [ ] Email sent (if configured) ✉️

### 5. Editor Access
- [ ] Open edit link
- [ ] Can edit site data
- [ ] Save works
- [ ] Slug claiming works

### 6. Publishing
- [ ] Claim a slug
- [ ] Publish site
- [ ] Visit `https://yourslug.yourdomain.com`
- [ ] Site displays correctly

### 7. WhatsApp Preview
- [ ] Share site link on WhatsApp
- [ ] Check preview shows couple names and image
- [ ] Verify og:title, og:description, og:image

### 8. Mobile Testing
- [ ] Test on real mobile device
- [ ] Check responsive design
- [ ] Test all features

## 🔒 Security Hardening

### Server Security
- [ ] Set up firewall (UFW):
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```
- [ ] Disable root login
- [ ] Set up SSH key authentication
- [ ] Disable password authentication
- [ ] Install fail2ban

### Application Security
- [ ] Change admin password from default
- [ ] Rotate JWT_SECRET
- [ ] Limit admin IP (optional, via Cloudflare Access)
- [ ] Enable Cloudflare WAF
- [ ] Set up rate limiting rules in Cloudflare

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure alerts (email/SMS)
- [ ] Set up log aggregation (optional)
- [ ] Enable Cloudflare analytics

## 📊 Monitoring Setup

### 1. Uptime Monitoring

Sign up for free tier:
- **UptimeRobot** (50 monitors free): https://uptimerobot.com
- **Pingdom** (free tier): https://www.pingdom.com

Add monitors for:
- [ ] https://yourdomain.com (every 5 min)
- [ ] https://yourdomain.com/healthz (every 5 min)
- [ ] Create alert contact (email/SMS)

### 2. Log Monitoring

```bash
# View application logs
docker-compose logs -f app

# View backup logs
tail -f /var/log/wedding-backup.log

# Check disk usage
df -h

# Check database size
ls -lh ~/wedding-platform/data/
```

### 3. Performance Monitoring

Use Cloudflare Analytics (free):
- [ ] Check requests per day
- [ ] Monitor bandwidth usage
- [ ] Check cache hit ratio
- [ ] Review security events

## 📝 Legal Pages

Create these pages before launch:

### Terms of Service
File: `web/src/pages/Terms.tsx`
- [ ] Service description
- [ ] User obligations
- [ ] Payment terms
- [ ] Refund policy reference
- [ ] Intellectual property
- [ ] Limitation of liability
- [ ] Governing law

### Refund Policy
File: `web/src/pages/Refund.tsx`
- [ ] Pre-book refund: 7 days, full refund
- [ ] Full purchase: No refund after edit link sent
- [ ] Custom requests: Case by case
- [ ] Refund processing time: 7-10 days

### Privacy Policy
File: `web/src/pages/Privacy.tsx`
- [ ] Data collected (email, phone, names, photos)
- [ ] How data is used
- [ ] Data retention (90 days after wedding)
- [ ] Third-party services
- [ ] User rights
- [ ] Contact information

Add routes in `App.tsx`:
```tsx
<Route path="/terms" element={<Terms />} />
<Route path="/refund" element={<Refund />} />
<Route path="/privacy" element={<Privacy />} />
```

## 🎨 Content Preparation

### Template Posters
- [ ] Create poster images (1200x1600px)
- [ ] Optimize for web (WebP format)
- [ ] Upload to `web/public/assets/templates/`
- [ ] Update database template records

### Branding
- [ ] Logo (SVG preferred)
- [ ] Favicon (ico + PNG sizes)
- [ ] Social media images
- [ ] Email template header

### Copy Writing
- [ ] Landing page hero text
- [ ] Feature descriptions
- [ ] Email templates
- [ ] WhatsApp message templates

## 🧪 Pre-Launch Testing

### Soft Launch Checklist
- [ ] 5-10 test users ready
- [ ] Support channel set up (WhatsApp/Email)
- [ ] Payment verification SLA defined (24 hours)
- [ ] Rollback plan ready
- [ ] Backup verified and tested

### Launch Day Checklist
- [ ] All services running
- [ ] Monitoring active
- [ ] Admin logged in
- [ ] Support team ready
- [ ] Announce on social media
- [ ] Monitor logs actively for 24 hours

## 🚨 Emergency Contacts

Add your details:

- **Developer:** _______________
- **Phone:** _______________
- **Email:** _______________
- **Backup Admin:** _______________

## 📞 Support Resources

- **Server Issues:** Check `docker-compose logs -f`
- **DNS Issues:** Use `dig yourdomain.com` and `dig *.yourdomain.com`
- **Database Issues:** Check `/home/ubuntu/wedding-platform/data/`
- **Payment Issues:** Review admin panel payments tab

## ✨ Launch Announcement Template

```
🎉 Introducing [Your Platform Name]!

Create your perfect wedding invitation website in minutes:
✨ Beautiful templates
💰 Starting at just ₹2,000
🌐 Your own unique subdomain
📱 Perfect WhatsApp sharing

Visit: https://yourdomain.com

#WeddingInvitation #WeddingTech #IndianWeddings
```

---

## 🎯 Launch Readiness Score

Check off all items above. You're ready when:
- [ ] 100% of "Pre-Deployment Configuration" complete
- [ ] 100% of "Deployment" complete
- [ ] 100% of "Post-Deployment Testing" complete
- [ ] 100% of "Security Hardening" complete
- [ ] At least 80% of "Monitoring Setup" complete
- [ ] All legal pages created
- [ ] Soft launch completed successfully

**Current Score: ____ %**

---

**Good luck with your launch! 🚀**
