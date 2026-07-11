// ============================================================================
// CAREER NOTES SERVICE (TypeScript) — CRUD artikel karir via Supabase
// ============================================================================

import supabase from '../lib/supabase.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import type { CareerNoteRow, CareerNoteResponse } from '../types/index.js';

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Hitung estimasi waktu baca (menit) berdasarkan jumlah kata */
function estimateReadTime(konten: string): string {
  const wordCount = konten.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} menit`;
}

/** Mapping dari row DB → response FE */
function toResponse(row: CareerNoteRow): CareerNoteResponse {
  return {
    id: row.id_note,
    title: row.judul,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.konten,
    category: row.kategori,
    author: row.penulis,
    date: new Date(row.created_at).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    readTime: estimateReadTime(row.konten),
    image: row.gambar || row.judul.charAt(0),
  };
}

// ---------------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------------

/**
 * Ambil semua career notes (sorted by created_at DESC).
 */
export async function getAllNotes(): Promise<CareerNoteResponse[]> {
  const { data, error } = await supabase
    .from('career_notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Gagal mengambil career notes: ' + error.message);
  }

  return (data as CareerNoteRow[]).map(toResponse);
}

/**
 * Ambil satu career note berdasarkan slug.
 */
export async function getNoteBySlug(slug: string): Promise<CareerNoteResponse> {
  const { data, error } = await supabase
    .from('career_notes')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error('Gagal mengambil career note: ' + error.message);
  }

  if (!data) {
    throw new NotFoundError(`Career note dengan slug "${slug}" tidak ditemukan.`);
  }

  return toResponse(data as CareerNoteRow);
}

/**
 * Buat career note baru.
 */
export async function createNote(body: {
  judul: string;
  slug: string;
  kategori: string;
  konten: string;
  excerpt?: string;
  gambar?: string;
  penulis?: string;
}): Promise<CareerNoteResponse> {
  if (!body.judul || !body.slug || !body.konten) {
    throw new BadRequestError('judul, slug, dan konten wajib diisi.');
  }

  const { data, error } = await supabase
    .from('career_notes')
    .insert({
      judul: body.judul,
      slug: body.slug,
      kategori: body.kategori || 'umum',
      konten: body.konten,
      excerpt: body.excerpt || body.konten.substring(0, 150),
      gambar: body.gambar || '',
      penulis: body.penulis || 'Admin',
    })
    .select()
    .single();

  if (error) throw new Error('Gagal membuat career note: ' + error.message);
  return toResponse(data as CareerNoteRow);
}

/**
 * Update career note berdasarkan ID.
 */
export async function updateNote(
  id: number,
  body: Partial<{
    judul: string;
    slug: string;
    kategori: string;
    konten: string;
    excerpt: string;
    gambar: string;
    penulis: string;
  }>,
): Promise<CareerNoteResponse> {
  const updateData: Record<string, any> = {};
  if (body.judul !== undefined) updateData.judul = body.judul;
  if (body.slug !== undefined) updateData.slug = body.slug;
  if (body.kategori !== undefined) updateData.kategori = body.kategori;
  if (body.konten !== undefined) updateData.konten = body.konten;
  if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
  if (body.gambar !== undefined) updateData.gambar = body.gambar;
  if (body.penulis !== undefined) updateData.penulis = body.penulis;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('career_notes')
    .update(updateData)
    .eq('id_note', id)
    .select()
    .single();

  if (error) throw new Error('Gagal update career note: ' + error.message);
  if (!data) throw new NotFoundError(`Career note dengan id ${id} tidak ditemukan.`);
  return toResponse(data as CareerNoteRow);
}

/**
 * Hapus career note berdasarkan ID.
 */
export async function deleteNote(id: number): Promise<void> {
  const { error } = await supabase
    .from('career_notes')
    .delete()
    .eq('id_note', id);

  if (error) throw new Error('Gagal menghapus career note: ' + error.message);
}
