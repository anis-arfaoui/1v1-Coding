/**
 * Main Application Component (React State Machine & Socket Binding)
 * Responsible Member: Djerbouaa Zakaria (Frontend Developer)
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import { socket } from './utils/socket';

export default function App() {
  const [gameState, setGameState] = useState('home'); // 'home' | 'lobby'
  const [roomCode, setRoomCode] = useState(null);
  const [nickname, setNickname] = useState(() => localStorage.getItem('duel_nickname') || '');
  const [difficulty, setDifficulty] = useState('any');
  const [players, setPlayers] = useState([]);
  const [myId, setMyId] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Setup real-time Socket.IO listeners on component mount
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setMyId(socket.id);
      console.log('[Socket] Connected to server with id:', socket.id);
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('[Socket] Disconnected from server');
    }

    function onRoomCreated({ roomCode: code, difficulty: diff, players: initialPlayers }) {
      setIsCreating(false);
      setRoomCode(code);
      setDifficulty(diff || 'any');
      setPlayers(initialPlayers || []);
      setGameState('lobby');
      setErrorMessage(null);
    }

    function onRoomJoined({ roomCode: code, difficulty: diff, players: initialPlayers }) {
      setIsJoining(false);
      setRoomCode(code);
      setDifficulty(diff || 'any');
      setPlayers(initialPlayers || []);
      setGameState('lobby');
      setErrorMessage(null);
    }

    function onPlayerJoined({ players: updatedPlayers }) {
      console.log('[Socket] Player joined event received:', updatedPlayers);
      setPlayers(updatedPlayers);
    }

    function onPlayerLeft({ players: updatedPlayers, message }) {
      console.log('[Socket] Player left:', message);
      setPlayers(updatedPlayers);
      if (message) {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }

    function onErrorMessage({ message }) {
      console.warn('[Socket Error]:', message);
      setErrorMessage(message);
      setIsCreating(false);
      setIsJoining(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room_created', onRoomCreated);
    socket.on('room_joined', onRoomJoined);
    socket.on('player_joined', onPlayerJoined);
    socket.on('player_left', onPlayerLeft);
    socket.on('error_message', onErrorMessage);

    // In case socket is already connected
    if (socket.connected) {
      setIsConnected(true);
      setMyId(socket.id);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room_created', onRoomCreated);
      socket.off('room_joined', onRoomJoined);
      socket.off('player_joined', onPlayerJoined);
      socket.off('player_left', onPlayerLeft);
      socket.off('error_message', onErrorMessage);
    };
  }, []);

  // Action: Create Room
  const handleCreateRoom = (nick, selectedDifficulty) => {
    setNickname(nick);
    setDifficulty(selectedDifficulty);
    setIsCreating(true);
    setErrorMessage(null);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('create_room', {
      nickname: nick,
      difficulty: selectedDifficulty
    });
  };

  // Action: Join Room
  const handleJoinRoom = (code, nick) => {
    setNickname(nick);
    setIsJoining(true);
    setErrorMessage(null);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join_room', {
      roomCode: code,
      nickname: nick
    });
  };

  // Action: Leave Room
  const handleLeaveRoom = () => {
    if (roomCode) {
      socket.emit('leave_room', { roomCode });
    }
    setGameState('home');
    setRoomCode(null);
    setPlayers([]);
    setErrorMessage(null);

    // Clean URL parameter ?join=CODE
    if (window.location.search) {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Header
        roomCode={roomCode}
        nickname={nickname}
        isConnected={isConnected}
        onLeaveRoom={roomCode ? handleLeaveRoom : null}
      />

      <main className="flex-1 flex flex-col justify-center">
        {gameState === 'home' && (
          <HomeScreen
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            errorMessage={errorMessage}
            isCreating={isCreating}
            isJoining={isJoining}
          />
        )}

        {gameState === 'lobby' && (
          <LobbyScreen
            roomCode={roomCode}
            difficulty={difficulty}
            players={players}
            myId={myId}
            onLeaveRoom={handleLeaveRoom}
          />
        )}
      </main>

      <footer className="border-t border-slate-900 py-3 text-center text-xs text-slate-500">
        1v1 Coding Duel &bull; Sprint 1: Foundation & Multiplayer Rooms
      </footer>
    </div>
  );
}
