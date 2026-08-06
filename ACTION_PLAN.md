# UW Partner Portal - Development Action Plan

**Current Status:** Visual MVP complete, backend integration needed  
**Goal:** Production-ready portal with Supabase + Vapi + n8n integration  
**Timeline:** 3 weeks (based on portal.md)

---

## 🎯 **Week 1: Authentication & Database Foundation**

### **Day 1-2: Supabase Setup**

**Tasks:**
- [ ] Create Supabase project at https://supabase.com
- [ ] Copy project URL and anon key to `.env.local`
- [ ] Install Supabase client: `bun add @supabase/supabase-js`
- [ ] Create `src/lib/supabase.ts` client singleton
- [ ] Configure in TanStack Start context

**Schema Creation (SQL in Supabase dashboard):**
```sql
-- Run this in Supabase SQL editor
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'associate' CHECK (role IN ('associate', 'admin')),
  language TEXT DEFAULT 'en',
  experience_level TEXT CHECK (experience_level IN ('fast-track', 'foundation')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  body_md TEXT,
  video_url TEXT,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, module_id)
);

CREATE TABLE ai_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  duration_secs INTEGER,
  summary_text TEXT,
  completed_onboarding BOOLEAN DEFAULT false
);
```

**RLS Policies:**
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;

-- Associates can only see their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Associates can view own progress"
  ON progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Associates can insert own progress"
  ON progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Associates can view own AI sessions"
  ON ai_sessions FOR SELECT USING (auth.uid() = user_id);

-- Everyone can read published modules
CREATE POLICY "Anyone can view published modules"
  ON modules FOR SELECT USING (is_published = true);

-- Admins can see everything (create admin role later)
```

**Seed Data:**
```sql
-- Insert test modules
INSERT INTO modules (sort_order, title, body_md, video_url) VALUES
(1, 'Module 1: UW Basics', 'Energy, broadband, mobile, insurance — how UW bundles simplify life.', null),
(2, 'Module 2: Commission & Earnings', 'How the plan works, how bundles factor in, and realistic timelines.', null),
(3, 'Module 3: Bill Savings & Social Proof', 'Show real customer savings and handle objections.', null),
(4, 'Module 4: Your First Customer', 'Step-by-step: finding leads, the conversation, closing.', null);
```

---

### **Day 3-4: Authentication Pages**

**Create `/login` page:**
```typescript
// src/routes/login.tsx
import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/login')({
  component: LoginPage
})

function LoginPage() {
  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    })
    if (!error) {
      // Redirect to /dashboard
    }
  }

  return (
    // Build form with email/password inputs
    // Add magic link option (optional)
  )
}
```

**Create `/signup` page:**
- Email + password + full name
- Ask 3 experience questions (for fast-track vs foundation)
- Set `experience_level` in user metadata

**Protect Routes:**
```typescript
// src/lib/auth.ts
export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw redirect({ to: '/login' })
  }
  return session
}

// In protected routes:
export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAuth,
  component: Dashboard
})
```

---

### **Day 5: Real Data Integration**

**Replace hardcoded data in `/dashboard`:**
```typescript
// Create hooks
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .single()
      return data
    }
  })
}

export function useProgress() {
  return useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const { data } = await supabase
        .from('progress')
        .select('*, module:modules(*)')
      return data
    }
  })
}
```

**Update dashboard.tsx:**
- Replace "Sarah" with real user name
- Calculate progress from database (modules completed / total)
- Show actual AI session count
- Display real "next module" based on progress

---

## 🎙️ **Week 2: Vapi Integration & Module System**

### **Day 1-2: Vapi Web SDK**

**Get Vapi credentials from BAC:**
- Public assistant ID
- Public key for web widget

**Install SDK:**
```bash
bun add @vapi-ai/web
```

**Integrate in `/trainer`:**
```typescript
import Vapi from '@vapi-ai/web'

const vapi = new Vapi('YOUR_PUBLIC_KEY')

// Pass user metadata
vapi.start({
  assistantId: 'YOUR_ASSISTANT_ID',
  metadata: {
    user_id: currentUser.id,
    full_name: currentUser.full_name
  }
})

// Listen for events
vapi.on('call-start', () => setActive(true))
vapi.on('call-end', (data) => {
  // Show summary modal
  setSummaryOpen(true)
})
vapi.on('speech-update', (transcript) => {
  // Update UI with real transcript
})
```

**Remove mock transcript, use real data from Vapi events**

---

### **Day 3: n8n Webhook**

**Set up n8n workflow:**
1. Create Vapi webhook trigger node
2. Verify shared secret header
3. Extract: user_id, duration, summary, completion flag
4. Supabase insert node → `ai_sessions` table
5. Add error handling (retry + Slack/email alert)

**Test:**
- Make real call on `/trainer`
- Hang up
- Check Supabase `ai_sessions` table (should appear within 60s)

---

### **Day 4-5: Module Progression System**

**Create `/training` page:**
- List all modules
- Show lock icon on incomplete modules
- Show checkmark on completed
- Progress bar at top

**Create `/training/[module]` page:**
```typescript
// src/routes/training.$moduleId.tsx
export const Route = createFileRoute('/training/$moduleId')({
  loader: async ({ params }) => {
    const { data: module } = await supabase
      .from('modules')
      .select('*')
      .eq('id', params.moduleId)
      .single()
    return { module }
  },
  component: ModulePage
})

function ModulePage() {
  const { module } = Route.useLoaderData()
  
  const handleComplete = async () => {
    await supabase.from('progress').insert({
      user_id: currentUser.id,
      module_id: module.id
    })
    // Redirect to /training (next module unlocks automatically)
  }

  return (
    // Display module.body_md (markdown renderer)
    // Embed module.video_url if exists (Vimeo/YouTube)
    // "Mark Complete" button
  )
}
```

**Sequential Unlocking Logic:**
- Query modules ordered by `sort_order`
- Join with user's `progress`
- Module N is unlocked if Module N-1 is completed
- First module always unlocked

---

## 🔧 **Week 3: Admin, Polish & Handover**

### **Day 1-2: Admin Dashboard**

**Create `/admin` page:**
```typescript
// Protect with role check
export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const session = await requireAuth()
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    if (user?.role !== 'admin') {
      throw redirect({ to: '/dashboard', code: 404 })
    }
  },
  component: AdminDashboard
})
```

**Features:**
- Table of all associates (name, email, modules X/Y, last AI session)
- Sortable columns
- Search bar
- CSV export button

**CSV Export:**
```typescript
function exportCSV(data: any[]) {
  const csv = [
    ['Name', 'Email', 'Modules Complete', 'Total AI Minutes', 'Last Session'],
    ...data.map(u => [u.full_name, u.email, `${u.completed}/${u.total}`, u.ai_minutes, u.last_session])
  ].map(row => row.join(',')).join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'uw-partners-export.csv'
  a.click()
}
```

---

### **Day 3: Compliance & Content**

- [ ] Create `/guidelines` page with compliance content (provided by BAC)
- [ ] Review all copy on all pages (sign-off from Coat)
- [ ] Add privacy policy page
- [ ] Add terms of use page
- [ ] Test account deletion (removes rows from all tables)

---

### **Day 4: Performance & Accessibility**

**Run Lighthouse audit:**
```bash
npm run build
npm run preview
# Open Lighthouse in Chrome DevTools
```

**Target scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 90+

**Optimizations:**
- Lazy load images
- Code splitting (dynamic imports)
- Compress assets
- Add `loading="lazy"` to images

---

### **Day 5: Handover**

**Deliverables:**
1. `.env.example` file with all required variables
2. Supabase RLS policy screenshots
3. README.md with setup instructions
4. 30-min recorded walkthrough video
5. Transfer Vercel, Supabase, GitHub access to BAC

**Handover Call Topics:**
- How to add a new module (Supabase SQL)
- How to add a new associate (Supabase Auth or admin UI)
- How to read analytics (admin dashboard)
- How to update Vapi assistant (BAC already knows)
- Troubleshooting common issues

---

## 📋 **Acceptance Checklist (from portal.md)**

Copy this into a GitHub issue and check off as you go:

- [ ] Every associate route redirects to /login when logged out
- [ ] /admin returns 404 for non-admin accounts
- [ ] Mobile responsive at 375px width on every page
- [ ] Log in as Associate A, cannot query Associate B's progress
- [ ] RLS policies exist in Supabase (screenshot sent to Coat)
- [ ] Seed script creates 1 admin + 3 test associates + 5 test modules
- [ ] New account sees only module 1 unlocked
- [ ] Completing module 1 unlocks module 2 without page refresh
- [ ] Progress survives logout/login
- [ ] Vapi session starts cleanly on Chrome, Safari iOS, Android
- [ ] User metadata visible in Vapi call logs
- [ ] No Vapi keys exposed client-side
- [ ] Test call appears in ai_sessions within 60 seconds
- [ ] Webhook rejects requests without shared secret
- [ ] CSV export opens correctly in Excel
- [ ] Coat reviews every page's copy
- [ ] Delete test account removes rows from all tables
- [ ] Zero hardcoded strings in components (all in locale file)
- [ ] All section checklists pass
- [ ] Deployed to production with SSL
- [ ] Environment variables documented
- [ ] Lighthouse scores 85+ on /dashboard mobile
- [ ] BAC has owner access to Vercel, Supabase, repo

---

**🚀 Ready to build? Start with Week 1, Day 1. Good luck!**
