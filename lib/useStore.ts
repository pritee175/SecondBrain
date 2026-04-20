"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type {
  Habit, Goal, Project, Todo, JournalEntry, CaptureItem,
  Meal, FinanceEntry, Application, CalendarEvent, SavedPost, SelfTalk,
} from "@/types";
import { todayISO, yesterday } from "@/lib/utils";

// Old seeded IDs to wipe on migration
const OLD_GOAL_IDS    = new Set(["g1","g2","g3","g4"]);
const OLD_PROJECT_IDS = new Set(["p1","p2"]);
const OLD_HABIT_IDS   = new Set(["h1","h2","h3","h4"]);

function useFirebaseState<T>(userId: string, key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const isInitializing = useRef(true);

  // Real-time listener for Firebase data
  useEffect(() => {
    console.log(`📡 Setting up listener for ${key}`);
    const docRef = doc(db, "users", userId, "data", key);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const rawData = docSnap.data();
        console.log(`📥 Raw data for ${key}:`, rawData);
        
        let data = rawData.value as T;
        console.log(`✓ Loaded ${key}:`, Array.isArray(data) ? `Array[${data.length}]` : typeof data);
        
        // Check for corrupted data (object with numeric keys)
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const keys = Object.keys(data);
          if (keys.length > 0 && keys.every(k => /^\d+$/.test(k))) {
            console.warn(`⚠ ${key} is corrupted (object with numeric keys), converting to array`);
            data = Object.values(data) as T;
          }
        }
        
        // Clean old seeded data
        if (key === "goals" && Array.isArray(data)) {
          data = (data as Goal[]).filter(g => !OLD_GOAL_IDS.has(g.id)) as unknown as T;
        }
        if (key === "projects" && Array.isArray(data)) {
          data = (data as Project[]).filter(p => !OLD_PROJECT_IDS.has(p.id)) as unknown as T;
        }
        if (key === "habits" && Array.isArray(data)) {
          data = (data as Habit[]).filter(h => !OLD_HABIT_IDS.has(h.id)) as unknown as T;
        }
        
        setState(data);
      } else {
        console.log(`○ ${key}: No data, using initial`);
        setState(initial);
      }
      setLoading(false);
      isInitializing.current = false;
    }, (error) => {
      console.error(`✗ Error loading ${key}:`, error);
      console.error(`Error code: ${error.code}`);
      setState(initial);
      setLoading(false);
      isInitializing.current = false;
    });

    return () => {
      console.log(`🔌 Unsubscribing from ${key}`);
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, key]);

  const set = useCallback((val: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
      
      // Don't save during initialization
      if (isInitializing.current) {
        console.log(`⏭ Skipping save for ${key} (still initializing)`);
        return next;
      }
      
      // Save to Firebase
      const docRef = doc(db, "users", userId, "data", key);
      
      console.log(`💾 Saving ${key}:`, Array.isArray(next) ? `Array[${(next as any).length}]` : typeof next);
      console.log(`💾 Data to save:`, next);
      
      setDoc(docRef, { value: next })
        .then(() => {
          console.log(`✓ Saved ${key} to Firebase successfully`);
        })
        .catch(error => {
          console.error(`✗ Error saving ${key}:`, error);
          console.error(`Error code: ${error.code}`);
          console.error(`Error message: ${error.message}`);
        });
      
      return next;
    });
  }, [userId, key]);

  return [state, set, loading] as const;
}

export function useStore(userId: string) {
  const u = userId;
  const [habits,       setHabitsRaw,    loadingHabits]    = useFirebaseState<Habit[]>(u,        "habits",       []);
  const [goals,        setGoals,        loadingGoals]     = useFirebaseState<Goal[]>(u,         "goals",        []);
  const [projects,     setProjects,     loadingProjects]  = useFirebaseState<Project[]>(u,      "projects",     []);
  const [todos,        setTodosRaw,     loadingTodos]     = useFirebaseState<Todo[]>(u,         "todos",        []);
  const [journals,     setJournals,     loadingJournals]  = useFirebaseState<JournalEntry[]>(u, "journals",     []);
  const [captures,     setCaptures,     loadingCaptures]  = useFirebaseState<CaptureItem[]>(u,  "captures",     []);
  const [meals,        setMeals,        loadingMeals]     = useFirebaseState<Meal[]>(u,         "meals",        []);
  const [waterLogs,    setWaterLogs,    loadingWater]     = useFirebaseState<Record<string,number>>(u, "waterLogs", {});
  const [applications, setApplications, loadingApps]      = useFirebaseState<Application[]>(u,  "applications", []);
  const [events,       setEvents,       loadingEvents]    = useFirebaseState<CalendarEvent[]>(u, "events",      []);
  const [finances,     setFinances,     loadingFinances]  = useFirebaseState<FinanceEntry[]>(u,  "finances",    []);
  const [savedPosts,   setSavedPosts,   loadingPosts]     = useFirebaseState<SavedPost[]>(u,    "savedPosts",   []);
  const [selfTalks,    setSelfTalks,    loadingSelfTalks] = useFirebaseState<SelfTalk[]>(u,     "selfTalks",    []);

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
