# 🔐 Enable Authentication in Firebase

You're seeing the error **"Firebase: Error (auth/operation-not-allowed)"** because authentication methods aren't enabled yet in Firebase Console.

## Quick Fix (2 minutes):

### Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **second-brain-18b46**
3. Click **"Authentication"** in the left sidebar
4. Click **"Get started"** (if you haven't already)
5. Click on the **"Sign-in method"** tab
6. Find **"Email/Password"** in the list
7. Click on it
8. Toggle **"Enable"** to ON
9. Click **"Save"**

### Step 2: Enable Google Sign-In

1. In the same **"Sign-in method"** tab
2. Find **"Google"** in the list
3. Click on it
4. Toggle **"Enable"** to ON
5. Enter a **"Project support email"** (your email)
6. Click **"Save"**

## That's It!

Now refresh your app at http://localhost:3000 and try:
- ✅ Creating an account with email/password
- ✅ Signing in with Google

Both should work now! 🎉

## Visual Guide:

```
Firebase Console
└── Your Project (second-brain-18b46)
    └── Authentication
        └── Sign-in method tab
            ├── Email/Password → Enable ✓
            └── Google → Enable ✓
```

## What Each Method Does:

**Email/Password:**
- Users create account with email + password
- Traditional sign-up/sign-in
- You manage the accounts

**Google Sign-In:**
- Users sign in with their Google account
- One-click authentication
- No password to remember
- More secure (uses Google's authentication)

## After Enabling:

Your app will show:
1. Email/password fields
2. "OR" divider
3. "Continue with Google" button with Google logo

Users can choose either method to sign in!
