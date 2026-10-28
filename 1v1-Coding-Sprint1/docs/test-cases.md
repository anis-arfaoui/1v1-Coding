# 🧪 Sprint 1 Test Cases & QA Validation Matrix
**Responsible Member:** Arfaoui Mohamed Anis (Integration, Data, and Testing Developer)

This document outlines the test cases used to verify Sprint 1 functionality across both manual and automated testing.

---

## Test Cases Summary

| ID | Title | Description | Expected Outcome | Status |
|---|---|---|---|:---:|
| **TC-01** | Create Room | Host enters nickname and clicks "Create Room & Enter" | Room is created, unique 6-character code is displayed, and host appears in Slot 1. | ✅ Passed |
| **TC-02** | Room Code Uniqueness | Create multiple rooms in sequence | Each generated code is exactly 6 characters and has no collisions. | ✅ Passed |
| **TC-03** | Join by Code | Player 2 enters existing 6-character code and nickname | Player 2 joins room; both players immediately see each other in real-time. | ✅ Passed |
| **TC-04** | Direct Share Link | Player 2 opens link formatted as `http://localhost:3000/?join=CODE` | Room code input is automatically pre-filled with the code from the query parameter. | ✅ Passed |
| **TC-05** | Room Full Rejection | Player 3 attempts to join a room that already has 2 players | Server rejects with `ROOM_FULL` error: "Room 'CODE' is already full (2/2 players)." | ✅ Passed |
| **TC-06** | Invalid Room Code | Player attempts to join with non-existent code | Server rejects with `ROOM_NOT_FOUND` error: "Room 'CODE' was not found." | ✅ Passed |
| **TC-07** | Empty Nickname Validation | Player clicks Create or Join with blank/spaces nickname | Action is blocked; red error alert prompts user to enter a nickname. | ✅ Passed |
| **TC-08** | Player Departure | Player 2 clicks "Cancel and return to home" | Player 1 is notified via `player_left`; slot resets to "Waiting for opponent...". | ✅ Passed |
| **TC-09** | Room Cleanup | Both players leave room | Room is removed from backend memory (`rooms.delete(code)`), preventing leaks. | ✅ Passed |
| **TC-10** | REST Health Check | `GET /api/health` | Returns `{ status: 'ok', sprint: 'Sprint 1', activeRooms: N }`. | ✅ Passed |

---

## Two-Tab Manual Review Script

1. Open `http://localhost:3000` in **Browser Tab 1** (Host).
2. Enter nickname `Alice`, select `🟢 Easy (5 min)`, and click **Create Room & Enter**.
3. Confirm Tab 1 enters Lobby with room code (e.g., `WU7RRV`), showing `Alice` as Host.
4. Open `http://localhost:3000` in **Browser Tab 2** (Guest).
5. Enter nickname `Bob`, input room code `WU7RRV`, and click **Join Duel Room**.
6. Observe that **Tab 1 and Tab 2 update simultaneously without reloading**:
   - Tab 1 displays `Bob` in Slot 2 (`Connected & Ready`).
   - Tab 2 displays `Alice` in Slot 1 (`Host`) and `Bob` in Slot 2 (`You`).
7. Open **Tab 3** and attempt to join `WU7RRV` as `Charlie`.
   - Verify red alert: *"Room 'WU7RRV' is already full (2/2 players)."*
