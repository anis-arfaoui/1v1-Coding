import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load problems dataset
const problemsPath = path.join(__dirname, 'problems.json');
let problems = [];
try {
  const problemsData = fs.readFileSync(problemsPath, 'utf8');
  problems = JSON.parse(problemsData);
  console.log(`Loaded ${problems.length} problems successfully.`);
} catch (err) {
  console.error('Failed to load problems.json:', err);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Serve static build from dist (or public as fallback)
const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}
app.use(express.static(publicPath));

// API status route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size, problemsCount: problems.length });
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  const indexPath = fs.existsSync(path.join(distPath, 'index.html'))
    ? path.join(distPath, 'index.html')
    : path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('1v1 Coding Duel server is running. Build frontend with `npm run build`.');
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Active game rooms map: roomCode => Room
const rooms = new Map();

// Helper: Generate unique 6-character room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Disambiguated characters
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (rooms.has(code));
  return code;
}

// Helper: Pick a problem matching difficulty or random
function selectProblem(difficulty, excludeId = null) {
  let pool = problems;
  if (difficulty && difficulty !== 'any') {
    const filtered = problems.filter((p) => p.difficulty === difficulty.toLowerCase());
    if (filtered.length > 0) pool = filtered;
  }
  if (excludeId && pool.length > 1) {
    pool = pool.filter((p) => p.id !== excludeId);
  }
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

// Start countdown sequence (3, 2, 1) before match starts
function startCountdown(room) {
  room.status = 'countdown';
  let countdownSec = 3;

  io.to(room.code).emit('countdown_tick', { seconds: countdownSec });

  room.countdownTimer = setInterval(() => {
    countdownSec--;
    if (countdownSec > 0) {
      io.to(room.code).emit('countdown_tick', { seconds: countdownSec });
    } else {
      clearInterval(room.countdownTimer);
      room.countdownTimer = null;
      startGame(room);
    }
  }, 1000);
}

// Start match
function startGame(room) {
  // Clear any leftover timer
  if (room.timer) clearInterval(room.timer);

  const problem = selectProblem(room.difficulty, room.problem ? room.problem.id : null);
  room.problem = problem;
  room.status = 'in_game';
  room.timeRemaining = problem.timeLimit;
  room.totalTime = problem.timeLimit;
  room.hintsSent = 0;
  room.unlockedHints = [];

  // Reset player match stats
  room.players.forEach((p) => {
    p.testsPassed = 0;
    p.totalTests = problem.tests.length;
  });

  // Broadcast game start to room
  io.to(room.code).emit('game_start', {
    problem: {
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      timeLimit: problem.timeLimit,
      description: problem.description,
      example: problem.example,
      starterCode: problem.starterCode,
      tests: problem.tests,
      hintsCount: problem.hints.length
    },
    totalTime: room.totalTime,
    timeRemaining: room.timeRemaining,
    players: room.players.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      testsPassed: 0,
      totalTests: problem.tests.length
    }))
  });

  // Start 1-second interval timer
  room.timer = setInterval(() => {
    if (room.status !== 'in_game') {
      clearInterval(room.timer);
      room.timer = null;
      return;
    }

    room.timeRemaining--;

    // Broadcast timer tick
    io.to(room.code).emit('timer_tick', {
      timeRemaining: room.timeRemaining,
      totalTime: room.totalTime
    });

    // Check Hint 1: unlocked at 1/3 of the time elapsed (2/3 time remaining)
    const hint1Threshold = Math.floor((room.totalTime * 2) / 3);
    if (room.hintsSent === 0 && room.timeRemaining <= hint1Threshold && problem.hints.length > 0) {
      room.hintsSent = 1;
      const hintData = { hintIndex: 1, text: problem.hints[0] };
      room.unlockedHints.push(hintData);
      io.to(room.code).emit('hint_unlocked', hintData);
    }

    // Check Hint 2: unlocked at 2/3 of the time elapsed (1/3 time remaining)
    const hint2Threshold = Math.floor((room.totalTime * 1) / 3);
    if (room.hintsSent === 1 && room.timeRemaining <= hint2Threshold && problem.hints.length > 1) {
      room.hintsSent = 2;
      const hintData = { hintIndex: 2, text: problem.hints[1] };
      room.unlockedHints.push(hintData);
      io.to(room.code).emit('hint_unlocked', hintData);
    }

    // Timer expires -> Draw
    if (room.timeRemaining <= 0) {
      clearInterval(room.timer);
      room.timer = null;
      room.status = 'game_over';

      io.to(room.code).emit('game_over', {
        result: 'draw',
        winnerNickname: null,
        reason: 'Time expired! No player solved all tests in time.',
        players: room.players
      });
    }
  }, 1000);
}

// Clean up room completely
function destroyRoom(code) {
  const room = rooms.get(code);
  if (!room) return;
  if (room.timer) clearInterval(room.timer);
  if (room.countdownTimer) clearInterval(room.countdownTimer);
  rooms.delete(code);
  console.log(`Room ${code} cleaned up.`);
}

io.on('connection', (socket) => {
  let currentRoomCode = null;

  // Create Room
  socket.on('create_room', ({ nickname, difficulty }) => {
    const cleanNick = (nickname || '').trim() || 'Player 1';
    const code = generateRoomCode();

    const room = {
      code,
      difficulty: difficulty || 'any',
      status: 'waiting',
      players: [
        {
          id: socket.id,
          nickname: cleanNick,
          testsPassed: 0,
          totalTests: 0,
          readyForRematch: false
        }
      ],
      problem: null,
      timer: null,
      countdownTimer: null,
      timeRemaining: 0,
      totalTime: 0,
      hintsSent: 0,
      unlockedHints: []
    };

    rooms.set(code, room);
    currentRoomCode = code;
    socket.join(code);

    socket.emit('room_created', {
      roomCode: code,
      player: room.players[0],
      difficulty: room.difficulty
    });
    console.log(`Room created: ${code} by ${cleanNick} (${socket.id})`);
  });

  // Join Room
  socket.on('join_room', ({ roomCode, nickname }) => {
    const cleanCode = (roomCode || '').trim().toUpperCase();
    const cleanNick = (nickname || '').trim() || 'Player 2';

    if (!cleanCode) {
      return socket.emit('error_message', { message: 'Room code cannot be empty.' });
    }

    const room = rooms.get(cleanCode);
    if (!room) {
      return socket.emit('error_message', { message: `Room "${cleanCode}" was not found.` });
    }

    if (room.players.length >= 2) {
      return socket.emit('error_message', { message: `Room "${cleanCode}" is already full.` });
    }

    if (room.status === 'in_game') {
      return socket.emit('error_message', { message: `Duel in "${cleanCode}" is already in progress.` });
    }

    // Add Player 2
    const player2 = {
      id: socket.id,
      nickname: cleanNick,
      testsPassed: 0,
      totalTests: 0,
      readyForRematch: false
    };

    room.players.push(player2);
    currentRoomCode = cleanCode;
    socket.join(cleanCode);

    // Notify joiner
    socket.emit('room_joined', {
      roomCode: cleanCode,
      player: player2,
      difficulty: room.difficulty,
      players: room.players
    });

    // Notify room that Player 2 joined
    io.to(cleanCode).emit('player_joined', {
      players: room.players
    });

    console.log(`Player joined room: ${cleanCode} by ${cleanNick} (${socket.id})`);

    // Auto-trigger 3-second countdown now that 2 players are present
    startCountdown(room);
  });

  // Opponent progress update (broadcast how many tests were passed on Run)
  socket.on('player_progress', ({ roomCode, testsPassed, totalTests }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'in_game') return;

    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      player.testsPassed = testsPassed;
      player.totalTests = totalTests;
    }

    socket.to(roomCode).emit('opponent_progress', {
      playerId: socket.id,
      nickname: player ? player.nickname : 'Opponent',
      testsPassed,
      totalTests
    });
  });

  // Player passed all tests -> Winner!
  socket.on('solved', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'in_game') return;

    const winner = room.players.find((p) => p.id === socket.id);
    if (!winner) return;

    // First solve event locks the win
    room.status = 'game_over';
    if (room.timer) {
      clearInterval(room.timer);
      room.timer = null;
    }

    const elapsedSeconds = room.totalTime - room.timeRemaining;

    console.log(`Duel in ${roomCode} WON by ${winner.nickname} in ${elapsedSeconds}s!`);

    io.to(roomCode).emit('game_over', {
      result: 'win',
      winnerId: winner.id,
      winnerNickname: winner.nickname,
      elapsedSeconds,
      reason: `${winner.nickname} solved all tests first in ${elapsedSeconds} seconds!`,
      players: room.players
    });
  });

  // Play Again / Rematch request
  socket.on('play_again', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      player.readyForRematch = true;
    }

    io.to(roomCode).emit('rematch_update', {
      readyPlayers: room.players.filter((p) => p.readyForRematch).map((p) => p.nickname)
    });

    // If both players want rematch (or if only 1 player remains), start countdown
    if (room.players.every((p) => p.readyForRematch) && room.players.length === 2) {
      room.players.forEach((p) => (p.readyForRematch = false));
      startCountdown(room);
    }
  });

  // Handle Disconnection
  socket.on('disconnect', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    const leavingPlayer = room.players.find((p) => p.id === socket.id);
    const remainingPlayers = room.players.filter((p) => p.id !== socket.id);

    console.log(`Player ${leavingPlayer ? leavingPlayer.nickname : socket.id} disconnected from ${currentRoomCode}`);

    if (remainingPlayers.length === 0) {
      destroyRoom(currentRoomCode);
      return;
    }

    room.players = remainingPlayers;

    if (room.status === 'in_game') {
      // Forfeit victory awarded to remaining player
      if (room.timer) clearInterval(room.timer);
      room.status = 'game_over';

      const remainingPlayer = remainingPlayers[0];
      io.to(currentRoomCode).emit('game_over', {
        result: 'forfeit',
        winnerId: remainingPlayer.id,
        winnerNickname: remainingPlayer.nickname,
        reason: `${leavingPlayer ? leavingPlayer.nickname : 'Opponent'} disconnected mid-game. ${remainingPlayer.nickname} wins by forfeit!`,
        players: room.players
      });
    } else if (room.status === 'countdown') {
      if (room.countdownTimer) clearInterval(room.countdownTimer);
      room.status = 'waiting';
      io.to(currentRoomCode).emit('opponent_left', {
        message: 'Opponent disconnected during countdown. Waiting for another player...'
      });
    } else {
      io.to(currentRoomCode).emit('opponent_left', {
        message: 'Opponent left the room.'
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`⚔️  1v1 Coding Duel server running on http://localhost:${PORT}`);
});
