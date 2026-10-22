# ⚔️ 1v1 Coding Duel

A real-time competitive multiplayer web application where two players join the same room with a 6-character code, receive the same JavaScript coding challenge, and race against each other and the clock to solve it first.

Built strictly according to the specifications in [`plan.md`](./plan.md).

---

## 🚀 Live Demo & Quick Start

The app is fully built and ready to run locally or deploy to the cloud (Render, Railway, Heroku, etc.).

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **npm** v9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Frontend
```bash
npm run build
```

### 4. Start the Server
```bash
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in two different browser tabs (or on two devices on the same network) to start a duel!

---

## 🎮 How to Play

1. **Create a Match**:
   - Player 1 enters a nickname and chooses challenge difficulty (Any, Easy, Medium, Hard).
   - A unique 6-character room code is generated (e.g. `WU7RRV`).
2. **Join a Match**:
   - Player 2 enters their nickname and the 6-character room code (or clicks a direct share link: `?join=CODE`).
3. **Countdown (3.. 2.. 1.. DUEL!)**:
   - As soon as Player 2 enters the lobby, a synchronized 3-second countdown starts with sound cues.
4. **The Coding Race**:
   - Both players are given the **exact same problem** and the **server-authoritative timer**.
   - Write code in the built-in JavaScript editor.
   - Click **Run & Test** (or press `Ctrl + Enter`) to run your code against test cases in an isolated Web Worker.
   - See instant test results: execution time (ms), passed/failed test cases, expected vs actual values, and `console.log` output.
   - Watch the live opponent progress bar update in real-time as they pass tests.
5. **Hints**:
   - Server-timed hints automatically unlock at fixed intervals (at 1/3 and 2/3 of elapsed match time) with audio notifications.
6. **Victory / Draw / Rematch**:
   - The first player whose code passes 100% of the tests wins immediately (celebrated with victory fanfare and confetti).
   - If the timer hits `00:00`, the server announces a Draw.
   - If an opponent disconnects mid-game, victory is awarded by forfeit.
   - Both players can click **Request Rematch** to instantly start a new match with another problem!

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS | Single-page application with dark theme, sound synthesis, and real-time state |
| **Code Editor** | CodeMirror 6 (`@uiw/react-codemirror`) | Full syntax highlighting, line numbers, One Dark theme, bracket matching |
| **Backend** | Node.js + Express + Socket.IO | Authoritative room management, synchronized timer, hint dispatcher, win referee |
| **Code Execution** | Web Worker (`public/runner.js`) | Sandboxed browser thread with an enforced 2-second timeout preventing infinite loops |
| **Audio** | Web Audio API | Zero external audio asset dependencies — pure synthesized retro gaming sound effects |
| **Problem Storage** | `problems.json` | 11 comprehensive coding challenges across Easy, Medium, and Hard difficulties |

---

## 📂 Project Structure

```
1vs1/
├── server.js              # Express + Socket.IO server (authoritative logic)
├── problems.json          # 11 coding challenges with test cases and hints
├── package.json           # Scripts and dependencies
├── vite.config.js         # Vite bundler configuration with Tailwind v4
├── index.html             # HTML entry point with Google Fonts
├── public/
│   └── runner.js          # Web Worker test runner with 2s timeout
├── src/
│   ├── main.jsx           # React DOM root
│   ├── App.jsx            # Main app controller & socket event management
│   ├── index.css          # Theme styles, animations, and custom scrollbars
│   ├── components/
│   │   ├── Header.jsx           # Navbar with room code badge & sound toggle
│   │   ├── HomeScreen.jsx       # Create room & Join room views
│   │   ├── LobbyScreen.jsx      # Waiting room with 1-click copy & share link
│   │   ├── CountdownOverlay.jsx # 3-2-1-DUEL animated countdown
│   │   ├── DuelScreen.jsx       # 2-column layout: Problem/Hints + Editor/Runner
│   │   └── GameOverModal.jsx    # Victory/Defeat modal with confetti & rematch
│   └── utils/
│       ├── socket.js      # Socket.IO client instance
│       ├── codeRunner.js  # Worker spawner with 2000ms safety timeout
│       └── audio.js       # Synthesized Web Audio API sound effects
└── test/
    └── duel.test.js       # Automated end-to-end integration test suite
```

---

## 🧪 Running Automated Tests

Run the test suite that simulates two socket clients creating a room, joining, running countdown, receiving server timers, updating progress, and triggering victory:

```bash
node test/duel.test.js
```

---

## ☁️ Deployment Guide (Render / Railway)

### Deploying to Render
1. Create a new **Web Service** pointing to your repository.
2. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Environment variables:
   - `PORT`: `3000` (or leave default, Render sets `PORT` automatically).
4. WebSockets work out of the box with Render's Node service.

---

## 🛡️ Edge Cases Handled

- **Infinite Loops**: The Web Worker automatically terminates after 2000ms and reports an execution timeout without freezing the browser tab.
- **Mid-Game Disconnections**: The remaining player is awarded an immediate victory by forfeit.
- **Simultaneous Submissions**: The server's single-threaded event loop atomically accepts the first valid `solved` message and transitions room state to `game_over`.
- **Validation**: Enforces non-empty nicknames, checks for room existence, and prevents joining full (2/2) or in-progress rooms.
