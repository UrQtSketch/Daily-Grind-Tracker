# Daily Grind Tracker (Full-Stack Productivity System)

A full-stack personal discipline and productivity application with a 351-Day Quest engine, daily reward celebration modal, multi-user isolated history archive, REST API backend, and persistent database.

---

## Quick Start

### 1. Run with Node.js Backend (Full-Stack Mode)
```bash
npm install
npm start
```
Then open: **http://localhost:3000**

### 2. Run Offline (Client-Only Mode)
Simply open `index.html` directly in any web browser (`file:///.../index.html`). The application includes built-in hybrid offline fallback and continues working seamlessly.

---

## Architecture & Features

### Frontend
- **351-Day Quest Engine**: Real-time progress calculation (`0 / 351 Days`), milestone badges (Centurion, Mastery, Legend).
- **Celebration Reward Modal**: Triggers automatically on 100% daily task completion with golden trophy, canvas confetti particles, tailored congratulations, and 351 unique daily motivational quotes.
- **Activity History Archive**: Chronological timeline showing date-by-date accomplishments, `🏆 Day X Conquered` badges, and earned daily reward quotes.
- **Task Management**: Real-time task ticking, debounced auto-sync, category symbols, search, and dynamic weekly momentum charts.
- **Bottom Mood Cards**: Local assets with crisp high-definition motivational visuals.

### Backend & Database (Node.js & Express)
- **REST APIs**:
  - `GET /api/health` — Service status check.
  - `POST /api/auth/register` — Create user account with secure salt & PBKDF2 password hash.
  - `POST /api/auth/login` — Authenticate and issue session token.
  - `POST /api/auth/logout` — Revoke session token.
  - `GET /api/auth/me` — Return authenticated user profile.
  - `GET /api/tracker` — Fetch authenticated user's complete quest and history state.
  - `PUT /api/tracker` — Persist updated daily tasks, rewards, and journal entries.
- **Database (`data/tracker_db.json`)**: Zero-dependency atomic file database with per-user multi-tenant isolation.
- **Hosting Ready**: Compatible with Render.com, Railway.app, or Glitch free tiers with zero reconfiguration.
