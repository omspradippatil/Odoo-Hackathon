<div align="center">

# ⚡ DEV FLOW

### *The smarter way to make a deal.*

**An intelligent deal, procurement & sales operations platform built for the Odoo Hackathon.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion)

</div>

---

## 📖 Overview

**DEV FLOW** is a full-stack, role-based deal management platform that streamlines every stage of procurement and sales — from sourcing and negotiation to multi-tier approvals, fulfilment tracking, and payment release. It consolidates the fragmented deal lifecycle into one intelligent, trust-driven workspace.

> Source → Compare → Negotiate → Approve → Fulfil — all in one place.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🛡️ **Trust Engine** | Vendor trust scoring system (Bronze / Silver / Gold tiers) powered by historical performance |
| 🤝 **Deal Negotiation** | Real-time quotation comparison and counter-offer workspace per deal |
| ✅ **Multi-Tier Approvals** | Configurable approval chains with Finance, Manager, and Admin stages |
| 📦 **Fulfilment Tracking** | End-to-end delivery verification with escrow-style payment release |
| 📊 **Role-Based Dashboards** | Tailored dashboards for Buyers, Sellers, Sales Reps, Managers, Finance, and Admins |
| 🔐 **Protected Transactions** | Escrow-like payment protection — funds release only after delivery verification |
| 🛒 **Vendor Onboarding** | Structured onboarding flow for new vendors with document collection |
| 📈 **Admin Control Panel** | Full oversight: users, pricing, inventory, discount policies, audit logs, and reports |

---

## 🗂️ Project Structure

```
Odoo-Hackathon/
└── dev-flow/                    # Main Next.js application
    ├── src/
    │   ├── app/                 # Next.js App Router pages
    │   │   ├── admin/           # Admin panel (users, reports, policies, etc.)
    │   │   ├── approvals/       # Approval workflow views
    │   │   ├── buyer/           # Buyer workspace
    │   │   ├── customer/        # Customer-facing views
    │   │   ├── dashboard/       # Main role-agnostic dashboard
    │   │   ├── deals/           # Deal management
    │   │   ├── login/           # Authentication — Login
    │   │   ├── negotiation/     # Quotation negotiation workspace
    │   │   ├── onboarding/      # Vendor & user onboarding flow
    │   │   ├── operations/      # Finance & operations views
    │   │   ├── sales/           # Sales rep workspace
    │   │   ├── seller/          # Seller workspace
    │   │   ├── signup/          # Authentication — Sign Up
    │   │   └── vendors/         # Vendor management
    │   ├── components/
    │   │   ├── demo/            # Demo shortcut overlay
    │   │   ├── layout/          # Shared layout components (Navbar, Sidebar)
    │   │   ├── sections/        # Landing page sections
    │   │   └── ui/              # Reusable UI primitives
    │   ├── lib/
    │   │   ├── authService.ts   # Mock authentication service
    │   │   └── utils.ts         # Utility helpers (cn, etc.)
    │   └── types/               # TypeScript type definitions
    │       ├── auth.ts          # User, UserRole, AuthResponse
    │       ├── approval.ts      # Approval chain types
    │       ├── negotiation.ts   # Quotation & negotiation types
    │       ├── trust.ts         # Vendor trust scoring types
    │       ├── fulfilment.ts    # Delivery & fulfilment types
    │       └── ...              # (billing, payment, health, etc.)
    ├── database.sql             # Database schema reference (MySQL/PostgreSQL)
    ├── next.config.ts           # Next.js configuration
    └── package.json             # Dependencies & scripts
```

---

## 👥 User Roles

DEV FLOW is built around a **role-based access control (RBAC)** model. Each role gets a dedicated workspace:

| Role | Access |
|---|---|
| `BUYER` | Raise requirements, compare quotations, track deliveries |
| `SELLER` | Receive RFQs, submit quotations, manage fulfilment |
| `SALES_REP` | Manage deals, coordinate between buyers and sellers |
| `SALES_MANAGER` | Approve deals, oversee sales team, view reports |
| `FINANCE_OPERATIONS` | Payment approvals, billing, financial reporting |
| `ADMIN` | Full platform control — users, policies, inventory, audit |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or yarn / pnpm / bun)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/omspradippatil/Odoo-Hackathon.git
cd Odoo-Hackathon/dev-flow

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot-reload |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check for code issues |

---

## 🔑 Demo Credentials

Use the following credentials to log in and explore the platform without creating an account:

```
Email:    demo@devflow.com
Password: Demo123!
```

> **Tip:** A **demo shortcut overlay** (keyboard accessible via the app) lets you instantly switch between role-based views.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.3 | App framework (App Router, SSR) |
| [React](https://react.dev) | 19 | UI component library |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type safety |
| [TailwindCSS](https://tailwindcss.com) | 4 | Utility-first CSS |
| [Framer Motion](https://www.framer.com/motion) | 13 | Animations & transitions |
| [Lucide React](https://lucide.dev) | ^1.41 | Icon system |
| [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | latest | Conditional class utilities |

### Typography
- **Geist Sans** & **Geist Mono** — via `next/font/google`

### Backend / Database (Planned)
- **PostgreSQL** — final production database
- **MySQL** — local development reference (see `database.sql`)

---

## 🏗️ Architecture Highlights

- **App Router** — Uses Next.js 16's latest App Router with nested layouts, server components, and client boundaries.
- **Role-Gated Routes** — Each role's workspace is a distinct route segment (e.g., `/buyer`, `/seller`, `/admin`) with layout-level auth guards.
- **Mock Auth Service** — `src/lib/authService.ts` provides a simulated async auth layer using `sessionStorage`, ready to be swapped for a real backend.
- **Typed Domain Models** — All business entities (deals, approvals, quotations, trust scores, etc.) are strictly typed under `src/types/`.
- **PWA-Ready** — Configured with a web manifest and Apple Web App meta tags for installability.

---

## 🏆 Hackathon Context

This project was built for the **Odoo Hackathon**. The goal was to design and prototype a platform that solves real-world B2B procurement pain points:

- **Fragmented deal visibility** across email, spreadsheets, and disconnected tools
- **Lack of structured negotiation** between buyers and sellers
- **Manual, error-prone approval workflows** in procurement
- **No trust layer** for evaluating vendor reliability
- **Delayed payments** due to absent fulfilment verification

DEV FLOW addresses all of these by providing a unified, intelligent deal workspace.

---

## 📄 License

This project is licensed for hackathon demonstration purposes.

---

<div align="center">

Built with ❤️ for the **Odoo Hackathon** by **Team OM**

</div>
