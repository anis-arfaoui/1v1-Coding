/**
 * Header Navigation Component
 * Responsible Member: Djerbouaa Zakaria (Frontend Developer)
 */

import React, { useState } from 'react';
import { Swords, Copy, Check, LogOut } from 'lucide-react';

export default function Header({ roomCode, nickname, isConnected, onLeaveRoom }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="glass-panel sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 px-4 py-3 sm:px-6 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => !roomCode && window.location.reload()}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Swords className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
              CODE DUEL <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-400 border border-blue-500/30">1v1</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Sprint 1 — Foundation & Multiplayer Rooms
            </p>
          </div>
        </div>

        {/* Center: Room Code Badge if in room */}
        {roomCode && (
          <div className="flex items-center space-x-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 shadow-inner">
            <span className="text-xs font-medium text-slate-400">ROOM:</span>
            <span className="font-mono text-sm font-bold tracking-widest text-cyan-400">
              {roomCode}
            </span>
            <button
              onClick={handleCopyCode}
              title="Copy Room Code"
              className="ml-1 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* Real-time Socket Connection Status Dot */}
          <div
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full border ${
              isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            ></span>
            <span className="hidden sm:inline font-medium">
              {isConnected ? 'Server Online' : 'Connecting...'}
            </span>
          </div>

          {nickname && (
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded-md border border-slate-800">
              <span className="font-semibold">{nickname}</span>
            </div>
          )}

          {/* Leave Room Button */}
          {roomCode && onLeaveRoom && (
            <button
              onClick={onLeaveRoom}
              className="flex items-center space-x-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
