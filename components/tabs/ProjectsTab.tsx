"use client";
import { useState } from "react";
import type { Project } from "@/types";
import { AREAS, AREA_COLORS, AREA_ICONS, STATUS_COLORS } from "@/lib/constants";
import { uid, fmtDate } from "@/lib/utils";
import { SectionHeader } from "../ui";

interface Props { projects: Project[]; setProjects: (fn:(p:Project[])=>Project[])=>void; }

const empty = (): Omit<Project,"id"> => ({ name:"", area:"Work / Career", status:"Not Started", nextAction:"", due:"" });

export default function ProjectsTab({ projects, setProjects }: Props) {
  const [show, setShow]   = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm]   = useState(empty());
  const [deletingId, setDeletingId] = useState<string|null>(null);

  function openAdd() { setForm(empty()); setEditId(null); setShow(true); }
  function openEdit(p: Project) { setForm({name:p.name,area:p.area,status:p.status,nextAction:p.nextAction,due:p.due}); setEditId(p.id); setShow(true); }

  function save() {
    if (!form.name.trim()) return;
    if (editId) setProjects(p=>p.map(pp=>pp.id===editId?{...pp,...form}:pp));
    else setProjects(p=>[...p,{...form,id:uid()}]);
    setShow(false); setEditId(null); setForm(empty());
  }

  function remove(id: string) {
    setDeletingId(id);
    setTimeout(()=>{ setProjects(p=>p.filter(pp=>pp.id!==id)); setDeletingId(null); },300);
  }

  const STATUS_ICONS: Record<string,string> = { "Not Started":"⭕","In Progress":"🔄","Done":"✅","On Hold":"⏸️" };

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <SectionHeader eyebrow="WORKSPACE" title="Projects"
        action={<button className="sb-btn" onClick={openAdd}>+ New Project</button>} />

      {/* Status summary */}
      {projects.length>0 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {(["Not Started","In Progress","Done","On Hold"] as const).map(s=>{
            const cnt = projects.filter(p=>p.status===s).length;
            return cnt>0 ? (
              <div key={s} style={{ padding:"5px 10px", background:STATUS_COLORS[s]+"18",
                border:`1px solid ${STATUS_COLORS[s]}33`, borderRadius:8, fontSize:12, color:STATUS_COLORS[s] }}>
                {STATUS_ICONS[s]} {cnt} {s}
              </div>
            ):null;
          })}
        </div>
      )}

      {show && (
        <div className="sb-card pop-in" style={{ padding:"16px", border:"1px solid var(--accent)44" }}>
          <div style={{ fontSize:13, color:"var(--accent-dim)", marginBottom:12, fontWeight:600 }}>
            {editId?"✏️ Edit Project":"📁 New Project"}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <input className="sb-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Project name..." />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <select className="sb-input" value={form.area} onChange={e=>setForm({...form,area:e.target.value as Project["area"]})}>
                {AREAS.map(a=><option key={a}>{a}</option>)}
              </select>
              <select className="sb-input" value={form.status} onChange={e=>setForm({...form,status:e.target.value as Project["status"]})}>
                {(["Not Started","In Progress","Done","On Hold"] as const).map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <input className="sb-input" value={form.nextAction} onChange={e=>setForm({...form,nextAction:e.target.value})} placeholder="Next action..." />
            <div style={{ display:"flex", gap:8 }}>
              <input className="sb-input" style={{ flex:1 }} type="date" value={form.due} onChange={e=>setForm({...form,due:e.target.value})} />
              <button className="sb-btn" onClick={save} style={{ flexShrink:0 }}>{editId?"Save":"Create"}</button>
              <button className="sb-btn-ghost" onClick={()=>setShow(false)} style={{ flexShrink:0 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {projects.map(p=>(
          <div key={p.id} className={`sb-card hover-lift card-entrance ${deletingId===p.id?"deleting":""}`} style={{ padding:"15px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ flex:1, marginRight:10 }}>
                <div style={{ fontSize:16, fontWeight:600, color:"#fff" }}>{p.name}</div>
                <div style={{ fontSize:11, color:AREA_COLORS[p.area], marginTop:3 }}>{AREA_ICONS[p.area]} {p.area}</div>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <div style={{ padding:"4px 10px", borderRadius:8, background:STATUS_COLORS[p.status]+"18",
                  border:`1px solid ${STATUS_COLORS[p.status]}44`, fontSize:12, color:STATUS_COLORS[p.status] }}>
                  {STATUS_ICONS[p.status]} {p.status}
                </div>
                <button onClick={()=>openEdit(p)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"var(--text4)", padding:"4px" }}>✏️</button>
                <button onClick={()=>remove(p.id)} style={{ background:"none", border:"none", color:"var(--text4)", cursor:"pointer", fontSize:20, padding:"0 4px" }}>×</button>
              </div>
            </div>
            <div style={{ borderTop:"1px solid var(--border2)", marginTop:10, paddingTop:10, display:"flex", justifyContent:"space-between" }}>
              <div style={{ fontSize:13, color:"var(--text3)" }}>→ {p.nextAction||"No next action"}</div>
              {p.due && <div style={{ fontSize:11, color:"var(--text5)" }}>📅 {fmtDate(p.due)}</div>}
            </div>
            {/* Status quick-change */}
            <div style={{ marginTop:10, display:"flex", gap:5, flexWrap:"wrap" }}>
              {(["Not Started","In Progress","Done","On Hold"] as const).map(s=>(
                <button key={s} onClick={()=>setProjects(prev=>prev.map(pp=>pp.id===p.id?{...pp,status:s}:pp))}
                  style={{ padding:"4px 9px", borderRadius:6, border:`1px solid ${STATUS_COLORS[s]}44`,
                    background: p.status===s ? STATUS_COLORS[s]+"33" : "transparent",
                    color: p.status===s ? STATUS_COLORS[s] : "var(--text5)",
                    fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
                  {STATUS_ICONS[s]} {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {projects.length===0 && (
        <div className="sb-card" style={{ padding:"40px 20px", textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12, animation:"float 3s ease-in-out infinite" }}>📁</div>
          <div style={{ fontSize:15, color:"var(--text3)", marginBottom:16 }}>No projects yet</div>
          <button className="sb-btn" onClick={openAdd}>+ Create First Project</button>
        </div>
      )}
    </div>
  );
}
