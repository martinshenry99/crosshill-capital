# Crosshill Capital

Institutional-grade crypto investment platform. A companion site to [Index Masterclass](https://www.indexmasterclass.com/).

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript
- **Styling:** TailwindCSS 4 + custom theme
- **Backend/Auth:** Supabase (PostgreSQL + Auth + RLS)
- **Charts:** Recharts
- **Icons:** Lucide React

## Features

### Public
- Professional landing page with CTAs
- Signup / Login / Password reset
- Link to Index Masterclass ecosystem

### Investor Dashboard
- Portfolio overview (total invested, current value, returns)
- Performance chart
- Portfolio breakdown (BTC, ETH, USDT allocations)
- Deposit page (wallet addresses, deposit confirmation)
- Transaction history with filters
- Notifications center

### Admin Panel
- Platform stats overview
- Investor management (view all, update portfolios, suspend/activate)
- Deposit approval/rejection workflow
- Wallet address configuration (add/remove/toggle receiving wallets)
- Automatic notifications to investors on deposit status changes

## Getting Started

### 1. Clone & Install

```bash
cd crosshill-capital
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

3. Run the schema SQL in your Supabase SQL Editor:
   - Open `supabase/schema.sql`
   - Execute it in Dashboard > SQL Editor

### 3. Create Admin User

After signing up through the app:
1. Go to Supabase Dashboard > Table Editor > `profiles`
2. Find your user and change `role` from `investor` to `admin`

### 4. Configure Wallet Addresses

1. Log in as admin
2. Go to Admin > Wallet Config
3. Add your BTC, ETH, and USDT receiving addresses

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Login page
│   ├── signup/               # Registration page
│   ├── forgot-password/      # Password reset
│   ├── dashboard/            # Investor dashboard
│   │   ├── page.tsx          # Overview
│   │   ├── portfolio/        # Portfolio breakdown
│   │   ├── deposit/          # Deposit crypto
│   │   ├── transactions/     # Transaction history
│   │   └── notifications/    # Notifications
│   └── admin/                # Admin panel
│       ├── page.tsx          # Admin overview
│       ├── users/            # Manage investors
│       ├── deposits/         # Approve deposits
│       └── wallets/          # Wallet config
├── components/ui/            # Reusable UI components
├── lib/
│   ├── supabase/             # Supabase client setup
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
└── middleware.ts             # Auth route protection
```

## Deployment

Deploy to Vercel or Netlify. Ensure environment variables are set in the deployment platform.

## Security Notes

- Row Level Security (RLS) enabled on all tables
- Admin routes protected via middleware + database role check
- Investor data isolated per user
- No API keys or secrets exposed client-side
