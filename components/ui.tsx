"use client";
import React from "react";

export function StatCard({ label, value, sub, color }: { label:string; value:string|number; sub:string; color:string }) {
  return (
    <div className="sb-card hover-lift card-entrance" style={{ padding:"14px 14px" }}>
      <div className="sb-label" style={{ marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:"-0.01em", animation:"numberRoll 0.4s ease" }}>{value}</div>
      <div style={{ fontSize:12, color:"var(--text4)", marginTop:3 }}>{sub}</div>
    </div>
  );
}

export function SectionHeader({ eyebrow, title, action }: { eyebrow:string; title:string; action?:React.ReactNode }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16 }}>
      <div>
        <div style={{ fontSize:10, color:"var(--accent)", letterSpacing:"0.18em", marginBottom:4, textTransform:"uppercase" }}>{eyebrow}</div>
        <h1 style={{ margin:0, fontSize:22, fontWeight:700, color:"#ffffff", letterSpacing:"0.01em" }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({ value, max=100, color, height=5 }: { value:number; max?:number; color:string; height?:number }) {
  const pct = Math.min(100, Math.round((value/max)*100));
  return (
    <div style={{ height, background:"var(--border)", borderRadius:4, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:4, transition:"width 0.6s cubic-bezier(.16,1,.3,1)" }} />
    </div>
  );
}

export function Tag({ children, color="var(--accent)" }: { children:React.ReactNode; color?:string }) {
  return (
    <span style={{ fontSize:10, background:color+"22", color, border:`1px solid ${color}44`, borderRadius:5, padding:"2px 8px" }}>
      {children}
    </span>
  );
}

export function FilterBar({ options, active, onChange, colors }: { options:string[]; active:string; onChange:(v:string)=>void; colors?:Record<string,string> }) {
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
      {options.map(o=>{
        const c = colors?.[o]??"var(--accent)";
        const isActive = active===o;
        return (
          <button key={o} onClick={()=>onChange(o)} style={{
            background: isActive ? c : "var(--surface)",
            border:`1px solid ${isActive?c:"var(--border)"}`,
            borderRadius:8, color: isActive?"#fff":"var(--text3)",
            padding:"6px 13px", fontSize:13, cursor:"pointer",
            fontFamily:"inherit", minHeight:38,
            transform: isActive?"scale(1.05)":"scale(1)",
            transition:"all 0.2s",
            boxShadow: isActive?`0 4px 12px ${c}44`:"none",
          }}>{o}</button>
        );
      })}
    </div>
  );
}

export function DeleteBtn({ onClick }: { onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{
      background:"none", border:"none", color:"var(--text4)", cursor:"pointer",
      fontSize:20, lineHeight:1, padding:"4px 6px", flexShrink:0,
      minWidth:36, minHeight:36, display:"flex", alignItems:"center", justifyContent:"center",
      transition:"color 0.15s, transform 0.15s",
    }}
    onMouseEnter={e=>{e.currentTarget.style.color="#ef4444";e.currentTarget.style.transform="scale(1.2)";}}
    onMouseLeave={e=>{e.currentTarget.style.color="var(--text4)";e.currentTarget.style.transform="scale(1)";}}>×</button>
  );
}

export function EmptyState({ icon, title, sub, onAdd, addLabel }: { icon:string; title:string; sub?:string; onAdd?:()=>void; addLabel?:string }) {
  return (
    <div className="sb-card" style={{ padding:"40px 20px", textAlign:"center" }}>
      <div style={{ fontSize:44, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>{icon}</div>
      <div style={{ fontSize:16, color:"var(--text3)", marginBottom:6 }}>{title}</div>
      {sub && <div style={{ fontSize:13, color:"var(--text5)", marginBottom:onAdd?16:0 }}>{sub}</div>}
      {onAdd && <button className="sb-btn" onClick={onAdd}>{addLabel??"+ Add"}</button>}
    </div>
  );
}
