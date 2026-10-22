// Disambiguated characters (excludes easily confused letters/numbers: 0/O, 1/I/L)
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Generate a random 6-character room code.
 * @returns {string} 6-character uppercase code
 */
export function generateRoomCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}

/**
 * Validate that a room code is formatted properly (6 alphanumeric chars).
 * @param {string} code
 * @returns {boolean}
 */
export function isValidRoomCode(code) {
  if (!code || typeof code !== 'string') return false;
  return /^[A-Z0-9]{6}$/.test(code.trim().toUpperCase());
}
