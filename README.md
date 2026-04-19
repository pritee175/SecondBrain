# 🧠 Second Brain

Your personal productivity OS — habits, journal, goals, diet, finance and more. Works on phone like a native app.

## ⚡ Quick Start (Local)

```bash
# 1. Enter the project folder
cd second-brain

# 2. Install
npm install

# 3. Run
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🌐 Deploy Free to Vercel (use on phone anywhere)

### Option A — GitHub + Vercel (recommended, 5 minutes)

1. **Create a free GitHub account** at github.com if you don't have one
2. **Create a new repo** → click "+" → "New repository" → name it `second-brain` → Create
3. **Upload your files**: drag the entire `second-brain` folder contents into the repo
4. **Go to vercel.com** → Sign up free with GitHub
5. Click **"Add New Project"** → Import your `second-brain` repo
6. Click **Deploy** — done! You get a URL like `second-brain-xyz.vercel.app`
7. Open that URL on your phone 🎉

### Option B — Vercel CLI (if you have Node installed)

```bash
# Install Vercel CLI
npm install -g vercel

# Inside the second-brain folder:
vercel

# Follow prompts → get a live URL in ~60 seconds
```

---

## 📱 Install on Phone (PWA — works like a native app)

Once deployed to Vercel:

**iPhone (Safari):**
1. Open your Vercel URL in Safari
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **Add** → app icon appears on your home screen

**Android (Chrome):**
1. Open your Vercel URL in Chrome
2. Tap the **three dots menu**
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **Install** → app icon appears

The app will open fullscreen, like a native app, with no browser bar.

---

## ✨ Features

| Section | Feature |
|---|---|
| Dashboard | Habits + streaks, today's stats, events preview, goal bars |
| Journal | Mood picker (5 moods), tags, expandable entries |
| Self Talk | 4 reflection categories, 20+ questions, saved archive |
| Inbox | Instant idea capture with area tagging |
| Saved Posts | YouTube / Instagram / Telegram bookmarks |
| To-Do | Priority groups (High/Med/Low), area, due date |
| Projects | Status tracking, next actions |
| Goals | Progress bars with +/− controls |
| Events | Date + time scheduler with colour-coded types |
| Diet | Calorie/macro log, water tracker |
| Finance | Income/expense daily log + all-time totals |
| Applications | Job pipeline with 6 status stages |

## 💾 Data Storage
- All data saved to **localStorage** in your browser
- Each account's data is separate
- Works fully **offline** after first load
- Data stays until you clear browser storage

## 🏗️ Stack
- **Next.js 14** (App Router)
- **TypeScript** — fully typed
- **CSS variables** — no UI library needed
- **localStorage** — no database, no server, no cost
