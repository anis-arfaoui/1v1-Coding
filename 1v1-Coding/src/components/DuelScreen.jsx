import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Lightbulb,
  Lock,
  Terminal,
  AlertTriangle,
  Flame,
  Swords,
  ChevronRight
} from 'lucide-react';
import { executeCode } from '../utils/codeRunner';
import { playSuccessSound, playFailureSound, playHintSound } from '../utils/audio';

export default function DuelScreen({
  problem,
  timeRemaining,
  totalTime,
  unlockedHints,
  players,
  myId,
  onSolved,
  onProgressUpdate
}) {
  const [code, setCode] = useState(problem.starterCode || '');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [selectedTestTab, setSelectedTestTab] = useState(0);
  const [executionError, setExecutionError] = useState(null);

  // Play audio when a new hint unlocks
  useEffect(() => {
    if (unlockedHints && unlockedHints.length > 0) {
      playHintSound();
    }
  }, [unlockedHints ? unlockedHints.length : 0]);

  // Identify players
  const myPlayer = useMemo(() => players.find((p) => p.id === myId) || players[0], [players, myId]);
  const opponentPlayer = useMemo(() => players.find((p) => p.id !== myId) || { nickname: 'Opponent', testsPassed: 0, totalTests: problem.tests.length }, [players, myId]);

  // Handle Running user code
  const handleRunTests = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setExecutionError(null);

    try {
      const response = await executeCode(code, problem.tests, 2000);

      if (!response.success && response.error && (!response.results || response.results.length === 0)) {
        setExecutionError(response.error);
        setTestResults(null);
        playFailureSound();
      } else {
        setTestResults(response.results);
        const passedCount = response.results.filter((r) => r.passed).length;

        // Broadcast progress to server and opponent
        onProgressUpdate(passedCount, problem.tests.length);

        if (response.allPassed) {
          playSuccessSound();
          // Notify server of solve!
          onSolved();
        } else {
          playFailureSound();
        }
      }
    } catch (err) {
      setExecutionError(err.message || 'Unknown execution error');
      playFailureSound();
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning, problem, onProgressUpdate, onSolved]);

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to Run
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunTests();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRunTests]);

  // Format Timer mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(Math.max(0, secs) / 60);
    const s = Math.max(0, secs) % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = timeRemaining <= 60;

  // Calculate hint thresholds
  const hint1Threshold = Math.floor((totalTime * 2) / 3);
  const hint2Threshold = Math.floor((totalTime * 1) / 3);

  const passedTestsCount = testResults ? testResults.filter((r) => r.passed).length : 0;
  const totalTestsCount = problem.tests.length;

  return (
    <div className="flex flex-col min-h-[calc(100vh-65px)] bg-slate-950">
      {/* TOP HUD BAR */}
      <div className="glass-panel border-b border-slate-800 bg-slate-950/90 px-4 py-2.5 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          {/* Left: Problem Badge & Title */}
          <div className="flex items-center space-x-3">
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                problem.difficulty === 'easy'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : problem.difficulty === 'medium'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="font-bold text-white text-sm sm:text-base truncate max-w-[200px] sm:max-w-xs">
              {problem.title}
            </span>
          </div>

          {/* Center: Server Match Timer */}
          <div
            className={`flex items-center space-x-2 rounded-xl px-4 py-1.5 font-mono text-lg font-black transition-all ${
              isTimeCritical
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse'
                : 'bg-slate-900 border border-slate-800 text-cyan-400'
            }`}
          >
            <Clock className={`h-4 w-4 ${isTimeCritical ? 'text-rose-400' : 'text-cyan-400'}`} />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          {/* Right: Duelists Scoreboard */}
          <div className="flex items-center space-x-4 text-xs">
            {/* You */}
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="font-bold text-white">{myPlayer ? myPlayer.nickname : 'You'} (You)</div>
                <div className="text-[11px] text-cyan-400 font-mono">
                  {passedTestsCount} / {totalTestsCount} Tests
                </div>
              </div>
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${(passedTestsCount / totalTestsCount) * 100}%` }}
                />
              </div>
            </div>

            <Swords className="h-4 w-4 text-slate-500 shrink-0" />

            {/* Opponent */}
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{
                    width: `${((opponentPlayer.testsPassed || 0) / (opponentPlayer.totalTests || totalTestsCount)) * 100}%`
                  }}
                />
              </div>
              <div>
                <div className="font-bold text-slate-300">{opponentPlayer.nickname}</div>
                <div className="text-[11px] text-purple-400 font-mono">
                  {opponentPlayer.testsPassed || 0} / {opponentPlayer.totalTests || totalTestsCount} Tests
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* LEFT COLUMN: Problem Description & Hints (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800/80 bg-slate-900/50 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-125px)]">
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
              <span>Problem Statement</span>
            </h2>
            <div className="prose prose-invert prose-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {problem.description}
            </div>
          </div>

          {/* Example Input / Output */}
          {problem.example && (
            <div className="mb-6 rounded-xl bg-slate-900 border border-slate-800 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Example
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-start">
                  <span className="text-slate-500 w-16 shrink-0">Input:</span>
                  <span className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {problem.example.input}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-500 w-16 shrink-0">Output:</span>
                  <span className="text-emerald-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {problem.example.output}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hints Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span>Hints ({unlockedHints.length} / {problem.hintsCount || 2} Unlocked)</span>
              </h3>
            </div>

            {/* Hint 1 */}
            <div className="rounded-xl border transition-all p-3.5 text-xs">
              {unlockedHints.length >= 1 ? (
                <div className="border-amber-500/30 bg-amber-500/10 text-amber-200">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-400 mb-1">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Hint #1</span>
                  </div>
                  <p className="text-slate-300">{unlockedHints[0].text}</p>
                </div>
              ) : (
                <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-3.5 w-3.5 text-slate-600" />
                    <span>Hint #1 (Locked)</span>
                  </div>
                  <span className="text-[11px] font-mono">
                    Unlocks at {formatTime(hint1Threshold)}
                  </span>
                </div>
              )}
            </div>

            {/* Hint 2 */}
            <div className="rounded-xl border transition-all p-3.5 text-xs">
              {unlockedHints.length >= 2 ? (
                <div className="border-amber-500/30 bg-amber-500/10 text-amber-200">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-400 mb-1">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Hint #2</span>
                  </div>
                  <p className="text-slate-300">{unlockedHints[1].text}</p>
                </div>
              ) : (
                <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-3.5 w-3.5 text-slate-600" />
                    <span>Hint #2 (Locked)</span>
                  </div>
                  <span className="text-[11px] font-mono">
                    Unlocks at {formatTime(hint2Threshold)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Code Editor & Execution Results (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 overflow-hidden">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-300">Solution (JavaScript ES6)</span>
            </div>
            <button
              onClick={() => setCode(problem.starterCode || '')}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              title="Reset code to starter template"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* CodeMirror Editor */}
          <div className="flex-1 min-h-[300px] overflow-auto">
            <CodeMirror
              value={code}
              height="100%"
              extensions={[javascript({ jsx: false })]}
              theme={oneDark}
              onChange={(value) => setCode(value)}
              className="text-sm font-mono h-full"
            />
          </div>

          {/* Execution Controls & Test Results Section */}
          <div className="border-t border-slate-800 bg-slate-900/90 p-4">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRunTests}
                  disabled={isRunning}
                  className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                    isRunning
                      ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 shadow-emerald-500/20'
                  }`}
                >
                  <Play className={`h-4 w-4 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
                  <span>{isRunning ? 'Running Code...' : 'Run & Test'}</span>
                </button>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  (or press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">Ctrl</kbd> + <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">Enter</kbd>)
                </span>
              </div>

              {/* Status Pill */}
              {testResults && (
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center space-x-1.5 rounded-lg px-3 py-1 text-xs font-bold ${
                      testResults.every((r) => r.passed)
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {testResults.every((r) => r.passed) ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>All Tests Passed! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" />
                        <span>{passedTestsCount} / {totalTestsCount} Tests Passed</span>
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Error Message if compilation / syntax failed */}
            {executionError && (
              <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs text-rose-300 flex items-start space-x-2.5">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="font-mono whitespace-pre-wrap">{executionError}</div>
              </div>
            )}

            {/* Test Case Result Tabs */}
            {testResults && testResults.length > 0 && (
              <div>
                {/* Tabs */}
                <div className="flex space-x-1.5 overflow-x-auto pb-2 border-b border-slate-800">
                  {testResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTestTab(idx)}
                      className={`flex items-center space-x-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all shrink-0 ${
                        selectedTestTab === idx
                          ? 'bg-slate-800 text-white border border-slate-700'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {result.passed ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3 w-3 text-rose-400" />
                      )}
                      <span>Test {result.testIndex}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {result.executionTimeMs}ms
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected Test Detail */}
                {testResults[selectedTestTab] && (
                  <div className="mt-3 rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono space-y-2">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Input:</span>
                      <pre className="bg-slate-900 p-2 rounded text-cyan-300 overflow-x-auto">
                        {JSON.stringify(testResults[selectedTestTab].input, null, 2)}
                      </pre>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Expected Output:</span>
                        <pre className="bg-slate-900 p-2 rounded text-emerald-400 overflow-x-auto">
                          {JSON.stringify(testResults[selectedTestTab].expected, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Actual Output:</span>
                        <pre className={`bg-slate-900 p-2 rounded overflow-x-auto ${
                          testResults[selectedTestTab].passed ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {testResults[selectedTestTab].error
                            ? `Error: ${testResults[selectedTestTab].error}`
                            : JSON.stringify(testResults[selectedTestTab].actual, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Console Logs */}
                    {testResults[selectedTestTab].logs && testResults[selectedTestTab].logs.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Console Output:</span>
                        <pre className="bg-slate-900/60 p-2 rounded text-slate-300 overflow-x-auto text-[11px]">
                          {testResults[selectedTestTab].logs.join('\n')}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
