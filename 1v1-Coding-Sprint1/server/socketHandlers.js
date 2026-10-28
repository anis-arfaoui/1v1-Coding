
import { createRoom, joinRoom, leaveRoom } from './rooms.js';

export function registerSocketHandlers(io, socket) {
  let currentRoomCode = null;

  // US-01: Create Room
  socket.on('create_room', ({ nickname, difficulty }) => {
    const result = createRoom(socket.id, nickname, difficulty);

    if (!result.success) {
      return socket.emit('error_message', {
        type: result.type,
        message: result.error
      });
    }

    const { room, player } = result;
    currentRoomCode = room.code;
    socket.join(room.code);

    console.log(`[Sprint 1] Room created: ${room.code} by ${player.nickname} (${socket.id})`);

    // Acknowledge to host
    socket.emit('room_created', {
      roomCode: room.code,
      difficulty: room.difficulty,
      status: room.status,
      players: room.players,
      player
    });
  });

  // US-02: Join Room
  socket.on('join_room', ({ roomCode, nickname }) => {
    const result = joinRoom(socket.id, roomCode, nickname);

    if (!result.success) {
      return socket.emit('error_message', {
        type: result.type,
        message: result.error
      });
    }

    const { room, player } = result;
    currentRoomCode = room.code;
    socket.join(room.code);

    console.log(`[Sprint 1] Player joined: ${room.code} by ${player.nickname} (${socket.id})`);

    // Send acknowledgement to the guest player who just joined
    socket.emit('room_joined', {
      roomCode: room.code,
      difficulty: room.difficulty,
      status: room.status,
      players: room.players,
      player
    });

    // US-03: Broadcast to everyone in the room that both players are now connected
    io.to(room.code).emit('player_joined', {
      roomCode: room.code,
      difficulty: room.difficulty,
      status: room.status,
      players: room.players
    });
  });

  // Handle Leave Room (Voluntary)
  socket.on('leave_room', ({ roomCode }) => {
    const targetCode = roomCode || currentRoomCode;
    handleLeave(socket, targetCode);
  });

  // Handle Disconnection (Socket drop)
  socket.on('disconnect', () => {
    if (currentRoomCode) {
      handleLeave(socket, currentRoomCode);
    }
  });

  function handleLeave(leavingSocket, code) {
    if (!code) return;
    leavingSocket.leave(code);

    const result = leaveRoom(leavingSocket.id, code);
    if (!result.success) return;

    if (result.roomDestroyed) {
      console.log(`[Sprint 1] Room ${code} destroyed (empty)`);
    } else {
      console.log(`[Sprint 1] Player ${result.leftPlayer.nickname} left room ${code}`);
      // Notify the remaining player
      io.to(code).emit('player_left', {
        roomCode: code,
        status: result.room.status,
        players: result.room.players,
        leftPlayerNickname: result.leftPlayer.nickname,
        message: `${result.leftPlayer.nickname} has left the room. Waiting for an opponent...`
      });
    }

    if (currentRoomCode === code) {
      currentRoomCode = null;
    }
  }
}
