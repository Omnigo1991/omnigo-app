import { query } from './db';
import { getSessionUserId } from './auth';

export async function getCurrentUser() {
  const userId = getSessionUserId();
  if (!userId) return null;
  const { rows } = await query('SELECT id, email FROM users WHERE id = $1', [userId]);
  return rows[0] || null;
}
