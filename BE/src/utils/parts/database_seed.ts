// ============================================================================
// SEEDER DATABASE OPERATIONS — Functions for seeding lowongan and career notes
// ============================================================================

import supabase from '../../lib/supabase.js';
import { pool } from '../../lib/supabase.js';
import { generateLowonganBatch } from './helpers.js';
import { CAREER_NOTES } from './career_notes_data.js';
import { JUDUL_PEKERJAAN, PERUSAHAAN, DESKRIPSI_PER_JUDUL, DESKRIPSI_FALLBACK } from './seeder_config.js';

// ---------------------------------------------------------------------------
// SEED CAREER NOTES — Insert 15 career notes into database
// ---------------------------------------------------------------------------

export async function seedCareerNotes(): Promise<number> {
  try {
    const { count, error: countError } = await supabase
      .from('career_notes')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error('Gagal mengecek jumlah career notes: ' + countError.message);
    }

    if ((count ?? 0) >= 15) {
      console.log(`[SEEDER] Career notes sudah ada ${count} — seed dilewati.`);
      return 0;
    }

    console.log('[SEEDER] Menghapus data lama & insert 15 career notes baru...');

    const { error: deleteError } = await supabase
      .from('career_notes')
      .delete()
      .neq('id_note', 0);

    if (deleteError) {
      throw new Error('Gagal hapus career notes lama: ' + deleteError.message);
    }

    const { error: insertError } = await supabase
      .from('career_notes')
      .insert(CAREER_NOTES);

    if (insertError) {
      throw new Error('Gagal insert career notes: ' + insertError.message);
    }

    console.log('[SEEDER] ✅ 15 career notes baru berhasil ditambahkan.');
    return 15;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[SEEDER] ❌ Gagal seed career notes: ${message}`);
    return 0;
  }
}

/**
 * Seed database dengan 60 lowongan dummy jika jumlah lowongan masih < 60.
 *
 * @param target Jumlah target lowongan yang diinginkan (default: 60).
 * @returns Jumlah data baru yang berhasil di-insert.
 */
export async function seedDatabase(target: number = 60, force: boolean = false): Promise<number> {
  try {
    // Jika force, hapus dulu data lama (termasuk tabel SPK yang punya FK ke lowongan)
    // Pakai direct SQL karena Supabase anon key kena RLS
    if (force) {
      console.log('[SEEDER] Force mode aktif — menghapus data terkait lowongan lama...');
      const client = await pool.connect();
      try {
        await client.query('DELETE FROM hasil_saw');
        await client.query('DELETE FROM hasil_wp');
        await client.query('DELETE FROM hasil_topsis');
        await client.query('DELETE FROM lowongan');
        console.log('[SEEDER] Data lama berhasil dihapus.');
      } finally {
        client.release();
      }
    } else {
      const { count, error: countError } = await supabase
        .from('lowongan')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw new Error('Gagal mengecek jumlah lowongan: ' + countError.message);
      }

      const existing = count ?? 0;

      if (existing >= 50) {
        console.log(`[SEEDER] Database sudah memiliki ${existing} lowongan — seed dilewati.`);
        return 0;
      }
    }

    console.log(`[SEEDER] Mulai generate ${target} data dummy...`);

    const BATCH_SIZE = 25;
    let inserted = 0;

    for (let i = 0; i < target; i += BATCH_SIZE) {
      const currentBatchSize = Math.min(BATCH_SIZE, target - i);
      const batch = generateLowonganBatch(
        JUDUL_PEKERJAAN,
        PERUSAHAAN,
        DESKRIPSI_PER_JUDUL,
        currentBatchSize,
        DESKRIPSI_FALLBACK
      );

      const { error: insertError } = await supabase
        .from('lowongan')
        .insert(batch);

      if (insertError) {
        throw new Error('Gagal insert batch lowongan: ' + insertError.message);
      }

      inserted += currentBatchSize;
      console.log(`[SEEDER] ✅ ${inserted}/${target} lowongan tersimpan...`);
    }

    console.log(`[SEEDER] ✅ Selesai! ${inserted} lowongan dummy berhasil ditambahkan.`);
    return inserted;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[SEEDER] ❌ Gagal melakukan seed database: ${message}`);
    throw error;
  }
}

// Export all needed constants and functions for seeder.ts
export { JUDUL_PEKERJAAN, PERUSAHAAN, DESKRIPSI_PER_JUDUL, DESKRIPSI_FALLBACK } from './seeder_config.js';