"use client";
import { useState, useEffect, useCallback } from "react";
import type {
  Habit, Goal, Project, Todo, JournalEntry, CaptureItem,
  Meal, FinanceEntry, Application, CalendarEvent, SavedPost, SelfTalk,
} from "@/types";
import { todayISO, yesterday } from "@/lib/utils";

// Old seeded IDs to wipe on migration
const OLD_GOAL_IDS    = new Set(["g1","g2","g3","g4"]);
const OLD_PROJECT_IDS = new Set(["p1","p2"]);
const OLD_HABIT_IDS   = new Set(["h1","h2","h3","h4"]);

function useLocalState<T>(userId: string, key: string, initial: T) {
  const fullKey = `sb_${userId}_${key}`;
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      if (raw !== null) {
        let parsed = JSON.parse(raw) as T;
        if (key === "goals"    && Array.isArray(parsed)) {
          parsed = (parsed as Goal[]).filter(g => !OLD_GOAL_IDS.has(g.id)) as unknown as T;
          localStorage.setItem(fullKey, JSON.stringify(parsed));
        }
        if (key === "projects" && Array.isArray(parsed)) {
          parsed = (parsed as Project[]).filter(p => !OLD_PROJECT_IDS.has(p.id)) as unknown as T;
          localStorage.setItem(fullKey, JSON.stringify(parsed));
        }
        if (key === "habits"   && Array.isArray(parsed)) {
          parsed = (parsed as Habit[]).filter(h => !OLD_HABIT_IDS.has(h.id)) as unknown as T;
          localStorage.setItem(fullKey, JSON.stringify(parsed));
        }
        setState(parsed);
      } else {
        setState(initial);
      }
    } catch { setState(initial); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey]);

  const set = useCallback((val: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
      try { localStorage.setItem(fullKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [fullKey]);

  return [state, set] as const;
}

export function useStore(userId: string) {
  const u = userId;
  const [habits,       setHabitsRaw]    = useLocalState<Habit[]>(u,        "habits",       []);
  const [goals,        setGoals]        = useLocalState<Goal[]>(u,         "goals",        []);
  const [projects,     setProjects]     = useLocalState<Project[]>(u,      "projects",     []);
  const [todos,        setTodosRaw]     = useLocalState<Todo[]>(u,         "todos",        []);
  const [journals,     setJournals]     = useLocalState<JournalEntry[]>(u, "journals",     []);
  const [captures,     setCaptures]     = useLocalState<CaptureItem[]>(u,  "captures",     []);
  const [meals,        setMeals]        = useLocalState<Meal[]>(u,         "meals",        []);
  const [waterLogs,    setWaterLogs]    = useLocalState<Record<string,number>>(u, "waterLogs", {});
  const [applications, setApplications] = useLocalState<Application[]>(u,  "applications", []);
  const [events,       setEvents]       = useLocalState<CalendarEvent[]>(u, "events",      []);
  const [finances,     setFinances]     = useLocalState<FinanceEntry[]>(u,  "finances",    []);
  const [savedPosts,   setSavedPosts]   = useLocalState<SavedPost[]>(u,    "savedPosts",   []);
  const [selfTalks,    setSelfTalks]    = useLocalState<SelfTalk[]>(u,     "selfTalks",    []);

  // ── Daily habit reset ──────────────────────────────────────────
  // When a habit's lastDone !== today AND !== yesterday → streak broken, mark undone
  const setHabits = useCallback((val: Habit[] | ((p: Habit[]) => Habit[])) => {
    setHabitsRaw(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      const today = todayISO();
      return next.map(h => {
        // Auto-reset done status at start of new day
        if (h.done && h.lastDone !== today) {
          return { ...h, done: false };
        }
        // Break streak if not done yesterday or today
        if (h.lastDone && h.lastDone !== today && h.lastDone !== yesterday() && h.streak > 0) {
          return { ...h, streak: 0 };
        }
        return h;
      });
    });
  }, [setHabitsRaw]);

  // Apply daily reset on load too
  useEffect(() => {
    setHabitsRaw(prev => {
      const today = todayISO();
      const yest = yesterday();
      return prev.map(h => {
        if (h.done && h.lastDone !== today) return { ...h, done: false };
        if (h.lastDone && h.lastDone !== today && h.lastDone !== yest && h.streak > 0) return { ...h, streak: 0 };
        return h;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Recurring todo reset ───────────────────────────────────────
  const setTodos = useCallback((val: Todo[] | ((p: Todo[]) => Todo[])) => {
    setTodosRaw(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      const today = todayISO();
      const weekS = (() => { const d = new Date(); const day = d.getDay(); const diff = d.getDate()-day+(day===0?-6:1); d.setDate(diff); return d.toISOString().split("T")[0]; })();
      const monthS = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-01`;
      return next.map(t => {
        if (!t.done || !t.recurring) return t;
        // Daily recurring — reset if last done not today
        if (t.recurring === "daily" && t.createdAt < today) return { ...t, done: false, createdAt: today };
        if (t.recurring === "weekly" && t.createdAt < weekS) return { ...t, done: false, createdAt: weekS };
        if (t.recurring === "monthly" && t.createdAt < monthS) return { ...t, done: false, createdAt: monthS };
        return t;
      });
    });
  }, [setTodosRaw]);

  // Apply recurring reset on load
  useEffect(() => {
    const today = todayISO();
    const weekS = (() => { const d = new Date(); const day = d.getDay(); const diff = d.getDate()-day+(day===0?-6:1); d.setDate(diff); return d.toISOString().split("T")[0]; })();
    const monthS = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-01`;
    setTodosRaw(prev => prev.map(t => {
      if (!t.done || !t.recurring) return t;
      if (t.recurring === "daily" && t.createdAt < today) return { ...t, done: false, createdAt: today };
      if (t.recurring === "weekly" && t.createdAt < weekS) return { ...t, done: false, createdAt: weekS };
      if (t.recurring === "monthly" && t.createdAt < monthS) return { ...t, done: false, createdAt: monthS };
      return t;
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Water: per-day logs { "2026-03-31": 5 }
  const today = todayISO();
  const water = waterLogs[today] ?? 0;
  const setWater = useCallback((fn: (p: number) => number) => {
    setWaterLogs(prev => {
      const cur = prev[today] ?? 0;
      return { ...prev, [today]: Math.min(8, Math.max(0, fn(cur))) };
    });
  }, [setWaterLogs, today]);

  return {
    habits, setHabits,
    goals, setGoals,
    projects, setProjects,
    todos, setTodos,
    journals, setJournals,
    captures, setCaptures,
    meals, setMeals,
    water, setWater, waterLogs,
    applications, setApplications,
    events, setEvents,
    finances, setFinances,
    savedPosts, setSavedPosts,
    selfTalks, setSelfTalks,
  };
}
