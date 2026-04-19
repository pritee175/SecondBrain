# 🔥 Firebase Setup Guide

Your Second Brain app is now configured to use Firebase! Follow these steps to complete the setup:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "second-brain")
4. Disable Google Analytics (optional, not needed for this app)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Email/Password" under Sign-in method
4. Toggle "Enable" to ON
5. Click "Save"

## Step 3: Enable Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" (we'll set rules next)
4. Select a location closest to your users
5. Click "Enable"

## Step 4: Set Firestore Security Rules

1. In Firestore Database, click on the "Rules" tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/data/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Your Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>` to add a web app
5. Enter app nickname (e.g., "Second Brain Web")
6. Click "Register app"
7. Copy the `firebaseConfig` object

## Step 6: Add Configuration to Your App

1. Open `second-brain/lib/firebase.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 7: Test Your App

1. Restart your development server (if running)
2. Open http://localhost:3000
3. Create a new account
4. Add some tasks, habits, or journal entries
5. Open the app on another device or browser
6. Login with the same account
7. Your data should sync automatically! 🎉

## Important Notes

- All your data is now stored in Firebase, not localStorage
- Data syncs in real-time across all devices
- Each user's data is completely separate and secure
- Firebase free tier includes:
  - 50,000 reads/day
  - 20,000 writes/day
  - 1GB storage
  - This is more than enough for personal use!

## Troubleshooting

**"Firebase: Error (auth/configuration-not-found)"**
- Make sure you've replaced the placeholder config in `lib/firebase.ts`

**"Missing or insufficient permissions"**
- Check that Firestore security rules are set correctly
- Make sure you're logged in

**Data not syncing**
- Check browser console for errors
- Verify you're using the same email on both devices
- Check your internet connection

## Optional: Deploy to Vercel

Once Firebase is configured, you can deploy to Vercel:

```bash
npm install -g vercel
vercel
```

Your app will be live and accessible from any device!
