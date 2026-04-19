"use client";
import { useState } from "react";
import type { Goal } from "@/types";
import { AREAS, AREA_COLORS, AREA_ICONS } from "@/lib/constants";
import { uid, todayISO, fmtDateFull } from "@/lib/utils";

interface Props { goals: Goal[]; setGoals: (fn:(p:Goal[])=>Goal[])=>void; }

export default function GoalsTab({ goals, setGoals }: Props) {
  const [showForm,  setShowForm]  = useState(false);
  const [editId,    setEditId]    = useState<string|null>(null);
  const [goalText,  setGoalText]  = useState("");
  const [milestone, setMilestone] = useState("");
  const [area,      setArea]      = useState<Goal["area"]>("Health & Fitness");
  const [progress,  setProgress]  = useState(0);
  const [dueDate,   setDueDate]   = useState("");

  function resetForm() { setGoalText(""); setMilestone(""); setArea("Health & Fitness"); setProgress(0); setDueDate(""); setEditId(null); setShowForm(false); }

  function openAdd() { resetForm(); setShowForm(true); }
  function openEdit(g: Goal) { setGoalText(g.goal); setMilestone(g.milestone); setArea(g.area); setProgress(g.progress); setDueDate(g.dueDate??""); setEditId(g.id); setShowForm(true); }

  function save() {
    if (!goalText.trim()) { alert("Please enter a goal!"); return; }
    const entry: Goal = { id: editId??uid(), goal:goalText, milestone, area, progress, dueDate, createdAt: editId ? undefined : todayISO() };
    if (editId) setGoals(p=>p.map(g=>g.id===editId?entry:g));
    else setGoals(p=>[...p,entry]);
    resetForm();
  }

  function remove(id: string) { if(confirm("Delete this goal?")) setGoals(p=>p.filter(g=>g.id!==id)); }

  function updProg(id: string, delta: number) {
    setGoals(p=>p.map(g=>g.id===id?{...g,progress:Math.min(100,Math.max(0,g.progress+delta))}:g));
  }

  function daysLeft(due: string) {
    if (!due) return null;
    const diff = Math.ceil((new Date(due+"T00:00:00").getTime() - Date.now()) / 86400000);
    return diff;
  }

  const avg = goals.length ? Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length) : 0;
  const S = { input: { width:"100%", background:"#0f1118", border:"1px solid #252a3a", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box" as const } };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:10, color:"#6366f1", letterSpacing:"0.15em", marginBottom:4 }}>QUARTERLY</div>
          <div style={{ fontSize:22, fontWeight:700, color:"#fff" }}>Goals</div>
        </div>
        <button onClick={openAdd} style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:12, color:"#fff", padding:"12px 20px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 15px #6366f144" }}>+ Add Goal</button>
      </div>

      {goals.length>0 && (
        <div style={{ background:"#13151f", border:"1px solid #252a3a", borderRadius:14, padding:"16px 18px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:`conic-gradient(#6366f1 ${avg*3.6}deg, #252a3a 0deg)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <div style={{ width:42, height:42, borderRadius:"50%", background:"#13151f", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#6366f1" }}>{avg}%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>{goals.filter(g=>g.progress===100).length}/{goals.length} goals complete</div>
            <div style={{ fontSize:12, color:"#9fa8da", marginTop:3 }}>Keep going! 🚀</div>
          </div>
        </div>
      )}

      {showForm && (
        <div style={{ background:"#13151f", border:"2px solid #6366f1", borderRadius:14, padding:18 }}>
          <div style={{ fontSize:14, color:"#c7d2fe", fontWeight:700, marginBottom:14 }}>{editId?"✏️ Edit Goal":"🎯 New Goal"}</div>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:11, color:"#9fa8da", marginBottom:5 }}>GOAL *</div>
            <input value={goalText} onChange={e=>setGoalText(e.target.value)} placeholder="e.g. Run 5K without stopping" style={S.input} />
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:11, color:"#9fa8da", marginBottom:5 }}>CURRENT MILESTONE</div>
            <input value={milestone} onChange={e=>setMilestone(e.target.value)} placeholder="e.g. Run 2K this week" style={S.input} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <div style={{ fontSize:11, color:"#9fa8da", marginBottom:5 }}>AREA</div>
              <select value={area} onChange={e=>setArea(e.target.value as Goal["area"])} style={{ ...S.input, WebkitAppearance:"none" as const }}>
                {AREAS.map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:11, color:"#9fa8da", marginBottom:5 }}>PROGRESS %</div>
              <input type="number" min={0} max={100} value={progress} onChange={e=>setProgress(Math.min(100,Math.max(0,Number(e.target.value))))} style={S.input} />
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:"#9fa8da", marginBottom:5 }}>DUE DATE (optional)</div>
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} style={S.input} />
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={save} style={{ flex:1, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:10, color:"#fff", padding:13, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              {editId?"✅ Save Changes":"🎯 Add Goal"}
            </button>
            <button onClick={resetForm} style={{ background:"#1e293b", border:"1px solid #252a3a", borderRadius:10, color:"#9fa8da", padding:"13px 18px", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {goals.map(g => {
        const dl = g.dueDate ? daysLeft(g.dueDate) : null;
        const overdue = dl !== null && dl < 0;
        const urgent  = dl !== null && dl >= 0 && dl <= 7;
        return (
          <div key={g.id} style={{ background:"#13151f", border:`1px solid ${overdue?"#ef444444":urgent?"#fb923c33":"#252a3a"}`, borderRadius:14, padding:16, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, bottom:0, width:4, background:AREA_COLORS[g.area], borderRadius:"14px 0 0 14px" }} />
            <div style={{ paddingLeft:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ flex:1, marginRight:10 }}>
                  <div style={{ fontSize:11, color:AREA_COLORS[g.area], marginBottom:5, letterSpacing:"0.1em" }}>{AREA_ICONS[g.area]} {g.area.toUpperCase()}</div>
                  <div style={{ fontSize:16, fontWeight:600, color:"#fff", lineHeight:1.4 }}>{g.goal}</div>
                  {g.dueDate && (
                    <div style={{ fontSize:11, marginTop:5, color: overdue?"#ef4444":urgent?"#fb923c":"#5c6bc0" }}>
                      📅 {overdue ? `${Math.abs(dl!)} days overdue` : dl===0 ? "Due today!" : `${dl} days left`} · {fmtDateFull(g.dueDate)}
                    </div>
                  )}
                </div>
                <div style={{ fontSize:24, fontWeight:700, color:AREA_COLORS[g.area], flexShrink:0 }}>{g.progress}%</div>
              </div>
              <div style={{ height:8, background:"#252a3a", borderRadius:4, marginBottom:10, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:4, width:`${g.progress}%`, background:g.progress===100?"linear-gradient(90deg,#4ade80,#22d3ee)":`linear-gradient(90deg,${AREA_COLORS[g.area]}66,${AREA_COLORS[g.area]})`, transition:"width 0.5s ease" }} />
              </div>
              {g.milestone && <div style={{ fontSize:13, color:"#9fa8da", marginBottom:12 }}>◎ {g.milestone}</div>}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", gap:6 }}>
                  {[-10,-5,+5,+10].map(d=>(
                    <button key={d} onClick={()=>updProg(g.id,d)} style={{ width:40, height:40, borderRadius:8, background:"#1e293b", border:"1px solid #252a3a", color:"#c5cae9", fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{d>0?`+${d}`:d}</button>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>openEdit(g)} style={{ background:"#1e293b", border:"1px solid #252a3a", borderRadius:8, color:"#c7d2fe", padding:"8px 14px", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>✏️ Edit</button>
                  <button onClick={()=>remove(g.id)} style={{ background:"#ef444418", border:"1px solid #ef444444", borderRadius:8, color:"#fca5a5", padding:"8px 14px", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>🗑️ Delete</button>
                </div>
              </div>
              {g.progress===100 && <div style={{ marginTop:12, padding:"10px 14px", borderRadius:8, background:"#4ade8018", border:"1px solid #4ade8044", fontSize:13, color:"#4ade80", textAlign:"center" }}>🎉 Goal Complete! Amazing work!</div>}
            </div>
          </div>
        );
      })}

      {goals.length===0 && !showForm && (
        <div style={{ background:"#13151f", border:"1px solid #252a3a", borderRadius:14, padding:"50px 20px", textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:14 }}>🎯</div>
          <div style={{ fontSize:17, color:"#c5cae9", marginBottom:8 }}>No goals yet</div>
          <div style={{ fontSize:13, color:"#5c6bc0", marginBottom:20 }}>Set your first goal and start tracking progress</div>
          <button onClick={openAdd} style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:12, color:"#fff", padding:"14px 28px", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 20px #6366f144" }}>🎯 Set Your First Goal</button>
        </div>
      )}
    </div>
  );
}
