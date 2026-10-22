import React, { useState, useEffect } from 'react';
import { Swords, PlusCircle, LogIn, Sparkles, Clock, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

export default function HomeScreen({ onCreateRoom, onJoinRoom, errorMessage }) {
  const [nickname, setNickname] = useState(() => localStorage.getItem('duel_nickname') || '');
  const [joinCode, setJoinCode] = useState(() => {
    // US-1.4: Auto-populate room code if ?join=CODE is in the URL query string
    try {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('join');
      return codeParam && codeParam.length === 6 ? codeParam.toUpperCase() : '';
    } catch {
      return '';
    }
  });
  const [difficulty, setDifficulty] = useState('any');
  const [localError, setLocalError] = useState('');

  // Update joinCode if URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('join');
    if (codeParam && codeParam.length === 6) {
      setJoinCode(codeParam.toUpperCase());
    }
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    const cleanNick = nickname.trim();
    if (!cleanNick) {
      setLocalError('Please enter a nickname before creating a room.');
      return;
    }
    setLocalError('');
    localStorage.setItem('duel_nickname', cleanNick);
    onCreateRoom(cleanNick, difficulty);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const cleanNick = nickname.trim();
    const cleanCode = joinCode.trim().toUpperCase();

    if (!cleanNick) {
      setLocalError('Please enter a nickname before joining a room.');
      return;
    }
    if (!cleanCode) {
      setLocalError('Please enter the 6-character room code.');
      return;
    }
    if (cleanCode.length !== 6) {
      setLocalError('Room code must be exactly 6 characters.');
      return;
    }

    setLocalError('');
    localStorage.setItem('duel_nickname', cleanNick);
    onJoinRoom(cleanCode, cleanNick);
  };

  const displayedError = localError || errorMessage;

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-8 sm:px-6">
      {/* Hero Header */}
      <div className="mb-8 text-center max-w-2xl">
        <div className="inline-flex items-center space-x-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 text-xs font-semibold text-cyan-400 mb-4 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Sprint 1 Increment: UI & Layout Foundations</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Outcode Your Opponent in <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Real Time</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Two developers, one JavaScript challenge, zero room for mistakes. Create a room, configure your difficulty, and invite a friend with an instant join link.
        </p>
      </div>

      {/* Global Error Banner */}
      {displayedError && (
        <div className="mb-6 flex w-full max-w-md items-center space-x-2 rounded-xl bg-rose-500/15 border border-rose-500/30 p-3.5 text-xs text-rose-300 animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{displayedError}</span>
        </div>
      )}

      {/* Nickname Input Card */}
      <div className="w-full max-w-xl mb-8 glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Your Nickname
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="e.g. CodeNinja, Ada, Hacker99"
          maxLength={20}
          className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm font-medium text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
        />
      </div>

      {/* Actions Grid: Create vs Join */}
      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* CREATE ROOM CARD */}
        <div className="glass-panel flex flex-col justify-between rounded-2xl border border-slate-800/80 p-6 shadow-xl transition-all hover:border-cyan-500/40">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Create a Duel</h3>
                <p className="text-xs text-slate-400">Generate a unique 6-character room code</p>
              </div>
            </div>

            {/* Difficulty Selection (US-1.2) */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Challenge Difficulty
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'any', label: '🎲 Any', desc: 'Random difficulty' },
                  { id: 'easy', label: '🟢 Easy', desc: '5 min limit' },
                  { id: 'medium', label: '🟡 Medium', desc: '10 min limit' },
                  { id: 'hard', label: '🔴 Hard', desc: '15 min limit' }
                ].map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setDifficulty(diff.id)}
                    className={`flex flex-col rounded-xl p-2.5 text-left text-xs transition-all border ${
                      difficulty === diff.id
                        ? 'border-cyan-500 bg-cyan-500/15 text-white ring-1 ring-cyan-500/40'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-semibold text-slate-200">{diff.label}</span>
                    <span className="text-[10px] text-slate-400">{diff.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/30 transition-all active:scale-[0.99] cursor-pointer"
          >
            <Swords className="h-4 w-4" />
            <span>Create Room & Enter Lobby</span>
          </button>
        </div>

        {/* JOIN ROOM CARD */}
        <div className="glass-panel flex flex-col justify-between rounded-2xl border border-slate-800/80 p-6 shadow-xl transition-all hover:border-blue-500/40">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <LogIn className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Join a Duel</h3>
                <p className="text-xs text-slate-400">Enter your friend's 6-character room code</p>
              </div>
            </div>

            {/* Room Code Input (US-1.4) */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Room Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="e.g. 7X8K2B"
                maxLength={6}
                className="w-full text-center font-mono text-xl font-bold tracking-[0.3em] rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-cyan-400 placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all uppercase"
              />
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Ask your opponent for their code or open a direct invite link
              </p>
            </div>
          </div>

          <button
            onClick={handleJoin}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/30 transition-all active:scale-[0.99] cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Join Duel Room</span>
          </button>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="mt-12 grid w-full max-w-3xl grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 rounded-xl bg-slate-900/40 border border-slate-800 p-3.5">
          <Clock className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">Authoritative Timer</div>
            <div className="text-[11px] text-slate-400">Planned for Sprint 4 sync</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 rounded-xl bg-slate-900/40 border border-slate-800 p-3.5">
          <Zap className="h-5 w-5 text-cyan-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">Code Execution Sandbox</div>
            <div className="text-[11px] text-slate-400">Planned for Sprint 2 & 4</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 rounded-xl bg-slate-900/40 border border-slate-800 p-3.5">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-bold text-white">Pure 1v1 Race</div>
            <div className="text-[11px] text-slate-400">First to pass all test cases wins</div>
          </div>
        </div>
      </div>
    </div>
  );
}
