import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
// Option 1: Use environment variables (recommended for production)
// Option 2: Hardcode values directly (easier for quick setup)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAMCbLzbJ3Jk83zjJATHSOQVP2qI5kBKxQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "second-brain-18b46.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "second-brain-18b46",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "second-brain-18b46.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "927504873910",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:927504873910:web:78f9f89eaa78a2c15a2917",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);




