"use client";
import { useState } from "react";
import type { CalendarEvent } from "@/types";
import { EVENT_TYPE_COLORS } from "@/lib/constants";
import { uid, todayISO, fmtDate } from "@/lib/utils";
import { SectionHeader, EmptyState } from "../ui";

interface Props { events: CalendarEvent[]; setEvents:(fn:(p:CalendarEvent[])=>CalendarEvent[])=>void; }
const ET = ["Work","Personal","Health","Social","Learning"] as const;

export default function EventsTab({ events, setEvents }: Props) {
  const [title,setTitle]=useState(""); const [date,setDate]=useState(""); const [time,setTime]=useState(""); const [type,setType]=useState<CalendarEvent["type"]>("Work");
  const [editId,setEditId]=useState<string|null>(null);
  const [deletingId,setDeletingId]=useState<string|null>(null);

  function save() {
    if (!title.trim()||!date) return;
    if (editId) setEvents(p=>p.map(e=>e.id===editId?{...e,title,date,time,type}:e));
    else setEvents(p=>[...p,{id:uid(),title,date,time,type}]);
    setTitle(""); setDate(""); setTime(""); setEditId(null);
  }
  function openEdit(e: CalendarEvent) { setTitle(e.title);setDate(e.date);setTime(e.time);setType(e.type);setEditId(e.id); window.scrollTo({top:0,behavior:"smooth"}); }
  function remove(id:string) { setDeletingId(id); setTimeout(()=>{setEvents(p=>p.filter(e=>e.id!==id));setDeletingId(null);},300); }

  const upcoming = events.filter(e=>e.date>=todayISO()).sort((a,b)=>a.date.localeCompare(b.date));
  const past = events.filter(e=>e.date<todayISO()).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader eyebrow="SCHEDULE" title="Events" />
      <div className="sb-card" style={{padding:"14px",border:editId?"1px solid var(--accent)44":"1px solid var(--border)"}}>
        {editId && <div style={{fontSize:12,color:"var(--accent-dim)",marginBottom:10}}>✏️ Editing event</div>}
        <input className="sb-input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Event title..." style={{marginBottom:10}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <input className="sb-input" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
          <input className="sb-input" type="time" value={time} onChange={e=>setTime(e.target.value)}/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
          {ET.map(t=>(
            <button key={t} onClick={()=>setType(t)} style={{
              padding:"6px 12px",borderRadius:8,border:`1px solid ${EVENT_TYPE_COLORS[t]}`,
              background:type===t?EVENT_TYPE_COLORS[t]+"33":"transparent",
              color:type===t?EVENT_TYPE_COLORS[t]:"var(--text4)",fontSize:12,cursor:"pointer",
              fontFamily:"inherit",transition:"all 0.2s",
            }}>{t}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="sb-btn" onClick={save} style={{flex:1}}>{editId?"SAVE CHANGES":"ADD EVENT"}</button>
          {editId&&<button className="sb-btn-ghost" onClick={()=>{setEditId(null);setTitle("");}} style={{flexShrink:0}}>Cancel</button>}
        </div>
      </div>
      {upcoming.length>0&&<><div className="sb-label">UPCOMING ({upcoming.length})</div>
        <div className="stagger" style={{display:"flex",flexDirection:"column",gap:8}}>
          {upcoming.map(e=>(
            <div key={e.id} className={`sb-card hover-lift card-entrance ${deletingId===e.id?"deleting":""}`} style={{padding:"13px 14px",display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:4,borderRadius:4,alignSelf:"stretch",background:EVENT_TYPE_COLORS[e.type],flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:15,color:"#fff"}}>{e.title}</div>
                <div style={{fontSize:12,color:"var(--text4)",marginTop:2}}>{fmtDate(e.date)}{e.time&&` · ${e.time}`} · <span style={{color:EVENT_TYPE_COLORS[e.type]}}>{e.type}</span></div>
              </div>
              <button onClick={()=>openEdit(e)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text4)",padding:"4px"}}>✏️</button>
              <button onClick={()=>remove(e.id)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:20,padding:"0 4px"}}>×</button>
            </div>
          ))}
        </div></>}
      {past.length>0&&<><div className="sb-label" style={{marginTop:6}}>PAST</div>
        {past.map(e=>(
          <div key={e.id} className="sb-card" style={{padding:"10px 14px",display:"flex",gap:12,alignItems:"center",opacity:0.4}}>
            <div style={{width:4,borderRadius:4,alignSelf:"stretch",background:EVENT_TYPE_COLORS[e.type]}}/>
            <div style={{flex:1,fontSize:13,color:"var(--text2)"}}>{e.title} · {fmtDate(e.date)}</div>
            <button onClick={()=>remove(e.id)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:18}}>×</button>
          </div>
        ))}</>}
      {events.length===0&&<EmptyState icon="📅" title="No events yet" sub="Schedule your first event above"/>}
    </div>
  );
}
