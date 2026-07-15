import { notFound } from 'next/navigation';
import { query } from '../../../../lib/db';
import { updateListing, deleteListingImage } from '../../../actions/listings';
import { getCurrentUser } from '../../../../lib/users';

export const dynamic = 'force-dynamic';

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

export default async function EditListingPage({ params }) {
  const { rows } = await query('SELECT * FROM listings WHERE id = $1', [params.id]);
  const listing = rows[0];

  if (!listing) {
    notFound();
  }

  const user = await getCurrentUser();
  if (!user || listing.user_id !== user.id) {
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
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1D1D1F', margin: 0 }}>
          Kein Zugriff
        </h1>
        <p style={{ color: '#6E6E73', marginTop: 10 }}>
          Du kannst nur eigene Inserate bearbeiten.
        </p>
      </main>
    );
  }

  const updateWithId = updateListing.bind(null, listing.id);

  const { rows: images } = await query(
    'SELECT id, url FROM listing_images WHERE listing_id = $1 ORDER BY position ASC, id ASC',
    [listing.id]
  );

  return (
    <main style={{ fontFamily: FONT, maxWidth: 520, margin: '0 auto', padding: '60px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#1D1D1F' }}>
        Inserat bearbeiten
      </h1>

      {images.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', marginBottom: 8 }}>
            Vorhandene Fotos
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {images.map((img) => {
              const deleteImageWithIds = deleteListingImage.bind(null, listing.id, img.id);
              return (
                <div key={img.id} style={{ position: 'relative' }}>
                  <img
                    src={img.url}
                    alt=""
                    style={{
                      width: 90,
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: 10,
                      border: '1px solid #D2D2D7',
                      display: 'block',
                    }}
                  />
                  <form action={deleteImageWithIds} style={{ marginTop: 4 }}>
                    <button
                      type="submit"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#B3261E',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Entfernen
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <form
        action={updateWithId}
        encType="multipart/form-data"
        style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30 }}
      >
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Weitere Fotos hinzufügen
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            style={{ ...inputStyle, padding: '8px 12px' }}
          />
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Titel
          <input name="title" required defaultValue={listing.title} style={inputStyle} />
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Beschreibung
          <textarea
            name="description"
            rows={4}
            defaultValue={listing.description || ''}
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Preis (CHF)
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={listing.price ?? ''}
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F' }}>
          Kategorie
          <select name="category" defaultValue={listing.category || ''} style={inputStyle}>
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
          <select name="condition" defaultValue={listing.condition || ''} style={inputStyle}>
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
          <input name="location" defaultValue={listing.location || ''} style={inputStyle} />
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
          Änderungen speichern
        </button>
      </form>
    </main>
  );
}
