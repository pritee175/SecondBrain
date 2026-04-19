# 🔧 Firebase Data Fix Guide

## Problem
When you add data (habits, todos, etc.) and refresh the page, the data disappears from both the web app and Firebase Console.

## Root Cause
Firebase was storing arrays as **objects with numeric keys** instead of proper arrays:
```javascript
// ❌ WRONG (what was happening)
{ value: { 0: {...}, 1: {...}, 2: {...} } }

// ✅ CORRECT (what should happen)
{ value: [{...}, {...}, {...}] }
```

When the page refreshes, the code expects an array but gets an object, causing data to not display.

## Solution Applied

### 1. Code Fix (Already Pushed ✓)
Updated `lib/useStore.ts` to ensure arrays are properly serialized:
```typescript
const dataToSave = Array.isArray(next) ? [...next] : next;
```

This prevents future data corruption.

### 2. Clean Up Existing Corrupted Data

Your existing Firebase data is still corrupted and needs to be fixed. You have 2 options:

#### Option A: Use the Fix Tool (Recommended)
1. Open `scripts/fix-firebase-data.html` in your browser
2. Make sure you're logged into your Second Brain app in another tab
3. Click "Check Data Structure" to see what's corrupted
4. Click "Fix All Data" to convert objects back to arrays
5. Refresh your Second Brain app - data should now persist!

#### Option B: Manual Cleanup
1. Go to [Firebase Console](https://console.firebase.google.com/project/second-brain-18b46/firestore)
2. Navigate to: `users/{your-user-id}/data/`
3. For each document (habits, todos, goals, etc.):
   - Delete the document
   - Log into your app and re-add your data
   - The new data will be stored correctly

## Verification
After fixing:
1. Add a new habit or todo
2. Refresh the page
3. Data should still be there ✓
4. Check Firebase Console - should see proper arrays

## Why This Happened
Firestore's `setDoc()` can convert arrays to objects if not properly spread. The fix ensures arrays maintain their structure during serialization.
