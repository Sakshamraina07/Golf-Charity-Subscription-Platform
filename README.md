# BirdieBet — Golf Charity Subscription Platform

A high-performance, charity-first MVP for a golf subscription platform. Built with **Next.js 14**, **Supabase**, and **Tailwind CSS**.

## 🚀 Quick Start

### 1. Environment Variables
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Database Setup
Run the SQL schema provided in the request directly in the Supabase SQL Editor. This will create all tables, triggers, and RLS policies.

### 3. Seed Data (Run in SQL Editor)
```sql
-- Insert Initial Charities
INSERT INTO public.charities (name, description, website_url, is_featured) VALUES
('Healthcare for All', 'Providing essential medical services to underserved communities globally.', 'https://example.org/health', true),
('Green Earth Initiative', 'Focusing on reforestation and marine conservation efforts.', 'https://example.org/green', false),
('Education Foundation', 'Scholarships and school supplies for children in developing regions.', 'https://example.org/edu', true),
('Community Shelter', 'Supporting local homeless populations with food and housing.', 'https://example.org/shelter', false),
('Youth Sports Fund', 'Increasing access to golf and other sports for underprivileged youth.', 'https://example.org/sports', false),
('Animal Rescue League', 'Rescuing and rehoming abandoned pets nationwide.', 'https://example.org/animals', false);
```

### 4. Promote Admin
After signing up with `admin@test.com`, run:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@test.com';
```

### 5. Install & Run
```bash
npm install
npm run dev
```

## 🏗️ Technical Architecture

### **The Draw Engine (`lib/draw.ts`)**
- Prize pool is **50% of total subscription revenue**.
- **Distribution:** Match 5 (40% + Rollover), Match 4 (35%), Match 3 (25%).
- Uses random sequence generation and cross-references them with the latest 5 scores of active subscribers.

### **Rolling 5-Score System (DB Level)**
- Instead of complex application logic, we use a **PostgreSQL trigger** `rolling_score_limit` on the `scores` table.
- When an 6th score is inserted, the trigger automatically deletes the oldest entry for that user.
- This ensures the data is always clean and performant for the draw engine.

### **Mock Subscription Flow**
- Simple `POST /api/subscribe` endpoint updates the user's `subscriptions` record.
- No real Stripe integration; "Confirm" signifies the payment.

### **Route Protection (Middleware)**
- `middleware.ts` handles all RBAC and subscription state checks.
- Users without an `active` status in the `subscriptions` table are redirected from `/dashboard` to `/subscribe`.
- Only `role = 'admin'` can access `/admin/*` and `api/admin/*`.

## 💎 Design System
- **Background:** Zinc-950 (Deep Dark)
- **Accents:** Emerald Green (#10b981)
- **Typography:** Inter (Bold/Black)
- **glassmorphism:** Custom glass effects for cards and navbars.

## 👥 Test Credentials
- **User:** `user@test.com` / `password123`
- **Admin:** `admin@test.com` / `admin123`
