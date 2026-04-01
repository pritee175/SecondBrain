"use client";
import { useState } from "react";
import type { Todo } from "@/types";
import { AREAS, AREA_COLORS, AREA_ICONS, PRIORITIES, PRIORITY_COLORS } from "@/lib/constants";
import { uid, todayISO, fmtDate } from "@/lib/utils";
import { SectionHeader, EmptyState } from "../ui";

interface Props { todos: Todo[]; setTodos:(fn:(p:Todo[])=>Todo[])=>void; }

const RECUR_LABELS: Record<string,string> = { "":"One-time", daily:"Daily 🔄", weekly:"Weekly 📅", monthly:"Monthly 📆" };

export default function TodoTab({ todos, setTodos }: Props) {
  const [text,    setText]    = useState("");
  const [pri,     setPri]     = useState<Todo["priority"]>("Medium");
  const [area,    setArea]    = useState<Todo["area"]>("Work / Career");
  const [due,     setDue]     = useState("");
  const [recur,   setRecur]   = useState<Todo["recurring"]>("");
  const [editId,  setEditId]  = useState<string|null>(null);
  const [deletingId, setDeletingId] = useState<string|null>(null);

  function save() {
    if (!text.trim()) return;
    if (editId) {
      setTodos(p=>p.map(t=>t.id===editId?{...t,text,priority:pri,area,due,recurring:recur}:t));
      setEditId(null);
    } else {
      setTodos(p=>[{ id:uid(), text, priority:pri, area, due, done:false, createdAt:todayISO(), recurring:recur }, ...p]);
    }
    setText(""); setDue(""); setRecur("");
  }

  function openEdit(t: Todo) { setText(t.text); setPri(t.priority); setArea(t.area); setDue(t.due); setRecur(t.recurring??""); setEditId(t.id); window.scrollTo({top:0,behavior:"smooth"}); }
  function toggle(id: string) { setTodos(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t)); }
  function remove(id: string) { setDeletingId(id); setTimeout(()=>{ setTodos(p=>p.filter(t=>t.id!==id)); setDeletingId(null); },300); }

  const pending   = todos.filter(t=>!t.done);
  const completed = todos.filter(t=>t.done);

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <SectionHeader eyebrow="TASKS" title="To-Do List" />

      {/* Stats */}
      {todos.length>0 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {PRIORITIES.map(p=>{ const cnt=pending.filter(t=>t.priority===p).length; return cnt>0?(
            <div key={p} style={{ padding:"5px 10px", background:PRIORITY_COLORS[p]+"18", border:`1px solid ${PRIORITY_COLORS[p]}33`, borderRadius:8, fontSize:12, color:PRIORITY_COLORS[p] }}>
              {cnt} {p}
            </div>
          ):null; })}
          {completed.length>0 && <div style={{ padding:"5px 10px", background:"#4ade8018", border:"1px solid #4ade8033", borderRadius:8, fontSize:12, color:"#4ade80" }}>✓ {completed.length} done</div>}
        </div>
      )}

      {/* Form */}
      <div className="sb-card" style={{ padding:14, border:editId?"1px solid var(--accent)44":"1px solid var(--border)" }}>
        {editId && <div style={{ fontSize:12, color:"var(--accent-dim)", marginBottom:10 }}>✏️ Editing task</div>}
        <input className="sb-input" value={text} onChange={e=>setText(e.target.value)} placeholder="What needs to be done?" style={{ marginBottom:10 }} onKeyDown={e=>e.key==="Enter"&&save()} />
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
          <select className="sb-input" style={{ flex:1, minWidth:100 }} value={pri} onChange={e=>setPri(e.target.value as Todo["priority"])}>
            {PRIORITIES.map(p=><option key={p}>{p}</option>)}
          </select>
          <select className="sb-input" style={{ flex:2, minWidth:140 }} value={area} onChange={e=>setArea(e.target.value as Todo["area"])}>
            {AREAS.map(a=><option key={a}>{a}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <input className="sb-input" style={{ flex:1, minWidth:120 }} type="date" value={due} onChange={e=>setDue(e.target.value)} />
          <select className="sb-input" style={{ flex:1, minWidth:100 }} value={recur??""} onChange={e=>setRecur(e.target.value as Todo["recurring"])}>
            {Object.entries(RECUR_LABELS).map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <button className="sb-btn" onClick={save} style={{ flexShrink:0 }}>{editId?"SAVE":"ADD"}</button>
          {editId && <button className="sb-btn-ghost" onClick={()=>{setEditId(null);setText("");}} style={{flexShrink:0}}>Cancel</button>}
        </div>
      </div>

      {PRIORITIES.map(priority => {
        const items = pending.filter(t=>t.priority===priority);
        if (!items.length) return null;
        return (
          <div key={priority}>
            <div className="sb-label" style={{ color:PRIORITY_COLORS[priority], marginBottom:8 }}>
              {priority==="High"?"🔴":priority==="Medium"?"🟡":"🟢"} {priority} Priority
            </div>
            <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {items.map(t=>(
                <div key={t.id} className={`sb-card hover-lift card-entrance ${deletingId===t.id?"deleting":""}`} style={{ padding:"13px 14px", display:"flex", alignItems:"center", gap:12 }}>
                  <div onClick={()=>toggle(t.id)} style={{ width:22, height:22, minWidth:22, borderRadius:6, border:`2px solid ${PRIORITY_COLORS[t.priority]}`, cursor:"pointer", transition:"all 0.2s" }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, color:"#fff" }}>{t.text}</div>
                    <div style={{ display:"flex", gap:8, marginTop:3, flexWrap:"wrap", alignItems:"center" }}>
                      <span style={{ fontSize:11, color:AREA_COLORS[t.area] }}>{AREA_ICONS[t.area]} {t.area}</span>
                      {t.due && <span style={{ fontSize:11, color:"var(--text4)" }}>📅 {fmtDate(t.due)}</span>}
                      {t.recurring && <span style={{ fontSize:10, background:"#6366f118", color:"#a5b4fc", border:"1px solid #6366f133", borderRadius:4, padding:"1px 6px" }}>{RECUR_LABELS[t.recurring]}</span>}
                    </div>
                  </div>
                  <button onClick={()=>openEdit(t)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text4)",padding:"4px" }}>✏️</button>
                  <button onClick={()=>remove(t.id)} style={{ background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:20,padding:"0 4px" }}>×</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {completed.length>0 && (
        <div>
          <div className="sb-label" style={{ marginBottom:8 }}>✅ COMPLETED ({completed.length})</div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {completed.map(t=>(
              <div key={t.id} className="sb-card" style={{ padding:"11px 14px", display:"flex", alignItems:"center", gap:12, opacity:0.5 }}>
                <div onClick={()=>toggle(t.id)} style={{ width:22, height:22, minWidth:22, borderRadius:6, background:"#4ade80", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#000", cursor:"pointer" }}>✓</div>
                <div style={{ flex:1, fontSize:14, color:"var(--text3)", textDecoration:"line-through" }}>{t.text}</div>
                {t.recurring && <span style={{ fontSize:10, color:"#a5b4fc" }}>🔄</span>}
                <button onClick={()=>remove(t.id)} style={{ background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:20,padding:"0 4px" }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {todos.length===0 && <EmptyState icon="✅" title="All clear!" sub="Add your first task above" />}
    </div>
  );
}
