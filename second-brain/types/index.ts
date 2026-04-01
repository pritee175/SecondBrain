export interface Habit {
  id: string;
  name: string;
  area: Area;
  streak: number;
  done: boolean;
  lastDone?: string; // ISO date - tracks which day it was last completed
  history?: string[]; // ISO dates completed
}

export interface Goal {
  id: string;
  area: Area;
  goal: string;
  milestone: string;
  progress: number;
  dueDate?: string; // ISO date
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  area: Area;
  status: ProjectStatus;
  nextAction: string;
  due: string;
}

export interface Todo {
  id: string;
  text: string;
  priority: Priority;
  area: Area;
  due: string;
  done: boolean;
  createdAt: string;
  recurring?: "daily" | "weekly" | "monthly" | "";
}

export interface JournalEntry {
  id: string;
  text: string;
  mood: number;
  tags: string[];
  date: string;
  dateISO?: string;
}

export interface CaptureItem {
  id: string;
  text: string;
  area: Area;
  date: string;
}

export interface Meal {
  id: string;
  name: string;
  cal: number;
  p: number;
  c: number;
  f: number;
  date: string; // ISO date
}

export interface FinanceEntry {
  id: string;
  type: "Income" | "Expense";
  amt: number;
  cat: string;
  desc: string;
  date: string; // ISO date
}

export interface Application {
  id: string;
  company: string;
  role: string;
  status: AppStatus;
  date: string;
  notes: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: EventType;
}

export interface SavedPost {
  id: string;
  platform: Platform;
  title: string;
  url: string;
  notes: string;
  date: string;
}

export interface SelfTalk {
  id: string;
  cat: string;
  q: string;
  a: string;
  date: string;
}

export interface WaterLog {
  date: string; // ISO date
  count: number;
}

export type Area = "Health & Fitness" | "Work / Career" | "Creative Projects" | "Personal Growth";
export type ProjectStatus = "Not Started" | "In Progress" | "Done" | "On Hold";
export type Priority = "High" | "Medium" | "Low";
export type AppStatus = "Applied" | "Interview" | "Offer" | "Rejected" | "Ghosted" | "Saved";
export type EventType = "Work" | "Personal" | "Health" | "Social" | "Learning";
export type Platform = "YouTube" | "Instagram" | "Telegram";

export type TabId =
  | "Dashboard" | "Journal" | "Self Talk"
  | "Inbox" | "Saved Posts"
  | "To-Do" | "Projects" | "Goals" | "Events"
  | "Diet" | "Finance" | "Applications";
