// Web Audio API synthesized sound effects (no external audio files required)

let audioCtx = null;
let isMuted = localStorage.getItem('duel_muted') === 'true';

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem('duel_muted', isMuted);
  return isMuted;
}

export function getMuteState() {
  return isMuted;
}

// Countdown beep
export function playCountdownSound(seconds) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const freq = seconds === 0 ? 880 : 440; // High pitch on GO!
  const duration = seconds === 0 ? 0.35 : 0.15;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

// Hint unlocked sound
export function playHintSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + i * 0.08;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.25);
  });
}

// All tests passed chime
export function playSuccessSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const chords = [587.33, 880, 1174.66]; // D5, A5, D6
  chords.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  });
}

// Test failed buzz
export function playFailureSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

// Victory Fanfare
export function playVictorySound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const melody = [
    { freq: 523.25, time: 0.0, dur: 0.15 }, // C5
    { freq: 659.25, time: 0.15, dur: 0.15 }, // E5
    { freq: 783.99, time: 0.3, dur: 0.15 }, // G5
    { freq: 1046.5, time: 0.45, dur: 0.45 } // C6
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + note.time;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, startTime);

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + note.dur);
  });
}
