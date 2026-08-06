# Developer Quick Start Guide

**Goal:** Get the portal running locally and understand the codebase in 30 minutes.

---

## 🚀 **Local Setup (5 minutes)**

### **Prerequisites**
- Node.js 18+ or Bun installed
- Git

### **Clone & Install**
```bash
cd c:\Users\ahada\Desktop\Utility Warehouse
cd coach-anywhere-practice
bun install   # or npm install
```

### **Run Development Server**
```bash
bun run dev   # or npm run dev
```

Open: http://localhost:3000

**Expected behavior:**
- Landing page loads with animations
- Click "Start your training" → goes to `/trainer`
- Navigate to `/dashboard` → see mock data

---

## 📁 **Project Structure**

```
coach-anywhere-practice/
├── src/
│   ├── routes/              # Pages (file-based routing)
│   │   ├── index.tsx        # Landing page (/)
│   │   ├── dashboard.tsx    # Dashboard (/dashboard)
│   │   ├── trainer.tsx      # Voice AI trainer (/trainer)
│   │   └── __root.tsx       # Root layout
│   ├── components/
│   │   ├── ui/              # shadcn components (Button, Card, etc.)
│   │   └── uw/              # Custom UW components
│   │       ├── SiteHeader.tsx
│   │       └── Waveform.tsx
│   ├── lib/
│   │   └── utils.ts         # Helper functions (cn classname merger)
│   ├── styles.css           # Tailwind + custom design tokens
│   └── router.tsx           # TanStack Router config
├── public/                  # Static assets (favicon, images)
├── package.json
└── vite.config.ts
```

---

## 🎨 **Key Concepts**

### **1. Routing (TanStack Router)**
- File-based: `src/routes/about.tsx` → `/about`
- Dynamic: `src/routes/training.$moduleId.tsx` → `/training/[id]`
- Protected routes: Use `beforeLoad` to check auth

**Example:**
```typescript
// src/routes/dashboard.tsx
export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAuth,  // Function to check if user is logged in
  component: Dashboard
})
```

### **2. Styling (Tailwind CSS 4)**
- Design tokens in `src/styles.css` (`:root` and `.dark`)
- Custom utilities: `bg-gradient-brand`, `shadow-lift`, `animate-wave`
- UW colors: `bg-brand`, `text-gold`, `bg-gradient-night`

**Color reference:**
```css
--brand: oklch(0.56 0.155 313)    /* Purple */
--info: oklch(0.665 0.134 245)    /* Blue */
--gold: oklch(0.82 0.152 79)      /* Yellow */
--success: oklch(0.639 0.15 149)  /* Green */
```

### **3. Components (shadcn/ui)**
- Pre-built: Button, Card, Dialog, Accordion, Progress, etc.
- Located in `src/components/ui/`
- Import: `import { Button } from '@/components/ui/button'`

### **4. Custom Components**
- **Waveform:** Animated voice visualization (`src/components/uw/Waveform.tsx`)
- **SiteHeader:** Sticky nav with logo (`src/components/uw/SiteHeader.tsx`)

---

## 📄 **Page Breakdown**

### **Landing Page (`/`)**
**File:** `src/routes/index.tsx`

**Sections:**
1. Hero (line 173-266): Headline, CTA, waveform demo
2. Why Voice AI (267-289): 3-column feature grid
3. How It Works (290-310): 4-step timeline
4. Modules (311-368): Accordion with lock states
5. AI Coach (369-413): Feature list + demo
6. Testimonials (414-443): 3 partner quotes
7. FAQ (444-466): Accordion with compliance copy
8. Final CTA (467-486): Call to action section
9. Footer (487-507): Links + branding

**Customization:**
- Edit text in the `reasons`, `steps`, `modules`, `testimonials`, `faqs` arrays
- Replace images in `src/assets/` (hero-partner.jpg, ai-orb.jpg)

---

### **Dashboard (`/dashboard`)**
**File:** `src/routes/dashboard.tsx`

**Layout:** 3-column grid (responsive)
- Left: Progress overview (stats, "Continue training" button)
- Middle: Next module cards (unlocked/locked states)
- Right: Milestones + resources

**Hardcoded data (line 49-72):**
```typescript
const PROGRESS = 50  // Change this to test different states
const stats = [...]  // Mock user stats
const milestones = [...]  // Day 1-14 timeline
```

**To make real:**
- Replace with Supabase queries
- Calculate progress from database
- Fetch user's actual AI sessions

---

### **Trainer Page (`/trainer`)**
**File:** `src/routes/trainer.tsx`

**Features:**
- Idle state: Pulsing mic button
- Active state: Waveform + mock transcript
- Bottom toolbar: Mute, volume, scenario selector
- Summary modal: Shows after ending session

**Mock data (line 36-41):**
```typescript
const transcript = [
  { who: "ai", text: "..." },
  { who: "you", text: "..." },
  // ...
]
```

**To make real:**
- Install `@vapi-ai/web` package
- Replace mock transcript with Vapi events
- See ACTION_PLAN.md Week 2, Day 1-2

---

## 🔧 **Common Tasks**

### **Add a New Page**
```bash
# Create file
touch src/routes/about.tsx

# Add content
export const Route = createFileRoute('/about')({
  component: AboutPage
})

function AboutPage() {
  return <div>About Us</div>
}
```

### **Change Colors**
Edit `src/styles.css`:
```css
:root {
  --brand: oklch(0.56 0.155 313);  /* Change this */
}
```

### **Add a Component**
```bash
# Using shadcn CLI
npx shadcn@latest add tooltip
# Now import from @/components/ui/tooltip
```

---

## 🐛 **Troubleshooting**

**"Cannot find module '@/...'"**
- TypeScript path alias issue
- Check `tsconfig.json` has `"@/*": ["./src/*"]`

**Styles not loading**
- Check `src/styles.css` is imported in `src/routes/__root.tsx`
- Clear Tailwind cache: `rm -rf .next node_modules/.cache`

**Port already in use**
- Change port: `bun run dev -- --port 3001`

**Build fails**
- Check TypeScript errors: `bun run lint`
- Ensure all dependencies installed: `bun install`

---

## 📚 **Learn More**

**TanStack Start Docs:** https://tanstack.com/start  
**Tailwind CSS 4:** https://tailwindcss.com/docs  
**shadcn/ui:** https://ui.shadcn.com/  
**Lovable (this project's builder):** https://lovable.dev

---

## 🎯 **Next Steps for Development**

1. **Read ANALYSIS.md** - Understand what's built vs what's missing
2. **Read ACTION_PLAN.md** - Step-by-step guide to add backend
3. **Start with Week 1** - Set up Supabase and authentication
4. **Join daily standups** - Coordinate with team

---

## 🆘 **Need Help?**

**Codebase Questions:**
- Check component files for inline comments
- Search existing code for examples (`grep -r "useQuery"`)

**TanStack Router:**
- Params: `const { moduleId } = Route.useParams()`
- Navigation: `<Link to="/dashboard">Go</Link>`
- Loader data: `const data = Route.useLoaderData()`

**Styling:**
- Use existing utilities: `className="rounded-xl bg-card p-6 shadow-card"`
- Check `src/styles.css` for custom tokens

**Supabase (when ready):**
- Client setup: See ACTION_PLAN.md Week 1, Day 1
- Auth: `supabase.auth.signInWithPassword()`
- Query: `supabase.from('users').select('*')`

---

**🚀 Happy coding! Start with the landing page, it's the most complete example.**
