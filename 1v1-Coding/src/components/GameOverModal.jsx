import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Skull, Clock, RefreshCw, Home, ShieldAlert, Award } from 'lucide-react';
import { playVictorySound, playFailureSound } from '../utils/audio';

export default function GameOverModal({
  gameOverData,
  myId,
  onPlayAgain,
  onLeaveRoom,
  rematchPlayers = []
}) {
  const { result, winnerId, winnerNickname, reason, elapsedSeconds } = gameOverData;

  const isWinner = result === 'win' && winnerId === myId;
  const isForfeitWin = result === 'forfeit' && winnerId === myId;
  const isLoss = result === 'win' && winnerId !== myId;
  const isDraw = result === 'draw';

  useEffect(() => {
    if (isWinner || isForfeitWin) {
      playVictorySound();
      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (isLoss) {
      playFailureSound();
    }
  }, [isWinner, isForfeitWin, isLoss]);

  const hasRequestedRematch = rematchPlayers.includes(myId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl text-center animate-countdown">
        {/* Outcome Icon */}
        <div className="mb-4 flex justify-center">
          {isWinner || isForfeitWin ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-xl shadow-amber-500/20">
              <Trophy className="h-10 w-10 animate-bounce" />
            </div>
          ) : isLoss ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-xl shadow-rose-500/20">
              <Skull className="h-10 w-10" />
            </div>
          ) : isDraw ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-xl shadow-blue-500/20">
              <Clock className="h-10 w-10" />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-xl shadow-purple-500/20">
              <ShieldAlert className="h-10 w-10" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black tracking-tight text-white mb-2">
          {isWinner
            ? 'VICTORY!'
            : isForfeitWin
            ? 'VICTORY BY FORFEIT!'
            : isLoss
            ? 'DEFEAT'
            : isDraw
            ? "IT'S A DRAW!"
            : 'MATCH OVER'}
        </h2>

        {/* Subtitle / Reason */}
        <p className="text-sm text-slate-300 mb-6 px-4">
          {reason || (isWinner ? 'You outcoded your opponent!' : 'Your opponent solved all tests first.')}
        </p>

        {/* Match Statistics Card */}
        <div className="mb-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 text-xs space-y-2">
          {winnerNickname && (
            <div className="flex justify-between items-center text-slate-400">
              <span>Winner:</span>
              <span className="font-bold text-white text-sm">{winnerNickname}</span>
            </div>
          )}
          {elapsedSeconds !== undefined && elapsedSeconds > 0 && (
            <div className="flex justify-between items-center text-slate-400">
              <span>Time Taken:</span>
              <span className="font-mono font-bold text-cyan-400">{elapsedSeconds}s</span>
            </div>
          )}
          <div className="flex justify-between items-center text-slate-400">
            <span>Result:</span>
            <span className={`font-semibold capitalize ${
              isWinner || isForfeitWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-blue-400'
            }`}>
              {result}
            </span>
          </div>
        </div>

        {/* Rematch Status indicator */}
        {rematchPlayers.length > 0 && (
          <div className="mb-4 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 py-2 px-3 rounded-xl">
            {rematchPlayers.length === 1 && !hasRequestedRematch
              ? 'Opponent requested a rematch! Click Rematch to accept.'
              : 'Waiting for opponent to accept rematch...'}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            disabled={hasRequestedRematch}
            className={`flex w-full items-center justify-center space-x-2 rounded-xl px-4 py-3 text-sm font-bold shadow-lg transition-all active:scale-[0.99] ${
              hasRequestedRematch
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${hasRequestedRematch ? 'animate-spin' : ''}`} />
            <span>{hasRequestedRematch ? 'Waiting for Opponent...' : 'Request Rematch'}</span>
          </button>

          <button
            onClick={onLeaveRoom}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Back to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
