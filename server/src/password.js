import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = await scryptAsync(password, salt, 64);
  return `${salt}:${derived.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash || !password) return false;

  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;

  const derived = await scryptAsync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');

  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}
