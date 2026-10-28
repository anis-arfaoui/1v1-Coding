# ⚔️ 1v1 Coding Duel — Sprint 1

> **Sprint 1 Focus:** Foundation and Multiplayer Rooms  
> **Sprint Goal:** Two players can create and join the same room, see lobby status, and enter a stable shared match flow over real WebSockets.

---

## 👥 Scrum Team Ownership

| Role | Team Member | Primary Responsibility |
|---|---|---|
| **Backend Developer** | **Brik Djalel** | Node.js + Express + Socket.IO server, room data model, code generation, room capacity validation. |
| **Frontend Developer** | **Djerbouaa Zakaria** | React 18 + Vite + Tailwind CSS, UI state machine, Home and Lobby screens, Socket.IO client wiring. |
| **Integration, Data & Testing** | **Arfaoui Mohamed Anis** | Problems dataset schema, Socket.IO event contract, manual QA checklist, automated E2E test suite. |

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18+ (tested on v22)
- **npm**: v9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Frontend
```bash
npm run build
```

### 4. Start the Application
```bash
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in two browser tabs to test the real-time multiplayer room flow!

> **Vite Development Mode:** Run `npm run dev` for Vite hot module replacement (proxies WebSocket and REST to port 3000).

---

## 🧪 Automated Testing

Run the automated integration test suite simulating multiple concurrent WebSocket clients:

```bash
npm test
```

This verifies:
1. Health and inspection endpoints (`/api/health`, `/api/rooms/:code`).
2. Room creation and 6-character unique code generation (**US-01**).
3. Player 2 joining and synchronized 2-player lobby state (**US-02 & US-03**).
4. Rejection of 3rd player trying to join a full room (**US-04**).
5. Validation of non-existent room codes and empty nicknames (**US-04**).
6. Disconnect recovery and memory disposal upon empty room.

---

## 📁 Sprint 1 File Structure

```
1v1-Coding-Sprint1/
├── server.js                  # Main server entry (Brik Djalel)
├── server/
│   ├── rooms.js               # In-memory room store & code generator (Brik Djalel)
│   └── socketHandlers.js      # Socket.IO connection & event handlers (Brik Djalel)
├── problems.json              # Agreed JSON problem schema & sample problems (Arfaoui Mohamed Anis)
├── package.json               # Project manifest & scripts (Shared)
├── vite.config.js             # Vite + Tailwind + Proxy configuration (Djerbouaa Zakaria)
├── index.html                 # HTML shell & web fonts (Djerbouaa Zakaria)
├── docs/
│   ├── socket-events.md       # Socket.IO event interface specification (Arfaoui Mohamed Anis)
│   └── test-cases.md          # Manual testing checklist & test scenarios (Arfaoui Mohamed Anis)
├── test/
│   └── sprint1.test.js        # Automated E2E multi-client integration test (Arfaoui Mohamed Anis)
└── src/
    ├── main.jsx               # React entry point (Djerbouaa Zakaria)
    ├── App.jsx                # Main React controller & socket listeners (Djerbouaa Zakaria)
    ├── index.css              # Dark theme styling & animations (Djerbouaa Zakaria)
    ├── components/
    │   ├── Header.jsx         # App header, connection dot & room code badge (Djerbouaa Zakaria)
    │   ├── HomeScreen.jsx     # Landing view: Nickname, Create & Join cards (Djerbouaa Zakaria)
    │   └── LobbyScreen.jsx    # Waiting room: Room code, copy links & player slots (Djerbouaa Zakaria)
    └── utils/
        └── socket.js          # Socket.IO client singleton (Djerbouaa Zakaria)
```
