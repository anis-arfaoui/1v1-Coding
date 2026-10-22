# SPECIFICATIONS & DEVELOPMENT REPORT: 1v1 CODING DUEL
**A Real-Time Multiplayer Web Application for Competitive Programming**  
*Submitted using Scrum as Agile Methodology to the Software Technologies and Information Systems Program*  
*University of Abdelhamid Mehri - Constantine 2 | Faculty of New Technologies of Information and Communication (NTIC)*  
*Master's of Software Engineering and Smart Systems (ILSI) — Course of Agile Development*

---

**Certified by Course Professor:** Dr. BOUANAKA Mohamed Ali  
**Author / Agile Team:**
- **Role 1 (Frontend & UI/UX Specialist):** Component architecture, UI state machines, CodeMirror 6 IDE, dark gaming aesthetic.
- **Role 2 (Backend & Real-Time Networking Architect):** Node.js, Express, Socket.IO, room lifecycle, authoritative timer, winner referee.
- **Role 3 (Execution Sandbox & QA Specialist):** Web Worker sandbox, 2000ms safety timeout guard, problems dataset, Web Audio API, E2E test suite.

**Academic Session:** 2024 / 2025 – Algeria

---

## TABLE OF CONTENTS
- [Introduction](#introduction)
  - [Motivation](#motivation)
  - [Scrum as an Agile Methodology](#scrum-as-an-agile-methodology)
- [Chapter 1: Case Study & Project Specifications](#chapter-1-case-study--project-specifications)
  - [1.1 Context and Project Definition](#11-context-and-project-definition)
  - [1.2 Project Objectives](#12-project-objectives)
  - [1.3 Project Scope & Target Users](#13-project-scope--target-users)
  - [1.4 Functional Description of Requirements](#14-functional-description-of-requirements)
  - [1.5 Non-Functional Requirements](#15-non-functional-requirements)
  - [1.6 Working Methodology & Collaborative Tooling](#16-working-methodology--collaborative-tooling)
- [Chapter 2: Sprint-by-Sprint Agile Development & Deliverables](#chapter-2-sprint-by-sprint-agile-development--deliverables)
  - [2.1 Sprint 1: Web Page UI & Layout Foundations](#21-sprint-1-web-page-ui--layout-foundations)
  - [2.2 Sprint 2: Code Frame & Editor Environment](#22-sprint-2-code-frame--editor-environment)
  - [2.3 Sprint 3: Real-Time Networking, Rooms & Synchronized Countdown](#23-sprint-3-real-time-networking-rooms--synchronized-countdown)
  - [2.4 Sprint 4: Execution Sandbox, Challenges Bank, Authoritative Timer & Referee](#24-sprint-4-execution-sandbox-challenges-bank-authoritative-timer--referee)
  - [2.5 Sprint 5: Optimization, Automated E2E Testing, Audio FX & Cloud Deployment](#25-sprint-5-optimization-automated-e2e-testing-audio-fx--cloud-deployment)
- [Chapter 3: Project Demonstration & Visual Showcase](#chapter-3-project-demonstration--visual-showcase)
- [Chapter 4: Agile Scrum Evaluation & Conclusion](#chapter-4-agile-scrum-evaluation--conclusion)

---

# INTRODUCTION

### Motivation
In modern computer science education and technical recruiting, the ability to solve algorithmic challenges quickly, correctly, and under pressure has become paramount. Traditional competitive coding and technical assessment platforms such as LeetCode, HackerRank, and Codewars excel at providing extensive problem repositories, asynchronous scoring, and automated test runners. However, these platforms inherently lack **synchronous, side-by-side head-to-head racing against a friend or peer**.

When two developers compete asynchronously, the psychological excitement of a real-time race is absent:
1. Players cannot see their opponent's live progress as test cases pass.
2. Players do not experience shared countdown timers or synchronized dynamic hints.
3. Traditional platforms require tedious user account registrations, onboarding steps, and cumbersome team setups before writing a single line of code.

**1v1 Coding Duel** addresses this gap by creating an instantaneous, arcade-style competitive web arena. Two developers can simply open a URL, share a unique 6-character room code, receive the identical algorithmic problem, and race in real time to solve it in their browser before the clock expires.

### Scrum as an Agile Methodology
To deliver a high-quality, real-time multiplayer application within an intensive academic timeline, our team adopted the **Scrum framework** under Agile principles. Scrum replaces traditional, monolithic "Waterfall" development with rapid, iterative cycles known as **Sprints**. 

The fundamental pillars of Scrum guiding this project include:
1. **Transparency:** Every aspect of development—from task progress on Jira to socket event protocols—is visible and accessible to all team members.
2. **Inspection:** At each daily standup and sprint review, the working increment is systematically evaluated against acceptance criteria.
3. **Adaptation:** When technical challenges arise (such as browser UI thread freezing during infinite loops or network race conditions in simultaneous submissions), the team immediately refines the sprint backlog and reallocates resources.

The project was executed in **5 one-week Sprints**, transitioning from visual UI wireframing to an in-browser code editor, real-time WebSocket networking, isolated browser sandboxing, and automated end-to-end integration testing.

---

# CHAPTER 1: CASE STUDY & PROJECT SPECIFICATIONS

### 1.1 Context and Project Definition
**1v1 Coding Duel** is a responsive, real-time multiplayer web application where two players connect to an ephemeral match room, receive the same JavaScript coding challenge, and race against each other and an authoritative countdown clock to produce a working solution.

The project is architected as a modern decoupled full-stack application:
- **Frontend Client:** React 18 single-page application bundled with Vite and styled with Tailwind CSS v4.
- **In-Browser IDE:** CodeMirror 6 with JavaScript syntax highlighting, line numbers, and dark arcade theme.
- **Backend Server:** Node.js HTTP server utilizing Express and Socket.IO for real-time bidirectional communication.
- **Client Sandbox:** Web Worker execution environment isolating untrusted user code execution with an enforced 2000ms safety timeout.

### 1.2 Project Objectives
1. **Zero-Friction Matchmaking:** Allow two players to initiate a duel in under 10 seconds without account creation or authentication barriers.
2. **True Synchronized Racing:** Guarantee both players experience simultaneous problem presentation, identical test cases, synchronized countdowns, and real-time opponent progress updates.
3. **Safe Client-Side Code Execution:** Execute arbitrary JavaScript safely within the user's browser, preventing runaway recursion or infinite loops from hanging the user interface.
4. **Server-Authoritative Refereeing:** Enforce the match timer, hint dispatch schedule, and win/draw/forfeit determinations strictly on the server to prevent race conditions or client-side tampering.
5. **Polished Arcade User Experience:** Provide retro 8-bit audio cues synthesized purely via the Web Audio API, accompanied by responsive gaming aesthetics and celebration animations.

### 1.3 Project Scope & Target Users
- **Target Audience:**
  - Computer science students preparing for technical interviews and coding exams.
  - Software engineering teams conducting hackathon icebreakers and friendly coding scrimmages.
  - Self-taught programmers seeking gamified practice in algorithms and data structures.
- **Supported Problem Scope:** Pure JavaScript algorithmic challenges covering arithmetic, string manipulation, array transformations, recursion, hashing, and frequency counting.

### 1.4 Functional Description of Requirements
The system is decomposed into six cohesive functional modules:

```
+-----------------------------------------------------------------------------------+
|                           1v1 CODING DUEL SYSTEM MODULES                          |
+--------------------------+-----------------------------+--------------------------+
|  1. ROOM & MATCHMAKING   |     2. IN-BROWSER IDE       |  3. EXECUTION SANDBOX    |
|  - 6-Char Room Codes     |     - CodeMirror 6 Engine   |  - Web Worker Isolation  |
|  - Guest Join via Code   |     - JS Syntax & Theme     |  - 2000ms Timeout Guard  |
|  - 1-Click Link Sharing  |     - Starter Code Loader   |  - Deep Equality Engine  |
|  - Difficulty Selection  |     - Tabbed Results Panel  |  - Console Interception  |
+--------------------------+-----------------------------+--------------------------+
|  4. REAL-TIME GAMEPLAY   |     5. PROBLEM BANK         |  6. AUDIO & POLISH       |
|  - 3-2-1 Sync Countdown  |     - 11 Algorithmic Tasks  |  - Web Audio API Synth   |
|  - Server 1s Clock Ticks |     - Multiple Test Cases   |  - Confetti Celebrations |
|  - 1/3 & 2/3 Match Hints |     - Difficulty Tiers      |  - Rematch Negotiation   |
|  - Opponent Live Bar     |     - Time Limit Metadata   |  - Audio Mute Toggle     |
+--------------------------+-----------------------------+--------------------------+
```

1. **Room & Matchmaking Module:**
   - Host generates a room with a 6-character disambiguated alphanumeric code.
   - Host selects match difficulty (`Any`, `Easy` - 5m, `Medium` - 10m, `Hard` - 15m).
   - Guest joins by entering room code or clicking an invite link (`?join=CODE`).
   - Sockets track player presence and reject join attempts if a room is full or in progress.
2. **In-Browser IDE Module:**
   - Responsive split-screen desktop layout (Problem description on left, Code editor on right).
   - CodeMirror 6 editor with JavaScript language extensions, bracket matching, and One Dark theme.
   - Code reset action restoring default starter function signature (`function solve(...)`).
   - Keyboard shortcut binding (`Ctrl + Enter` / `Cmd + Enter`) to trigger execution.
3. **Execution Sandbox & Test Runner Module:**
   - User code is dispatched to an isolated Web Worker (`runner.js`).
   - Strict 2000ms safety timeout terminates hanging workers (`worker.terminate()`).
   - Deep equality assertions (`isDeepEqual`) evaluate complex return types (arrays, objects, primitives).
   - `console.log` statements are captured and displayed in a dedicated monospace console tab.
4. **Real-Time Gameplay & Synchronized Referee Module:**
   - Synchronized 3-second animated countdown overlay upon player connection.
   - Server-authoritative 1-second countdown clock broadcasts `timer_tick` events.
   - Hints automatically broadcast to both players at 1/3 and 2/3 of elapsed time.
   - Passing tests emits `player_progress` to update the opponent's live progress bar.
   - First player passing 100% of test cases atomically triggers a win event (`game_over`).
   - Disconnections award an immediate forfeit victory to the remaining player.
5. **Problem Bank Catalog Module:**
   - 11 curated algorithmic problems across Easy, Medium, and Hard difficulty levels.
   - Structured JSON schema specifying title, description, time limit, hints, starter code, and verified test cases.
6. **Synthesized Audio Engine Module:**
   - Zero-asset audio synthesis using native browser `AudioContext` oscillators.
   - Retro sound effects for countdown beeps, match start, test pass chime, test failure buzz, hint unlock, victory fanfare, and defeat chords.

### 1.5 Non-Functional Requirements
- **Performance & Latency:** WebSocket event round-trip latency under 100ms on broadband networks. Immediate sub-5ms UI responsiveness during code typing.
- **Security & Sandbox Isolation:** Untrusted code execution confined entirely within a Web Worker. User code has zero access to the DOM, window cookies, or network sockets.
- **Reliability & Memory Safety:** Web Workers are terminated and garbage-collected after every run or timeout. Server intervals (`setInterval`) are cleared on match completion or disconnection.
- **Cross-Platform Compatibility:** Responsive layout functioning seamlessly on desktop, laptop, tablet, and modern mobile viewports (Chrome, Firefox, Safari, Edge).
- **Usability & Ergonomics:** High-contrast dark arcade interface preventing eye fatigue during intense coding duels.

### 1.6 Working Methodology & Collaborative Tooling
Our team of 3 developers operated on a weekly sprint cadence:

```
+------------------------------------------------------------------------------------+
|                         SCRUM TEAM ROLE RESPONSIBILITY MATRIX                      |
+-------------------+----------------------------+-----------------------------------+
| Team Role         | Specialist                 | Core Focus & Responsibilities     |
+-------------------+----------------------------+-----------------------------------+
| Role 1            | Frontend & UI/UX Specialist| - React 18 component hierarchy     |
|                   |                            | - Tailwind CSS v4 visual theme    |
|                   |                            | - CodeMirror 6 IDE integration    |
|                   |                            | - Screen state transitions        |
+-------------------+----------------------------+-----------------------------------+
| Role 2            | Backend & Real-Time        | - Node.js Express server          |
|                   | Networking Architect       | - Socket.IO real-time channels    |
|                   |                            | - In-memory room state management |
|                   |                            | - Authoritative timer & referee   |
+-------------------+----------------------------+-----------------------------------+
| Role 3            | Execution Sandbox,         | - Web Worker sandbox & timeout    |
|                   | Challenges & QA Specialist | - Algorithmic problems authoring  |
|                   |                            | - Web Audio API synthesizer       |
|                   |                            | - Automated E2E test suite        |
+-------------------+----------------------------+-----------------------------------+
```

- **Jira Software:** Managed the Product Backlog, Sprint Backlogs, Story Point estimations, and Burndown charts.
- **GitHub:** Maintained continuous integration, Git feature branching (`feature/*`), pull request reviews, and version control.
- **Visual Paradigm / Mermaid:** Utilized for modeling Use Case diagrams, Sequence diagrams, and Domain Entity models.
- **VS Code:** Standardized integrated development environment configured with ESLint and Prettier.

---

# CHAPTER 2: SPRINT-BY-SPRINT AGILE DEVELOPMENT & DELIVERABLES

## 2.1 Sprint 1: Web Page UI & Layout Foundations
- **Duration:** Week 1
- **Sprint Goal:** Initialize the React 18 + Vite repository, establish the dark arcade visual identity using Tailwind CSS v4, and implement the interactive landing and lobby page layouts with state machine transitions.

### User Stories:
- **US-1.1:** *As a player, I want an attractive landing page so that I can choose to create a room or join an existing room.*
- **US-1.2:** *As a player, I want to input my nickname and select my challenge difficulty so that matches match my skill level.*
- **US-1.3:** *As a host, I want a lobby page displaying a room code and a copy-link button so that I can easily invite a friend.*
- **US-1.4:** *As a player joining via an invite link (`?join=CODE`), I want the room code auto-filled on my screen.*

### Use Case Specifications:
```
+---------------------+---------------------------------------------------------------+
| USE CASE SPECIFICATION: CREATE ROOM (US-1.1, US-1.2)                                |
+---------------------+---------------------------------------------------------------+
| Use Case Name       | Create Room                                                   |
| Participating Actor | Player 1 (Host)                                               |
| Pre-conditions      | Host has opened the application in a web browser              |
| Basic Flow          | 1. User inputs nickname into the nickname field.              |
|                     | 2. User selects challenge difficulty (Any, Easy, Medium, Hard)|
|                     | 3. User clicks "Create Room & Enter Lobby".                   |
|                     | 4. System validates nickname is not empty.                    |
|                     | 5. System generates unique 6-character room code.             |
|                     | 6. System transitions user to LobbyScreen in Host status.     |
| Alternative Flow    | If nickname is blank, system displays error alert.            |
| Termination Outcome | Host is positioned in LobbyScreen with shareable room code.   |
+---------------------+---------------------------------------------------------------+
```

```
+---------------------+---------------------------------------------------------------+
| USE CASE SPECIFICATION: JOIN ROOM (US-1.1, US-1.4)                                  |
+---------------------+---------------------------------------------------------------+
| Use Case Name       | Join Room                                                     |
| Participating Actor | Player 2 (Guest)                                              |
| Pre-conditions      | Valid 6-character room code exists on the host side           |
| Basic Flow          | 1. User inputs nickname.                                      |
|                     | 2. User enters 6-character code (or opens direct invite link).|
|                     | 3. User clicks "Join Duel Room".                              |
|                     | 4. System validates code format (exactly 6 alphanumeric chars)|
|                     | 5. System places user into LobbyScreen as Player 2.           |
| Alternative Flow    | If code is invalid or missing, system displays error message. |
| Termination Outcome | Guest enters lobby; two connected players are reflected.     |
+---------------------+---------------------------------------------------------------+
```

### Domain Entity Model (Sprint 1):
```
+----------------------------------+          +----------------------------------+
|               ROOM               | 1      2 |              PLAYER              |
+----------------------------------+----------+----------------------------------+
| - code: String (6 chars, Unique) |          | - id: String (UUID / socket.id)  |
| - difficulty: Enum (any/easy/...) |          | - nickname: String               |
| - status: Enum (waiting/in_game) |          | - isHost: Boolean                |
| - createdAt: Timestamp           |          | - isReady: Boolean               |
+----------------------------------+          +----------------------------------+
```

### Key Technical Deliverables:
- Disambiguated room code generator (`src/utils/roomCode.js`) filtering ambiguous characters `0`, `O`, `1`, `I`, `L`.
- `HomeScreen.jsx` with persistent `localStorage` nickname storage and query parameter parser.
- `LobbyScreen.jsx` with 1-click clipboard actions for room codes and direct links.
- `Header.jsx` with room code badge and audio mute toggle placeholder.

---

## 2.2 Sprint 2: Code Frame & Editor Environment
- **Duration:** Week 2
- **Sprint Goal:** Integrate CodeMirror 6 into React, construct the responsive two-column duel workspace layout, render problem briefing frames, and establish the tabbed results/console output panel.

### User Stories:
- **US-2.1:** *As a developer, I want a syntax-highlighted JavaScript editor with line numbers, dark theme, and auto-closing brackets.*
- **US-2.2:** *As a player, I want to see the problem title, difficulty badge, description, examples, and hints frame on the left side of my screen.*
- **US-2.3:** *As a player, I want a toolbar above the editor with "Run & Test", "Reset Code", and keyboard shortcut indicators.*
- **US-2.4:** *As a player, I want an output panel below the editor with tabs for "Test Results" and "Console Output".*

### Key Technical Deliverables:
- CodeMirror 6 integration (`@uiw/react-codemirror`) styled with the One Dark color palette.
- Responsive split-screen grid (`DuelScreen.jsx`) optimized for dual-column 1920x1080 and 1366x768 screens.
- Problem briefing component formatting code variables, example inputs/outputs, and hint status badges.
- Tabbed footer panel displaying test rows (Input, Expected, Actual, Status badge) and dark terminal monospace console log viewer.

---

## 2.3 Sprint 3: Real-Time Networking, Rooms & Synchronized Countdown
- **Duration:** Week 3
- **Sprint Goal:** Develop the Node.js Express backend, integrate Socket.IO for real-time bidirectional communication, synchronize player presence across match lobbies, and orchestrate the simultaneous 3-2-1-DUEL animated countdown.

### User Stories:
- **US-3.1:** *As Player 1, I want the server to generate a unique 6-character room code when I create a match.*
- **US-3.2:** *As Player 2, I want to enter the 6-character code and instantly join Player 1's lobby without page refreshes.*
- **US-3.3:** *As a player in the lobby, I want to see when the other player connects or disconnects in real time.*
- **US-3.4:** *As both players, once two players are connected in the lobby, I want an animated 3-2-1-DUEL countdown to start automatically on both screens.*

### Real-Time Socket Event Sequence Diagram:
```
Player 1 (Host)                  Node.js Server                  Player 2 (Guest)
      |                                |                                |
      |--- emit('create_room') ------->|                                |
      |<-- emit('room_created', code) -|                                |
      |                                |                                |
      |                                |<-- emit('join_room', code) ----|
      |                                |--- emit('room_joined') ------->|
      |<-- emit('player_joined') ------|                                |
      |                                |                                |
      |        [Room Capacity Reached: 2/2 -> Start Countdown]          |
      |                                |                                |
      |<-- emit('countdown_tick', 3) --|-- emit('countdown_tick', 3) -->|
      |<-- emit('countdown_tick', 2) --|-- emit('countdown_tick', 2) -->|
      |<-- emit('countdown_tick', 1) --|-- emit('countdown_tick', 1) -->|
      |                                |                                |
      |        [Countdown Complete -> Transition to In-Game]            |
      |<-- emit('game_start', prob) ---|-- emit('game_start', prob) --->|
      |                                |                                |
```

### Key Technical Deliverables:
- Express HTTP server and Socket.IO server initialization (`server.js`).
- Authoritative room state store (`rooms = new Map()`) managing room lifecycles (`waiting`, `countdown`, `in_game`, `game_over`).
- Client-side Socket.IO singleton (`src/utils/socket.js`).
- `CountdownOverlay.jsx` delivering full-screen typography animations ("3", "2", "1", "DUEL!") synchronized to server clock ticks.

---

## 2.4 Sprint 4: Execution Sandbox, Challenges Bank, Authoritative Timer & Referee
- **Duration:** Week 4
- **Sprint Goal:** Build the 11-problem algorithmic repository (`problems.json`), implement the isolated Web Worker execution sandbox with 2000ms safety timeout, establish the server-authoritative match timer and hint dispatcher, track live opponent progress, and implement the authoritative win/draw referee and rematch system.

### User Stories:
- **US-4.1:** *As a player, I want to receive a real JavaScript problem from the problem bank with starter code and verified test cases.*
- **US-4.2:** *As a player, I want to click "Run & Test" and safely execute my code in an isolated Web Worker without freezing my browser on infinite loops.*
- **US-4.3:** *As both players, I want a server-controlled countdown timer and automatic hints unlocking at 1/3 and 2/3 of match duration.*
- **US-4.4:** *As a player, I want to see my opponent's live progress bar update when they pass tests.*
- **US-4.5:** *As a player, the first person to pass 100% of test cases should win immediately with celebration confetti; if time runs out, it's a draw; if an opponent disconnects, I win by forfeit.*
- **US-4.6:** *As both players, I want a "Request Rematch" button to immediately play another challenge together.*

### Web Worker Sandboxing & Infinite Loop Guard:
To ensure security and interface responsiveness, user code is executed in an isolated background thread (`public/runner.js`). If a player writes an accidental infinite loop:

```javascript
// Example hanging user submission
function solve(n) {
  while (true) {} // Would freeze browser UI thread if executed synchronously
}
```

The execution wrapper (`src/utils/codeRunner.js`) launches a safety timer alongside the worker:

```javascript
// Timeout Guard Implementation
const worker = new Worker('/runner.js');
const timeoutId = setTimeout(() => {
  worker.terminate(); // Forcefully kills the OS execution thread
  resolve({
    passed: false,
    results: [],
    error: 'Execution Timed Out (2000ms limit exceeded). Check for infinite loops or recursion!'
  });
}, 2000);
```

### Algorithmic Problem Bank Catalog (`problems.json`):
The dataset provides 11 challenges with verified unit tests:
1. **Sum of Two Numbers** (Easy, 300s) — Arithmetic operations.
2. **Reverse a String** (Easy, 300s) — String iteration and reversal.
3. **Palindrome Check** (Easy, 300s) — Bidirectional pointer comparison.
4. **Find Maximum Number** (Easy, 300s) — Array traversal and accumulation.
5. **FizzBuzz Array** (Easy, 300s) — Modulo arithmetic and mapping.
6. **Factorial of a Number** (Medium, 600s) — Iteration and recursion base cases.
7. **Anagram Check** (Medium, 600s) — Frequency hashing and character normalization.
8. **Two Sum** (Medium, 600s) — Hash map lookup for target complement.
9. **Flatten Nested Array** (Medium, 600s) — Recursive depth flattening.
10. **Valid Parentheses** (Hard, 900s) — Stack data structure and bracket matching.
11. **Longest Substring Without Repeating Characters** (Hard, 900s) — Sliding window algorithm with hash set.

### Key Technical Deliverables:
- Web Worker runner (`public/runner.js`) with deep value comparator (`isDeepEqual`) and `console.log` interceptor.
- Server-authoritative timer interval broadcasting `timer_tick` and scheduled `hint_unlocked` events.
- Atomic win referee in `server.js` processing `solved` events and emitting `game_over`.
- `GameOverModal.jsx` featuring dynamic victory/defeat banners, `canvas-confetti` fireworks, and two-party rematch negotiation.

---

## 2.5 Sprint 5: Optimization, Automated E2E Testing, Audio FX & Cloud Deployment
- **Duration:** Week 5
- **Sprint Goal:** Build synthesized retro 8-bit sound effects using the Web Audio API, implement an automated end-to-end integration test suite, harden edge cases, optimize production builds, and prepare cloud deployment on Render/Railway.

### User Stories:
- **US-5.1:** *As a developer, I want an automated test suite verifying problem schemas, code execution, and dual-client socket flows.*
- **US-5.2:** *As a player, I want synthesized retro sound effects for countdowns, runs, hints, victory, and defeat with a mute toggle.*
- **US-5.3:** *As a user, I want the web app to load quickly, handle bad inputs gracefully, and never crash.*
- **US-5.4:** *As a player, I want the game hosted live on the web so I can duel my friends on different devices anywhere in the world.*

### Synthesized Web Audio API Engine (`src/utils/audio.js`):
Rather than loading bulky external `.mp3` or `.wav` files over the network, all game audio is generated in real time using native browser oscillators:
- **Countdown Beep:** 440Hz sine wave (pitching to 880Hz on "DUEL!").
- **Test Pass:** Ascending major triad (523.25Hz -> 659.25Hz -> 783.99Hz).
- **Test Fail:** Descending low sawtooth buzz (220Hz -> 110Hz).
- **Victory Fanfare:** Victorious arpeggio (C5 -> E5 -> G5 -> C6) with exponential gain decay.
- **Defeat Chord:** Somber minor triad (A4 -> C5 -> E5 -> A3).

### Automated Integration Test Suite (`test/duel.test.js`):
The automated test suite runs via Node.js and executes three verification phases:
1. **Problem Bank Validation:** Confirms all 11 challenges possess valid titles, positive time limits, at least 2 hints, starter functions, and unit tests.
2. **Worker Sandbox Simulation:** Verifies correct solutions pass all tests and incorrect solutions fail properly.
3. **Dual-Client Socket Flow:** Launches a test server, connects two virtual Socket.IO clients, verifies room creation, joining, countdown synchronization, opponent progress broadcasting, and atomic victory resolution.

```bash
# Executing automated test suite
node test/duel.test.js
```
*Result: 100% tests passing across problem validation, runner execution, and socket synchronization.*

---

# CHAPTER 3: PROJECT DEMONSTRATION & VISUAL SHOWCASE

### 3.1 Landing & Duel Configuration
The Home Screen welcomes users with the dark arcade visual identity. Users can input their custom nickname, choose a challenge difficulty tier, or enter a 6-character room code. If an invite link (`?join=CODE`) is used, the room code is pre-filled automatically.

### 3.2 Matchmaking Lobby & 1-Click Sharing
Upon creating a match, the host enters the lobby. The disambiguated 6-character room code is rendered prominently. Host and Opponent status cards provide instant visual feedback on connection state. 1-click buttons copy the raw code or formatted invite URL directly to the user's system clipboard.

### 3.3 Synchronous 3-2-1 Countdown Overlay
When the second player enters the lobby, the server locks the room and initiates a 3-second synchronized countdown. Both players view a full-screen animated overlay counting down from 3 to 1 before transitioning simultaneously into the arena.

### 3.4 Live Duel Arena (IDE, Problem Card & Opponent Bar)
The dual-column layout provides a distraction-free coding experience:
- **Left Panel:** Displays challenge title, difficulty badge, formatted description, example inputs/outputs, and locked/unlocked hints.
- **Top Bar:** Shows the server-synchronized countdown timer (color-coded red below 60s) and the live opponent progress bar showing tests passed.
- **Right Panel:** CodeMirror 6 editor with One Dark syntax highlighting, line numbers, and "Run & Test" (`Ctrl + Enter`) controls.
- **Bottom Panel:** Tabbed container toggling between detailed test case verdicts (Passed/Failed, inputs, expected vs actual values, execution time in ms) and user `console.log` terminal output.

### 3.5 Infinite Loop Safety Guard in Action
When user code contains an infinite loop or recursion error, the Web Worker execution sandbox forcefully terminates the process after 2000ms. An alert notifies the developer without freezing the browser tab or interrupting the opponent's match.

### 3.6 Progressive Hint Unlocking
Hints unlock automatically from the server at 1/3 and 2/3 of elapsed time. An audio chime notifies both players, and the hint text reveals itself in the briefing panel to assist struggling contestants.

### 3.7 Victory Celebration & Rematch Modal
As soon as a player passes 100% of the unit tests, the server atomically declares them the winner. The winner's screen explodes with confetti animations and a celebratory fanfare, while the opponent receives a respectful defeat screen. Both players can click **"Request Rematch"** to immediately roll a new challenge and begin another duel.

---

# CHAPTER 4: AGILE SCRUM EVALUATION & CONCLUSION

### 4.1 Evaluation of Scrum in 1v1 Coding Duel
Applying the Scrum framework was instrumental to the successful delivery of this project:
1. **Iterative Layering:** Separating the visual layout (Sprint 1) from editor integration (Sprint 2) and WebSocket networking (Sprint 3) prevented complex integration bottlenecks.
2. **Rapid De-risking:** High-risk architectural challenges—specifically browser UI freezing from untrusted code execution—were isolated and resolved in Sprint 4 via Web Worker sandboxing before final integration.
3. **Cross-Functional Synergy:** Daily 10-minute standups ensured seamless synchronization between frontend component states and backend Socket.IO event payloads.

### 4.2 Velocity and Retrospective Insights
Over the 5 sprints, team velocity remained consistent, averaging 14 story points per sprint. Retrospective discussions after Sprint 3 led to the extraction of the disambiguated room code utility, reducing user input typos during match joining.

### 4.3 Future Perspectives & Strategic Roadmap
- **Server-Side Multi-Language Execution:** Integrating external execution engines like Piston or Judge0 to support Python, C++, Java, and Rust.
- **Persistent Profiles & ELO Matchmaking:** Adding user authentication and a global skill-based rating system (ELO) with ranked matchmaking queues.
- **Spectator Mode:** Allowing non-playing peers to join room sessions via a spectator link to watch live code typing and test executions.

### 4.4 Final Concluding Remarks
The **1v1 Coding Duel** project demonstrates the power of modern web technologies combined with disciplined Agile Scrum execution. By coupling React 18, CodeMirror 6, Socket.IO, Web Workers, and the Web Audio API, the platform delivers an engaging, ultra-fast, and secure competitive coding experience that bridges the gap between solitary algorithm study and exciting head-to-head competition.
