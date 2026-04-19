"use client";
import { useState } from "react";
import type { useAuth } from "@/lib/useAuth";

type AuthFns = ReturnType<typeof useAuth>;

interface Props {
  login: AuthFns["login"];
  signup: AuthFns["signup"];
  signInWithGoogle: AuthFns["signInWithGoogle"];
}

export default function AuthScreen({ login, signup, signInWithGoogle }: Props) {
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
    const err = mode === "signup"
      ? await signup(name, email, password)
      : await login(email, password);
    setLoading(false);
    if (err) setError(err);
  }

  async function handleGoogleSignIn() {
    setError("");
    setLoading(true);
    const err = await signInWithGoogle();
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

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#252a3a" }} />
          <span style={{ color: "#5c6bc0", fontSize: 12 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#252a3a" }} />
        </div>

        <button 
          onClick={handleGoogleSignIn} 
          disabled={loading}
          style={{
            width: "100%",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 10,
            color: "#333",
            padding: 13,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: loading ? 0.7 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          {loading ? "..." : `Continue with Google`}
        </button>

        <div className="auth-switch">{mode === "login" ? (
            <>Don't have an account? <button onClick={switchMode}>Sign up free</button></>
          ) : (
            <>Already have an account? <button onClick={switchMode}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
}
