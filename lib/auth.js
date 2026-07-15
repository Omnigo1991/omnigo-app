import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'omnigo_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      'SESSION_SECRET fehlt. Lege in Vercel unter Settings -> Environment Variables eine Variable ' +
        'SESSION_SECRET mit einem langen, zufälligen Text an.'
    );
  }
  return secret;
}

function sign(value) {
  const hmac = crypto.createHmac('sha256', getSecret());
  hmac.update(value);
  return hmac.digest('hex');
}

export function createSessionToken(userId) {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = `${userId}.${expires}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, expires, signature] = parts;
  const payload = `${userId}.${expires}`;
  if (sign(payload) !== signature) return null;
  if (Date.now() > Number(expires)) return null;
  return Number(userId);
}

export function setSessionCookie(userId) {
  cookies().set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
}

export function getSessionUserId() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
