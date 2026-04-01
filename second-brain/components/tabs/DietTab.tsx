"use client";
import { useState } from "react";
import type { Meal } from "@/types";
import { uid, todayISO } from "@/lib/utils";
import { SectionHeader, StatCard, ProgressBar, EmptyState } from "../ui";

interface Props { meals:Meal[]; setMeals:(fn:(p:Meal[])=>Meal[])=>void; water:number; setWater:(fn:(p:number)=>number)=>void; }

export default function DietTab({ meals, setMeals, water, setWater }: Props) {
  const [name,setName]=useState(""); const [cal,setCal]=useState(""); const [prot,setProt]=useState(""); const [carb,setCarb]=useState(""); const [fat,setFat]=useState("");
  const [editId,setEditId]=useState<string|null>(null);
  const [deletingId,setDeletingId]=useState<string|null>(null);

  const todayMeals = meals.filter(m=>m.date===todayISO());
  const totCal=todayMeals.reduce((a,m)=>a+m.cal,0), totP=todayMeals.reduce((a,m)=>a+m.p,0),
        totC=todayMeals.reduce((a,m)=>a+m.c,0),   totF=todayMeals.reduce((a,m)=>a+m.f,0);

  function save() {
    if (!name.trim()) return;
    const entry = {id:uid(),name,cal:+cal||0,p:+prot||0,c:+carb||0,f:+fat||0,date:todayISO()};
    if (editId) setMeals(p=>p.map(m=>m.id===editId?{...m,...entry,id:editId}:m));
    else setMeals(p=>[...p,entry]);
    setName("");setCal("");setProt("");setCarb("");setFat("");setEditId(null);
  }
  function openEdit(m: Meal) { setName(m.name);setCal(String(m.cal));setProt(String(m.p));setCarb(String(m.c));setFat(String(m.f));setEditId(m.id); }
  function remove(id:string) { setDeletingId(id); setTimeout(()=>{setMeals(p=>p.filter(m=>m.id!==id));setDeletingId(null);},300); }

  const calPct = Math.min(100,(totCal/2000)*100);
  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader eyebrow="NUTRITION" title="Diet Tracker"/>
      <div className="grid-2 stagger">
        <StatCard label="CALORIES" value={totCal} sub="/ 2000 kcal" color={totCal>2000?"#ef4444":"#4ade80"}/>
        <StatCard label="PROTEIN"  value={`${totP}g`} sub="today" color="#60a5fa"/>
        <StatCard label="CARBS"    value={`${totC}g`} sub="today" color="#fb923c"/>
        <StatCard label="FAT"      value={`${totF}g`} sub="today" color="#f472b6"/>
      </div>
      <div className="sb-card" style={{padding:"14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <div className="sb-label">CALORIE PROGRESS</div>
          <div style={{fontSize:13,color:totCal>2000?"#ef4444":"#4ade80",fontWeight:700}}>{Math.round(calPct)}%</div>
        </div>
        <div style={{height:10,background:"var(--border)",borderRadius:5,overflow:"hidden",marginBottom:16}}>
          <div style={{height:"100%",width:`${calPct}%`,
            background:totCal>2000?"linear-gradient(90deg,#ef444488,#ef4444)":"linear-gradient(90deg,#4ade8055,#4ade80)",
            borderRadius:5,transition:"width 0.6s cubic-bezier(.16,1,.3,1)"}}/>
        </div>
        <div className="sb-label" style={{marginBottom:10}}>WATER ({water}/8 glasses)</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {Array.from({length:8}).map((_,i)=>(
            <div key={i} onClick={()=>setWater(()=>i<water?i:i+1)} style={{
              width:40,height:48,borderRadius:10,cursor:"pointer",
              background:i<water?"#0ea5e922":"var(--border)",
              border:`2px solid ${i<water?"#0ea5e9":"var(--text5)"}`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
              transition:"all 0.2s",transform:i<water?"scale(1.05)":"scale(1)",
              boxShadow:i<water?"0 0 10px #0ea5e944":"none",
            }}>{i<water?"💧":""}</div>
          ))}
        </div>
      </div>
      <div className="sb-card" style={{padding:"14px",border:editId?"1px solid var(--accent)44":"1px solid var(--border)"}}>
        {editId&&<div style={{fontSize:12,color:"var(--accent-dim)",marginBottom:10}}>✏️ Editing meal</div>}
        <div className="sb-label" style={{marginBottom:10}}>LOG MEAL</div>
        <input className="sb-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Meal name..." style={{marginBottom:10}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <input className="sb-input" type="number" value={cal}  onChange={e=>setCal(e.target.value)}  placeholder="Calories"/>
          <input className="sb-input" type="number" value={prot} onChange={e=>setProt(e.target.value)} placeholder="Protein g"/>
          <input className="sb-input" type="number" value={carb} onChange={e=>setCarb(e.target.value)} placeholder="Carbs g"/>
          <input className="sb-input" type="number" value={fat}  onChange={e=>setFat(e.target.value)}  placeholder="Fat g"/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="sb-btn" onClick={save} style={{flex:1}}>{editId?"SAVE":"LOG MEAL"}</button>
          {editId&&<button className="sb-btn-ghost" onClick={()=>{setEditId(null);setName("");}} style={{flexShrink:0}}>Cancel</button>}
        </div>
      </div>
      {todayMeals.length===0&&<EmptyState icon="🥗" title="No meals logged today" sub="Track your nutrition above"/>}
      <div className="stagger" style={{display:"flex",flexDirection:"column",gap:8}}>
        {todayMeals.map(m=>(
          <div key={m.id} className={`sb-card hover-lift card-entrance ${deletingId===m.id?"deleting":""}`} style={{padding:"13px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:15,color:"#fff",fontWeight:600}}>{m.name}</div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>openEdit(m)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text4)",padding:"4px"}}>✏️</button>
                <button onClick={()=>remove(m.id)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:20,padding:"0 4px"}}>×</button>
              </div>
            </div>
            <div style={{display:"flex",gap:12,fontSize:13,flexWrap:"wrap"}}>
              <span style={{color:"#fb923c",fontWeight:600}}>{m.cal} kcal</span>
              <span style={{color:"var(--text3)"}}>P:{m.p}g</span>
              <span style={{color:"var(--text3)"}}>C:{m.c}g</span>
              <span style={{color:"var(--text3)"}}>F:{m.f}g</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
