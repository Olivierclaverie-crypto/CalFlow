import { useState } from "react";
import { C } from '../utils/constants.js';

export default function Header({
  weekDays,
  syncing,
  syncOk,
  onSync,
  onSettings,
  onAddEvent,
  clipboard,
  onClearClipboard,
  tasks,
  onToggleDrawer,
  weekStart,
  onToday,
  onGoToDate,
  onChangeView,
  currentView,
  fmtWeekRange,
  weekNum,
}) {
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickDay, setPickDay] = useState(String(new Date().getDate()).padStart(2,"0"));
  const [pickMonth, setPickMonth] = useState(String(new Date().getMonth()+1).padStart(2,"0"));
  const [pickYear, setPickYear] = useState(String(new Date().getFullYear()));

  const views = [
    { key:"day",   label:"Jour" },
    { key:"week",  label:"Semaine" },
    { key:"month", label:"Mois" },
    { key:"year",  label:"Année" },
  ];

  function handleGoToDate() {
    const iso = `${pickYear}-${pickMonth}-${pickDay}`;
    const d = new Date(iso + "T12:00:00");
    if (!isNaN(d)) { onGoToDate(d); setShowDatePicker(false); }
  }

  const btnStyle = {
    fontSize: 11, fontWeight: 700,
    border: `1px solid ${C.accentBorder}`,
    borderRadius: 8, padding: "5px 10px",
    cursor: "pointer", fontFamily: "inherit",
    background: C.accentLight, color: C.accent,
  };

  const btnPrimary = {
    ...btnStyle,
    background: C.accent, color: "#fff", border: "none",
  };

  const inputNum = {
    width: 44, textAlign: "center",
    padding: "6px 4px", borderRadius: 8,
    border: `1.5px solid ${C.border}`,
    background: C.bg, color: C.ink,
    fontSize: 16, fontFamily: "Phenomena, sans-serif",
    fontWeight: 700, outline: "none",
  };

  return (
    <div style={{
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      padding: "10px 16px 10px",
      flexShrink: 0,
      position: "relative",
    }}>

      {/* Ligne 1 — ↻ | NomadCal | ⚙️ */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 2 }}>
        <div style={{ position:"relative", display:"inline-flex" }}>
          <button onClick={onSync} style={{
            background:"none", border:"none",
            color: C.muted, cursor:"pointer", fontSize:22, padding:4, lineHeight:1,
          }}>↻</button>
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-50%)",
            width:7, height:7, borderRadius:"50%",
            background: syncing ? C.gold : syncOk ? C.green : C.red,
            transition:"background .3s", pointerEvents:"none",
          }}/>
        </div>

        <span style={{
          fontSize: 26, fontWeight: 800,
          color: C.accent,
          fontFamily: "Phenomena, sans-serif",
          letterSpacing: -1,
        }}>NomadCal</span>

        <button onClick={onSettings} style={{
          background:"none", border:"none",
          color: C.muted, cursor:"pointer", fontSize:22, padding:4,
        }}>⚙️</button>
      </div>

      {/* Bandeau clipboard */}
      {clipboard ? (
        <div style={{
          display:"flex", alignItems:"center", gap:8,
          background: C.goldLight, border:`1px solid ${C.gold}`,
          borderRadius:10, padding:"8px 12px", marginTop:6,
        }}>
          <span style={{ fontSize:12, color:C.goldDark, flex:1, fontWeight:700 }}>
            📋 {clipboard.title} — Tap sur un créneau pour coller
          </span>
          <button onClick={onClearClipboard} style={{
            background:"none", border:"none",
            color:C.goldDark, cursor:"pointer", fontSize:16, padding:"0 4px", fontWeight:700,
          }}>✕</button>
        </div>
      ) : (<>

        {/* Ligne 2 — Numéro semaine centré */}
        <div style={{ textAlign:"center", fontSize:11, color:C.muted, fontWeight:600, marginBottom:1 }}>
          {weekNum ? `Sem. ${weekNum}` : ""}
        </div>

        {/* Ligne 3 — Mois Année centré */}
        <div style={{ textAlign:"center", fontSize:13, color:C.ink, fontWeight:700, marginBottom:8, fontFamily:"Phenomena, sans-serif" }}>
          {fmtWeekRange(weekDays)}
        </div>

        {/* Ligne 4 — 4 boutons symétriques */}
        <div style={{ display:"flex", gap:6, justifyContent:"center" }}>

          {/* Aller */}
          <button onClick={()=>setShowDatePicker(v=>!v)} style={btnStyle}>
            Aller
          </button>

          {/* Aujourd'hui */}
          <button onClick={onToday} style={btnStyle}>
            Aujourd'hui
          </button>

          {/* Vues */}
          <div style={{ position:"relative" }}>
            <button onClick={()=>setShowViewMenu(v=>!v)} style={btnStyle}>
              Vues ▾
            </button>
            {showViewMenu && (
              <div style={{
                position:"absolute", top:"calc(100% + 6px)", left:"50%",
                transform:"translateX(-50%)",
                background: C.surface, border:`1px solid ${C.border}`,
                borderRadius:10, overflow:"hidden",
                boxShadow:"0 4px 16px rgba(0,0,0,.12)",
                zIndex:500, minWidth:110,
              }}>
                {views.map(v=>(
                  <button key={v.key} onClick={()=>{ onChangeView(v.key); setShowViewMenu(false); }}
                    style={{
                      display:"block", width:"100%",
                      padding:"10px 16px", textAlign:"left",
                      background: currentView===v.key ? C.accentLight : "transparent",
                      color: currentView===v.key ? C.accent : C.ink,
                      border:"none", borderBottom:`0.5px solid ${C.border}`,
                      fontSize:13, fontWeight: currentView===v.key ? 700 : 500,
                      cursor:"pointer", fontFamily:"inherit",
                    }}>
                    {v.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* + RDV */}
          <button onClick={onAddEvent} style={btnPrimary}>
            + RDV
          </button>

        </div>

      </>)}

      {/* Mini modal date picker */}
      {showDatePicker && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", left:"50%",
          transform:"translateX(-50%)",
          background: C.surface, border:`1px solid ${C.border}`,
          borderRadius:14, padding:"16px 20px",
          boxShadow:"0 8px 24px rgba(0,0,0,.15)",
          zIndex:500, display:"flex", flexDirection:"column",
          alignItems:"center", gap:12,
        }}>
          <div style={{ fontSize:11, color:C.muted, fontWeight:700, letterSpacing:.5 }}>ALLER À</div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <input value={pickDay} onChange={e=>setPickDay(e.target.value)}
              placeholder="JJ" maxLength={2} style={inputNum}/>
            <span style={{ color:C.muted, fontWeight:700 }}>/</span>
            <input value={pickMonth} onChange={e=>setPickMonth(e.target.value)}
              placeholder="MM" maxLength={2} style={inputNum}/>
            <span style={{ color:C.muted, fontWeight:700 }}>/</span>
            <input value={pickYear} onChange={e=>setPickYear(e.target.value)}
              placeholder="AAAA" maxLength={4} style={{...inputNum, width:60}}/>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setShowDatePicker(false)} style={{...btnStyle, fontSize:12}}>Annuler</button>
            <button onClick={handleGoToDate} style={{...btnPrimary, fontSize:12}}>Aller ✓</button>
          </div>
        </div>
      )}

    </div>
  );
}
