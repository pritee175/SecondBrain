# 📦 Migrate Your Existing Data to Firebase

If you have existing data in localStorage that you want to keep, follow these steps:

## Option 1: Export and Import (Recommended)

1. **Before updating to Firebase**, open your app at http://localhost:3000
2. Login with your existing account
3. Click the menu (☰) and select "Export & Backup"
4. Click "Download Backup (.json)"
5. Save the file somewhere safe

6. **After Firebase is configured**, create a new account (or login)
7. Click menu (☰) → "Export & Backup"
8. Click "Choose backup .json file" and select your saved file
9. Click "Restore from Backup"
10. Your data will be uploaded to Firebase! 🎉

## Option 2: Automatic Migration (Advanced)

If you want to automatically migrate localStorage data to Firebase on first login, you can add this migration code.

Add this to `lib/useStore.ts` after the imports:

```typescript
// One-time migration from localStorage to Firebase
async function migrateLocalStorageToFirebase(userId: string) {
  const migrationKey = `migrated_${userId}`;
  if (localStorage.getItem(migrationKey)) return; // Already migrated

  const keys = [
    "habits", "goals", "projects", "todos", "journals", "captures",
    "meals", "waterLogs", "applications", "events", "finances", 
    "savedPosts", "selfTalks"
  ];

  for (const key of keys) {
    const localKey = `sb_${userId}_${key}`;
    const data = localStorage.getItem(localKey);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const docRef = doc(db, "users", userId, "data", key);
        await setDoc(docRef, { value: parsed });
        console.log(`Migrated ${key} to Firebase`);
      } catch (error) {
        console.error(`Failed to migrate ${key}:`, error);
      }
    }
  }

  localStorage.setItem(migrationKey, "true");
  console.log("Migration complete!");
}
```

Then call it in your `SecondBrain.tsx` component after user logs in:

```typescript
useEffect(() => {
  if (user?.id) {
    migrateLocalStorageToFirebase(user.id);
  }
}, [user?.id]);
```

## Important Notes

- Migration only needs to happen once per user
- After migration, all new data goes directly to Firebase
- You can safely clear localStorage after confirming data is in Firebase
- The export/import method (Option 1) is safer and recommended

## Verify Migration

1. Login to your app
2. Check that all your tasks, habits, etc. are visible
3. Open the app on another device
4. Login with the same account
5. Confirm all data appears on the second device

If everything looks good, your migration was successful!
