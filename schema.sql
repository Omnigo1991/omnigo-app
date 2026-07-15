-- Omnigo – Grundtabelle für Inserate.
-- Einmal im Neon SQL-Editor ausführen, bevor Inserate erstellt werden können.

CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  category TEXT,
  condition TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
