import { io } from 'socket.io-client';

// Connect to backend server. In dev, Vite proxies /socket.io, or points to window.location.origin
const SERVER_URL = window.location.origin;

export const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
});
