# ⚔️ 1v1 Coding Duel — Sprint 1 Increment
> **Sprint 1 Focus:** Web Page UI & Layout Foundations (Landing, Lobby, Navigation)  
> **Methodology:** Agile Scrum (Sprint 1 of 5-Week Cycle)  
> **Source Plan:** Defined in [`project.txt`](./project.txt) and [`plan.md`](./plan.md)

---

## 🎯 Sprint 1 Goal & Scope

Initialize the React 18 + Vite project, configure Tailwind CSS v4 styling, establish the dark arcade gaming visual identity, and build the interactive page layouts (**Header**, **HomeScreen**, **LobbyScreen**) with a mock navigation state machine.

### User Stories Implemented in Sprint 1:
- **US-1.1**: As a player, I want an attractive landing page so that I can choose to create a room or join a friend's room.
- **US-1.2**: As a player, I want to input my nickname and preferred challenge difficulty (Any, Easy, Medium, Hard).
- **US-1.3**: As a host, I want a lobby page displaying a room code and a copy-link button so that I can easily invite a friend.
- **US-1.4**: As a player joining via an invite link (`?join=CODE`), I want the room code auto-filled on my screen.

---

## 👥 Agile Team Breakdown (Sprint 1)

| Role | Specialist | Sprint 1 Deliverables |
|---|---|---|
| **Role 1** | Frontend & UI/UX Specialist | React 18 + Vite setup, Tailwind CSS v4 styling, `Header.jsx`, `HomeScreen.jsx`, `LobbyScreen.jsx`, and `App.jsx` state machine. |
| **Role 2** | Backend Architect | Node.js + Express backend (`server.js`), CORS setup, in-memory room data model (`rooms = new Map()`), REST API endpoints (`/api/health`, `/api/rooms`). |
| **Role 3** | QA & Tooling Specialist | URL query parameter parsing (`?join=CODE`), `localStorage` persistence, disambiguated room code generator (`src/utils/roomCode.js`), project documentation. |

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server (Vite)
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build & Run with Express Server
```bash
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Sprint 1 Interactive Features & Testing Guide

1. **Nickname Persistence**:
   - Enter a nickname (e.g. `AdaCode`) in the Home Screen.
   - Refresh the page: notice your nickname is preserved via `localStorage`.

2. **Create Room & Difficulty Selection**:
   - Choose a difficulty badge (`Any`, `Easy`, `Medium`, `Hard`).
   - Click **Create Room & Enter Lobby**.
   - A unique 6-character room code (e.g., `K9X2B7`) is generated using disambiguated characters (excluding confusing glyphs like 0, O, 1, I).
   - You enter the **LobbyScreen** showing you as Host ("Connected & Ready").

3. **1-Click Clipboard Actions**:
   - In the Lobby, click **Copy Code**: copies the 6-character room code.
   - Click **Share Direct Link**: copies `${origin}?join=CODE`.

4. **Direct Join Link Auto-fill (US-1.4)**:
   - Open a new tab or URL with `http://localhost:5173/?join=WU7RRV`.
   - Notice the "Room Code" field in the Join Card is immediately auto-filled with `WU7RRV`.

5. **Lobby Opponent Slot Preview**:
   - In the lobby screen, use the **Sprint 1 Prototype Demo Tool** ("Simulate Opponent Joined") to toggle between the waiting slot and the connected 2-player state.

6. **Header Controls**:
   - Sound toggle button placeholder (switches mute state with persistent storage).
   - "Leave" button allows safely exiting a room back to the Home Screen.

---

## 📁 Sprint 1 File Structure

```
1v1-Coding-Sprint1/
├── index.html                  # HTML entry point with Google Fonts (Plus Jakarta Sans & Fira Code)
├── package.json                # Lean dependencies for Sprint 1 (React, Tailwind, Lucide, Express)
├── vite.config.js              # Vite configuration with Tailwind v4 & API proxy
├── server.js                   # Express backend with in-memory room store (rooms Map)
├── project.txt                 # Full 5-week Agile roadmap and task breakdown
├── plan.md                     # High-level architecture specification
├── README.md                   # This documentation
├── public/                     # Static assets directory
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Top-level UI state switcher ('home' <-> 'lobby')
    ├── index.css               # Dark arcade gaming theme, custom scrollbars, animations
    ├── components/
    │   ├── Header.jsx          # Header with branding, room code badge & sound toggle placeholder
    │   ├── HomeScreen.jsx      # Nickname input, difficulty picker, create/join cards, feature pills
    │   └── LobbyScreen.jsx     # Waiting room with 1-click copy/share buttons & player slots
    └── utils/
        └── roomCode.js         # Disambiguated 6-character code generator & validator
```

---

## 🔮 Scope for Subsequent Sprints

The following features belong to future sprints and are purposefully excluded from this Sprint 1 increment:
- **Sprint 2 (Week 2)**: CodeMirror 6 code editor, 2-column duel screen, problem description briefing, test results/console tabs.
- **Sprint 3 (Week 3)**: Socket.IO WebSocket real-time networking, 2-player matchmaking synchronization, synchronized 3-2-1 countdown overlay.
- **Sprint 4 (Week 4)**: Coding problem dataset (`problems.json`), Web Worker isolated sandbox with 2s timeout guard, authoritative server timer, hints dispatcher, winner referee, and Game Over modal.
- **Sprint 5 (Week 5)**: Synthesized 8-bit retro Web Audio engine, automated end-to-end test suite (`duel.test.js`), production optimizations, and cloud deployment.

---

## ✅ Definition of Done (Sprint 1)

- [x] Modern dark arcade theme configured with Tailwind CSS v4.
- [x] Home screen allows nickname entry with `localStorage` persistence and difficulty selection.
- [x] Lobby screen displays room code with 1-click clipboard copy functionality.
- [x] Direct join links (`?join=XXXXXX`) correctly populate the input.
- [x] Zero console errors; verified responsive across mobile and desktop.
