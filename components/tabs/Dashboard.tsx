"use client";
import { useState } from "react";
import type { Habit, Goal, CalendarEvent, Todo } from "@/types";
import { AREA_COLORS, AREA_ICONS, PRIORITY_COLORS } from "@/lib/constants";
import { fmtDate, greet, todayISO, uid, lastNDays } from "@/lib/utils";
import { StatCard, SectionHeader, ProgressBar } from "../ui";

interface Props {
  habits: Habit[]; setHabits: (fn:(p:Habit[])=>Habit[])=>void;
  todos: Todo[];   setTodos:  (fn:(p:Todo[])=>Todo[])=>void;
  goals: Goal[];   events: CalendarEvent[];
  doneTodos: number; totalTodos: number;
  todayCalories: number; netToday: number;
  captures: number; savedPosts: number; journals: number; applications: number;
}

const EV_COLORS: Record<string,string> = { Work:"#60a5fa",Personal:"#f472b6",Health:"#4ade80",Social:"#fb923c",Learning:"#a78bfa" };

export default function Dashboard({ habits, setHabits, todos, setTodos, goals, events, doneTodos, totalTodos, todayCalories, netToday, captures, savedPosts, journals, applications }: Props) {
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [habText, setHabText] = useState("");
  const [habArea, setHabArea] = useState<Habit["area"]>("Health & Fitness");
  const [todoText, setTodoText] = useState("");
  const [todoPri,  setTodoPri]  = useState<Todo["priority"]>("Medium");

  const doneHabits = habits.filter(h=>h.done).length;
  const avgProg    = goals.length ? Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length) : 0;
  const upcoming   = events.filter(e=>e.date>=todayISO()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
  const pendingTodos = todos.filter(t=>!t.done);
  const last7 = lastNDays(7).reverse(); // oldest→newest

  function toggleHabit(id: string) {
    const today = todayISO();
    setHabits(p=>p.map(h=>h.id===id ? {
      ...h,
      done: !h.done,
      lastDone: !h.done ? today : h.lastDone,
      streak: !h.done ? h.streak+1 : Math.max(0,h.streak-1),
      history: !h.done ? [...(h.history??[]).filter(d=>d!==today), today] : (h.history??[]).filter(d=>d!==today),
    } : h));
  }
  function deleteHabit(id: string, e: React.MouseEvent) { e.stopPropagation(); setHabits(p=>p.filter(h=>h.id!==id)); }
  function addHabit() {
    if (!habText.trim()) return;
    setHabits(p=>[...p,{id:uid(),name:habText,area:habArea,streak:0,done:false,history:[]}]);
    setHabText(""); setShowAddHabit(false);
  }
  function addTodo() {
    if (!todoText.trim()) return;
    setTodos(p=>[{id:uid(),text:todoText,priority:todoPri,area:"Work / Career",due:"",done:false,createdAt:todayISO(),recurring:""},...p]);
    setTodoText("");
  }
  function toggleTodo(id: string) { setTodos(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t)); }
  function deleteTodo(id: string) { setTodos(p=>p.filter(t=>t.id!==id)); }

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:14}}>
      <SectionHeader eyebrow="OVERVIEW" title={`${greet()} ☀️`} />

      <div className="grid-4">
        <StatCard label="HABITS"   value={`${doneHabits}/${habits.length}`}                          sub="done today"  color="#4ade80" />
        <StatCard label="TO-DO"    value={`${doneTodos}/${totalTodos}`}                              sub="completed"   color="#60a5fa" />
        <StatCard label="CALORIES" value={todayCalories}                                             sub="/ 2000 kcal" color="#fb923c" />
        <StatCard label="NET"      value={`${netToday>=0?"+":""}$${netToday.toFixed(0)}`}            sub="today"       color={netToday>=0?"#4ade80":"#ef4444"} />
      </div>

      {/* Quick To-Do */}
      <div className="sb-card" style={{overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span className="sb-label">TO-DO · {pendingTodos.length} pending</span>
        </div>
        <div style={{padding:"10px 14px",borderBottom:"1px solid var(--border2)",display:"flex",gap:8}}>
          <input className="sb-input" value={todoText} onChange={e=>setTodoText(e.target.value)} placeholder="Quick add task..." style={{flex:1}} onKeyDown={e=>e.key==="Enter"&&addTodo()} />
          <select className="sb-input" style={{width:"auto"}} value={todoPri} onChange={e=>setTodoPri(e.target.value as Todo["priority"])}>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
          <button className="sb-btn" onClick={addTodo} style={{flexShrink:0}}>+</button>
        </div>
        {pendingTodos.length===0 && <div style={{padding:16,fontSize:13,color:"var(--text5)",textAlign:"center"}}>All caught up! ✓</div>}
        {pendingTodos.slice(0,5).map(t=>(
          <div key={t.id} style={{padding:"11px 14px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #0d0f18"}}>
            <div onClick={()=>toggleTodo(t.id)} style={{width:20,height:20,borderRadius:5,flexShrink:0,cursor:"pointer",border:`2px solid ${PRIORITY_COLORS[t.priority]}`}} />
            <div style={{flex:1,fontSize:14,color:"#fff"}}>{t.text}</div>
            <span style={{fontSize:10,color:PRIORITY_COLORS[t.priority],flexShrink:0}}>{t.priority}</span>
            <button onClick={()=>deleteTodo(t.id)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:18,padding:"0 4px",lineHeight:1}}>×</button>
          </div>
        ))}
        {pendingTodos.length>5 && <div style={{padding:"10px 14px",fontSize:12,color:"var(--text4)",textAlign:"center"}}>+{pendingTodos.length-5} more in To-Do tab</div>}
      </div>

      {/* Habits with 7-day history */}
      <div className="sb-card" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 15px",borderBottom:"1px solid var(--border2)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span className="sb-label">TODAY'S HABITS</span>
          <button onClick={()=>setShowAddHabit(!showAddHabit)} className="sb-btn-ghost" style={{padding:"6px 14px",fontSize:13}}>+ Add</button>
        </div>
        {showAddHabit && (
          <div style={{padding:"10px 15px",borderBottom:"1px solid var(--border2)",display:"flex",flexDirection:"column",gap:8}}>
            <input className="sb-input" value={habText} onChange={e=>setHabText(e.target.value)} placeholder="Habit name..." onKeyDown={e=>e.key==="Enter"&&addHabit()} />
            <div style={{display:"flex",gap:8}}>
              <select className="sb-input" style={{flex:1}} value={habArea} onChange={e=>setHabArea(e.target.value as Habit["area"])}>
                {(["Health & Fitness","Work / Career","Creative Projects","Personal Growth"] as const).map(a=><option key={a}>{a}</option>)}
              </select>
              <button className="sb-btn" onClick={addHabit} style={{flexShrink:0}}>Save</button>
            </div>
          </div>
        )}
        {habits.map(h=>(
          <div key={h.id} style={{padding:"10px 15px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #0d0f18",background:h.done?"#0a160a":"transparent"}}>
            <div onClick={()=>toggleHabit(h.id)} style={{width:22,height:22,borderRadius:6,flexShrink:0,border:h.done?"none":`2px solid ${AREA_COLORS[h.area]}`,background:h.done?AREA_COLORS[h.area]:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#000",cursor:"pointer"}}>{h.done?"✓":""}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,color:h.done?"var(--text5)":"#fff",textDecoration:h.done?"line-through":"none"}}>{h.name}</div>
              {/* 7-day history dots */}
              <div style={{display:"flex",gap:3,marginTop:4}}>
                {last7.map(d=>{
                  const done=(h.history??[]).includes(d)||( d===todayISO()&&h.done);
                  return <div key={d} style={{width:8,height:8,borderRadius:2,background:done?AREA_COLORS[h.area]:"var(--border)"}} />;
                })}
                <span style={{fontSize:9,color:"var(--text5)",marginLeft:4}}>7 days</span>
              </div>
            </div>
            <span style={{fontSize:11,color:AREA_COLORS[h.area]}}>{AREA_ICONS[h.area]}</span>
            <span style={{fontSize:11,color:"var(--text5)"}}>🔥{h.streak}</span>
            <button onClick={e=>deleteHabit(h.id,e)} style={{background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:18,padding:"0 4px",lineHeight:1}}>×</button>
          </div>
        ))}
        {habits.length===0 && <div style={{padding:16,fontSize:13,color:"var(--text5)",textAlign:"center"}}>No habits yet. Add one above.</div>}
      </div>

      {/* Events + Goals */}
      <div className="grid-2">
        <div className="sb-card" style={{padding:14}}>
          <div className="sb-label" style={{marginBottom:9}}>UPCOMING EVENTS</div>
          {upcoming.length===0 && <div style={{color:"var(--text5)",fontSize:13}}>None scheduled</div>}
          {upcoming.map(e=>(
            <div key={e.id} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:EV_COLORS[e.type]??"#6366f1",flexShrink:0,marginTop:5}} />
              <div>
                <div style={{fontSize:13,color:"#fff"}}>{e.title}</div>
                <div style={{fontSize:11,color:"var(--text4)"}}>{fmtDate(e.date)}{e.time&&` · ${e.time}`}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="sb-card" style={{padding:14}}>
          <div className="sb-label" style={{marginBottom:9}}>GOALS · {avgProg}%</div>
          {goals.map(g=>(
            <div key={g.id} style={{marginBottom:9}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <div style={{fontSize:11,color:"var(--text3)"}}>{AREA_ICONS[g.area]}</div>
                <div style={{fontSize:11,color:AREA_COLORS[g.area]}}>{g.progress}%</div>
              </div>
              <ProgressBar value={g.progress} color={AREA_COLORS[g.area]} height={4} />
            </div>
          ))}
          {goals.length===0 && <div style={{color:"var(--text5)",fontSize:12}}>No goals set</div>}
        </div>
      </div>

      <div className="grid-4">
        <StatCard label="APPS"    value={applications} sub="tracked"  color="#a78bfa" />
        <StatCard label="IDEAS"   value={captures}     sub="in inbox" color="#f472b6" />
        <StatCard label="POSTS"   value={savedPosts}   sub="saved"    color="#fb923c" />
        <StatCard label="JOURNAL" value={journals}     sub="entries"  color="#60a5fa" />
      </div>
    </div>
  );
}
