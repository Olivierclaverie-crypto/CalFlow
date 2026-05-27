import { useState } from "react";
import { C } from '../utils/constants.js';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Email et mot de passe requis");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onLogin(email.trim(), password.trim());
    } catch (e) {
      setError("Connexion échouée — vérifiez vos identifiants");
    }
    setLoading(false);
  }

  const iStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1.5px solid ${C.border}`,
    background: C.bg,
    color: C.ink,
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    marginBottom: 12,
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: C.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{
          fontSize: 42,
          fontWeight: 900,
          color: C.accent,
          fontFamily: "Phenomena, sans-serif",
          letterSpacing: -2,
          lineHeight: 1,
          marginBottom: 6,
        }}>
          NomadCal
        </div>
        <div style={{ fontSize: 13, color: C.muted, letterSpacing: 2 }}>
          CALENDRIER PRO NOMADE
        </div>
      </div>

      {/* Formulaire */}
      <div style={{
        width: "100%",
        maxWidth: 380,
        background: C.surface,
        borderRadius: 20,
        padding: "24px 20px",
        border: `1px solid ${C.border}`,
        boxShadow: "0 4px 24px rgba(0,0,0,.06)",
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 16 }}>
          Connexion iCloud
        </div>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Apple ID (email)"
          style={iStyle}
          autoComplete="email"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe d'application"
          style={iStyle}
          autoComplete="current-password"
        />

        {error && (
          <div style={{
            fontSize: 13, color: C.red,
            background: C.redLight,
            border: `1px solid ${C.red}44`,
            borderRadius: 8, padding: "8px 12px",
            marginBottom: 12,
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: loading ? C.muted : C.accent,
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "background .2s",
          }}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <div style={{ fontSize: 11, color: C.muted, marginTop: 14, lineHeight: 1.6 }}>
          💡 Le mot de passe d'application se génère sur{" "}
          <a href="https://appleid.apple.com" target="_blank" rel="noreferrer"
            style={{ color: C.accent }}>
            appleid.apple.com
          </a>
          {" "}→ Sécurité → Mots de passe d'app
        </div>
      </div>
    </div>
  );
}
