/**
 * Lobby Screen Component (Multiplayer Waiting Room)
 * Responsible Member: Djerbouaa Zakaria (Frontend Developer)
 */

import React, { useState } from 'react';
import { Copy, Check, Clock, Share2, Sparkles, CheckCircle2, Users, ArrowLeft } from 'lucide-react';

export default function LobbyScreen({
  roomCode,
  difficulty,
  players,
  myId,
  onLeaveRoom
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?join=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const hostPlayer = players[0];
  const guestPlayer = players[1];
  const hasBothPlayers = players.length >= 2;

  const difficultyLabels = {
    any: '🎲 Any Difficulty',
    easy: '🟢 Easy (5 min)',
    medium: '🟡 Medium (10 min)',
    hard: '🔴 Hard (15 min)'
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl text-center animate-fadeIn">
        
        {/* Header Tag */}
        <div className="inline-flex items-center space-x-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Multiplayer Match Lobby (Sprint 1)</span>
        </div>

        {/* Lobby Headline (US-03) */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {hasBothPlayers ? 'Opponent Connected!' : 'Waiting for Opponent'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          {hasBothPlayers
            ? 'Both players are synchronized via real-time Socket.IO room events!'
            : 'Share this 6-character room code with your opponent to connect.'}
        </p>

        {/* Room Code Display Box (US-01) */}
        <div className="relative mb-6 rounded-2xl bg-slate-900/90 border-2 border-dashed border-cyan-500/40 p-5 shadow-inner">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Room Code
          </div>
          <div className="font-mono text-4xl sm:text-5xl font-black tracking-[0.25em] text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text select-all">
            {roomCode}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow cursor-pointer active:scale-95"
            >
              {copiedCode ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-cyan-400" />
              )}
              <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow cursor-pointer active:scale-95"
            >
              {copiedLink ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Share2 className="h-3.5 w-3.5 text-blue-400" />
              )}
              <span>{copiedLink ? 'Copied Link!' : 'Share Direct Link'}</span>
            </button>
          </div>
        </div>

        {/* Selected Difficulty Pill */}
        <div className="mb-6 inline-flex items-center space-x-2 rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          <span>
            Match Difficulty:{' '}
            <strong className="text-white">
              {difficultyLabels[difficulty] || difficulty}
            </strong>
          </span>
        </div>

        {/* Players Card Grid (US-03) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Host Card (Player 1) */}
          <div className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-4 text-left flex items-center space-x-3 shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold text-lg">
              {hostPlayer ? hostPlayer.nickname.charAt(0).toUpperCase() : 'H'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold text-white truncate">
                  {hostPlayer ? hostPlayer.nickname : 'Host'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
                  Host
                </span>
                {hostPlayer && hostPlayer.id === myId && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                    You
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>Connected & Ready</span>
              </div>
            </div>
          </div>

          {/* Guest Card (Player 2 or Waiting Slot) */}
          <div
            className={`relative rounded-2xl border p-4 text-left flex items-center space-x-3 transition-all ${
              guestPlayer
                ? 'bg-slate-900/80 border-slate-800 shadow-md'
                : 'bg-slate-900/30 border-dashed border-slate-800'
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-lg ${
                guestPlayer
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {guestPlayer ? guestPlayer.nickname.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0">
              {guestPlayer ? (
                <>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold text-white truncate">
                      {guestPlayer.nickname}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-semibold border border-purple-500/30">
                      Guest
                    </span>
                    {guestPlayer.id === myId && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    <span>Ready to Duel!</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-semibold text-slate-400">Opponent Slot</div>
                  <div className="flex items-center space-x-1 text-xs text-amber-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    <span>Waiting for opponent...</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status notification */}
        <div className="mb-6">
          {hasBothPlayers ? (
            <div className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-medium animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Both players connected! Shared match state established.</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-300 font-medium">
              <Users className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>Open a second tab or share the direct link to test real-time room joining!</span>
            </div>
          )}
        </div>

        {/* Leave Room action */}
        <button
          onClick={onLeaveRoom}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Cancel and return to home</span>
        </button>
      </div>
    </div>
  );
}
