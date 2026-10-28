export const rooms = new Map();

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (rooms.has(code));
  return code;
}

/**
 * Creates a new room and assigns the creating socket as Host.
 * @param {string} hostSocketId
 * @param {string} nickname
 * @param {string} difficulty
 * @returns {object} { success: boolean, room?: object, error?: string, type?: string }
 */
export function createRoom(hostSocketId, nickname, difficulty = 'any') {
  const cleanNick = (nickname || '').trim();

  if (!cleanNick) {
    return {
      success: false,
      type: 'INVALID_NICKNAME',
      error: 'Please enter a valid nickname to create a room.'
    };
  }

  const code = generateRoomCode();
  const hostPlayer = {
    id: hostSocketId,
    nickname: cleanNick,
    isHost: true,
    joinedAt: new Date().toISOString()
  };

  const room = {
    code,
    difficulty: difficulty || 'any',
    status: 'waiting', 
    createdAt: new Date().toISOString(),
    players: [hostPlayer]
  };

  rooms.set(code, room);

  return {
    success: true,
    room,
    player: hostPlayer
  };
}

/**
 * Adds a guest player to an existing room.
 * @param {string} guestSocketId
 * @param {string} roomCode
 * @param {string} nickname
 * @returns {object} { success: boolean, room?: object, player?: object, error?: string, type?: string }
 */
export function joinRoom(guestSocketId, roomCode, nickname) {
  const cleanCode = (roomCode || '').trim().toUpperCase();
  const cleanNick = (nickname || '').trim();

  if (!cleanCode) {
    return {
      success: false,
      type: 'EMPTY_ROOM_CODE',
      error: 'Please enter a 6-character room code.'
    };
  }

  if (!cleanNick) {
    return {
      success: false,
      type: 'INVALID_NICKNAME',
      error: 'Please enter a valid nickname to join.'
    };
  }

  const room = rooms.get(cleanCode);
  if (!room) {
    return {
      success: false,
      type: 'ROOM_NOT_FOUND',
      error: `Room "${cleanCode}" was not found. Please verify the code.`
    };
  }

  if (room.players.length >= 2) {
    return {
      success: false,
      type: 'ROOM_FULL',
      error: `Room "${cleanCode}" is already full (2/2 players).`
    };
  }

  const guestPlayer = {
    id: guestSocketId,
    nickname: cleanNick,
    isHost: false,
    joinedAt: new Date().toISOString()
  };

  room.players.push(guestPlayer);
  room.status = 'ready';

  return {
    success: true,
    room,
    player: guestPlayer
  };
}

/**
 * Removes a player from a room upon leaving or disconnecting.
 * @param {string} socketId
 * @param {string} roomCode
 * @returns {object} { success: boolean, roomDestroyed?: boolean, room?: object, leftPlayer?: object }
 */
export function leaveRoom(socketId, roomCode) {
  if (!roomCode) return { success: false };
  const room = rooms.get(roomCode);
  if (!room) return { success: false };

  const playerIndex = room.players.findIndex((p) => p.id === socketId);
  if (playerIndex === -1) return { success: false };

  const [removedPlayer] = room.players.splice(playerIndex, 1);

  if (room.players.length === 0) {
    // Room is now empty, destroy it to prevent memory leaks
    rooms.delete(roomCode);
    return {
      success: true,
      roomDestroyed: true,
      leftPlayer: removedPlayer
    };
  }

  // 1 player remains, reset room status to waiting
  room.status = 'waiting';
  if (removedPlayer.isHost && room.players.length > 0) {
    room.players[0].isHost = true;
  }

  return {
    success: true,
    roomDestroyed: false,
    room,
    leftPlayer: removedPlayer
  };
}

/**
 * Finds a room by code
 * @param {string} code
 * @returns {object|undefined}
 */
export function getRoom(code) {
  return rooms.get((code || '').trim().toUpperCase());
}
