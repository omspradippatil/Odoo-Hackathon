# DEV FLOW 🚀
### Intelligent Sales Operations Platform | DealFlow360 Hackathon

> **India's first trust-based B2B procurement + local marketplace platform**  
> Dual-mode: Professional B2B + Local Consumer | Escrow | Anonymous Bidding | AI Trust Ratings

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         DEV FLOW                            │
│                    ┌─────────────┐                         │
│                    │ MODE TOGGLE │                         │
│                    └─────┬───────┘                         │
│              ┌───────────┴───────────┐                     │
│        LOCAL MODE            PROFESSIONAL MODE              │
│     (Consumer-Local)         (Org-to-Vendor B2B)           │
│  Buyer│Seller│Manager    Org│Vendor│Manager│Approver       │
│              └───────────┬───────────┘                     │
│                    MAIN ADMIN / SaaS                        │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + React 18 + TypeScript |
| UI | Tailwind CSS v3 + shadcn/ui |
| Animations | Framer Motion |
| Backend | Spring Boot 3.4 + Java 21 |
| Database | PostgreSQL 18 (local) |
| Auth | JWT (HS256, 15min access + 7d refresh) |
| PDF | iText 5 |
| Excel | Apache POI |

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 20+
- PostgreSQL 16+ (running locally)

### 1. Database Setup
```bash
psql -d postgres -c "CREATE DATABASE devflow;"
```

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
> Backend runs at http://localhost:8080  
> Seed data is automatically loaded on first run.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at http://localhost:3000

---

## 👤 Demo Accounts (Auto-Seeded)

| Role | Email | Password |
|---|---|---|
| Admin | admin@devflow.com | admin123 |
| Sales Rep | rep@devflow.com | rep123 |
| Sales Manager | manager@devflow.com | mgr123 |
| Finance | finance@devflow.com | fin123 |
| Customer (Portal) | customer@acme.com | cust123 |
| Seller (Local) | seller@localshop.com | sell123 |
| Buyer (Local) | buyer@user.com | buy123 |

---

## 🎯 5-Minute Demo Flow

### Flow 1: Professional Mode — Quotation to Billing

1. **Login as Sales Rep** → rep@devflow.com / rep123
2. **Select Professional Mode** → Open Sales Workspace
3. **Create New Quotation** for Acme Corp
4. Add **Dell Laptop** (12% discount) + **Setup Service** (18% discount)
5. Watch **Blended Risk Score** fire → auto-routed to Sales Manager
6. **Login as Manager** → manager@devflow.com / mgr123 → Approve
7. **Customer Portal** → customer@acme.com → counter-propose 20% discount
8. Quote **re-enters approval** automatically
9. Customer confirms → **GST Invoice PDF** downloaded

### Flow 2: Local Mode — Escrow Trust

1. **Login as Buyer** → buyer@user.com / buy123
2. **Select Local Mode** → Search "earbuds"
3. See vendors with **Gold/Silver/Bronze** trust badges
4. Select product → click **Mock UPI Pay**
5. UPI modal → Pay button → 1.5s spinner → **SUCCESS** ✅
6. Platform holds escrow → buyer uploads delivery proof
7. Payment **released to seller** (2% fee deducted)
8. Both rate each other → **trust score updates**

---

## 📐 Blended Discount Risk Score

```
BlendedRiskScore = Σ [ (givenDiscount_i - allowedDiscount_i) × lineWeight_i ]
lineWeight_i = lineTotal_i / orderTotal

Score ≤ 0    → ✅ Auto-approved
0 < Score ≤ 0.08 → ⚠️  L1 (Sales Manager) required  
Score > 0.08  → 🔴 L1 + L2 (Finance) required
```

## 🏅 Trust Tier Algorithm

```
GOLD:   avgStars ≥ 4.5  AND  totalTransactions ≥ 20
SILVER: avgStars ≥ 3.8  AND  totalTransactions ≥ 10
BRONZE: everything else
```

## 💰 Revenue Model

- **Free**: Up to 5 quotations/month
- **Pro**: Unlimited quotations, analytics, Professional Mode
- **Platform fee**: 2% of processed transaction (charged to seller)

---

## 🔒 Security

- JWT auth with refresh tokens
- bcrypt password hashing
- Rate limiting (100 req/min general, 5/min auth)
- CSP headers
- PostgreSQL Row Level Security on sensitive tables
- Immutable audit log on every action
- Bot protection on auth endpoints
- File upload validation (5MB max, jpg/png only)

---

## 📁 Project Structure

```
Odoo-Hackathon/
├── backend/                    # Spring Boot
│   ├── src/main/java/com/devflow/
│   │   ├── config/            # Security, CORS, JPA
│   │   ├── controller/        # REST endpoints
│   │   ├── dto/               # Request/Response DTOs
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Spring Data repos
│   │   ├── service/           # Business logic
│   │   ├── security/          # JWT filter + utils
│   │   └── exception/         # Global error handler
│   └── src/main/resources/
│       └── application.properties
├── frontend/                   # Next.js 14
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   ├── lib/                   # API client, auth utils
│   ├── context/               # React contexts
│   ├── hooks/                 # Custom hooks
│   └── types/                 # TypeScript types
└── README.md
```

---

## 🔮 What We'd Build Next

- Native Android/iOS app (React Native)
- ML-based market price prediction
- Blockchain immutable audit trail for large contracts
- Integration with GSTN for real GST filing
- Video call with sales manager (WebRTC)
- Multi-currency + multi-company support