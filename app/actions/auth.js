'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { query } from '../../lib/db';
import { setSessionCookie, clearSessionCookie } from '../../lib/auth';

export async function registerUser(prevState, formData) {
  const email = (formData.get('email') || '').toString().trim().toLowerCase();
  const password = (formData.get('password') || '').toString();

  if (!email || !password) {
    return { error: 'E-Mail und Passwort sind erforderlich.' };
  }
  if (password.length < 8) {
    return { error: 'Das Passwort muss mindestens 8 Zeichen lang sein.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let newUserId;
  try {
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, passwordHash]
    );
    newUserId = result.rows[0].id;
  } catch (err) {
    if (err.code === '23505') {
      return { error: 'Für diese E-Mail-Adresse existiert bereits ein Konto.' };
    }
    return { error: 'Registrierung fehlgeschlagen. Bitte versuch es erneut.' };
  }

  setSessionCookie(newUserId);
  redirect('/');
}

export async function loginUser(prevState, formData) {
  const email = (formData.get('email') || '').toString().trim().toLowerCase();
  const password = (formData.get('password') || '').toString();

  const result = await query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    return { error: 'E-Mail oder Passwort ist falsch.' };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return { error: 'E-Mail oder Passwort ist falsch.' };
  }

  setSessionCookie(user.id);
  redirect('/');
}

export async function logoutUser() {
  clearSessionCookie();
  redirect('/');
}
