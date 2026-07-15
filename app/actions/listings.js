'use server';

import { redirect } from 'next/navigation';
import { query } from '../../lib/db';

export async function createListing(formData) {
  const title = formData.get('title');
  const description = formData.get('description');
  const priceRaw = formData.get('price');
  const category = formData.get('category');
  const condition = formData.get('condition');
  const location = formData.get('location');

  if (!title || !title.toString().trim()) {
    throw new Error('Titel darf nicht leer sein.');
  }

  const price = priceRaw ? Number(priceRaw) : null;

  const result = await query(
    `INSERT INTO listings (title, description, price, category, condition, location)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [title, description || null, price, category || null, condition || null, location || null]
  );

  const newId = result.rows[0].id;
  redirect(`/inserat/${newId}`);
}
