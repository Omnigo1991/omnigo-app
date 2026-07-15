'use server';

import { redirect } from 'next/navigation';
import { put } from '@vercel/blob';
import { query } from '../../lib/db';
import { getCurrentUser } from '../../lib/users';

const MAX_IMAGES = 5;

async function saveUploadedImages(listingId, formData) {
  const files = formData.getAll('images').filter((f) => f && typeof f === 'object' && f.size > 0);

  const toUpload = files.slice(0, MAX_IMAGES);

  for (const file of toUpload) {
    const blob = await put(`listings/${listingId}/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    await query(
      'INSERT INTO listing_images (listing_id, url) VALUES ($1, $2)',
      [listingId, blob.url]
    );
  }
}

export async function createListing(formData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Bitte melde dich an, um ein Inserat zu erstellen.');
  }

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
    `INSERT INTO listings (title, description, price, category, condition, location, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [title, description || null, price, category || null, condition || null, location || null, user.id]
  );

  const newId = result.rows[0].id;

  await saveUploadedImages(newId, formData);

  redirect(`/inserat/${newId}`);
}

export async function updateListing(id, formData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Bitte melde dich an.');
  }

  const existing = await query('SELECT user_id FROM listings WHERE id = $1', [id]);
  if (!existing.rows[0] || existing.rows[0].user_id !== user.id) {
    throw new Error('Du kannst nur eigene Inserate bearbeiten.');
  }

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

  await query(
    `UPDATE listings
     SET title = $1, description = $2, price = $3, category = $4, condition = $5, location = $6
     WHERE id = $7`,
    [title, description || null, price, category || null, condition || null, location || null, id]
  );

  await saveUploadedImages(id, formData);

  redirect(`/inserat/${id}`);
}

export async function deleteListingImage(listingId, imageId) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Bitte melde dich an.');
  }

  const existing = await query('SELECT user_id FROM listings WHERE id = $1', [listingId]);
  if (!existing.rows[0] || existing.rows[0].user_id !== user.id) {
    throw new Error('Du kannst nur eigene Inserate bearbeiten.');
  }

  await query('DELETE FROM listing_images WHERE id = $1 AND listing_id = $2', [imageId, listingId]);

  redirect(`/inserat/${listingId}/bearbeiten`);
}

export async function deleteListing(id) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Bitte melde dich an.');
  }

  const existing = await query('SELECT user_id FROM listings WHERE id = $1', [id]);
  if (!existing.rows[0] || existing.rows[0].user_id !== user.id) {
    throw new Error('Du kannst nur eigene Inserate löschen.');
  }

  await query('DELETE FROM listings WHERE id = $1', [id]);
  redirect('/');
}
