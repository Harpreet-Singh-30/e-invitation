# 17. Deployment, Environment & Hosting Architecture

> **Document Version:** 1.0.0  
> **Author:** Senior Technical Architect & DevOps Lead  
> **Hosting Platform:** Vercel (Frontend & Serverless Edge) + Supabase (PostgreSQL)  
> **Status:** Production Verified

---

## 1. Hosting Architecture Overview

InviteHub is configured for zero-ops deployment on Vercel's global CDN edge combined with a managed Supabase PostgreSQL instance:

```mermaid
flowchart TD
    UserClient["End User / Browser"]
    VercelEdge["Vercel Edge Network / CDN"]
    StaticSPA["Vite Single Page App\n(Static HTML / CSS / JS Chunks)"]
    ServerlessAPI["Express Serverless Functions\n(Node.js 20 Runtime)"]
    SupabasePooler["Supabase Connection Pooler\n(pgbouncer:6543)"]
    SupabaseDB[("PostgreSQL 15 Cluster\n(Supabase Hosted)")]

    UserClient --> VercelEdge
    VercelEdge -->|Static Routes: /*| StaticSPA
    VercelEdge -->|API Routes: /api/*| ServerlessAPI
    ServerlessAPI -->|Prisma ORM (Pooled URI)| SupabasePooler
    SupabasePooler --> SupabaseDB
```

---

## 2. Vercel Configuration (`vercel.json`)

To run the decoupled monorepo seamlessly on Vercel without breaking client-side React Router routing or backend Express routes, `vercel.json` is configured as follows:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "web/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "server/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "web/$1"
    }
  ]
}
```

* **Client SPA Fallback:** Any non-API route (e.g., `/i/rohan-priya-wedding`, `/dashboard`, `/admin/studio`) is rewritten to `web/index.html` where React Router hydrates the client route.
* **API Forwarding:** All requests prefixed with `/api/*` are directed into the Express application entry point.

---

## 3. Database Connection & Pooling Strategy

### 3.1 Supabase Connection Strings
PostgreSQL on Supabase provides two connection endpoints:
1. **Direct Connection (Port 5432):** Used for Prisma migrations and schema push (`npx prisma db push`).
2. **Pooled Connection (Port 6543 with PgBouncer):** Mandatory for application runtime and Vercel serverless functions to prevent connection exhaustion.

```bash
# Application Runtime Connection String (server/.env)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5"

# Direct Migration Connection String (Optional for local CLI migrations)
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

---

## 4. Production Environment Variables Checklist

The following environment variables must be configured in the Vercel Project Settings dashboard:

| Variable Name | Required By | Secret? | Description / Value |
|---|---|:---:|---|
| `DATABASE_URL` | `server` | Yes | Pooled Supabase PostgreSQL connection string |
| `JWT_SECRET` | `server` | Yes | 64-character random hexadecimal string |
| `GEMINI_API_KEY` | `server` | Yes | Google AI Studio Gemini API Key |
| `RAZORPAY_KEY_ID` | `server` & `web` | No | Live Razorpay Key ID (`rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | `server` | Yes | Live Razorpay Merchant Secret |
| `RAZORPAY_WEBHOOK_SECRET` | `server` | Yes | Webhook verification signing secret |
| `VITE_API_URL` | `web` | No | Base API URL (e.g. `https://invitehub.in/api` or `/api`) |
| `NODE_ENV` | `server` | No | Set to `"production"` |

---

## 5. Health Checks & Production Monitoring

* **Liveness Endpoint:** `GET /api/health` returns `200 OK` with `{ status: "healthy", timestamp: "..." }`.
* **Database Check:** The health check performs a lightweight query (`SELECT 1`) to confirm active database connectivity before reporting healthy.
* **Vercel Analytics:** Core Web Vitals (LCP, FID, CLS) monitored continuously via Vercel Web Analytics.

