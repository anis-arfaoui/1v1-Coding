# 1v1 Coding Duel — Project Plan

A simple real-time web app where two players join the same room, get the same JavaScript coding problem, and race to solve it before time runs out.

---

## 1. Project Summary

- **Type:** 1v1 coding game (web application)
- **Team:** Group project
- **Duration:** 6 weeks
- **Goal:** A simple, working version with only the needed features

## 2. Core Features (final scope)

- Create a room and get a unique 6-character code
- Join a room using the code and a nickname (no accounts)
- Both players see the same problem: title, description, example input, expected output
- Code editor in the browser (JavaScript only)
- "Run" button that tests the code against test cases
- Server-controlled timer, based on problem difficulty
- Hints that appear at fixed times
- First player to pass all tests wins; if nobody does before the timer ends, it's a draw
- Hosted online so friends can play from home

## 3. Tech Stack

| Part | Choice |
|---|---|
| Frontend | React js  |
| Code editor | Monaco Editor or CodeMirror (via CDN) |
| Backend | Node.js + Express + Socket.IO |
| Code execution | Web Worker in the player's browser (with timeout) |
| Problems storage | `problems.json` file |
| Hosting | Render or Railway (must support WebSockets) |

## 4. How the Game Works

1. Player A clicks **Create room**. The server generates a code and creates the room.
2. Player B enters the code and a nickname, then joins.
3. When 2 players are in the room, the server starts a short countdown.
4. The server sends the same problem to both players and starts the match timer.
5. Players write a `solve` function and click **Run**. The code runs in a Web Worker against the test cases and the player sees the results.
6. When all tests pass, the browser sends `solved` to the server.
7. The server accepts the first `solved` message, announces the winner to both players, and stops the timer.
8. At the hint times, the server sends the next hint to both players.
9. If the timer reaches 0 with no winner, the server announces a draw.

**Rule:** the server owns the timer and the winner decision, so both players stay in sync.

## 5. Problem Format

```json
{
  "id": 1,
  "title": "Sum of Two Numbers",
  "difficulty": "easy",
  "timeLimit": 300,
  "description": "Write a function solve(a, b) that returns a + b.",
  "example": { "input": "2, 3", "output": "5" },
  "hints": ["Think about the + operator.", "Return the result, don't print it."],
  "tests": [
    { "input": [2, 3], "output": 5 },
    { "input": [-1, 1], "output": 0 }
  ]
}
```

Players always write a function named `solve`. The runner calls it with each test's input and compares the result with the expected output.

### Timer by difficulty

| Difficulty | Time limit |
|---|---|
| Easy | 5 minutes |
| Medium | 10 minutes |
| Hard | 15 minutes |

### Hints

Hints appear at fixed points in the match, for example at 1/3 and 2/3 of the time limit.

## 6. Socket Events

**Client to server**
- `create_room`
- `join_room`
- `solved`

**Server to client**
- `room_created`
- `player_joined`
- `game_start`
- `timer_tick`
- `hint`
- `game_over`

## 7. Suggested Folder Structure

```
coding-duel/
├── server.js
├── problems.json
├── package.json
└── public/
    ├── index.html      (home: create / join room)
    ├── game.html       (lobby + game screen)
    ├── style.css
    ├── client.js       (socket logic + UI)
    └── runner.js       (Web Worker that runs player code)
```

## 8. Timeline (6 weeks)

### Week 1 — Rooms
- [ ] Set up Node.js, Express, Socket.IO
- [ ] Create room and generate unique code  
- [ ] Join room with code and nickname
- [ ] Basic pages: home and lobby
- [ ] Show "2 players connected" in the lobby

### Week 2 — Problem, editor, and runner
- [ ] Write `problems.json` with the first 3 problems
- [ ] Display the problem to both players
- [ ] Add the code editor
- [ ] Build the Web Worker test runner with a 2-second timeout
- [ ] Show test results to the player after clicking Run

### Week 3 — Game logic
- [ ] Server-side timer sent to both players
- [ ] Hints at fixed times
- [ ] Winner detection (first `solved` wins)
- [ ] Draw when time runs out
- [ ] Handle disconnections (the other player wins)
- [ ] Game over screen with a "Play again" option

### Week 4 — Hosting and polish
- [ ] Deploy online (Render or Railway)
- [ ] Write 6-10 problems across all difficulties
- [ ] Test with real players from different devices
- [ ] Fix bugs and improve the design
- [ ] Prepare the demo and presentation

## 9. Work Split (adjust to group size)

| Person | Responsibility |
|---|---|
| Person 1 | Backend: rooms, timer, game logic |
| Person 2 | Frontend: UI and code editor |
| Person 3 | Code runner and writing problems |
| Person 4 | Hosting, testing, report and presentation |

## 10. Edge Cases to Handle

- Player disconnects mid-game: the other player wins
- Both solve at nearly the same time: the first message received by the server wins
- Infinite loop in player code: terminate the Web Worker after about 2 seconds
- Invalid or full room code: show a clear error message
- Empty nickname: ask the player to enter one

## 11. Known Limitation

Code is checked in the player's browser, so a determined player could cheat with the dev tools or read the test cases. This is acceptable for a school project played with friends. Mention it in the presentation.

## 12. Optional Upgrades (only if time remains)

- Server-side re-check of solutions to prevent cheating
- Difficulty selection when creating a room
- Penalty seconds for wrong submissions
- Live indicator such as "Your opponent has run their code 3 times"
- Spectator mode
- Accounts with win/loss history
- Support for more languages (via Piston or Judge0)

## 13. Definition of Done

The project is complete when:

- [ ] Two players on different devices can create and join a room with a code
- [ ] Both see the same problem and timer
- [ ] Players can write code, run it, and see test results
- [ ] Hints appear at the right times
- [ ] A winner (or draw) is announced correctly to both players
- [ ] The app is hosted online and works from home
- [ ] At least 6 problems are available
