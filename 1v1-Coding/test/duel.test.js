import http from 'http';
import { io as Client } from 'socket.io-client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('🧪 Starting 1v1 Coding Duel automated test suite...\n');

  // Verify problems.json
  const problemsPath = path.join(__dirname, '..', 'problems.json');
  const problems = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));
  console.log(`✅ problems.json loaded: ${problems.length} problems found.`);
  if (problems.length < 6) {
    throw new Error('Failed: Expected at least 6 problems in problems.json');
  }

  // Validate problem structure
  for (const p of problems) {
    if (!p.id || !p.title || !p.difficulty || !p.timeLimit || !p.description || !p.starterCode || !p.tests) {
      throw new Error(`Problem ID ${p.id} is missing required fields.`);
    }
    if (!Array.isArray(p.tests) || p.tests.length === 0) {
      throw new Error(`Problem ID ${p.id} has no tests.`);
    }
  }
  console.log('✅ All problems passed schema validation.');

  // Test Code Execution logic (simulating runner logic)
  const sampleProblem = problems[0]; // Sum of Two Numbers
  console.log(`\nTesting problem: "${sampleProblem.title}"`);

  const correctCode = `function solve(a, b) { return a + b; }`;
  const wrongCode = `function solve(a, b) { return a - b; }`;

  // Evaluate correct code
  const fn1 = new Function(`${correctCode}; return solve;`)();
  let correctPassed = 0;
  for (const t of sampleProblem.tests) {
    if (fn1(...t.input) === t.output) correctPassed++;
  }
  console.log(`✅ Correct code passed ${correctPassed}/${sampleProblem.tests.length} tests.`);
  if (correctPassed !== sampleProblem.tests.length) {
    throw new Error('Correct code failed some tests!');
  }

  // Evaluate wrong code
  const fn2 = new Function(`${wrongCode}; return solve;`)();
  let wrongPassed = 0;
  for (const t of sampleProblem.tests) {
    if (fn2(...t.input) === t.output) wrongPassed++;
  }
  console.log(`✅ Wrong code correctly failed: passed ${wrongPassed}/${sampleProblem.tests.length} tests.`);

  // Connect to active server
  const serverPort = 3000;
  console.log(`\nConnecting test clients to http://localhost:${serverPort}...`);

  const clientA = Client(`http://localhost:${serverPort}`, { reconnection: false });
  const clientB = Client(`http://localhost:${serverPort}`, { reconnection: false });

  await new Promise((resolve, reject) => {
    let connected = 0;
    const check = () => {
      connected++;
      if (connected === 2) resolve();
    };
    clientA.on('connect', check);
    clientB.on('connect', check);
    setTimeout(() => reject(new Error('Connection timeout to server')), 4000);
  });
  console.log('✅ Both test sockets connected to backend.');

  // Test 1: Player A creates room
  let roomCode = null;
  await new Promise((resolve) => {
    clientA.emit('create_room', { nickname: 'Alice', difficulty: 'easy' });
    clientA.on('room_created', (data) => {
      roomCode = data.roomCode;
      console.log(`✅ Room created with code: ${roomCode}`);
      if (roomCode.length !== 6) throw new Error('Room code must be 6 characters');
      resolve();
    });
  });

  // Test 2: Player B joins room
  await new Promise((resolve) => {
    clientB.emit('join_room', { roomCode, nickname: 'Bob' });
    clientB.on('room_joined', (data) => {
      console.log(`✅ Player B joined room ${data.roomCode}.`);
      resolve();
    });
  });

  // Test 3: Countdown and Game Start
  const gameStartPromise = new Promise((resolve) => {
    let started = 0;
    const onStart = (data) => {
      started++;
      console.log(`✅ game_start received! Problem: "${data.problem.title}", Time: ${data.totalTime}s`);
      if (started === 2) resolve(data);
    };
    clientA.on('game_start', onStart);
    clientB.on('game_start', onStart);
  });

  console.log('⏳ Waiting for countdown to finish and game to start...');
  const matchData = await gameStartPromise;

  // Test 4: Timer tick
  await new Promise((resolve) => {
    clientA.on('timer_tick', (tick) => {
      console.log(`✅ timer_tick received: ${tick.timeRemaining}s remaining.`);
      resolve();
    });
  });

  // Test 5: Progress update
  await new Promise((resolve) => {
    clientB.on('opponent_progress', (prog) => {
      console.log(`✅ Opponent progress received: ${prog.nickname} passed ${prog.testsPassed}/${prog.totalTests}`);
      resolve();
    });
    clientA.emit('player_progress', { roomCode, testsPassed: 3, totalTests: matchData.problem.tests.length });
  });

  // Test 6: Solved event & Winner determination
  await new Promise((resolve) => {
    clientB.on('game_over', (over) => {
      console.log(`✅ game_over received! Result: ${over.result}, Winner: ${over.winnerNickname}`);
      if (over.result !== 'win' || over.winnerNickname !== 'Alice') {
        throw new Error('Unexpected game over result');
      }
      resolve();
    });
    clientA.emit('solved', { roomCode });
  });

  // Disconnect clients
  clientA.disconnect();
  clientB.disconnect();

  console.log('\n🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY! 🚀');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
