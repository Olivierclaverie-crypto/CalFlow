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
  fmtWeekRange,
}) {
  const pendingCount = tasks.filter(t => !t.done).length;

  return (
    <div style={{
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      padding: "12px 16px 10px",
      flexShrink: 0,
    }}>
      {/* Ligne 1 — Logo + icônes */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 28,
          fontWeight: 800,
          color: C.accent,
          fontFamily: "Phenomena, sans-serif",
          letterSpacing: -1,
        }}>
          NomadCal
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Indicateur sync */}
          <div style={{
            width: 11, height: 11, borderRadius: "50%",
            background: syncing ? C.gold : syncOk ? C.green : C.red,
            transition: "background .3s",
          }} title={syncing ? "Synchronisation…" : syncOk ? "Synchronisé" : "Erreur sync"} />
          <button onClick={onSync} style={{
            background: "none", border: "none",
            color: C.muted, cursor: "pointer", fontSize: 22, padding: 4,
          }}>↻</button>
          <button onClick={onSettings} style={{
            background: "none", border: "none",
            color: C.muted, cursor: "pointer", fontSize: 22, padding: 4,
          }}>⚙️</button>
        </div>
      </div>

      {/* Bandeau clipboard actif */}
      {clipboard ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: C.goldLight, border: `1px solid ${C.gold}`,
          borderRadius: 10, padding: "8px 12px",
        }}>
          <span style={{ fontSize: 12, color: C.goldDark, flex: 1, fontWeight: 700 }}>
            📋 {clipboard.title} — Tap sur un créneau pour coller
          </span>
          <button onClick={onClearClipboard} style={{
            background: "none", border: "none",
            color: C.goldDark, cursor: "pointer", fontSize: 16, padding: "0 4px", fontWeight: 700,
          }}>✕</button>
        </div>
      ) : (
        /* Ligne 2 — Mois + boutons */
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>
            {fmtWeekRange(weekDays)}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onToday} style={{
              fontSize: 11, fontWeight: 700, color: C.accent,
              background: C.accentLight, border: `1px solid ${C.accentBorder}`,
              borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit",
            }}>Aujourd'hui</button>

            <button onClick={onAddEvent} style={{
              fontSize: 11, fontWeight: 700, color: "#fff",
              background: C.accent, border: "none",
              borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit",
            }}>+ RDV</button>
          </div>
        </div>
      )}
    </div>
  );
}
