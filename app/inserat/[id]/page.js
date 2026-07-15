import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '../../../lib/db';

export const dynamic = 'force-dynamic';

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export default async function ListingDetailPage({ params }) {
  const { rows } = await query('SELECT * FROM listings WHERE id = $1', [params.id]);
  const listing = rows[0];

  if (!listing) {
    notFound();
  }

  return (
    <main style={{ fontFamily: FONT, maxWidth: 640, margin: '0 auto', padding: '60px 20px' }}>
      <Link href="/" style={{ fontSize: 13, color: '#6E6E73' }}>
        &larr; Zurück zur Übersicht
      </Link>

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
    </main>
  );
}
