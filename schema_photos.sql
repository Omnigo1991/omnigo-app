-- Omnigo – Fotos für Inserate.
-- Einmal im Neon SQL-Editor ausführen (nach schema.sql und schema_users.sql).

CREATE TABLE IF NOT EXISTS listing_images (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
