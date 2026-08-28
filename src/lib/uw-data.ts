// Mock data for the UW Partner Coach frontend.
// TODO: Replace with Supabase queries when the backend is enabled.

export type ModuleStatus = "completed" | "unlocked" | "locked";

export type TrainingModule = {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  status: ModuleStatus;
  meta: string;
  completedOn?: string;
  learn: string[];
  prerequisite?: { id: string; title: string };
};

export const trainingModules: TrainingModule[] = [
  {
    id: "1",
    number: 1,
    title: "Module 1: Your UW Story",
    shortTitle: "Your UW Story",
    description: "Craft the personal story that opens every customer conversation.",
    status: "completed",
    meta: "📹 12 min video • 🎙️ 5 min practice",
    completedOn: "Completed Jan 12, 2026",
    learn: [
      "Introduce yourself without sounding scripted",
      "Explain why you joined UW in under 30 seconds",
      "Turn everyday conversations into opportunities",
      "Ask for permission before pitching",
      "Handle the “is this one of those schemes?” question",
    ],
  },
  {
    id: "2",
    number: 2,
    title: "Module 2: Commission & Earnings",
    shortTitle: "Commission & Earnings",
    description: "Understand how you get paid — and how to talk about it compliantly.",
    status: "completed",
    meta: "📹 18 min video • 🎙️ 5 min practice",
    completedOn: "Completed Jan 15, 2026",
    learn: [
      "Read your commission statement with confidence",
      "Explain the earnings model without income promises",
      "Set realistic personal targets",
      "Know which numbers you may never quote",
      "Answer “how much do you make?” compliantly",
    ],
    prerequisite: { id: "1", title: "Module 1: Your UW Story" },
  },
  {
    id: "3",
    number: 3,
    title: "Module 3: Bill Savings & Social Proof",
    shortTitle: "Bill Savings & Social Proof",
    description:
      "Show customers where their money goes today, build a like-for-like comparison and use real stories to build trust — without ever promising a number you cannot prove.",
    status: "unlocked",
    meta: "📹 15 min video • 🎙️ 5 min practice",
    learn: [
      "Calculate real customer savings using the UW bundle discount",
      "Handle “too expensive” objections with confidence",
      "Use social proof to build trust",
      "Show a bill comparison in under 60 seconds",
      "Close with the UW Price Pledge guarantee",
      "Keep every claim compliant and evidence-backed",
    ],
    prerequisite: { id: "2", title: "Module 2: Commission & Earnings" },
  },
  {
    id: "4",
    number: 4,
    title: "Module 4: Closing & Onboarding",
    shortTitle: "Closing & Onboarding",
    description: "Complete Module 3 to unlock",
    status: "locked",
    meta: "30 min interactive",
    learn: [
      "Ask for the switch naturally",
      "Complete the sign-up journey with the customer",
      "Set expectations for the first bill",
      "Book the follow-up call",
      "Ask for a referral the right way",
    ],
    prerequisite: { id: "3", title: "Module 3: Bill Savings & Social Proof" },
  },
];

export function getModule(id: string) {
  return trainingModules.find((m) => m.id === id);
}

export const recentActivity = [
  { id: 1, when: "2 hours ago", text: "Completed 8-min AI practice (Objection handling)" },
  { id: 2, when: "Yesterday at 3:42 PM", text: "Finished Module 2 ✓" },
  { id: 3, when: "2 days ago", text: "Practised first customer call (12 min)" },
  { id: 4, when: "3 days ago", text: "Unlocked Module 2" },
  { id: 5, when: "4 days ago", text: "Earned ‘Early Bird’ badge 🏆" },
];

export const badges = [
  { id: "early-bird", emoji: "🏆", title: "Early Bird", how: "Complete Module 1 in 24 hours", earned: "Jan 12, 2026" },
  { id: "speed", emoji: "⚡", title: "Speed Learner", how: "Finish 2 modules in 1 week", earned: "Jan 15, 2026" },
  { id: "convo", emoji: "🎙️", title: "Conversationalist", how: "Complete 10+ AI sessions", earned: null },
  { id: "dedicated", emoji: "📚", title: "Dedicated", how: "Practise 5 days in a row", earned: null },
  { id: "first-customer", emoji: "🌟", title: "First Customer", how: "Sign your first customer", earned: null },
  { id: "on-fire", emoji: "🔥", title: "On Fire", how: "Keep a 7-day practice streak", earned: null },
];

export const practiceSessions = [
  {
    id: "s1",
    date: "Jan 15, 2026 at 2:30 PM",
    daysAgo: 1,
    duration: "8 minutes",
    scenario: "Customer objections",
    icon: "💬",
    rating: 4,
    topics: ["Objection handling", "Bundle savings"],
    transcript: [
      { who: "ai", at: "00:00", text: "Hi Sarah! I'm a busy neighbour — go ahead.", tone: "" },
      { who: "you", at: "00:30", text: "Who do you pay for broadband at the moment?", tone: "good" },
      { who: "ai", at: "01:00", text: "Honestly, switching feels like a hassle.", tone: "" },
      { who: "you", at: "01:30", text: "It takes ten minutes and I handle the rest.", tone: "improve" },
    ],
  },
  {
    id: "s2",
    date: "Jan 13, 2026 at 9:05 AM",
    daysAgo: 3,
    duration: "12 minutes",
    scenario: "First customer call",
    icon: "📞",
    rating: 3,
    topics: ["Rapport", "Discovery"],
    transcript: [
      { who: "ai", at: "00:00", text: "Hello? Who's this?", tone: "" },
      { who: "you", at: "00:30", text: "Hi Tom, it's Sarah — we met at the school fair.", tone: "good" },
    ],
  },
  {
    id: "s3",
    date: "Dec 20, 2025 at 6:12 PM",
    daysAgo: 40,
    duration: "6 minutes",
    scenario: "Product Q&A",
    icon: "❓",
    rating: 5,
    topics: ["Broadband", "Mobile"],
    transcript: [
      { who: "ai", at: "00:00", text: "Does the broadband come with a router?", tone: "" },
      { who: "you", at: "00:30", text: "Yes — and installation is handled for you.", tone: "good" },
    ],
  },
];

export const scenarios = [
  { value: "objections", icon: "💬", label: "Customer objections" },
  { value: "product", icon: "❓", label: "Product Q&A" },
  { value: "first-call", icon: "📞", label: "First customer call" },
  { value: "closing", icon: "🤝", label: "Closing techniques" },
  { value: "savings", icon: "💰", label: "Bill savings walkthrough" },
];

// ============= Admin dashboard mock data =============

export type PartnerStatus = "on-track" | "at-risk" | "completed" | "new";

export type AdminPartner = {
  id: string;
  name: string;
  email: string;
  path: "Fast-Track" | "Standard" | "Self-Paced";
  joinedDaysAgo: number;
  modulesDone: number;
  aiSessions: number;
  practiceMins: number;
  lastActive: string;
  status: PartnerStatus;
};

export const adminPartners: AdminPartner[] = [
  { id: "p1", name: "Sarah Mitchell", email: "sarah.m@example.com", path: "Fast-Track", joinedDaysAgo: 12, modulesDone: 2, aiSessions: 7, practiceMins: 45, lastActive: "2 hours ago", status: "on-track" },
  { id: "p2", name: "James Okafor", email: "james.o@example.com", path: "Fast-Track", joinedDaysAgo: 10, modulesDone: 3, aiSessions: 12, practiceMins: 78, lastActive: "35 min ago", status: "on-track" },
  { id: "p3", name: "Priya Sharma", email: "priya.s@example.com", path: "Standard", joinedDaysAgo: 21, modulesDone: 4, aiSessions: 15, practiceMins: 96, lastActive: "1 day ago", status: "completed" },
  { id: "p4", name: "Tom Bradley", email: "tom.b@example.com", path: "Standard", joinedDaysAgo: 18, modulesDone: 1, aiSessions: 2, practiceMins: 14, lastActive: "6 days ago", status: "at-risk" },
  { id: "p5", name: "Amina Yusuf", email: "amina.y@example.com", path: "Fast-Track", joinedDaysAgo: 5, modulesDone: 2, aiSessions: 6, practiceMins: 41, lastActive: "4 hours ago", status: "on-track" },
  { id: "p6", name: "Dan Reeves", email: "dan.r@example.com", path: "Self-Paced", joinedDaysAgo: 30, modulesDone: 2, aiSessions: 4, practiceMins: 29, lastActive: "3 days ago", status: "at-risk" },
  { id: "p7", name: "Lucy Chen", email: "lucy.c@example.com", path: "Standard", joinedDaysAgo: 2, modulesDone: 0, aiSessions: 1, practiceMins: 6, lastActive: "Yesterday", status: "new" },
  { id: "p8", name: "Marcus Webb", email: "marcus.w@example.com", path: "Fast-Track", joinedDaysAgo: 14, modulesDone: 4, aiSessions: 18, practiceMins: 122, lastActive: "1 hour ago", status: "completed" },
  { id: "p9", name: "Elena Petrova", email: "elena.p@example.com", path: "Self-Paced", joinedDaysAgo: 25, modulesDone: 3, aiSessions: 9, practiceMins: 64, lastActive: "5 hours ago", status: "on-track" },
  { id: "p10", name: "Owen Griffiths", email: "owen.g@example.com", path: "Standard", joinedDaysAgo: 1, modulesDone: 0, aiSessions: 0, practiceMins: 0, lastActive: "Today", status: "new" },
];

export const moduleCompletionStats = [
  { module: "M1: Your UW Story", rate: 90 },
  { module: "M2: Commission", rate: 70 },
  { module: "M3: Bill Savings", rate: 40 },
  { module: "M4: Closing", rate: 20 },
];

export const weeklySignups = [
  { week: "W1", partners: 3 },
  { week: "W2", partners: 5 },
  { week: "W3", partners: 4 },
  { week: "W4", partners: 8 },
  { week: "W5", partners: 6 },
  { week: "W6", partners: 10 },
];
