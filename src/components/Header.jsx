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
  onOpenFrais,
  currentView,
  fmtWeekRange,
  fmtDay,
  fmtDayNum,
  weekNum,
  today,
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
    const iso = `${pickYear}-${pickMonth.padStart(2,"0")}-${pickDay.padStart(2,"0")}`;
    const d = new Date(iso + "T12:00:00");
    if (!isNaN(d)) { onGoToDate(d); setShowDatePicker(false); }
  }

  // Taille boutons indexée sur le plus grand (+RDV)
  const btnBase = {
    fontSize: 13, fontWeight: 700,
    borderRadius: 9, padding: "7px 12px",
    cursor: "pointer", fontFamily: "inherit",
    whiteSpace: "nowrap", flex: 1,
    textAlign: "center",
  };

  const btnStyle = {
    ...btnBase,
    border: `1px solid ${C.accentBorder}`,
    background: C.accentLight, color: C.accent,
  };

  const btnPrimary = {
    ...btnBase,
    background: C.accent, color: "#fff", border: "none",
  };

  const inputNum = {
    width: 50, textAlign: "center",
    padding: "8px 4px", borderRadius: 8,
    border: `1.5px solid ${C.border}`,
    background: C.bg, color: C.ink,
    fontSize: 18, fontFamily: "Phenomena, sans-serif",
    fontWeight: 700, outline: "none",
  };

  return (
    <div style={{
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      flexShrink: 0,
      position: "relative",
    }}>

      {/* ── Ligne 1 — NomadCal + ↻ + ⚙️ sur même ligne ── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px 4px",
      }}>
        <span style={{
          fontSize: 34, fontWeight: 800,
          color: C.accent,
          fontFamily: "Phenomena, sans-serif",
          letterSpacing: -1, lineHeight: 1,
        }}>NomadCal</span>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* ↻ avec pastille */}
          <div style={{ position:"relative", display:"inline-flex" }}>
            <button onClick={onSync} style={{
              background:"none", border:"none",
              color: C.muted, cursor:"pointer",
              fontSize: 28, padding: 2, lineHeight: 1,
            }}>↻</button>
            <div style={{
              position:"absolute", top:"50%", left:"50%",
              transform:"translate(-50%,-50%)",
              width: 7, height: 7, borderRadius:"50%",
              background: syncing ? C.gold : syncOk ? C.green : C.red,
              transition:"background .3s", pointerEvents:"none",
            }}/>
          </div>
          {/* ⚙️ */}
          <button onClick={onSettings} style={{
            background:"none", border:"none",
            color: C.muted, cursor:"pointer",
            fontSize: 28, padding: 2,
          }}>⚙️</button>
        </div>
      </div>

      {/* Bandeau clipboard */}
      {clipboard ? (
        <div style={{
          display:"flex", alignItems:"center", gap:8,
          background: C.goldLight, border:`1px solid ${C.gold}`,
          borderRadius:10, margin:"0 14px 8px", padding:"8px 12px",
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

        {/* ── Ligne 2 — Sem XX à gauche | Mois Année à droite ── */}
        <div style={{
          display:"flex", alignItems:"center",
          justifyContent:"space-between",
          padding:"0 14px 6px",
        }}>
          <span style={{ fontSize:15, color:C.ink, fontWeight:700, fontFamily:"Phenomena, sans-serif" }}>
            Sem. {weekNum}
          </span>
          <span style={{ fontSize:15, color:C.muted, fontWeight:600 }}>
            {fmtWeekRange(weekDays)}
          </span>
        </div>

        {/* ── Ligne 3 — 4 boutons même taille, espacés ── */}
        <div style={{
          display:"flex", gap:8,
          padding:"0 14px 8px",
        }}>
          <button onClick={()=>setShowDatePicker(v=>!v)} style={btnStyle}>Aller</button>
          <div style={{ position:"relative", flex:1 }}>
            <button onClick={()=>setShowViewMenu(v=>!v)} style={{...btnStyle, width:"100%"}}>Vues ▾</button>
            {showViewMenu && (
              <div style={{
                position:"absolute", top:"calc(100% + 6px)", left:0,
                background: C.surface, border:`1px solid ${C.border}`,
                borderRadius:12, overflow:"hidden",
                boxShadow:"0 6px 24px rgba(0,0,0,.15)",
                zIndex:500, minWidth:150,
              }}>
                {views.map(v=>(
                  <button key={v.key} onClick={()=>{ onChangeView(v.key); setShowViewMenu(false); }}
                    style={{
                      display:"block", width:"100%",
                      padding:"14px 18px", textAlign:"left",
                      background: currentView===v.key ? C.accentLight : "transparent",
                      color: currentView===v.key ? C.accent : C.ink,
                      border:"none", borderBottom:`0.5px solid ${C.border}`,
                      fontSize:15, fontWeight: currentView===v.key ? 700 : 500,
                      cursor:"pointer", fontFamily:"inherit",
                    }}>
                    {v.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={onToday} style={btnStyle}>Aujourd'hui</button>
          <button onClick={onAddEvent} style={btnPrimary}>+RDV</button>
        </div>

        {/* ── Ligne 4 — Jours + numéros + € cerclé bleu ── */}
        <div style={{
          display:"flex",
          borderTop:`0.5px solid ${C.border}`,
        }}>
          {weekDays.map(day=>{
            const isToday = day === today;
            return(
              <div key={day} style={{
                flex:1, textAlign:"center",
                padding:"4px 0 6px",
              }}>
                <div style={{
                  fontSize:10, fontWeight:700,
                  color: isToday ? C.accent : C.muted,
                  textTransform:"uppercase", letterSpacing:.5,
                  marginBottom:2,
                }}>
                  {fmtDay(day)}
                </div>
                <div style={{
                  width:24, height:24, borderRadius:"50%",
                  background: isToday ? C.accent : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 4px",
                }}>
                  <span style={{
                    fontSize:13, fontWeight:700,
                    color: isToday ? "#fff" : C.ink,
                  }}>{fmtDayNum(day)}</span>
                </div>
                <div
                  onClick={()=>onOpenFrais&&onOpenFrais(day)}
                  style={{
                    width:20, height:20, borderRadius:"50%",
                    background: C.accent,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    margin:"0 auto",
                    cursor:"pointer",
                    fontSize:10, fontWeight:800, color:"#fff",
                    boxShadow:`0 1px 4px ${C.accent}66`,
                  }}>
                  €
                </div>
              </div>
            );
          })}
        </div>

      </>)}

      {/* ── Mini modal date picker — 1.5x plus grande ── */}
      {showDatePicker && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:"50%",
          transform:"translateX(-50%)",
          background: C.surface, border:`1px solid ${C.border}`,
          borderRadius:16, padding:"20px 28px",
          boxShadow:"0 8px 32px rgba(0,0,0,.15)",
          zIndex:500, display:"flex", flexDirection:"column",
          alignItems:"center", gap:14,
        }}>
          <div style={{ fontSize:13, color:C.muted, fontWeight:700, letterSpacing:.5 }}>ALLER À</div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <input value={pickDay} onChange={e=>setPickDay(e.target.value)}
              placeholder="JJ" maxLength={2} style={inputNum}/>
            <span style={{ color:C.muted, fontWeight:700, fontSize:20 }}>/</span>
            <input value={pickMonth} onChange={e=>setPickMonth(e.target.value)}
              placeholder="MM" maxLength={2} style={inputNum}/>
            <span style={{ color:C.muted, fontWeight:700, fontSize:20 }}>/</span>
            <input value={pickYear} onChange={e=>setPickYear(e.target.value)}
              placeholder="AAAA" maxLength={4} style={{...inputNum, width:72}}/>
          </div>
          <div style={{ display:"flex", gap:10, width:"100%" }}>
            <button onClick={()=>setShowDatePicker(false)} style={{...btnStyle,flex:1,fontSize:14}}>Annuler</button>
            <button onClick={handleGoToDate} style={{...btnPrimary,flex:1,fontSize:14}}>Aller ✓</button>
          </div>
        </div>
      )}

    </div>
  );
}
