"use client";
import { useState } from "react";
import type { SavedPost } from "@/types";
import { PLATFORM_COLORS } from "@/lib/constants";
import { uid, todayStr } from "@/lib/utils";
import { SectionHeader, FilterBar, Tag, EmptyState } from "../ui";

const PLATFORMS = ["YouTube","Instagram","Telegram"] as const;
const P_ICONS: Record<string,string> = { YouTube:"▶️", Instagram:"📷", Telegram:"✈️" };

interface Props { savedPosts:SavedPost[]; setSavedPosts:(fn:(p:SavedPost[])=>SavedPost[])=>void; }

export default function SavedPostsTab({ savedPosts, setSavedPosts }: Props) {
  const [platform,setPlatform]=useState<SavedPost["platform"]>("YouTube"); const [title,setTitle]=useState(""); const [url,setUrl]=useState(""); const [notes,setNotes]=useState("");
  const [editId,setEditId]=useState<string|null>(null); const [filter,setFilter]=useState("All"); const [deletingId,setDeletingId]=useState<string|null>(null);

  function save() {
    if (!title.trim()) return;
    if (editId) setSavedPosts(p=>p.map(sp=>sp.id===editId?{...sp,platform,title,url,notes}:sp));
    else setSavedPosts(p=>[{id:uid(),platform,title,url,notes,date:todayStr()},...p]);
    setTitle("");setUrl("");setNotes("");setEditId(null);
  }
  function openEdit(p: SavedPost) { setPlatform(p.platform);setTitle(p.title);setUrl(p.url);setNotes(p.notes);setEditId(p.id); }
  function remove(id:string) { setDeletingId(id); setTimeout(()=>{setSavedPosts(p=>p.filter(sp=>sp.id!==id));setDeletingId(null);},300); }
  const filtered = savedPosts.filter(p=>filter==="All"||p.platform===filter);

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader eyebrow="BOOKMARKS" title="Saved Posts"/>
      <div className="sb-card" style={{padding:"14px",border:editId?"1px solid var(--accent)44":"1px solid var(--border)"}}>
        {editId&&<div style={{fontSize:12,color:"var(--accent-dim)",marginBottom:10}}>✏️ Editing post</div>}
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {PLATFORMS.map(p=>(
            <button key={p} onClick={()=>setPlatform(p)} className="sb-btn"
              style={{flex:1,fontSize:12,background:platform===p?PLATFORM_COLORS[p]:"var(--surface)",border:`1px solid ${platform===p?PLATFORM_COLORS[p]:"var(--border)"}`,boxShadow:platform===p?`0 4px 15px ${PLATFORM_COLORS[p]}44`:"none"}}>
              {P_ICONS[p]} {p}
            </button>
          ))}
        </div>
        <input className="sb-input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title / Post description..." style={{marginBottom:8}}/>
        <input className="sb-input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="URL (optional)..." style={{marginBottom:8}}/>
        <div style={{display:"flex",gap:8}}>
          <input className="sb-input" style={{flex:1}} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Why saving this?..."/>
          <button className="sb-btn" onClick={save} style={{flexShrink:0}}>{editId?"SAVE":"SAVE ★"}</button>
          {editId&&<button className="sb-btn-ghost" onClick={()=>{setEditId(null);setTitle("");}} style={{flexShrink:0}}>Cancel</button>}
        </div>
      </div>
      <FilterBar options={["All",...PLATFORMS]} active={filter} onChange={setFilter} colors={{All:"var(--accent)",YouTube:"#ff4444",Instagram:"#e1306c",Telegram:"#0088cc"}}/>
      {savedPosts.length===0&&<EmptyState icon="⭐" title="No posts saved yet" sub="Bookmark YouTube, Instagram & Telegram posts"/>}
      <div className="stagger" style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(p=>(
          <div key={p.id} className={`sb-card hover-lift card-entrance ${deletingId===p.id?"deleting":""}`} style={{padding:"13px 14px",borderLeft:`3px solid ${PLATFORM_COLORS[p.platform]}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:18}}>{P_ICONS[p.platform]}</span>
                  <Tag color={PLATFORM_COLORS[p.platform]}>{p.platform}</Tag>
                  <span style={{fontSize:11,color:"var(--text5)"}}>{p.date}</span>
                </div>
                <div style={{fontSize:15,color:"#fff",marginBottom:p.url||p.notes?5:0}}>{p.title}</div>
                {p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{display:"block",fontSize:12,color:"var(--accent)",marginBottom:4,wordBreak:"break-all"}}>{p.url}</a>}
                {p.notes&&<div style={{fontSize:13,color:"var(--text4)"}}>→ {p.notes}</div>}
              </div>
              <div style={{display:"flex",gap:4,flexShrink:0,marginLeft:8}}>
                <button onClick={()=>openEdit(p)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text4)",padding:"4px"}}>✏️</button>
                <button onClick={()=>remove(p.id)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:20,padding:"0 4px"}}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
