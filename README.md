# PC Banao — Custom PC Builder & Compatibility Checker

A full-stack web app for building custom PCs with real-time compatibility checking, live wattage tracking, and a community build gallery. Select components slot-by-slot, get instant feedback on socket/RAM/PSU compatibility, save your build, and share it publicly.

**Live:** [pcbanao.khanalankit.com](https://pcbanao.khanalankit.com)

---

## Features

- **Slot-based PC Builder** — Pick CPU, GPU, RAM, storage, PSU, motherboard, case, and cooler one by one
- **Real-time Compatibility Engine** — Validates CPU socket vs motherboard, RAM type and speed, PSU wattage with 1.2× headroom, case form factor, and cooler clearance
- **Live Power Draw Tracking** — Displays estimated component draw and warns when PSU is underpowered
- **Parts Catalog** — Browse 100+ components across 8 categories with price filtering, brand search, and in-stock toggle
- **Build Management** — Save, update, and delete builds; toggle public/private visibility
- **Community Gallery** — Browse and clone builds shared by other users
- **Google OAuth** — Sign in with Google, session persisted via JWT
- **Add to Builder** — Click any catalog item to instantly load it into the builder

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org) (App Router) | Framework — server components, ISR, `generateMetadata` |
| React 19 | UI rendering |
| TypeScript | Type safety throughout |
| Tailwind CSS 4 | Utility-first styling |
| Zustand 5 | Client state — builder slots, wattage totals, active slot |
| TanStack Query 5 | Server state — products, builds, compatibility; cache with `staleTime`/`gcTime` |
| NextAuth 4 | Google OAuth + JWT session strategy |
| Axios | HTTP client with auto token injection and 401 retry |
| Sonner | Toast notifications |
| React Hook Form + Zod | Form handling and validation |
| `next/image` | Optimized images (AVIF/WebP, 30-day CDN TTL) |
| `next/font` | Geist font, zero layout shift |

**Key architectural decisions:**

- **Hybrid rendering** — Catalog and builds pages use ISR (`revalidate: 120s / 60s`) for fast first paint, then TanStack Query handles client-side filter updates from cache
- **No mock data** — All data comes from the real API; skeletons shown while loading
- **Token caching** — 30-second in-memory cache prevents repeated `/api/auth/session` round-trips on every API call
- **PSU wattage** — Store's `totalWattage` tracks component draw only (PSU capacity excluded); builder summary compares draw vs. PSU rated output

### Backend

| Technology | Purpose |
|---|---|
| Express 5 | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose 9 | Database with connection pooling |
| JSON Web Token | Auth tokens, 7-day expiry |
| Helmet | HTTP security headers |
| CORS | Origin allowlist (Vercel + localhost) |
| express-rate-limit | 100 req / 15 min on `/api` |
| Zod | Request/response schema validation |
| bcryptjs | Password hashing |
| Cloudinary | Image storage |

**Backend architecture:** Controller → Service → Repository layers. Each module (product, build, compatibility, auth, user) is self-contained with its own router, controller, service, repository, and Zod validator.

**Compatibility engine** (`/modules/compatibility/compatibility.service.ts`):
- CPU socket ↔ motherboard socket match
- RAM type (DDR4/DDR5) and speed compatibility
- PSU wattage ≥ component draw × 1.2
- Case form factor ↔ motherboard size
- Cooler height vs case clearance
- Wattage fallbacks for parts with missing specs (CPU: 95W, GPU: 200W)

**Database indexes:** Compound `(category, price)`, text search on `(name, brand)`, `brand`, `(category, stock)` for fast filtered queries.

---

## Project Structure

```
PC-Banao/
├── pcbanao/                        # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx              # Root layout — providers, Toaster
│   │   ├── (main)/
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── builder/page.tsx    # PC builder
│   │   │   ├── catalog/page.tsx    # Parts catalog (ISR 120s)
│   │   │   ├── builds/page.tsx     # Community builds (ISR 60s)
│   │   │   └── builds/[id]/page.tsx # Build detail with OG metadata
│   │   └── (auth)/login/           # Google sign-in
│   ├── components/
│   │   ├── builder/                # PartSelector, BuildSummary
│   │   ├── landing/                # Navbar, hero, features, footer
│   │   └── shared/                 # QueryProvider, SessionProvider, AuthSync
│   ├── store/builderStore.ts       # Zustand — slots, totals, compatibility
│   └── lib/
│       ├── api/                    # productApi, buildApi, axios instance, serverFetch
│       ├── auth/authOptions.ts     # NextAuth config + OAuth→JWT exchange
│       └── queries/                # TanStack hooks — useProducts, useMyBuilds, useCompatibilityCheck
│
└── backend/                        # Express API
    └── src/
        ├── app.ts                  # Middleware chain, route mounting
        ├── models/                 # Mongoose schemas — parts, users, builds
        └── modules/
            ├── product/            # List, filter, paginate, admin CRUD
            ├── build/              # Create, update, delete, public/mine listings
            ├── compatibility/      # Rule engine for all compatibility checks
            └── auth/               # OAuth token exchange endpoint
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google OAuth credentials

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, CLIENT_URL, GOOGLE_CLIENT_ID/SECRET
npm run dev
```

### Frontend

```bash
cd pcbanao
npm install
cp .env.local.example .env.local   # fill in NEXTAUTH_SECRET, NEXTAUTH_URL, GOOGLE_CLIENT_ID/SECRET, NEXT_PUBLIC_API_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## GitHub Description

> Full-stack custom PC builder with real-time compatibility checking, live power draw tracking, and a community build gallery. Built with Next.js 15 App Router, TanStack Query, Zustand, and Express + MongoDB.
