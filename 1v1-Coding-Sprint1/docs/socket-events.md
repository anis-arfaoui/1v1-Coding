# 📜 Socket.IO Event Contract (Sprint 1)
**Responsible Member:** Arfaoui Mohamed Anis (Integration, Data, and Testing Developer)

This document serves as the shared communication agreement between the backend (Brik Djalel) and the frontend (Djerbouaa Zakaria).

---

## 1. Client-to-Server Events

### `create_room`
Sent by the host player to initialize a new room.

**Payload:**
```json
{
  "nickname": "Alice",
  "difficulty": "easy" // "any" | "easy" | "medium" | "hard"
}
```

**Backend Validation & Response:**
- Validates that `nickname` is non-empty.
- Generates a unique 6-character room code (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`).
- Returns `room_created` to the sender, or `error_message` if invalid.

---

### `join_room`
Sent by a second player to join an existing room.

**Payload:**
```json
{
  "roomCode": "WU7RRV",
  "nickname": "Bob"
}
```

**Backend Validation & Response:**
- Validates that `roomCode` and `nickname` are non-empty.
- Checks if room exists (`ROOM_NOT_FOUND`).
- Checks if room has capacity (`ROOM_FULL` if 2 players are already in the room).
- Sends `room_joined` to the joining player.
- Broadcasts `player_joined` to all players in the room channel.

---

### `leave_room`
Sent when a player leaves the room or clicks Cancel.

**Payload:**
```json
{
  "roomCode": "WU7RRV"
}
```

**Backend Action:**
- Removes player from room.
- If room becomes empty: destroys room.
- If 1 player remains: broadcasts `player_left` to the remaining player and resets status to `waiting`.

---

## 2. Server-to-Client Events

### `room_created`
Sent to the host upon successful room creation.

**Payload:**
```json
{
  "roomCode": "WU7RRV",
  "difficulty": "easy",
  "status": "waiting",
  "players": [
    {
      "id": "socket_id_1",
      "nickname": "Alice",
      "isHost": true,
      "joinedAt": "2026-10-28T20:00:00.000Z"
    }
  ],
  "player": {
    "id": "socket_id_1",
    "nickname": "Alice",
    "isHost": true
  }
}
```

---

### `room_joined`
Sent exclusively to the joining player upon success.

**Payload:**
```json
{
  "roomCode": "WU7RRV",
  "difficulty": "easy",
  "status": "ready",
  "players": [
    { "id": "socket_id_1", "nickname": "Alice", "isHost": true },
    { "id": "socket_id_2", "nickname": "Bob", "isHost": false }
  ],
  "player": {
    "id": "socket_id_2",
    "nickname": "Bob",
    "isHost": false
  }
}
```

---

### `player_joined`
Broadcasted to all room members when the second player connects.

**Payload:**
```json
{
  "roomCode": "WU7RRV",
  "difficulty": "easy",
  "status": "ready",
  "players": [
    { "id": "socket_id_1", "nickname": "Alice", "isHost": true },
    { "id": "socket_id_2", "nickname": "Bob", "isHost": false }
  ]
}
```

---

### `player_left`
Sent to the remaining player if their opponent leaves or disconnects.

**Payload:**
```json
{
  "roomCode": "WU7RRV",
  "status": "waiting",
  "players": [
    { "id": "socket_id_1", "nickname": "Alice", "isHost": true }
  ],
  "leftPlayerNickname": "Bob",
  "message": "Bob has left the room. Waiting for an opponent..."
}
```

---

### `error_message`
Emitted to a client when an operation fails validation.

**Payload:**
```json
{
  "type": "ROOM_FULL", // "INVALID_NICKNAME" | "EMPTY_ROOM_CODE" | "ROOM_NOT_FOUND" | "ROOM_FULL"
  "message": "Room \"WU7RRV\" is already full (2/2 players)."
}
```
