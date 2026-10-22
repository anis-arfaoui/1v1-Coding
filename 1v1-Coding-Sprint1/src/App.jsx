import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import { generateRoomCode } from './utils/roomCode';

export default function App() {
  const [gameState, setGameState] = useState('home'); // 'home' | 'lobby'
  const [roomCode, setRoomCode] = useState(null);
  const [nickname, setNickname] = useState(() => localStorage.getItem('duel_nickname') || '');
  const [difficulty, setDifficulty] = useState('any');
  const [players, setPlayers] = useState([]);
  const [myId, setMyId] = useState('p1');
  const [errorMessage, setErrorMessage] = useState(null);

  // Parse URL query parameter ?join=CODE on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const joinCodeParam = urlParams.get('join');
    if (joinCodeParam && joinCodeParam.length === 6) {
      // Code is ready for join on HomeScreen
    }
  }, []);

  // Handle Create Room (Host)
  const handleCreateRoom = (nick, selectedDifficulty) => {
    const newCode = generateRoomCode();
    const hostPlayer = {
      id: 'p1',
      nickname: nick,
      isHost: true
    };

    setNickname(nick);
    setDifficulty(selectedDifficulty);
    setRoomCode(newCode);
    setMyId('p1');
    setPlayers([hostPlayer]);
    setGameState('lobby');
    setErrorMessage(null);
  };

  // Handle Join Room (Guest)
  const handleJoinRoom = (code, nick) => {
    const cleanCode = code.trim().toUpperCase();
    const guestPlayer = {
      id: 'p2',
      nickname: nick,
      isHost: false
    };

    const hostPlayer = {
      id: 'p1',
      nickname: 'CodeRival (Host)',
      isHost: true
    };

    setNickname(nick);
    setRoomCode(cleanCode);
    setMyId('p2');
    setPlayers([hostPlayer, guestPlayer]);
    setGameState('lobby');
    setErrorMessage(null);
  };

  // Prototype Feature: Toggle simulated opponent join in the Lobby
  const handleSimulateOpponentToggle = () => {
    if (players.length >= 2) {
      // Disconnect opponent
      setPlayers((prev) => [prev[0]]);
    } else {
      // Connect opponent
      const opponent = {
        id: 'p2',
        nickname: 'ByteWarrior',
        isHost: false
      };
      setPlayers((prev) => [...prev, opponent]);
    }
  };

  // Handle Leave Room / Reset to Home
  const handleLeaveRoom = () => {
    setGameState('home');
    setRoomCode(null);
    setPlayers([]);
    setErrorMessage(null);

    // Clean URL without page reload
    if (window.location.search) {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Header
        roomCode={roomCode}
        nickname={nickname}
        onLeaveRoom={roomCode ? handleLeaveRoom : null}
      />

      <main className="flex-1 flex flex-col">
        {gameState === 'home' && (
          <HomeScreen
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            errorMessage={errorMessage}
          />
        )}

        {gameState === 'lobby' && (
          <LobbyScreen
            roomCode={roomCode}
            difficulty={difficulty}
            players={players}
            myId={myId}
            onLeaveRoom={handleLeaveRoom}
            onSimulateOpponentToggle={handleSimulateOpponentToggle}
          />
        )}
      </main>
    </div>
  );
}
