import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import LobbyScreen from './components/LobbyScreen';
import CountdownOverlay from './components/CountdownOverlay';
import DuelScreen from './components/DuelScreen';
import GameOverModal from './components/GameOverModal';
import { socket } from './utils/socket';

export default function App() {
  const [gameState, setGameState] = useState('home'); // 'home' | 'lobby' | 'countdown' | 'duel'
  const [roomCode, setRoomCode] = useState(null);
  const [nickname, setNickname] = useState(() => localStorage.getItem('duel_nickname') || '');
  const [difficulty, setDifficulty] = useState('any');
  const [players, setPlayers] = useState([]);
  const [myId, setMyId] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [problem, setProblem] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [unlockedHints, setUnlockedHints] = useState([]);
  const [gameOverData, setGameOverData] = useState(null);
  const [rematchPlayers, setRematchPlayers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const gameStateRef = React.useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Initialize socket connection once on mount
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      setMyId(socket.id);
    };

    const handleRoomCreated = ({ roomCode: code, player, difficulty: diff }) => {
      setRoomCode(code);
      setDifficulty(diff);
      setPlayers([player]);
      setGameState('lobby');
      setErrorMessage(null);
    };

    const handleRoomJoined = ({ roomCode: code, difficulty: diff, players: roomPlayers }) => {
      setRoomCode(code);
      setDifficulty(diff);
      setPlayers(roomPlayers);
      setGameState('lobby');
      setErrorMessage(null);
    };

    const handlePlayerJoined = ({ players: updatedPlayers }) => {
      setPlayers(updatedPlayers);
    };

    const handleCountdownTick = ({ seconds }) => {
      setCountdownSeconds(seconds);
      setGameState('countdown');
    };

    const handleGameStart = ({ problem: gameProblem, totalTime: tTime, timeRemaining: remTime, players: pList }) => {
      setProblem(gameProblem);
      setTotalTime(tTime);
      setTimeRemaining(remTime);
      setPlayers(pList);
      setUnlockedHints([]);
      setGameOverData(null);
      setRematchPlayers([]);
      setGameState('duel');
    };

    const handleTimerTick = ({ timeRemaining: remTime, totalTime: tTime }) => {
      setTimeRemaining(remTime);
      if (tTime) setTotalTime(tTime);
    };

    const handleHintUnlocked = (hint) => {
      setUnlockedHints((prev) => {
        if (prev.some((h) => h.hintIndex === hint.hintIndex)) return prev;
        return [...prev, hint];
      });
    };

    const handleOpponentProgress = ({ playerId, testsPassed, totalTests }) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId ? { ...p, testsPassed, totalTests } : p
        )
      );
    };

    const handleGameOver = (data) => {
      setGameOverData(data);
    };

    const handleRematchUpdate = ({ readyPlayers }) => {
      setRematchPlayers(readyPlayers);
    };

    const handleOpponentLeft = ({ message }) => {
      if (gameStateRef.current === 'lobby') {
        setPlayers((prev) => prev.filter((p) => p.id === socket.id));
      } else {
        setErrorMessage(message);
      }
    };

    const handleErrorMessage = ({ message }) => {
      setErrorMessage(message);
    };

    socket.on('connect', handleConnect);
    socket.on('room_created', handleRoomCreated);
    socket.on('room_joined', handleRoomJoined);
    socket.on('player_joined', handlePlayerJoined);
    socket.on('countdown_tick', handleCountdownTick);
    socket.on('game_start', handleGameStart);
    socket.on('timer_tick', handleTimerTick);
    socket.on('hint_unlocked', handleHintUnlocked);
    socket.on('opponent_progress', handleOpponentProgress);
    socket.on('game_over', handleGameOver);
    socket.on('rematch_update', handleRematchUpdate);
    socket.on('opponent_left', handleOpponentLeft);
    socket.on('error_message', handleErrorMessage);

    // Check URL parameters for direct join: ?join=ROOMCODE
    const urlParams = new URLSearchParams(window.location.search);
    const joinCodeParam = urlParams.get('join');
    if (joinCodeParam && joinCodeParam.length === 6) {
      const savedNick = localStorage.getItem('duel_nickname');
      if (savedNick) {
        socket.emit('join_room', { roomCode: joinCodeParam.toUpperCase(), nickname: savedNick });
      }
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('room_created', handleRoomCreated);
      socket.off('room_joined', handleRoomJoined);
      socket.off('player_joined', handlePlayerJoined);
      socket.off('countdown_tick', handleCountdownTick);
      socket.off('game_start', handleGameStart);
      socket.off('timer_tick', handleTimerTick);
      socket.off('hint_unlocked', handleHintUnlocked);
      socket.off('opponent_progress', handleOpponentProgress);
      socket.off('game_over', handleGameOver);
      socket.off('rematch_update', handleRematchUpdate);
      socket.off('opponent_left', handleOpponentLeft);
      socket.off('error_message', handleErrorMessage);
      socket.disconnect();
    };
  }, []);

  // Handle Create Room
  const handleCreateRoom = (nick, selectedDifficulty) => {
    setNickname(nick);
    setDifficulty(selectedDifficulty);
    socket.emit('create_room', { nickname: nick, difficulty: selectedDifficulty });
  };

  // Handle Join Room
  const handleJoinRoom = (code, nick) => {
    setNickname(nick);
    socket.emit('join_room', { roomCode: code, nickname: nick });
  };

  // Handle User passing all tests
  const handleSolved = () => {
    if (roomCode) {
      socket.emit('solved', { roomCode });
    }
  };

  // Handle Progress update
  const handleProgressUpdate = (testsPassed, totalTests) => {
    if (roomCode) {
      socket.emit('player_progress', { roomCode, testsPassed, totalTests });
    }
  };

  // Handle Play Again / Rematch
  const handlePlayAgain = () => {
    if (roomCode) {
      socket.emit('play_again', { roomCode });
    }
  };

  // Handle Leave Room / Reset to Home
  const handleLeaveRoom = () => {
    window.location.href = window.location.origin;
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
          />
        )}

        {gameState === 'countdown' && (
          <CountdownOverlay seconds={countdownSeconds} />
        )}

        {gameState === 'duel' && problem && (
          <DuelScreen
            problem={problem}
            timeRemaining={timeRemaining}
            totalTime={totalTime}
            unlockedHints={unlockedHints}
            players={players}
            myId={myId}
            onSolved={handleSolved}
            onProgressUpdate={handleProgressUpdate}
          />
        )}

        {gameOverData && (
          <GameOverModal
            gameOverData={gameOverData}
            myId={myId}
            onPlayAgain={handlePlayAgain}
            onLeaveRoom={handleLeaveRoom}
            rematchPlayers={rematchPlayers}
          />
        )}
      </main>
    </div>
  );
}
