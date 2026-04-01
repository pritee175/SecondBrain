"use client";
import { useState } from "react";
import type { useAuth } from "@/lib/useAuth";

type AuthFns = ReturnType<typeof useAuth>;

interface Props {
  login: AuthFns["login"];
  signup: AuthFns["signup"];
}

export default function AuthScreen({ login, signup }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    if (mode === "signup") {
      if (!name.trim()) { setError("Please enter your name."); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (password !== confirm) { setError("Passwords do not match."); return; }
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 300)); // slight delay for feel
    const err = mode === "signup"
      ? signup(name, email, password)
      : login(email, password);
    setLoading(false);
    if (err) setError(err);
  }

  function switchMode() {
    setMode(m => m === "login" ? "signup" : "login");
    setError(""); setName(""); setEmail(""); setPassword(""); setConfirm("");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">⬡</div>
        <div className="auth-title">SECOND BRAIN</div>
        <div className="auth-sub">
          {mode === "login" ? "Welcome back. Sign in to continue." : "Create your account to get started."}
        </div>

        {error && <div className="auth-error">{error}</div>}

        {mode === "signup" && (
          <div className="auth-field">
            <label>YOUR NAME</label>
            <input
              className="sb-input"
              type="text"
              placeholder="What should we call you?"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
        )}

        <div className="auth-field">
          <label>EMAIL</label>
          <input
            className="sb-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="auth-field">
          <label>PASSWORD</label>
          <input
            className="sb-input"
            type="password"
            placeholder={mode === "signup" ? "Min. 6 characters" : "Enter your password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {mode === "signup" && (
          <div className="auth-field">
            <label>CONFIRM PASSWORD</label>
            <input
              className="sb-input"
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
        )}

        <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : mode === "login" ? "SIGN IN →" : "CREATE ACCOUNT →"}
        </button>

        <div className="auth-switch">
          {mode === "login" ? (
            <>Don't have an account? <button onClick={switchMode}>Sign up free</button></>
          ) : (
            <>Already have an account? <button onClick={switchMode}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
}
