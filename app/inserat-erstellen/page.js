import Link from 'next/link';
import { createListing } from '../actions/listings';
import { getCurrentUser } from '../../lib/users';

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const inputStyle = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '10px 12px',
  border: '1.5px solid #D2D2D7',
  borderRadius: 10,
  fontFamily: 'inherit',
  fontSize: 14,
  boxSizing: 'border-box',
};

export default async function CreateListingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main
        style={{
          fontFamily: FONT,
          maxWidth: 480,
          margin: '0 auto',
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1D1D1F', margin: 0 }}>
          Bitte zuerst anmelden
        </h1>
        <p style={{ color: '#6E6E73', marginTop: 10 }}>
          Um ein Inserat zu erstellen, brauchst du ein Konto.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <Link
            href="/anmelden"
            style={{
              background: '#1FD8A4',
              color: '#1D1D1F',
              padding: '10px 20px',
              borderRadius: 999,
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            Anmelden
          </Link>
          <Link
            href="/registrieren"
            style={{
              border: '1.5px solid #1D1D1F',
              color: '#1D1D1F',
              padding: '10px 20px',
              borderRadius: 999,
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            Registrieren
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ fontFamily: FONT, maxWidth: 520, margin: '0 auto', padding: '60px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#1D1D1F' }}>
        Inserat erstellen
      </h1>
      <p style={{ color: '#6E6E73', marginTop: 8, marginBottom: 30 }}>
        Fotos und KI-Vorschläge folgen in einem späteren Schritt – für jetzt reicht der Text.
      </p>

      <form action={createListing} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Titel
          <input name="title" required style={inputStyle} />
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Beschreibung
          <textarea name="description" rows={4} style={inputStyle} />
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Preis (CHF)
          <input name="price" type="number" step="0.01" min="0" style={inputStyle} />
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Kategorie
          <select name="category" defaultValue="" style={inputStyle}>
            <option value="" disabled>
              Bitte wählen
            </option>
            <option value="Fahrzeuge">Fahrzeuge</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Mode & Accessoires">Mode &amp; Accessoires</option>
            <option value="Haushalt & Wohnen">Haushalt &amp; Wohnen</option>
            <option value="Sport & Freizeit">Sport &amp; Freizeit</option>
            <option value="Immobilien">Immobilien</option>
            <option value="Sammeln & Kunst">Sammeln &amp; Kunst</option>
          </select>
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Zustand
          <select name="condition" defaultValue="" style={inputStyle}>
            <option value="" disabled>
              Bitte wählen
            </option>
            <option value="Neu">Neu</option>
            <option value="Wie neu">Wie neu</option>
            <option value="Gebraucht – sehr guter Zustand">Gebraucht – sehr guter Zustand</option>
            <option value="Gebraucht – guter Zustand">Gebraucht – guter Zustand</option>
          </select>
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Standort
          <input name="location" placeholder="z. B. 8001 Zürich" style={inputStyle} />
        </label>

        <button
          type="submit"
          style={{
            marginTop: 10,
            background: '#1FD8A4',
            color: '#1D1D1F',
            border: 'none',
            borderRadius: 999,
            padding: '12px 20px',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Veröffentlichen
        </button>
      </form>
    </main>
  );
}
