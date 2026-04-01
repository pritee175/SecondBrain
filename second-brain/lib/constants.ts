import type { Area, ProjectStatus, Priority, AppStatus, EventType, Platform, Habit, Goal, Project } from "@/types";

export const AREAS: Area[] = ["Health & Fitness", "Work / Career", "Creative Projects", "Personal Growth"];

export const AREA_COLORS: Record<Area, string> = {
  "Health & Fitness": "#4ade80",
  "Work / Career": "#60a5fa",
  "Creative Projects": "#f472b6",
  "Personal Growth": "#fb923c",
};

export const AREA_ICONS: Record<Area, string> = {
  "Health & Fitness": "🏃",
  "Work / Career": "💼",
  "Creative Projects": "🎨",
  "Personal Growth": "🌱",
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  "Not Started": "#475569",
  "In Progress": "#60a5fa",
  "Done": "#4ade80",
  "On Hold": "#fb923c",
};

export const APP_STATUSES: AppStatus[] = ["Applied", "Interview", "Offer", "Rejected", "Ghosted", "Saved"];

export const APP_STATUS_COLORS: Record<AppStatus, string> = {
  Applied: "#60a5fa",
  Interview: "#fb923c",
  Offer: "#4ade80",
  Rejected: "#ef4444",
  Ghosted: "#475569",
  Saved: "#a78bfa",
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  Work: "#60a5fa",
  Personal: "#f472b6",
  Health: "#4ade80",
  Social: "#fb923c",
  Learning: "#a78bfa",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  YouTube: "#ff4444",
  Instagram: "#e1306c",
  Telegram: "#0088cc",
};

export const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

export const PRIORITY_COLORS: Record<Priority, string> = {
  High: "#ef4444",
  Medium: "#fb923c",
  Low: "#64748b",
};

export const FINANCE_CATS: Record<"Income" | "Expense", string[]> = {
  Income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
  Expense: ["Food", "Transport", "Health", "Entertainment", "Shopping", "Bills", "Other"],
};

export const MOODS = [
  { e: "😤", l: "Rough", c: "#ef4444" },
  { e: "😔", l: "Low", c: "#f97316" },
  { e: "😐", l: "Okay", c: "#eab308" },
  { e: "🙂", l: "Good", c: "#84cc16" },
  { e: "😄", l: "Great", c: "#4ade80" },
];

export const SELF_QUESTIONS: Record<string, string[]> = {
  "🌅 Morning": [
    "What's one thing I'm excited about today?",
    "What's my top priority today?",
    "How am I feeling right now?",
    "What would make today a success?",
    "What am I grateful for this morning?",
  ],
  "🌙 Evening": [
    "What went well today?",
    "What could I have done better?",
    "What did I learn today?",
    "Am I proud of how I spent my time?",
    "What will I do differently tomorrow?",
  ],
  "📅 Weekly": [
    "Am I moving toward my goals?",
    "What drained my energy this week?",
    "What energized me most?",
    "Am I spending time on what matters?",
    "What do I want to focus on next week?",
  ],
  "🔮 Deep Dive": [
    "What am I afraid of right now?",
    "What do I really want in life?",
    "What beliefs are holding me back?",
    "Who am I becoming?",
    "What would my future self tell me?",
    "Am I living authentically?",
    "What would I do if I wasn't afraid?",
  ],
};

export const NAV_GROUPS = [
  {
    group: "MIND",
    items: [
      { id: "Dashboard" as const, icon: "◈" },
      { id: "Journal" as const, icon: "≡" },
      { id: "Self Talk" as const, icon: "◉" },
    ],
  },
  {
    group: "CAPTURE",
    items: [
      { id: "Inbox" as const, icon: "⊕" },
      { id: "Saved Posts" as const, icon: "★" },
    ],
  },
  {
    group: "PLAN",
    items: [
      { id: "To-Do" as const, icon: "☐" },
      { id: "Projects" as const, icon: "⊞" },
      { id: "Goals" as const, icon: "◎" },
      { id: "Events" as const, icon: "◷" },
    ],
  },
  {
    group: "TRACK",
    items: [
      { id: "Diet" as const, icon: "◑" },
      { id: "Finance" as const, icon: "◈" },
      { id: "Applications" as const, icon: "▣" },
    ],
  },
];

// All start empty — user adds their own data
export const DEFAULT_HABITS:   Habit[]   = [];
export const DEFAULT_GOALS:    Goal[]    = [];
export const DEFAULT_PROJECTS: Project[] = [];
