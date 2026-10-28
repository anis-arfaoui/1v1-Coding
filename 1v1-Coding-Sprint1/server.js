/**
 * Main Application Server (Express + Socket.IO)
 * Responsible Member: Brik Djalel (Backend Developer)
 */

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { rooms, getRoom } from './server/rooms.js';
import { registerSocketHandlers } from './server/socketHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend build from dist
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// REST Health Check & Inspection Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    sprint: 'Sprint 1 — Foundation & Multiplayer Rooms',
    activeRooms: rooms.size
  });
});

app.get('/api/rooms/:code', (req, res) => {
  const code = (req.params.code || '').trim().toUpperCase();
  const room = getRoom(code);

  if (!room) {
    return res.status(404).json({ error: `Room "${code}" not found.` });
  }

  res.json({
    code: room.code,
    difficulty: room.difficulty,
    status: room.status,
    createdAt: room.createdAt,
    playerCount: room.players.length,
    players: room.players.map((p) => ({
      nickname: p.nickname,
      isHost: p.isHost
    }))
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>1v1 Coding Duel — Sprint 1</title></head>
        <body style="font-family: sans-serif; background: #080c14; color: #f8fafc; padding: 40px; text-align: center;">
          <h1 style="color: #38bdf8;">1v1 Coding Duel — Sprint 1 Server Running</h1>
          <p>The backend Socket.IO & Express server is active on port ${process.env.PORT || 3000}.</p>
          <p>Run <code>npm run build</code> to compile the frontend, or <code>npm run dev</code> for Vite dev server.</p>
        </body>
      </html>
    `);
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.IO Connection Entrypoint
io.on('connection', (socket) => {
  registerSocketHandlers(io, socket);
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  ⚔️ 1v1 Coding Duel — Sprint 1 Server Running!`);
    console.log(`  Port: http://localhost:${PORT}`);
    console.log(`  Sprint Goal: Foundation & Multiplayer Rooms`);
    console.log(`  Backend Owner: Brik Djalel`);
    console.log(`=======================================================`);
  });
}

export { app, server, io };
