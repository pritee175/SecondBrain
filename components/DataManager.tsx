"use client";
import { useState } from "react";

interface Props {
  userId: string;
  onClose: () => void;
}

function getAllData(userId: string) {
  const keys = [
    "habits","goals","projects","todos","journals","captures",
    "meals","waterLogs","applications","events","finances","savedPosts","selfTalks"
  ];
  const data: Record<string, unknown> = {};
  keys.forEach(k => {
    try { data[k] = JSON.parse(localStorage.getItem(`sb_${userId}_${k}`) ?? "null") ?? []; } catch { data[k] = []; }
  });
  return data;
}

function buildHtmlReport(data: Record<string, unknown>): string {
  const todos        = (data.todos        as Array<{text:string;priority:string;done:boolean;due:string}> ?? []);
  const habits       = (data.habits       as Array<{name:string;streak:number;area:string}> ?? []);
  const goals        = (data.goals        as Array<{goal:string;area:string;progress:number;milestone:string;dueDate:string}> ?? []);
  const projects     = (data.projects     as Array<{name:string;status:string;area:string;nextAction:string;due:string}> ?? []);
  const journals     = (data.journals     as Array<{text:string;date:string;mood:number;tags:string[]}> ?? []);
  const finances     = (data.finances     as Array<{type:string;amt:number;cat:string;desc:string;date:string}> ?? []);
  const applications = (data.applications as Array<{company:string;role:string;status:string;date:string;notes:string}> ?? []);
  const events       = (data.events       as Array<{title:string;date:string;time:string;type:string}> ?? []);
  const captures     = (data.captures     as Array<{text:string;area:string;date:string}> ?? []);
  const savedPosts   = (data.savedPosts   as Array<{platform:string;title:string;url:string;notes:string;date:string}> ?? []);
  const meals        = (data.meals        as Array<{name:string;cal:number;date:string}> ?? []);
  const selfTalks    = (data.selfTalks    as Array<{cat:string;q:string;a:string;date:string}> ?? []);

  const totalInc = finances.filter(f=>f.type==="Income").reduce((a,f)=>a+f.amt,0);
  const totalExp = finances.filter(f=>f.type==="Expense").reduce((a,f)=>a+f.amt,0);
  const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const moods = ["😤","😔","😐","🙂","😄"];

  const section = (title: string, content: string) => content.trim() ? `
    <div class="section">
      <h2>${title}</h2>
      ${content}
    </div>` : "";

  const badge = (text: string, color: string) =>
    `<span style="background:${color}22;color:${color};border:1px solid ${color}44;border-radius:4px;padding:2px 8px;font-size:11px;margin-right:4px">${text}</span>`;

  const priorityColor: Record<string,string> = { High:"#ef4444", Medium:"#fb923c", Low:"#64748b" };
  const statusColor:   Record<string,string> = { "Not Started":"#64748b","In Progress":"#60a5fa","Done":"#4ade80","On Hold":"#fb923c" };
  const appColor:      Record<string,string> = { Applied:"#60a5fa",Interview:"#fb923c",Offer:"#4ade80",Rejected:"#ef4444",Ghosted:"#64748b",Saved:"#a78bfa" };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Second Brain Export — ${now}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', Arial, sans-serif; color: #1e293b; background: #fff; line-height: 1.6; }
  .cover { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 60px 48px; }
  .cover h1 { font-size: 36px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 8px; }
  .cover p  { font-size: 15px; opacity: 0.8; }
  .stats-row { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 28px; }
  .stat { background: rgba(255,255,255,0.2); border-radius: 10px; padding: 12px 18px; text-align: center; min-width: 90px; }
  .stat .num { font-size: 22px; font-weight: 700; }
  .stat .lbl { font-size: 10px; opacity: 0.8; letter-spacing: 0.05em; }
  .body { padding: 32px 48px; }
  .section { margin-bottom: 36px; break-inside: avoid; }
  h2 { font-size: 16px; font-weight: 700; color: #6366f1; letter-spacing: 0.08em; text-transform: uppercase;
       border-bottom: 2px solid #e0e7ff; padding-bottom: 8px; margin-bottom: 14px; }
  .row { padding: 10px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: flex-start; gap: 12px; }
  .row:last-child { border-bottom: none; }
  .row-title { font-size: 14px; font-weight: 500; color: #1e293b; flex: 1; }
  .row-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
  .done { text-decoration: line-through; color: #94a3b8; }
  .prog-bar { height: 6px; background: #e2e8f0; border-radius: 3px; margin-top: 6px; overflow: hidden; }
  .prog-fill { height: 100%; border-radius: 3px; }
  .journal-entry { padding: 14px; background: #f8fafc; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #6366f1; }
  .journal-text { font-size: 13px; color: #334155; line-height: 1.7; white-space: pre-wrap; margin-top: 6px; }
  .tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px; }
  .tag { background: #e0e7ff; color: #4338ca; border-radius: 4px; padding: 1px 7px; font-size: 10px; }
  .finance-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
  .inc { color: #16a34a; font-weight: 600; }
  .exp { color: #dc2626; font-weight: 600; }
  .footer { text-align: center; padding: 20px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; margin-top: 32px; }
  @media print {
    .section { break-inside: avoid; }
    .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<div class="cover">
  <div style="font-size:32px;margin-bottom:12px">🧠</div>
  <h1>Second Brain</h1>
  <p>Personal Productivity Export · ${now}</p>
  <div class="stats-row">
    <div class="stat"><div class="num">${todos.filter(t=>!t.done).length}</div><div class="lbl">PENDING TASKS</div></div>
    <div class="stat"><div class="num">${habits.length}</div><div class="lbl">HABITS</div></div>
    <div class="stat"><div class="num">${goals.length}</div><div class="lbl">GOALS</div></div>
    <div class="stat"><div class="num">${journals.length}</div><div class="lbl">JOURNAL ENTRIES</div></div>
    <div class="stat"><div class="num">$${totalInc.toFixed(0)}</div><div class="lbl">TOTAL INCOME</div></div>
    <div class="stat"><div class="num">$${totalExp.toFixed(0)}</div><div class="lbl">TOTAL EXPENSES</div></div>
  </div>
</div>

<div class="body">

${section("📋 To-Do List", todos.map(t => `
  <div class="row">
    <div>
      <div class="row-title ${t.done?"done":""}">${t.text}</div>
      <div class="row-sub">${badge(t.priority, priorityColor[t.priority]||"#64748b")} ${t.due?"📅 "+t.due:""} ${t.done?"✅ Done":"⏳ Pending"}</div>
    </div>
  </div>`).join(""))}

${section("🔥 Habits", habits.map(h => `
  <div class="row">
    <div>
      <div class="row-title">${h.name}</div>
      <div class="row-sub">${h.area} · 🔥 ${h.streak} day streak</div>
    </div>
  </div>`).join(""))}

${section("🎯 Goals", goals.map(g => `
  <div class="row">
    <div style="flex:1">
      <div class="row-title">${g.goal}</div>
      <div class="row-sub">${g.area} ${g.dueDate?"· 📅 Due "+g.dueDate:""}</div>
      ${g.milestone ? `<div class="row-sub">◎ ${g.milestone}</div>` : ""}
      <div class="prog-bar"><div class="prog-fill" style="width:${g.progress}%;background:#6366f1"></div></div>
      <div class="row-sub" style="margin-top:3px">${g.progress}% complete</div>
    </div>
  </div>`).join(""))}

${section("📁 Projects", projects.map(p => `
  <div class="row">
    <div>
      <div class="row-title">${p.name}</div>
      <div class="row-sub">${badge(p.status, statusColor[p.status]||"#64748b")} ${p.area} ${p.due?"· Due "+p.due:""}</div>
      ${p.nextAction ? `<div class="row-sub">→ ${p.nextAction}</div>` : ""}
    </div>
  </div>`).join(""))}

${section("📅 Events", events.map(e => `
  <div class="row">
    <div>
      <div class="row-title">${e.title}</div>
      <div class="row-sub">📅 ${e.date}${e.time?" · "+e.time:""} · ${e.type}</div>
    </div>
  </div>`).join(""))}

${section("💼 Applications", applications.map(a => `
  <div class="row">
    <div>
      <div class="row-title">${a.company} — ${a.role}</div>
      <div class="row-sub">${badge(a.status, appColor[a.status]||"#64748b")} Applied ${a.date}</div>
      ${a.notes ? `<div class="row-sub">→ ${a.notes}</div>` : ""}
    </div>
  </div>`).join(""))}

${section("📖 Journal Entries", journals.map(j => `
  <div class="journal-entry">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:18px">${moods[j.mood]??""}</span>
      <span style="font-size:12px;color:#64748b">${j.date}</span>
    </div>
    <div class="journal-text">${j.text.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
    ${j.tags?.length ? `<div class="tags">${j.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>` : ""}
  </div>`).join(""))}

${section("💡 Idea Inbox", captures.map(c => `
  <div class="row">
    <div>
      <div class="row-title">${c.text.replace(/</g,"&lt;")}</div>
      <div class="row-sub">${c.area} · ${c.date}</div>
    </div>
  </div>`).join(""))}

${section("⭐ Saved Posts", savedPosts.map(p => `
  <div class="row">
    <div>
      <div class="row-title">${p.title}</div>
      <div class="row-sub">${p.platform} · ${p.date} ${p.url?`· <a href="${p.url}">${p.url}</a>`:""}</div>
      ${p.notes ? `<div class="row-sub">→ ${p.notes}</div>` : ""}
    </div>
  </div>`).join(""))}

${section("💰 Finance Log", `
  <div style="display:flex;gap:24px;margin-bottom:14px">
    <div><span style="font-size:20px;font-weight:700;color:#16a34a">$${totalInc.toFixed(2)}</span><div style="font-size:11px;color:#64748b">TOTAL INCOME</div></div>
    <div><span style="font-size:20px;font-weight:700;color:#dc2626">$${totalExp.toFixed(2)}</span><div style="font-size:11px;color:#64748b">TOTAL EXPENSES</div></div>
    <div><span style="font-size:20px;font-weight:700;color:${totalInc>=totalExp?"#16a34a":"#dc2626"}">$${Math.abs(totalInc-totalExp).toFixed(2)}</span><div style="font-size:11px;color:#64748b">NET ${totalInc>=totalExp?"SAVINGS":"DEFICIT"}</div></div>
  </div>
  ${finances.map(f=>`
  <div class="finance-row">
    <div><span style="font-size:13px;color:#1e293b">${f.desc||f.cat}</span> <span style="font-size:11px;color:#94a3b8">${f.cat} · ${f.date}</span></div>
    <div class="${f.type==="Income"?"inc":"exp"}">${f.type==="Income"?"+":"-"}$${f.amt.toFixed(2)}</div>
  </div>`).join("")}`)}

${section("🥗 Meal Log (Last 30 days)", meals.filter(m=>{const d=new Date(m.date+"T00:00:00");return d>new Date(Date.now()-30*86400000);}).map(m=>`
  <div class="row">
    <div>
      <div class="row-title">${m.name}</div>
      <div class="row-sub">${m.cal} kcal · ${m.date}</div>
    </div>
  </div>`).join(""))}

${section("🧘 Self Talk Reflections", selfTalks.map(s => `
  <div class="journal-entry" style="border-left-color:#8b5cf6">
    <div style="display:flex;justify-content:space-between">
      <span style="font-size:11px;background:#e0e7ff;color:#4338ca;border-radius:4px;padding:1px 8px">${s.cat}</span>
      <span style="font-size:11px;color:#64748b">${s.date}</span>
    </div>
    <div style="font-size:12px;color:#64748b;margin:6px 0;font-style:italic">"${s.q}"</div>
    <div class="journal-text">${s.a.replace(/</g,"&lt;")}</div>
  </div>`).join(""))}

</div>
<div class="footer">Second Brain Export · Generated ${now} · Your data, your life.</div>
</body>
</html>`;
}

export default function DataManager({ userId, onClose }: Props) {
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [importText, setImportText] = useState("");

  function exportPDF() {
    setLoading("pdf");
    const data = getAllData(userId);
    const html = buildHtmlReport(data);
    const win = window.open("", "_blank");
    if (!win) { setMsg({ text:"❌ Pop-up blocked. Allow pop-ups and try again.", ok:false }); setLoading(null); return; }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      setLoading(null);
      setMsg({ text:"✅ Print dialog opened — choose 'Save as PDF'", ok:true });
    }, 600);
  }

  function exportDoc() {
    setLoading("doc");
    const data = getAllData(userId);
    const html = buildHtmlReport(data);
    // Word-compatible HTML blob
    const wordHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8"/>
        <title>Second Brain Export</title>
        <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom></w:WordDocument></xml><![endif]-->
        <style>
          body { font-family: Calibri, Arial, sans-serif; color: #1e293b; line-height: 1.6; }
          h1 { font-size: 28pt; color: #6366f1; }
          h2 { font-size: 14pt; color: #6366f1; border-bottom: 1pt solid #6366f1; padding-bottom: 4pt; margin-top: 18pt; }
          p, div { font-size: 11pt; margin-bottom: 4pt; }
          .done { text-decoration: line-through; color: #94a3b8; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 12pt; }
          td, th { border: 1pt solid #e2e8f0; padding: 6pt 8pt; font-size: 10pt; }
          th { background: #f8fafc; font-weight: bold; }
          .inc { color: #16a34a; font-weight: bold; }
          .exp { color: #dc2626; font-weight: bold; }
        </style>
      </head>
      <body>${html.replace(/<!DOCTYPE html>[\s\S]*?<body>/,"").replace(/<\/body>[\s\S]*?<\/html>/,"")}</body>
      </html>`;
    const blob = new Blob(["\ufeff" + wordHtml], { type: "application/msword" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `second-brain-${new Date().toISOString().split("T")[0]}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(null);
    setMsg({ text:"✅ Word document downloaded!", ok:true });
  }

  function exportJson() {
    const keys = ["habits","goals","projects","todos","journals","captures","meals","waterLogs","applications","events","finances","savedPosts","selfTalks"];
    const data: Record<string,unknown> = { exportedAt:new Date().toISOString(), userId };
    keys.forEach(k=>{ try { data[k]=JSON.parse(localStorage.getItem(`sb_${userId}_${k}`)??"null"); } catch {} });
    const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download=`second-brain-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
    setMsg({text:"✅ JSON backup downloaded!",ok:true});
  }

  function importFromFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImportText(ev.target?.result as string);
    reader.readAsText(file);
  }

  function importData() {
    try {
      const data = JSON.parse(importText);
      const keys = ["habits","goals","projects","todos","journals","captures","meals","waterLogs","applications","events","finances","savedPosts","selfTalks"];
      keys.forEach(k=>{ if(data[k]!=null) localStorage.setItem(`sb_${userId}_${k}`,JSON.stringify(data[k])); });
      setMsg({text:"✅ Data restored! Refreshing...",ok:true});
      setTimeout(()=>window.location.reload(),1200);
    } catch {
      setMsg({text:"❌ Invalid file. Please use a valid backup JSON.",ok:false});
    }
  }

  const btnStyle = (color: string, disabled = false) => ({
    width:"100%", background: disabled ? "#1e293b" : `linear-gradient(135deg,${color},${color}cc)`,
    border:"none", borderRadius:10, color: disabled ? "#475569" : "#fff",
    padding:"13px", fontSize:14, fontWeight:600 as const, cursor: disabled ? "default" : "pointer",
    fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    opacity: loading ? 0.7 : 1,
  });

  return (
    <div style={{ position:"fixed",inset:0,zIndex:300,background:"#000b",display:"flex",alignItems:"center",justifyContent:"center",padding:16 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#13151f",border:"1px solid #252a3a",borderRadius:18,padding:24,width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto" }}>

        {/* Header */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <div style={{ fontSize:18,fontWeight:700,color:"#fff" }}>📤 Export & Backup</div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#9fa8da",cursor:"pointer",fontSize:22 }}>×</button>
        </div>

        {msg && (
          <div style={{ padding:"10px 14px",borderRadius:10,marginBottom:16,background:msg.ok?"#4ade8018":"#ef444418",border:`1px solid ${msg.ok?"#4ade8044":"#ef444444"}`,color:msg.ok?"#4ade80":"#fca5a5",fontSize:13 }}>
            {msg.text}
          </div>
        )}

        {/* Export options */}
        <div style={{ fontSize:12,color:"#9fa8da",marginBottom:10,letterSpacing:"0.08em" }}>EXPORT YOUR DATA</div>

        <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:20 }}>
          <button onClick={exportPDF} disabled={!!loading} style={btnStyle("#dc2626")}>
            {loading==="pdf" ? "⏳ Opening..." : "📄 Download as PDF"}
          </button>
          <button onClick={exportDoc} disabled={!!loading} style={btnStyle("#2563eb")}>
            {loading==="doc" ? "⏳ Creating..." : "📝 Download as Word (.doc)"}
          </button>
          <button onClick={exportJson} disabled={!!loading} style={btnStyle("#6366f1")}>
            💾 Download Backup (.json)
          </button>
        </div>

        <div style={{ fontSize:11,color:"#5c6bc0",padding:"8px 12px",background:"#1e293b",borderRadius:8,marginBottom:20 }}>
          💡 <b>PDF tip:</b> In the print dialog, select <b>"Save as PDF"</b> as the destination. Your full Second Brain will be exported as a beautifully formatted report.
        </div>

        <div style={{ height:1,background:"#252a3a",marginBottom:20 }} />

        {/* Import */}
        <div style={{ fontSize:12,color:"#9fa8da",marginBottom:10,letterSpacing:"0.08em" }}>RESTORE FROM BACKUP</div>
        <div style={{ fontSize:12,color:"#5c6bc0",marginBottom:10 }}>Only JSON backup files can be restored. PDF/Doc exports are read-only.</div>

        <label style={{ display:"block",background:"#0f1118",border:"2px dashed #252a3a",borderRadius:10,padding:16,textAlign:"center",cursor:"pointer",marginBottom:10,color:"#5c6bc0",fontSize:13,boxSizing:"border-box" as const }}>
          📂 Choose backup .json file
          <input type="file" accept=".json" onChange={importFromFile} style={{ display:"none" }} />
        </label>

        {importText && (
          <div style={{ marginBottom:10,padding:"8px 12px",borderRadius:8,background:"#4ade8015",border:"1px solid #4ade8033",fontSize:12,color:"#4ade80" }}>✓ File loaded — ready to restore</div>
        )}

        <button onClick={importData} disabled={!importText} style={btnStyle("#16a34a", !importText)}>
          Restore from Backup
        </button>
      </div>
    </div>
  );
}
