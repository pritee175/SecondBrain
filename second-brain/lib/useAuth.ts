"use client";
import { useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "./firebase";

export interface User {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email || "",
        });
      } else {
        setUser(null);
      }
      setReady(true);
    });

    return () => unsubscribe();
  }, []);

  async function signup(name: string, email: string, password: string): Promise<string | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name
      await updateProfile(userCredential.user, { displayName: name });
      return null;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        return "An account with this email already exists.";
      } else if (error.code === "auth/weak-password") {
        return "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        return "Invalid email address.";
      }
      return error.message || "Signup failed. Please try again.";
    }
  }

  async function login(email: string, password: string): Promise<string | null> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error: any) {
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        return "Invalid email or password.";
      } else if (error.code === "auth/invalid-email") {
        return "Invalid email address.";
      } else if (error.code === "auth/invalid-credential") {
        return "Invalid email or password.";
      }
      return error.message || "Login failed. Please try again.";
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async function signInWithGoogle(): Promise<string | null> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return null;
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        return "Sign-in cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        return "Pop-up blocked. Please allow pop-ups and try again.";
      }
      return error.message || "Google sign-in failed. Please try again.";
    }
  }

  return { user, ready, signup, login, logout, signInWithGoogle };
}
