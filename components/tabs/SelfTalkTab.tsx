"use client";
import { useState } from "react";
import type { SelfTalk } from "@/types";
import { SELF_QUESTIONS } from "@/lib/constants";
import { uid, todayStr } from "@/lib/utils";
import { SectionHeader, Tag } from "../ui";

interface Props { selfTalks:SelfTalk[]; setSelfTalks:(fn:(p:SelfTalk[])=>SelfTalk[])=>void; }
const CATS = Object.keys(SELF_QUESTIONS);
const CAT_COLORS: Record<string,string> = { "🌅 Morning":"#fb923c","🌙 Evening":"#a78bfa","📅 Weekly":"#60a5fa","🔮 Deep Dive":"#f472b6" };

export default function SelfTalkTab({ selfTalks, setSelfTalks }: Props) {
  const [cat,setCat]=useState(CATS[0]); const [idx,setIdx]=useState(0); const [answer,setAnswer]=useState("");
  const [deletingId,setDeletingId]=useState<string|null>(null);
  const questions=SELF_QUESTIONS[cat], currentQ=questions[idx];

  function save() {
    if (!answer.trim()) return;
    setSelfTalks(p=>[{id:uid(),cat,q:currentQ,a:answer,date:todayStr()},...p]);
    setAnswer("");
  }
  function remove(id:string) { setDeletingId(id); setTimeout(()=>{setSelfTalks(p=>p.filter(s=>s.id!==id));setDeletingId(null);},300); }

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader eyebrow="INNER VOICE" title="Self Talk"/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>{setCat(c);setIdx(0);setAnswer("");}} style={{
            background:cat===c?CAT_COLORS[c]+"22":"var(--surface)",
            border:`2px solid ${cat===c?CAT_COLORS[c]:"var(--border)"}`,
            borderRadius:10,color:cat===c?CAT_COLORS[c]:"var(--text3)",
            padding:"8px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit",minHeight:44,
            boxShadow:cat===c?`0 4px 15px ${CAT_COLORS[c]}33`:"none",
            transform:cat===c?"scale(1.03)":"scale(1)", transition:"all 0.2s",
          }}>{c}</button>
        ))}
      </div>
      {/* Question card */}
      <div className="sb-card glow-card" style={{padding:"24px 18px",textAlign:"center",background:`linear-gradient(135deg,#0f0f2a,${CAT_COLORS[cat]}11)`,border:`1px solid ${CAT_COLORS[cat]}33`}}>
        <div style={{fontSize:9,color:CAT_COLORS[cat],letterSpacing:"0.18em",marginBottom:12}}>QUESTION {idx+1} OF {questions.length}</div>
        {/* Progress dots */}
        <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:16}}>
          {questions.map((_,i)=>(
            <div key={i} onClick={()=>{setIdx(i);setAnswer("");}} style={{
              width:i===idx?20:6, height:6, borderRadius:4,
              background:i===idx?CAT_COLORS[cat]:i<idx?"var(--accent)":"var(--border)",
              cursor:"pointer", transition:"all 0.3s",
            }}/>
          ))}
        </div>
        <div style={{fontSize:17,color:"#fff",lineHeight:1.7,marginBottom:18,fontWeight:600,fontStyle:"italic"}}>"{currentQ}"</div>
        <textarea className="sb-input" value={answer} onChange={e=>setAnswer(e.target.value)}
          placeholder="Be honest with yourself..." rows={4}
          style={{resize:"none",lineHeight:1.65,textAlign:"left",marginBottom:14,
            border:`1px solid ${CAT_COLORS[cat]}33`}}/>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="sb-btn-ghost" onClick={()=>{setIdx((idx+1)%questions.length);setAnswer("");}}>NEXT →</button>
          <button className="sb-btn-ghost" onClick={()=>{setIdx(Math.floor(Math.random()*questions.length));setAnswer("");}}>RANDOM ⟳</button>
          <button className="sb-btn" onClick={save} style={{background:`linear-gradient(135deg,${CAT_COLORS[cat]},${CAT_COLORS[cat]}99)`}}>SAVE REFLECTION ✨</button>
        </div>
      </div>
      {selfTalks.length>0&&<>
        <div className="sb-label">PAST REFLECTIONS ({selfTalks.length})</div>
        <div className="stagger" style={{display:"flex",flexDirection:"column",gap:8}}>
          {selfTalks.map(s=>(
            <div key={s.id} className={`sb-card hover-lift card-entrance ${deletingId===s.id?"deleting":""}`} style={{padding:"14px",borderLeft:`3px solid ${CAT_COLORS[s.cat]||"var(--accent)"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <Tag color={CAT_COLORS[s.cat]||"var(--accent)"}>{s.cat}</Tag>
                  <span style={{fontSize:11,color:"var(--text5)"}}>{s.date}</span>
                </div>
                <button onClick={()=>remove(s.id)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:20,padding:"0 4px"}}>×</button>
              </div>
              <div style={{fontSize:12,color:"var(--text4)",marginBottom:6,fontStyle:"italic"}}>"{s.q}"</div>
              <div style={{fontSize:14,color:"var(--text2)",lineHeight:1.65}}>{s.a}</div>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}
