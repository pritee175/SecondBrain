"use client";
import { useState } from "react";
import type { TabId } from "@/types";
import { NAV_GROUPS } from "@/lib/constants";
import { useStore } from "@/lib/useStore";
import { useAuth } from "@/lib/useAuth";
import { todayStr, todayISO } from "@/lib/utils";
import AuthScreen    from "./AuthScreen";
import DataManager   from "./DataManager";
import GlobalSearch  from "./GlobalSearch";
import QuickCapture  from "./QuickCapture";

import Dashboard       from "./tabs/Dashboard";
import TodoTab         from "./tabs/TodoTab";
import ProjectsTab     from "./tabs/ProjectsTab";
import GoalsTab        from "./tabs/GoalsTab";
import EventsTab       from "./tabs/EventsTab";
import DietTab         from "./tabs/DietTab";
import FinanceTab      from "./tabs/FinanceTab";
import ApplicationsTab from "./tabs/ApplicationsTab";
import InboxTab        from "./tabs/InboxTab";
import SavedPostsTab   from "./tabs/SavedPostsTab";
import JournalTab      from "./tabs/JournalTab";
import SelfTalkTab     from "./tabs/SelfTalkTab";

const ALL_TABS: { id: TabId; icon: string; label: string; group: string }[] = [
  { id:"Dashboard",    icon:"🏠", label:"Dashboard",    group:"MIND"    },
  { id:"Journal",      icon:"📖", label:"Journal",      group:"MIND"    },
  { id:"Self Talk",    icon:"🧘", label:"Self Talk",    group:"MIND"    },
  { id:"Inbox",        icon:"💡", label:"Inbox",        group:"CAPTURE" },
  { id:"Saved Posts",  icon:"⭐", label:"Saved Posts",  group:"CAPTURE" },
  { id:"To-Do",        icon:"✅", label:"To-Do",        group:"PLAN"    },
  { id:"Projects",     icon:"📁", label:"Projects",     group:"PLAN"    },
  { id:"Goals",        icon:"🎯", label:"Goals",        group:"PLAN"    },
  { id:"Events",       icon:"📅", label:"Events",       group:"PLAN"    },
  { id:"Diet",         icon:"🥗", label:"Diet",         group:"TRACK"   },
  { id:"Finance",      icon:"💰", label:"Finance",      group:"TRACK"   },
  { id:"Applications", icon:"💼", label:"Applications", group:"TRACK"   },
];

function Sidebar({ tab, onPick, onClose }: { tab: TabId; onPick:(t:TabId)=>void; onClose:()=>void }) {
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:200,background:"#000000bb",backdropFilter:"blur(2px)",animation:"fadeIn 0.2s ease" }} />
      <div style={{ position:"fixed",top:0,left:0,bottom:0,width:264,zIndex:210,background:"#0d0e1a",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",animation:"slideInLeft 0.25s ease",overflowY:"auto" }}>
        <div style={{ padding:"18px 18px 14px",borderBottom:"1px solid var(--border2)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>⬡</div>
            <div>
              <div style={{ fontSize:13,fontWeight:700,color:"#fff",letterSpacing:"0.08em" }}>SECOND BRAIN</div>
              <div style={{ fontSize:9,color:"var(--text5)",letterSpacing:"0.1em" }}>YOUR MIND, ORGANIZED</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--text4)",cursor:"pointer",fontSize:22,lineHeight:1,padding:4 }}>×</button>
        </div>
        <div style={{ padding:"12px 0 24px",flex:1 }}>
          {NAV_GROUPS.map(g=>(
            <div key={g.group} style={{ marginBottom:6 }}>
              <div style={{ fontSize:9,color:"var(--text5)",letterSpacing:"0.2em",padding:"10px 18px 5px" }}>{g.group}</div>
              {ALL_TABS.filter(t=>t.group===g.group).map(t=>{
                const isActive = tab===t.id;
                return (
                  <button key={t.id} onClick={()=>onPick(t.id)} style={{
                    width:"100%",textAlign:"left",padding:"12px 18px",border:"none",
                    borderLeft:`3px solid ${isActive?"var(--accent)":"transparent"}`,
                    background:isActive?"#6366f118":"transparent",
                    color:isActive?"#ffffff":"var(--text3)",
                    fontSize:15,cursor:"pointer",
                    display:"flex",alignItems:"center",gap:14,fontFamily:"inherit",
                  }}>
                    <span style={{ fontSize:20,width:24,textAlign:"center",flexShrink:0 }}>{t.icon}</span>
                    <span style={{ fontWeight:isActive?600:400 }}>{t.label}</span>
                    {isActive && <span style={{ marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"var(--accent)",flexShrink:0 }} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function App({ userId, userName, onLogout }: { userId:string; userName:string; onLogout:()=>void }) {
  const [tab,          setTab]          = useState<TabId>("Dashboard");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [dataOpen,     setDataOpen]     = useState(false);
  const store = useStore(userId);

  const todayMeals    = store.meals.filter(m=>m.date===todayISO());
  const todayCalories = todayMeals.reduce((a,m)=>a+m.cal,0);
  const todayFin      = store.finances.filter(f=>f.date===todayISO());
  const todayInc      = todayFin.filter(f=>f.type==="Income").reduce((a,f)=>a+f.amt,0);
  const todayExp      = todayFin.filter(f=>f.type==="Expense").reduce((a,f)=>a+f.amt,0);

  function pickTab(id: TabId) { setTab(id); setSidebarOpen(false); }
  const currentTab = ALL_TABS.find(t=>t.id===tab);

  function renderTab() {
    switch (tab) {
      case "Dashboard":    return <Dashboard habits={store.habits} setHabits={store.setHabits} todos={store.todos} setTodos={store.setTodos} goals={store.goals} events={store.events} doneTodos={store.todos.filter(t=>t.done).length} totalTodos={store.todos.length} todayCalories={todayCalories} netToday={todayInc-todayExp} captures={store.captures.length} savedPosts={store.savedPosts.length} journals={store.journals.length} applications={store.applications.length} />;
      case "To-Do":        return <TodoTab         key="todo"  todos={store.todos}               setTodos={store.setTodos} />;
      case "Projects":     return <ProjectsTab     key="proj"  projects={store.projects}         setProjects={store.setProjects} />;
      case "Goals":        return <GoalsTab        key="goal"  goals={store.goals}               setGoals={store.setGoals} />;
      case "Events":       return <EventsTab       key="ev"    events={store.events}             setEvents={store.setEvents} />;
      case "Diet":         return <DietTab         key="diet"  meals={store.meals}               setMeals={store.setMeals} water={store.water} setWater={store.setWater} />;
      case "Finance":      return <FinanceTab      key="fin"   finances={store.finances}         setFinances={store.setFinances} />;
      case "Applications": return <ApplicationsTab key="app"   applications={store.applications} setApplications={store.setApplications} />;
      case "Inbox":        return <InboxTab        key="inbox" captures={store.captures}         setCaptures={store.setCaptures} />;
      case "Saved Posts":  return <SavedPostsTab   key="saved" savedPosts={store.savedPosts}     setSavedPosts={store.setSavedPosts} />;
      case "Journal":      return <JournalTab      key="jour"  journals={store.journals}         setJournals={store.setJournals} />;
      case "Self Talk":    return <SelfTalkTab     key="self"  selfTalks={store.selfTalks}       setSelfTalks={store.setSelfTalks} />;
    }
  }

  return (
    <div style={{ minHeight:"100dvh",display:"flex",flexDirection:"column" }}>
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse 70% 50% at 15% 0%,#6366f115,transparent 55%),radial-gradient(ellipse 50% 40% at 85% 100%,#8b5cf610,transparent 55%)" }} />

      {/* Header */}
      <header style={{ position:"relative",zIndex:10,borderBottom:"1px solid var(--border2)",padding:"0 16px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",background:"#080810f4",backdropFilter:"blur(14px)",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          {/* Hamburger */}
          <button onClick={()=>setSidebarOpen(true)} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",gap:5,padding:8,borderRadius:8 }} aria-label="Menu">
            <span style={{ display:"block",width:22,height:2,background:"#fff",borderRadius:2 }} />
            <span style={{ display:"block",width:16,height:2,background:"#fff",borderRadius:2 }} />
            <span style={{ display:"block",width:22,height:2,background:"#fff",borderRadius:2 }} />
          </button>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ fontSize:20 }}>{currentTab?.icon}</span>
            <span style={{ fontSize:16,fontWeight:700,color:"#fff" }}>{currentTab?.label}</span>
          </div>
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          {/* Search */}
          <button onClick={()=>setSearchOpen(true)} style={{ background:"none",border:"1px solid var(--border)",borderRadius:8,color:"var(--text3)",cursor:"pointer",fontSize:16,padding:"5px 10px",fontFamily:"inherit" }} title="Search (Ctrl+K)">🔍</button>
          {/* Backup */}
          <button onClick={()=>setDataOpen(true)} style={{ background:"none",border:"1px solid var(--border)",borderRadius:8,color:"var(--text3)",cursor:"pointer",fontSize:16,padding:"5px 10px" }} title="Backup / Restore">💾</button>
          {/* Avatar */}
          <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff" }}>{userName[0].toUpperCase()}</div>
          <span className="hide-mobile" style={{ fontSize:13,color:"var(--text2)" }}>{userName}</span>
          <button onClick={onLogout} style={{ background:"none",border:"1px solid var(--border)",borderRadius:8,color:"var(--text3)",cursor:"pointer",fontSize:12,padding:"5px 10px",fontFamily:"inherit" }}>Sign out</button>
        </div>
      </header>

      {sidebarOpen && <Sidebar tab={tab} onPick={pickTab} onClose={()=>setSidebarOpen(false)} />}
      {searchOpen  && (
        <GlobalSearch
          data={{ todos:store.todos, habits:store.habits, goals:store.goals, projects:store.projects, captures:store.captures, journals:store.journals, savedPosts:store.savedPosts, events:store.events, finances:store.finances, applications:store.applications }}
          onNavigate={t => { pickTab(t as TabId); }}
          onClose={()=>setSearchOpen(false)}
        />
      )}
      {dataOpen && <DataManager userId={userId} onClose={()=>setDataOpen(false)} />}

      <main style={{ flex:1,padding:"18px 16px",overflowY:"auto",position:"relative",zIndex:1 }}>
        {renderTab()}
      </main>

      {/* Quick capture floating button */}
      <QuickCapture onSave={item=>store.setCaptures(p=>[item,...p])} />
    </div>
  );
}

export default function SecondBrain() {
  const { user, ready, login, signup, logout, signInWithGoogle } = useAuth();
  if (!ready) return (<div style={{ minHeight:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)" }}><div style={{ fontSize:32,color:"var(--accent)" }}>⬡</div></div>);
  if (!user)  return <AuthScreen login={login} signup={signup} signInWithGoogle={signInWithGoogle} />;
  return <App userId={user.id} userName={user.name} onLogout={logout} />;
}
