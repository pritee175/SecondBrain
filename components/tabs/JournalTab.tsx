"use client";
import { useState } from "react";
import type { JournalEntry } from "@/types";
import { MOODS } from "@/lib/constants";
import { uid, todayStr } from "@/lib/utils";
import { SectionHeader, Tag } from "../ui";

interface Props { journals: JournalEntry[]; setJournals:(fn:(p:JournalEntry[])=>JournalEntry[])=>void; }

export default function JournalTab({ journals, setJournals }: Props) {
  const [text,setText]=useState(""); const [mood,setMood]=useState(2); const [tags,setTags]=useState("");
  const [expanded,setExpanded]=useState<string|null>(null);
  const [deletingId,setDeletingId]=useState<string|null>(null);
  const [editId,setEditId]=useState<string|null>(null);

  function save() {
    if (!text.trim()) return;
    const tagList = tags.split(",").map(t=>t.trim()).filter(Boolean);
    if (editId) {
      setJournals(p=>p.map(j=>j.id===editId?{...j,text,mood,tags:tagList}:j));
      setEditId(null);
    } else {
      setJournals(p=>[{id:uid(),text,mood,tags:tagList,date:todayStr()},...p]);
    }
    setText(""); setTags("");
  }

  function openEdit(j: JournalEntry) {
    setText(j.text); setMood(j.mood); setTags(j.tags.join(", ")); setEditId(j.id);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function remove(id:string) {
    setDeletingId(id);
    setTimeout(()=>{ setJournals(p=>p.filter(j=>j.id!==id)); setDeletingId(null); },300);
  }

  const moodCounts = MOODS.map((_,i)=>journals.filter(j=>j.mood===i).length);

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <SectionHeader eyebrow="REFLECTION LIBRARY" title="Journal" />

      {/* Mood stats */}
      {journals.length>0 && (
        <div className="sb-card" style={{ padding:"14px" }}>
          <div className="sb-label" style={{ marginBottom:10 }}>MOOD OVERVIEW</div>
          <div style={{ display:"flex", gap:6 }}>
            {MOODS.map((m,i)=>moodCounts[i]>0 && (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                flex:1, padding:"8px 4px", borderRadius:8, background:m.c+"18", border:`1px solid ${m.c}33` }}>
                <span style={{ fontSize:20 }}>{m.e}</span>
                <span style={{ fontSize:14, fontWeight:700, color:m.c }}>{moodCounts[i]}</span>
                <span style={{ fontSize:9, color:"var(--text4)" }}>{m.l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write */}
      <div className="sb-card" style={{ padding:"16px", border:editId?"1px solid var(--accent)44":"1px solid var(--border)" }}>
        {editId && <div style={{ fontSize:12,color:"var(--accent-dim)",marginBottom:10 }}>✏️ Editing entry</div>}
        <div style={{ fontSize:11, color:"var(--text4)", marginBottom:10, letterSpacing:"0.1em" }}>
          {editId ? "UPDATE ENTRY" : `NEW ENTRY · ${todayStr()}`}
        </div>
        <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
          {MOODS.map((m,i)=>(
            <button key={i} onClick={()=>setMood(i)} style={{
              background: mood===i ? m.c+"22" : "transparent",
              border:`2px solid ${mood===i?m.c:"var(--border)"}`,
              borderRadius:10, padding:"6px 10px", cursor:"pointer", fontSize:22,
              minHeight:48, transition:"all 0.2s",
              transform: mood===i ? "scale(1.15)" : "scale(1)",
              boxShadow: mood===i ? `0 0 15px ${m.c}44` : "none",
            }}>{m.e}</button>
          ))}
          <span style={{ fontSize:13, color:MOODS[mood].c, fontWeight:600 }}>{MOODS[mood].l}</span>
        </div>
        <textarea className="sb-input" value={text} onChange={e=>setText(e.target.value)}
          placeholder={"What happened today?\nWhat are you grateful for?\nWhat will you do better tomorrow?"}
          rows={5} style={{ resize:"none", lineHeight:1.7, marginBottom:10 }}/>
        <div style={{ display:"flex", gap:8 }}>
          <input className="sb-input" style={{ flex:1 }} value={tags} onChange={e=>setTags(e.target.value)} placeholder="Tags (comma separated)..." />
          <button className="sb-btn" onClick={save} style={{ flexShrink:0 }}>{editId?"SAVE":"SAVE ✨"}</button>
          {editId && <button className="sb-btn-ghost" onClick={()=>{setEditId(null);setText("");}} style={{flexShrink:0}}>Cancel</button>}
        </div>
      </div>

      {journals.length===0 && (
        <div className="sb-card" style={{ padding:"40px 20px", textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12, animation:"float 3s ease-in-out infinite" }}>📖</div>
          <div style={{ fontSize:15, color:"var(--text3)", marginBottom:6 }}>Your journal is empty</div>
          <div style={{ fontSize:13, color:"var(--text5)" }}>Start writing your first reflection above</div>
        </div>
      )}

      <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {journals.map(j=>(
          <div key={j.id} className={`sb-card hover-lift card-entrance ${deletingId===j.id?"deleting":""}`}
            style={{ padding:"14px", cursor:"pointer" }} onClick={()=>setExpanded(expanded===j.id?null:j.id)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:24 }}>{MOODS[j.mood].e}</span>
                <div>
                  <div style={{ fontSize:14, color:"#fff" }}>{j.text.substring(0,50)}{j.text.length>50&&expanded!==j.id?"…":""}</div>
                  <div style={{ fontSize:11, color:"var(--text4)", marginTop:2 }}>{j.date}</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                {j.tags.slice(0,2).map((t,i)=><Tag key={i}>{t}</Tag>)}
                <button onClick={e=>{e.stopPropagation();openEdit(j);}}
                  style={{ background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text4)",padding:"4px" }}>✏️</button>
                <button onClick={e=>{e.stopPropagation();remove(j.id);}}
                  style={{ background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:20,padding:"0 4px" }}>×</button>
              </div>
            </div>
            {expanded===j.id && (
              <div className="slide-up" style={{ marginTop:12, fontSize:14, color:"var(--text2)", lineHeight:1.75,
                whiteSpace:"pre-wrap", borderTop:"1px solid var(--border2)", paddingTop:12 }}>
                {j.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
