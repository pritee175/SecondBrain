"use client";
import { useState } from "react";
import type { CaptureItem } from "@/types";
import { AREAS, AREA_COLORS, AREA_ICONS } from "@/lib/constants";
import { uid, todayStr } from "@/lib/utils";
import { SectionHeader, EmptyState } from "../ui";

interface Props { captures:CaptureItem[]; setCaptures:(fn:(p:CaptureItem[])=>CaptureItem[])=>void; }

export default function InboxTab({ captures, setCaptures }: Props) {
  const [text,setText]=useState(""); const [area,setArea]=useState<CaptureItem["area"]>("Work / Career");
  const [editId,setEditId]=useState<string|null>(null); const [deletingId,setDeletingId]=useState<string|null>(null);

  function save() {
    if (!text.trim()) return;
    if (editId) setCaptures(p=>p.map(c=>c.id===editId?{...c,text,area}:c));
    else setCaptures(p=>[{id:uid(),text,area,date:todayStr()},...p]);
    setText(""); setEditId(null);
  }
  function openEdit(c: CaptureItem) { setText(c.text);setArea(c.area);setEditId(c.id); }
  function remove(id:string) { setDeletingId(id); setTimeout(()=>{setCaptures(p=>p.filter(c=>c.id!==id));setDeletingId(null);},300); }

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader eyebrow="CAPTURE" title="Idea Inbox"/>
      <div className="sb-card" style={{padding:"14px",border:editId?"1px solid var(--accent)44":"1px solid var(--border)"}}>
        {editId&&<div style={{fontSize:12,color:"var(--accent-dim)",marginBottom:10}}>✏️ Editing idea</div>}
        <textarea className="sb-input" value={text} onChange={e=>setText(e.target.value)}
          placeholder="Dump anything — ideas, links, thoughts..." rows={3}
          style={{resize:"none",lineHeight:1.6,marginBottom:10}} onKeyDown={e=>e.key==="Enter"&&e.ctrlKey&&save()}/>
        <div style={{display:"flex",gap:8}}>
          <select className="sb-input" style={{flex:1}} value={area} onChange={e=>setArea(e.target.value as CaptureItem["area"])}>{AREAS.map(a=><option key={a}>{a}</option>)}</select>
          <button className="sb-btn" onClick={save} style={{flexShrink:0}}>{editId?"SAVE":"CAPTURE ⊕"}</button>
          {editId&&<button className="sb-btn-ghost" onClick={()=>{setEditId(null);setText("");}} style={{flexShrink:0}}>Cancel</button>}
        </div>
      </div>
      <div className="sb-label">IDEAS ({captures.length})</div>
      {captures.length===0&&<EmptyState icon="💡" title="Nothing captured yet" sub="Start dumping ideas above"/>}
      <div className="stagger" style={{display:"flex",flexDirection:"column",gap:8}}>
        {captures.map(c=>(
          <div key={c.id} className={`sb-card hover-lift card-entrance ${deletingId===c.id?"deleting":""}`} style={{padding:"13px 14px",display:"flex",gap:10}}>
            <div style={{width:4,borderRadius:4,background:AREA_COLORS[c.area],alignSelf:"stretch",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:15,color:"#fff",lineHeight:1.6}}>{c.text}</div>
              <div style={{fontSize:12,color:AREA_COLORS[c.area],marginTop:5}}>{AREA_ICONS[c.area]} {c.area} · {c.date}</div>
            </div>
            <div style={{display:"flex",gap:4,flexShrink:0}}>
              <button onClick={()=>openEdit(c)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text4)",padding:"4px"}}>✏️</button>
              <button onClick={()=>remove(c.id)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:20,padding:"0 4px"}}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
