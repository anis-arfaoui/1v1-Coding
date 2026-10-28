/**
 * Client Socket.IO Connection Singleton
 * Responsible Member: Djerbouaa Zakaria (Frontend Developer)
 */

import { io } from 'socket.io-client';

// Connects to the current web origin (proxied by Vite in dev, served by Express in prod)
const SERVER_URL = window.location.origin;

export const socket = io(SERVER_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});
