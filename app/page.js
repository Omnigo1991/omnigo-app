import Link from 'next/link';
import { query } from '../lib/db';
import { getCurrentUser } from '../lib/users';
import { logoutUser } from './actions/auth';

export const dynamic = 'force-dynamic';

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export default async function HomePage() {
  let listings = [];
  let dbError = null;

  try {
    const result = await query(
      `SELECT l.id, l.title, l.price, l.category,
        (SELECT url FROM listing_images WHERE listing_id = l.id ORDER BY position ASC, id ASC LIMIT 1) AS image_url
       FROM listings l
       ORDER BY l.created_at DESC LIMIT 24`
    );
    listings = result.rows;
  } catch (err) {
    dbError = err.message;
  }

  const user = await getCurrentUser();

  return (
    <main style={{ fontFamily: FONT, maxWidth: 1100, margin: '0 auto', padding: '60px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10, fontSize: 13 }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#6E6E73' }}>
            <span>Angemeldet als {user.email}</span>
            <form action={logoutUser}>
              <button
                type="submit"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1D1D1F',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  padding: 0,
                }}
              >
                Abmelden
              </button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 14 }}>
            <Link href="/anmelden" style={{ color: '#1D1D1F' }}>
              Anmelden
            </Link>
            <Link href="/registrieren" style={{ color: '#1D1D1F', fontWeight: 600 }}>
              Registrieren
            </Link>
          </div>
        )}
      </div>

      <h1 style={{ fontSize: 40, fontWeight: 700, margin: 0, color: '#1D1D1F' }}>
        omni<span style={{ color: '#1FD8A4' }}>go</span>
      </h1>
      <p style={{ color: '#6E6E73', marginTop: 8, marginBottom: 40 }}>Mehr als ein Marktplatz.</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h2 style={{ fontSize: 22, margin: 0, color: '#1D1D1F' }}>Aktuelle Inserate</h2>
        <Link
          href="/inserat-erstellen"
          style={{
            background: '#1FD8A4',
            color: '#1D1D1F',
            padding: '10px 20px',
            borderRadius: 999,
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          + Inserat erstellen
        </Link>
      </div>

      {dbError ? (
        <p style={{ color: '#B3261E', fontSize: 14, lineHeight: 1.6 }}>
          Datenbank noch nicht bereit ({dbError}). Prüfe, ob die Tabelle "listings" via schema.sql
          angelegt wurde und die Umgebungsvariable korrekt gesetzt ist.
        </p>
      ) : listings.length === 0 ? (
        <p style={{ color: '#6E6E73' }}>
          Noch keine Inserate vorhanden. Sei die erste Person, die eines erstellt!
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {listings.map((item) => (
            <Link
              key={item.id}
              href={`/inserat/${item.id}`}
              style={{
                display: 'block',
                border: '1px solid #D2D2D7',
                borderRadius: 12,
                overflow: 'hidden',
                textDecoration: 'none',
                color: '#1D1D1F',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  background: '#F5F5F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: 12, color: '#AEAEB2' }}>Kein Foto</span>
                )}
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#6E6E73' }}>{item.category || 'Ohne Kategorie'}</div>
                <div style={{ fontWeight: 700, marginTop: 8 }}>
                  {item.price ? `CHF ${Number(item.price).toFixed(2)}` : 'Preis auf Anfrage'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
