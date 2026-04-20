"use client";
import { useState } from "react";
import type { FinanceEntry } from "@/types";
import { FINANCE_CATS } from "@/lib/constants";
import { uid, todayISO, fmtDate, weekStart, monthStart } from "@/lib/utils";
import { SectionHeader, EmptyState } from "../ui";

interface Props { finances:FinanceEntry[]; setFinances:(fn:(p:FinanceEntry[])=>FinanceEntry[])=>void; }

type Range = "today"|"week"|"month"|"all";
const RANGE_LABELS: Record<Range,string> = { today:"Today", week:"This Week", month:"This Month", all:"All Time" };

export default function FinanceTab({ finances, setFinances }: Props) {
  const [type,setType]=useState<"Income"|"Expense">("Expense"); const [amt,setAmt]=useState(""); const [cat,setCat]=useState("Food"); const [desc,setDesc]=useState("");
  const [range, setRange] = useState<Range>("today");
  const [deletingId,setDeletingId]=useState<string|null>(null);

  function getRangeEntries() {
    const today = todayISO(), ws = weekStart(), ms = monthStart();
    switch (range) {
      case "today": return finances.filter(f=>f.date===today);
      case "week":  return finances.filter(f=>f.date>=ws);
      case "month": return finances.filter(f=>f.date>=ms);
      default:      return finances;
    }
  }

  const filtered = getRangeEntries();
  const inc = filtered.filter(f=>f.type==="Income").reduce((a,f)=>a+f.amt,0);
  const exp = filtered.filter(f=>f.type==="Expense").reduce((a,f)=>a+f.amt,0);
  const net = inc - exp;

  function add() {
    if (!amt||isNaN(+amt)) return;
    setFinances(p=>[{id:uid(),type,amt:+amt,cat,desc,date:todayISO()},...p]);
    setAmt(""); setDesc("");
  }
  function remove(id:string) { setDeletingId(id); setTimeout(()=>{setFinances(p=>p.filter(f=>f.id!==id));setDeletingId(null);},300); }

  // Category breakdown for current range
  const expBycat: Record<string,number> = {};
  filtered.filter(f=>f.type==="Expense").forEach(f=>{ expBycat[f.cat]=(expBycat[f.cat]??0)+f.amt; });
  const topCats = Object.entries(expBycat).sort((a,b)=>b[1]-a[1]).slice(0,4);

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:12}}>
      <SectionHeader eyebrow="MONEY" title="Finance Tracker"/>

      {/* Range selector */}
      <div style={{ display:"flex", gap:6 }}>
        {(Object.keys(RANGE_LABELS) as Range[]).map(r=>(
          <button key={r} onClick={()=>setRange(r)} style={{
            flex:1, padding:"8px 4px", borderRadius:8, border:`1px solid ${range===r?"var(--accent)":"var(--border)"}`,
            background:range===r?"var(--accent)18":"var(--surface)", color:range===r?"var(--accent-dim)":"var(--text4)",
            fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:range===r?600:400,
          }}>{RANGE_LABELS[r]}</button>
        ))}
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9 }}>
        <div className="sb-card" style={{padding:"12px 10px",textAlign:"center"}}>
          <div className="sb-label" style={{marginBottom:4,fontSize:9}}>INCOME</div>
          <div style={{fontSize:16,fontWeight:700,color:"#4ade80"}}>₹{inc.toFixed(0)}</div>
        </div>
        <div className="sb-card" style={{padding:"12px 10px",textAlign:"center"}}>
          <div className="sb-label" style={{marginBottom:4,fontSize:9}}>EXPENSES</div>
          <div style={{fontSize:16,fontWeight:700,color:"#ef4444"}}>₹{exp.toFixed(0)}</div>
        </div>
        <div className="sb-card" style={{padding:"12px 10px",textAlign:"center"}}>
          <div className="sb-label" style={{marginBottom:4,fontSize:9}}>NET</div>
          <div style={{fontSize:16,fontWeight:700,color:net>=0?"#4ade80":"#ef4444"}}>{net>=0?"+":""}₹{net.toFixed(0)}</div>
        </div>
      </div>

      {/* Top expense categories */}
      {topCats.length>0 && (
        <div className="sb-card" style={{padding:"13px 14px"}}>
          <div className="sb-label" style={{marginBottom:10}}>TOP EXPENSES</div>
          {topCats.map(([cat,amt])=>(
            <div key={cat} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <div style={{fontSize:12,color:"var(--text2)"}}>{cat}</div>
                <div style={{fontSize:12,color:"#ef4444"}}>₹{amt.toFixed(0)}</div>
              </div>
              <div style={{height:4,background:"var(--border)",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(100,(amt/exp)*100)}%`,background:"linear-gradient(90deg,#ef444477,#ef4444)",borderRadius:4}}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      <div className="sb-card" style={{padding:14,display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",gap:8}}>
          {(["Income","Expense"] as const).map(t=>(
            <button key={t} onClick={()=>{setType(t);setCat(FINANCE_CATS[t][0]);}} className="sb-btn"
              style={{flex:1,background:type===t?(t==="Income"?"linear-gradient(135deg,#16a34a,#4ade80)":"linear-gradient(135deg,#dc2626,#ef4444)"):"var(--surface)",
                border:`1px solid ${type===t?"transparent":"var(--border)"}`,
                boxShadow:type===t?"0 4px 15px "+(t==="Income"?"#4ade8033":"#ef444433"):"none"}}>
              {t==="Income"?"💰":"💸"} {t}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <input className="sb-input" type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="Amount (₹)"/>
          <select className="sb-input" value={cat} onChange={e=>setCat(e.target.value)}>{FINANCE_CATS[type].map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <div style={{display:"flex",gap:8}}>
          <input className="sb-input" style={{flex:1}} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description..." onKeyDown={e=>e.key==="Enter"&&add()}/>
          <button className="sb-btn" onClick={add} style={{flexShrink:0}}>LOG</button>
        </div>
      </div>

      {filtered.length===0 && <EmptyState icon="💰" title={`No transactions for ${RANGE_LABELS[range].toLowerCase()}`} />}
      <div className="stagger" style={{display:"flex",flexDirection:"column",gap:7}}>
        {filtered.map(f=>(
          <div key={f.id} className={`sb-card hover-lift card-entrance ${deletingId===f.id?"deleting":""}`} style={{padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:f.type==="Income"?"#4ade8022":"#ef444422",border:`1px solid ${f.type==="Income"?"#4ade8044":"#ef444444"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{f.type==="Income"?"💰":"💸"}</div>
              <div><div style={{fontSize:14,color:"#fff"}}>{f.desc||f.cat}</div><div style={{fontSize:11,color:"var(--text4)"}}>{f.cat} · {fmtDate(f.date)}</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:14,fontWeight:700,color:f.type==="Income"?"#4ade80":"#ef4444"}}>{f.type==="Income"?"+":"-"}₹{f.amt.toFixed(2)}</div>
              <button onClick={()=>remove(f.id)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:20,padding:"0 4px"}}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
