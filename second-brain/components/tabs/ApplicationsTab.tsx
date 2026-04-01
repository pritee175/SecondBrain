"use client";
import { useState } from "react";
import type { Application } from "@/types";
import { APP_STATUSES, APP_STATUS_COLORS } from "@/lib/constants";
import { uid, todayISO, fmtDate } from "@/lib/utils";
import { SectionHeader, FilterBar, EmptyState } from "../ui";

const STATUS_ICONS: Record<string,string> = { Applied:"📤",Interview:"🎯",Offer:"🎉",Rejected:"❌",Ghosted:"👻",Saved:"📌" };

interface Props { applications:Application[]; setApplications:(fn:(p:Application[])=>Application[])=>void; }

export default function ApplicationsTab({ applications, setApplications }: Props) {
  const [company,setCompany]=useState(""); const [role,setRole]=useState(""); const [status,setStatus]=useState<Application["status"]>("Applied"); const [date,setDate]=useState(todayISO()); const [notes,setNotes]=useState("");
  const [editId,setEditId]=useState<string|null>(null); const [filter,setFilter]=useState("All"); const [deletingId,setDeletingId]=useState<string|null>(null);

  function save() {
    if (!company.trim()) return;
    if (editId) setApplications(p=>p.map(a=>a.id===editId?{...a,company,role,status,date,notes}:a));
    else setApplications(p=>[{id:uid(),company,role,status,date,notes},...p]);
    setCompany("");setRole("");setNotes("");setDate(todayISO());setEditId(null);
  }
  function openEdit(a: Application) { setCompany(a.company);setRole(a.role);setStatus(a.status);setDate(a.date);setNotes(a.notes);setEditId(a.id); window.scrollTo({top:0,behavior:"smooth"}); }
  function remove(id:string) { setDeletingId(id); setTimeout(()=>{setApplications(p=>p.filter(a=>a.id!==id));setDeletingId(null);},300); }
  const filtered = applications.filter(a=>filter==="All"||a.status===filter);

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader eyebrow="JOB HUNT" title="Applications"/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {APP_STATUSES.map(s=>(
          <div key={s} className="sb-card hover-lift" style={{padding:"8px 12px",textAlign:"center",border:`1px solid ${APP_STATUS_COLORS[s]}33`,minWidth:62,cursor:"pointer"}} onClick={()=>setFilter(filter===s?"All":s)}>
            <div style={{fontSize:20}}>{STATUS_ICONS[s]}</div>
            <div style={{fontSize:15,fontWeight:700,color:APP_STATUS_COLORS[s]}}>{applications.filter(a=>a.status===s).length}</div>
            <div style={{fontSize:9,color:"var(--text4)"}}>{s.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div className="sb-card" style={{padding:"14px",border:editId?"1px solid var(--accent)44":"1px solid var(--border)"}}>
        {editId&&<div style={{fontSize:12,color:"var(--accent-dim)",marginBottom:10}}>✏️ Editing application</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <input className="sb-input" value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company..."/>
          <input className="sb-input" value={role} onChange={e=>setRole(e.target.value)} placeholder="Role..."/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <select className="sb-input" value={status} onChange={e=>setStatus(e.target.value as Application["status"])}>{APP_STATUSES.map(s=><option key={s}>{STATUS_ICONS[s]} {s}</option>)}</select>
          <input className="sb-input" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <input className="sb-input" style={{flex:1}} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes..."/>
          <button className="sb-btn" onClick={save} style={{flexShrink:0}}>{editId?"SAVE":"ADD"}</button>
          {editId&&<button className="sb-btn-ghost" onClick={()=>{setEditId(null);setCompany("");}} style={{flexShrink:0}}>Cancel</button>}
        </div>
      </div>
      <FilterBar options={["All",...APP_STATUSES]} active={filter} onChange={setFilter} colors={{All:"var(--accent)",...APP_STATUS_COLORS}}/>
      {filtered.length===0&&applications.length===0&&<EmptyState icon="💼" title="No applications yet" sub="Start tracking your job hunt"/>}
      <div className="stagger" style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(a=>(
          <div key={a.id} className={`sb-card hover-lift card-entrance ${deletingId===a.id?"deleting":""}`} style={{padding:"14px",borderLeft:`3px solid ${APP_STATUS_COLORS[a.status]}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{fontSize:20}}>{STATUS_ICONS[a.status]}</span>
                  <div style={{fontSize:16,fontWeight:600,color:"#fff"}}>{a.company}</div>
                </div>
                <div style={{fontSize:13,color:"var(--text3)"}}>{a.role}</div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <div style={{padding:"4px 10px",borderRadius:8,background:APP_STATUS_COLORS[a.status]+"18",border:`1px solid ${APP_STATUS_COLORS[a.status]}44`,fontSize:11,color:APP_STATUS_COLORS[a.status]}}>{a.status}</div>
                <button onClick={()=>openEdit(a)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text4)",padding:"4px"}}>✏️</button>
                <button onClick={()=>remove(a.id)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:20,padding:"0 4px"}}>×</button>
              </div>
            </div>
            {a.notes&&<div style={{marginTop:8,fontSize:13,color:"var(--text4)"}}>→ {a.notes}</div>}
            <div style={{marginTop:6,fontSize:11,color:"var(--text5)"}}>Applied {fmtDate(a.date)}</div>
            {/* Quick status update */}
            <div style={{marginTop:10,display:"flex",gap:4,flexWrap:"wrap"}}>
              {APP_STATUSES.map(s=>(
                <button key={s} onClick={()=>setApplications(p=>p.map(ap=>ap.id===a.id?{...ap,status:s}:ap))}
                  style={{padding:"3px 8px",borderRadius:6,border:`1px solid ${APP_STATUS_COLORS[s]}33`,
                    background:a.status===s?APP_STATUS_COLORS[s]+"22":"transparent",
                    color:a.status===s?APP_STATUS_COLORS[s]:"var(--text5)",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>
                  {STATUS_ICONS[s]} {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
