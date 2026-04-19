# 🚀 Quick Start - Firebase Integration

Your app is now ready for Firebase! Here's what you need to do:

## ⚡ 3-Minute Setup

### 1. Create Firebase Project (1 min)
- Go to https://console.firebase.google.com/
- Click "Add project"
- Name it "second-brain"
- Click through the setup

### 2. Enable Services (1 min)
**Authentication:**
- Click "Authentication" → "Get started"
- Enable "Email/Password"

**Firestore:**
- Click "Firestore Database" → "Create database"
- Choose "Production mode"
- Select your region

**Security Rules:**
- In Firestore, go to "Rules" tab
- Paste this:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/data/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
- Click "Publish"

### 3. Get Config & Update Code (1 min)
- Click ⚙️ → "Project settings"
- Scroll to "Your apps" → Click web icon `</>`
- Copy the `firebaseConfig` object
- Open `second-brain/lib/firebase.ts`
- Replace the placeholder config with your real config

### 4. Test It! 🎉
```bash
# Restart your dev server
npm run dev
```

- Open http://localhost:3000
- Create a new account
- Add some tasks
- Open on your phone (use your computer's IP address)
- Login with same account
- See your data sync in real-time! ✨

## 📱 Access from Phone (Same Network)

Find your computer's IP:
- Windows: `ipconfig` (look for IPv4)
- Mac/Linux: `ifconfig` (look for inet)

Then open on phone: `http://YOUR_IP:3000`

## 🌐 Deploy to Internet (Optional)

```bash
npm install -g vercel
vercel
```

You'll get a URL like `second-brain-xyz.vercel.app` that works anywhere!

## ❓ Need Help?

See detailed guides:
- `FIREBASE_SETUP.md` - Complete Firebase setup
- `MIGRATION_GUIDE.md` - Move existing data to Firebase

## 🎯 What Changed?

- ✅ Authentication now uses Firebase Auth (secure, real accounts)
- ✅ Data stored in Firestore (syncs across devices)
- ✅ Real-time updates (changes appear instantly everywhere)
- ✅ Offline support (Firebase caches data locally)
- ✅ Free tier: 50k reads/day, 20k writes/day, 1GB storage

Your app is production-ready! 🚀
