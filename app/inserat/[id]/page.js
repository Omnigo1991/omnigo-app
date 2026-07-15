import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '../../../lib/db';
import { deleteListing } from '../../actions/listings';
import { getCurrentUser } from '../../../lib/users';
import DeleteListingButton from '../../components/DeleteListingButton';

export const dynamic = 'force-dynamic';

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export default async function ListingDetailPage({ params }) {
  const { rows } = await query('SELECT * FROM listings WHERE id = $1', [params.id]);
  const listing = rows[0];

  if (!listing) {
    notFound();
  }

  const user = await getCurrentUser();
  const isOwner = Boolean(user && listing.user_id === user.id);

  const deleteWithId = deleteListing.bind(null, listing.id);

  const { rows: images } = await query(
    'SELECT id, url FROM listing_images WHERE listing_id = $1 ORDER BY position ASC, id ASC',
    [listing.id]
  );

  return (
    <main style={{ fontFamily: FONT, maxWidth: 640, margin: '0 auto', padding: '60px 20px' }}>
      <Link href="/" style={{ fontSize: 13, color: '#6E6E73' }}>
        &larr; Zurück zur Übersicht
      </Link>

      {images.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
            gap: 8,
            marginTop: 20,
          }}
        >
          {images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={listing.title}
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                objectFit: 'cover',
                borderRadius: 12,
                border: '1px solid #D2D2D7',
              }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            marginTop: 20,
            width: '100%',
            aspectRatio: '16 / 9',
            background: '#F5F5F7',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 13, color: '#AEAEB2' }}>Keine Fotos vorhanden</span>
        </div>
      )}

      <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 20, color: '#1D1D1F' }}>
        {listing.title}
      </h1>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 10, color: '#1D1D1F' }}>
        {listing.price ? `CHF ${Number(listing.price).toFixed(2)}` : 'Preis auf Anfrage'}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14, fontSize: 12, color: '#6E6E73', flexWrap: 'wrap' }}>
        {listing.category && <span>{listing.category}</span>}
        {listing.condition && <span>· {listing.condition}</span>}
        {listing.location && <span>· {listing.location}</span>}
      </div>

      {listing.description && (
        <p style={{ marginTop: 24, lineHeight: 1.6, color: '#1D1D1F' }}>{listing.description}</p>
      )}

      {isOwner && (
        <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
          <Link
            href={`/inserat/${listing.id}/bearbeiten`}
            style={{
              border: '1.5px solid #1D1D1F',
              color: '#1D1D1F',
              borderRadius: 999,
              padding: '9px 18px',
              fontWeight: 600,
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            Bearbeiten
          </Link>
          <DeleteListingButton action={deleteWithId} />
        </div>
      )}
    </main>
  );
}
