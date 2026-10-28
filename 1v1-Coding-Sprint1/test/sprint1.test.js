/**
 * Automated End-to-End Integration Test Suite
 * Responsible Member: Arfaoui Mohamed Anis (Integration, Data, and Testing Developer)
 */

import http from 'http';
import { io as Client } from 'socket.io-client';

process.env.NODE_ENV = 'test';
const { server } = await import('../server.js');
const { rooms } = await import('../server/rooms.js');

const TEST_PORT = 3102;
let serverInstance;
let serverUrl;

function createClient() {
  return Client(serverUrl, {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTestSuite() {
  console.log('========================================================');
  console.log('🧪 Sprint 1 Automated Multi-Client Integration Tests');
  console.log('   QA Lead: Arfaoui Mohamed Anis');
  console.log('========================================================\n');

  serverInstance = server.listen(TEST_PORT);
  serverUrl = `http://localhost:${TEST_PORT}`;
  await wait(100);

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (!condition) {
      console.error(`❌ FAILED [${total}]: ${message}`);
      process.exit(1);
    } else {
      passed++;
      console.log(`✅ PASSED [${total}]: ${message}`);
    }
  }

  try {
    // 1. Health Endpoint Test
    const health = await fetch(`${serverUrl}/api/health`).then((r) => r.json());
    assert(health.status === 'ok', 'GET /api/health responds with ok status');

    // 2. Client 1 (Host) Creates Room
    const client1 = createClient();
    await new Promise((resolve) => client1.on('connect', resolve));
    assert(client1.connected, 'Client 1 (Alice) connected via WebSocket');

    let roomCode = null;
    let roomCreatedPayload = null;

    client1.emit('create_room', { nickname: 'Alice', difficulty: 'easy' });
    await new Promise((resolve) => {
      client1.on('room_created', (data) => {
        roomCreatedPayload = data;
        roomCode = data.roomCode;
        resolve();
      });
    });

    assert(Boolean(roomCode), `Host created room with code: ${roomCode}`);
    assert(roomCode.length === 6, 'Generated room code is exactly 6 characters');
    assert(roomCreatedPayload.players.length === 1, 'Room initially contains 1 player (Host)');
    assert(roomCreatedPayload.players[0].nickname === 'Alice', 'Host player nickname is Alice');
    assert(roomCreatedPayload.players[0].isHost === true, 'Host player flag isHost is true');
    assert(rooms.has(roomCode), 'Room is registered in server in-memory store');

    // 3. Client 2 (Guest) Joins Room
    const client2 = createClient();
    await new Promise((resolve) => client2.on('connect', resolve));
    assert(client2.connected, 'Client 2 (Bob) connected via WebSocket');

    let client2JoinedPayload = null;
    let client1PlayerJoinedPayload = null;

    const p1Promise = new Promise((resolve) => {
      client1.on('player_joined', (data) => {
        client1PlayerJoinedPayload = data;
        resolve();
      });
    });

    const p2Promise = new Promise((resolve) => {
      client2.on('room_joined', (data) => {
        client2JoinedPayload = data;
        resolve();
      });
    });

    client2.emit('join_room', { roomCode, nickname: 'Bob' });
    await Promise.all([p1Promise, p2Promise]);

    assert(client2JoinedPayload !== null, 'Client 2 received room_joined event');
    assert(client2JoinedPayload.players.length === 2, 'Client 2 room state contains 2 players');
    assert(client1PlayerJoinedPayload !== null, 'Client 1 received real-time player_joined event');
    assert(client1PlayerJoinedPayload.players.length === 2, 'Client 1 updated to 2 players');
    assert(client1PlayerJoinedPayload.status === 'ready', 'Room status updated to "ready"');

    // 4. REST Inspection Endpoint
    const roomInfo = await fetch(`${serverUrl}/api/rooms/${roomCode}`).then((r) => r.json());
    assert(roomInfo.playerCount === 2, 'REST /api/rooms/:code reports 2 connected players');

    // 5. Client 3 Rejection (Full Room)
    const client3 = createClient();
    await new Promise((resolve) => client3.on('connect', resolve));

    let client3Error = null;
    client3.emit('join_room', { roomCode, nickname: 'Charlie' });
    await new Promise((resolve) => {
      client3.on('error_message', (err) => {
        client3Error = err;
        resolve();
      });
    });

    assert(client3Error !== null, 'Client 3 was rejected from joining full room');
    assert(client3Error.type === 'ROOM_FULL', 'Rejection error type is ROOM_FULL');
    assert(client3Error.message.includes('already full'), 'Rejection error contains clear message');
    client3.disconnect();

    // 6. Non-Existent Room Code Error
    const client4 = createClient();
    await new Promise((resolve) => client4.on('connect', resolve));

    let client4Error = null;
    client4.emit('join_room', { roomCode: 'NOPE99', nickname: 'Dave' });
    await new Promise((resolve) => {
      client4.on('error_message', (err) => {
        client4Error = err;
        resolve();
      });
    });

    assert(client4Error !== null, 'Non-existent room was rejected');
    assert(client4Error.type === 'ROOM_NOT_FOUND', 'Error type is ROOM_NOT_FOUND');
    client4.disconnect();

    // 7. Empty Nickname Error
    const client5 = createClient();
    await new Promise((resolve) => client5.on('connect', resolve));

    let client5Error = null;
    client5.emit('create_room', { nickname: '   ', difficulty: 'easy' });
    await new Promise((resolve) => {
      client5.on('error_message', (err) => {
        client5Error = err;
        resolve();
      });
    });

    assert(client5Error !== null, 'Empty nickname was rejected');
    assert(client5Error.type === 'INVALID_NICKNAME', 'Error type is INVALID_NICKNAME');
    client5.disconnect();

    // 8. Player Disconnect & Room Recovery
    let p1PlayerLeftPayload = null;
    const leavePromise = new Promise((resolve) => {
      client1.on('player_left', (data) => {
        p1PlayerLeftPayload = data;
        resolve();
      });
    });

    client2.emit('leave_room', { roomCode });
    await leavePromise;

    assert(p1PlayerLeftPayload !== null, 'Client 1 received player_left notification');
    assert(p1PlayerLeftPayload.players.length === 1, 'Client 1 state reverted to 1 player');
    assert(p1PlayerLeftPayload.status === 'waiting', 'Room status reverted to "waiting"');
    client2.disconnect();

    // Client 1 leaves: room should be deleted
    client1.emit('leave_room', { roomCode });
    client1.disconnect();
    await wait(50);
    assert(!rooms.has(roomCode), 'Room deleted from memory after all players leave');

    console.log('\n========================================================');
    console.log(`🎉 ALL ${passed}/${total} SPRINT 1 INTEGRATION TESTS PASSED!`);
    console.log('========================================================\n');
  } catch (err) {
    console.error('Integration test failed:', err);
    process.exit(1);
  } finally {
    serverInstance.close();
    process.exit(0);
  }
}

runTestSuite();
