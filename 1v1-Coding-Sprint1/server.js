import express from 'express';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// In-memory room data model (Sprint 1 Architecture)
// Map<roomCode, { code, difficulty, status, players: Array<{ id, nickname, isHost }> }>
const rooms = new Map();

// Helper: 6-character room code generator (disambiguated characters)
function generateRoomCode() {
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

// REST API Routes (Sprint 1 Backend Foundations)

// Health and monitoring check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    sprint: 'Sprint 1 — Web Page UI & Layout Foundations',
    activeRooms: rooms.size
  });
});

// Create room
app.post('/api/rooms', (req, res) => {
  const { nickname, difficulty } = req.body;
  const cleanNick = (nickname || '').trim() || 'Player 1';
  const code = generateRoomCode();

  const room = {
    code,
    difficulty: difficulty || 'any',
    status: 'waiting',
    createdAt: new Date().toISOString(),
    players: [
      {
        id: 'host_' + Math.random().toString(36).substring(2, 9),
        nickname: cleanNick,
        isHost: true
      }
    ]
  };

  rooms.set(code, room);
  console.log(`[Sprint 1 Server] Room created: ${code} by ${cleanNick}`);

  res.status(201).json({
    roomCode: code,
    difficulty: room.difficulty,
    players: room.players
  });
});

// Get room details
app.get('/api/rooms/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase();
  const room = rooms.get(code);

  if (!room) {
    return res.status(404).json({ error: `Room ${code} not found.` });
  }

  res.json({
    roomCode: room.code,
    difficulty: room.difficulty,
    status: room.status,
    players: room.players
  });
});

// Join room
app.post('/api/rooms/:code/join', (req, res) => {
  const code = (req.params.code || '').toUpperCase();
  const { nickname } = req.body;
  const cleanNick = (nickname || '').trim() || 'Player 2';

  const room = rooms.get(code);
  if (!room) {
    return res.status(404).json({ error: `Room ${code} not found.` });
  }

  if (room.players.length >= 2) {
    return res.status(400).json({ error: `Room ${code} is already full.` });
  }

  const newPlayer = {
    id: 'guest_' + Math.random().toString(36).substring(2, 9),
    nickname: cleanNick,
    isHost: false
  };

  room.players.push(newPlayer);
  console.log(`[Sprint 1 Server] Player ${cleanNick} joined room: ${code}`);

  res.json({
    roomCode: room.code,
    difficulty: room.difficulty,
    players: room.players
  });
});

// Serve static assets from 'dist' if built
const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Fallback to index.html for SPA client-side routing
app.get('*', (req, res) => {
  const indexPath = fs.existsSync(path.join(distPath, 'index.html'))
    ? path.join(distPath, 'index.html')
    : path.join(publicPath, 'index.html');

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('1v1 Coding Duel Sprint 1 Server is running. Run `npm run build` or use `npm run dev` to access the Vite frontend.');
  }
});

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`⚔️  1v1 Coding Duel (Sprint 1) server running on http://localhost:${PORT}`);
});
