-- Omnigo – Benutzerkonten.
-- Einmal im Neon SQL-Editor ausführen (nach schema.sql).

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE listings ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
