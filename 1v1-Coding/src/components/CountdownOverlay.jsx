import React, { useEffect } from 'react';
import { Swords } from 'lucide-react';
import { playCountdownSound } from '../utils/audio';

export default function CountdownOverlay({ seconds }) {
  useEffect(() => {
    playCountdownSound(seconds);
  }, [seconds]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse">
            <Swords className="h-8 w-8" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-slate-400 mb-4">
          Duel Commencing In
        </h2>

        <div key={seconds} className="animate-countdown select-none">
          {seconds > 0 ? (
            <div className="font-mono text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500 bg-clip-text drop-shadow-[0_0_35px_rgba(6,182,212,0.5)]">
              {seconds}
            </div>
          ) : (
            <div className="text-6xl sm:text-7xl font-black uppercase tracking-wider text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text drop-shadow-[0_0_40px_rgba(16,185,129,0.7)]">
              DUEL!
            </div>
          )}
        </div>

        <p className="mt-8 text-sm text-slate-400">
          First player to pass all test cases takes the victory!
        </p>
      </div>
    </div>
  );
}
