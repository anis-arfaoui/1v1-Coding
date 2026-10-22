# ⚔️ 1v1 Coding Duel — Complete Project Workspace

A real-time competitive programming web application where two players join the same room with a 6-character code, receive the same JavaScript coding challenge, and race against the clock to solve it first.

Submitted as part of the **Master's in Software Engineering and Smart Systems (ILSI)** at the **University of Abdelhamid Mehri - Constantine 2**, Course of **Agile Development** certified by **Dr. BOUANAKA Mohamed Ali**.

---

## 📁 Repository Structure

```
complete-1v1coding/
├── 1v1-Coding-Sprint1/        # Sprint 1 Deliverable: Web Page UI & Layout Foundations
├── 1v1-Coding/                # Complete 5-Sprint Implementation (Full Application)
└── report/                    # Academic Specifications & Agile Project Reports
    ├── 1v1_Coding_Duel_Project_Report.pdf   # Full Academic Report (PDF)
    ├── 1v1_Coding_Duel_Project_Report.html  # Standalone Printable Report (HTML)
    └── 1v1_Coding_Duel_Project_Report.md    # Markdown Specifications
```

---

## 🚀 Projects Overview

### 1. `1v1-Coding-Sprint1` (Sprint 1 Increment)
- **Focus:** Web Page UI & Layout Foundations (Landing, Lobby, Navigation)
- **Tech Stack:** React 18, Vite, Tailwind CSS v4, Express REST API
- Features nickname persistence, difficulty selection, disambiguated 6-character room codes, direct invite links (`?join=CODE`), and prototype lobby simulation.

### 2. `1v1-Coding` (Full 5-Week Implementation)
- **Tech Stack:** React 18, Vite, Tailwind CSS v4, CodeMirror 6, Node.js + Express, Socket.IO, Web Workers, Web Audio API
- **Features:**
  - Real-time WebSocket matchmaking with 6-character codes.
  - Synchronized full-screen 3-2-1 countdown overlay.
  - Two-column duel arena with problem description, examples, and progressive hints.
  - Sandboxed JavaScript code execution inside Web Workers with an enforced 2000ms safety timeout (preventing infinite loop freezes).
  - 11 comprehensive coding challenges with automated unit tests (`problems.json`).
  - Server-authoritative countdown clock and live opponent progress tracking.
  - Pure Web Audio API retro 8-bit sound effects.
  - Automated integration test suite (`node test/duel.test.js`).

### 3. `report` (Academic Documentation)
- Contains the comprehensive Agile Scrum specification report detailing user stories, use case diagrams, sequence diagrams, architecture, and sprint retrospectives for all 5 sprints.

---

## 🛠️ Quick Start

To run the complete application:

```bash
cd 1v1-Coding
npm install
npm run build
npm start
```
Open **`http://localhost:3000`** in two browser tabs to start a duel!
