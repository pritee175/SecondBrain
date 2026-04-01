"use client";
import { useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// Very simple hash for demo — good enough for local-only auth
function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem("sb_users") ?? "[]"); } catch { return []; }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem("sb_users", JSON.stringify(users));
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Restore session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sb_session");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  function signup(name: string, email: string, password: string): string | null {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return "An account with this email already exists.";
    }
    const newUser: StoredUser = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: simpleHash(password),
    };
    saveUsers([...users, newUser]);
    const session: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem("sb_session", JSON.stringify(session));
    setUser(session);
    return null;
  }

  function login(email: string, password: string): string | null {
    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) return "No account found with this email.";
    if (found.passwordHash !== simpleHash(password)) return "Incorrect password.";
    const session: User = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem("sb_session", JSON.stringify(session));
    setUser(session);
    return null;
  }

  function logout() {
    localStorage.removeItem("sb_session");
    setUser(null);
  }

  return { user, ready, signup, login, logout };
}
