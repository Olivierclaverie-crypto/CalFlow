import { useState } from "react";
import { C } from '../utils/constants.js';

export default function Settings({ settings, setSettings, calendars, onBack, auth }) {

  const iStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1.5px solid ${C.border}`,
    background: C.bg,
    color: C.ink,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 11,
    color: C.muted,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: .5,
    marginBottom: 6,
    display: "block",
  };

  const sectionStyle = {
    background: C.surface,
    borderRadius: 16,
    padding: "16px",
    marginBottom: 16,
    border: `1px solid ${C.border}`,
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: C.bg,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none",
          color: C.accent, cursor: "pointer",
          fontSize: 16, fontWeight: 700, fontFamily: "inherit",
          padding: "4px 8px",
        }}>← Retour</button>
        <span style={{
          fontSize: 18, fontWeight: 800,
          color: C.ink, fontFamily: "Phenomena, sans-serif",
          flex: 1,
        }}>Paramètres</span>
        <span style={{
          fontSize: 11, color: C.muted,
          background: C.accentLight,
          border: `1px solid ${C.accentBorder}`,
          borderRadius: 8, padding: "2px 8px",
        }}>
          {auth?.email?.split("@")[0]}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>

        {/* AFFICHAGE */}
        <div style={{ ...sectionStyle }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.ink, marginBottom: 14,
            fontFamily: "Phenomena, sans-serif", letterSpacing: .5 }}>
            Affichage
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Heure début</label>
              <select value={settings.startHour || "8"}
                onChange={e => setSettings(s => ({ ...s, startHour: e.target.value }))}
                style={iStyle}>
                {Array.from({ length: 24 }, (_, i) =>
                  <option key={i} value={i}>{i}h00</option>
                )}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Heure fin</label>
              <select value={settings.endHour || "20"}
                onChange={e => setSettings(s => ({ ...s, endHour: e.target.value }))}
                style={iStyle}>
                {Array.from({ length: 24 }, (_, i) =>
                  <option key={i} value={i}>{i}h00</option>
                )}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, color: C.ink }}>Afficher les tâches terminées</span>
            <div onClick={() => setSettings(s => ({ ...s, showDone: !s.showDone }))}
              style={{
                width: 44, height: 26, borderRadius: 13,
                background: settings.showDone ? C.green : C.border,
                cursor: "pointer", position: "relative",
                transition: "background .2s",
              }}>
              <div style={{
                position: "absolute",
                top: 3, left: settings.showDone ? 21 : 3,
                width: 20, height: 20, borderRadius: "50%",
                background: "#fff",
                transition: "left .2s",
                boxShadow: "0 1px 4px rgba(0,0,0,.2)",
              }} />
            </div>
          </div>
        </div>

        {/* CALENDRIERS */}
        <div style={{ ...sectionStyle }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.ink, marginBottom: 14,
            fontFamily: "Phenomena, sans-serif", letterSpacing: .5 }}>
            Calendriers
          </div>

          <label style={labelStyle}>Calendrier par défaut</label>
          <select value={settings.defaultCalHref || ""}
            onChange={e => setSettings(s => ({ ...s, defaultCalHref: e.target.value }))}
            style={{ ...iStyle, marginBottom: 14,
              borderColor: calendars.find(c => c.href === settings.defaultCalHref)?.color || C.border,
              borderWidth: 2,
            }}>
            {calendars.map(c => (
              <option key={c.href} value={c.href}>{c.displayName}</option>
            ))}
          </select>
        </div>

        {/* FRAIS PREMIUM */}
        <div style={{ ...sectionStyle, borderColor: C.gold, borderWidth: 1.5 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.goldDark,
              fontFamily: "Phenomena, sans-serif", letterSpacing: .5 }}>
              💰 Frais — Premium
            </div>
            <span style={{ fontSize: 10, background: C.goldLight, color: C.goldDark,
              border: `1px solid ${C.gold}`, borderRadius: 10, padding: "2px 8px",
              fontWeight: 700 }}>
              Bientôt
            </span>
          </div>

          {[
            { key: "forfaitKm",      label: "Forfait km" },
            { key: "forfaitRepas",   label: "Forfait repas" },
            { key: "forfaitNuitee",  label: "Forfait nuitée" },
            { key: "forfaitInternet",label: "Forfait internet" },
            { key: "forfaitTel",     label: "Forfait tél." },
          ].map(({ key, label }) => (
            <div key={key} style={{ display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: C.ink }}>{label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  placeholder="0,00 €"
                  value={settings[key] || ""}
                  onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                  style={{ ...iStyle, width: 90, marginBottom: 0, opacity: .6 }}
                  disabled
                />
              </div>
            </div>
          ))}
        </div>

        {/* DÉCONNEXION */}
        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }} style={{
          width: "100%",
          padding: "12px",
          borderRadius: 12,
          border: `1px solid ${C.red}44`,
          background: C.redLight,
          color: C.red,
          fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          marginTop: 8,
        }}>
          Se déconnecter
        </button>

      </div>
    </div>
  );
}
