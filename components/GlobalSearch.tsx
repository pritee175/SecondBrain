"use client";
import { useState, useMemo } from "react";
import type {
  Todo, Habit, Goal, Project, CaptureItem,
  JournalEntry, SavedPost, CalendarEvent, FinanceEntry, Application
} from "@/types";
import { AREA_COLORS } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";

interface SearchData {
  todos: Todo[]; habits: Habit[]; goals: Goal[]; projects: Project[];
  captures: CaptureItem[]; journals: JournalEntry[]; savedPosts: SavedPost[];
  events: CalendarEvent[]; finances: FinanceEntry[]; applications: Application[];
}

interface Props {
  data: SearchData;
  onNavigate: (tab: string) => void;
  onClose: () => void;
}

interface Result {
  type: string; icon: string; title: string; sub: string; tab: string; color?: string;
}

export default function GlobalSearch({ data, onNavigate, onClose }: Props) {
  const [q, setQ] = useState("");

  const results = useMemo((): Result[] => {
    if (q.trim().length < 2) return [];
    const s = q.toLowerCase();
    const out: Result[] = [];

    data.todos.filter(t => t.text.toLowerCase().includes(s)).forEach(t =>
      out.push({ type:"Todo", icon:"✅", title:t.text, sub:`${t.priority} priority · ${t.done?"Done":"Pending"}`, tab:"To-Do", color:t.done?"#4ade80":"#60a5fa" }));

    data.habits.filter(h => h.name.toLowerCase().includes(s)).forEach(h =>
      out.push({ type:"Habit", icon:"🔥", title:h.name, sub:`Streak: ${h.streak} days · ${h.area}`, tab:"Dashboard", color:AREA_COLORS[h.area] }));

    data.goals.filter(g => g.goal.toLowerCase().includes(s) || g.milestone.toLowerCase().includes(s)).forEach(g =>
      out.push({ type:"Goal", icon:"🎯", title:g.goal, sub:`${g.progress}% · ${g.area}`, tab:"Goals", color:AREA_COLORS[g.area] }));

    data.projects.filter(p => p.name.toLowerCase().includes(s) || p.nextAction.toLowerCase().includes(s)).forEach(p =>
      out.push({ type:"Project", icon:"📁", title:p.name, sub:`${p.status} · ${p.area}`, tab:"Projects", color:AREA_COLORS[p.area] }));

    data.captures.filter(c => c.text.toLowerCase().includes(s)).forEach(c =>
      out.push({ type:"Idea", icon:"💡", title:c.text.slice(0,60), sub:`${c.area} · ${c.date}`, tab:"Inbox", color:AREA_COLORS[c.area] }));

    data.journals.filter(j => j.text.toLowerCase().includes(s) || j.tags.some(t => t.toLowerCase().includes(s))).forEach(j =>
      out.push({ type:"Journal", icon:"📖", title:j.text.slice(0,60), sub:j.date, tab:"Journal" }));

    data.savedPosts.filter(p => p.title.toLowerCase().includes(s) || p.notes.toLowerCase().includes(s)).forEach(p =>
      out.push({ type:"Saved Post", icon:"⭐", title:p.title, sub:`${p.platform} · ${p.date}`, tab:"Saved Posts" }));

    data.events.filter(e => e.title.toLowerCase().includes(s)).forEach(e =>
      out.push({ type:"Event", icon:"📅", title:e.title, sub:`${fmtDate(e.date)}${e.time?` · ${e.time}`:""}`, tab:"Events" }));

    data.finances.filter(f => (f.desc||f.cat).toLowerCase().includes(s)).forEach(f =>
      out.push({ type:"Finance", icon:f.type==="Income"?"💰":"💸", title:f.desc||f.cat, sub:`${f.type} $${f.amt} · ${fmtDate(f.date)}`, tab:"Finance", color:f.type==="Income"?"#4ade80":"#ef4444" }));

    data.applications.filter(a => a.company.toLowerCase().includes(s) || a.role.toLowerCase().includes(s)).forEach(a =>
      out.push({ type:"Application", icon:"💼", title:a.company, sub:`${a.role} · ${a.status}`, tab:"Applications" }));

    return out.slice(0, 20);
  }, [q, data]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "#000b", display: "flex", alignItems: "flex-start",
      justifyContent: "center", padding: "60px 16px 16px",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 520,
        background: "#13151f", border: "1px solid #252a3a",
        borderRadius: 18, overflow: "hidden",
        boxShadow: "0 25px 80px #000a",
      }}>
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: "1px solid #1e2333" }}>
          <span style={{ fontSize: 20 }}>🔍</span>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search everything..."
            onKeyDown={e => e.key === "Escape" && onClose()}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: "#fff", fontSize: 16, fontFamily: "inherit",
            }}
          />
          {q && <button onClick={() => setQ("")} style={{ background:"none",border:"none",color:"#9fa8da",cursor:"pointer",fontSize:18 }}>×</button>}
          <kbd style={{ fontSize: 11, color: "#5c6bc0", background: "#0f1118", border: "1px solid #252a3a", borderRadius: 5, padding: "2px 6px" }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {q.length < 2 && (
            <div style={{ padding: "30px 18px", textAlign: "center", color: "#5c6bc0", fontSize: 13 }}>
              Type at least 2 characters to search across all your data
            </div>
          )}
          {q.length >= 2 && results.length === 0 && (
            <div style={{ padding: "30px 18px", textAlign: "center", color: "#5c6bc0", fontSize: 13 }}>
              No results for "{q}"
            </div>
          )}
          {results.map((r, i) => (
            <div key={i} onClick={() => { onNavigate(r.tab); onClose(); }}
              style={{
                padding: "12px 18px", display: "flex", gap: 12, alignItems: "center",
                cursor: "pointer", borderBottom: "1px solid #0f1118",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1e2333")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: 14, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                <div style={{ fontSize: 11, color: r.color ?? "#9fa8da", marginTop: 2 }}>{r.type} · {r.sub}</div>
              </div>
              <span style={{ fontSize: 11, color: "#3949ab", flexShrink: 0 }}>{r.tab} →</span>
            </div>
          ))}
        </div>

        {results.length > 0 && (
          <div style={{ padding: "10px 18px", fontSize: 11, color: "#3949ab", borderTop: "1px solid #1e2333" }}>
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </div>
        )}
      </div>
    </div>
  );
}
