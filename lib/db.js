import { Pool } from 'pg';

// Vercel/Neon legt je nach gewähltem "Custom Prefix" unterschiedliche
// Variablennamen an. Wir probieren die gängigsten der Reihe nach durch,
// damit die Verbindung unabhängig vom genauen Namen funktioniert.
const connectionString =
  process.env.STORAGE_DATABASE_URL ||
  process.env.STORAGE_POSTGRES_URL ||
  process.env.STORAGE_POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

let pool;

function getPool() {
  if (!connectionString) {
    throw new Error(
      'Keine Datenbank-Verbindung gefunden. Prüfe in Vercel unter Settings -> Environment Variables, ' +
        'wie die von Neon angelegte Variable genau heisst, und ergänze sie in lib/db.js.'
    );
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}
