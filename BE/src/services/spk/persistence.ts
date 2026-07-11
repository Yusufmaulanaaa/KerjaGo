// ============================================================================
// SPK — Persistence Layer (Simpan / Hapus hasil SPK)
// ============================================================================

import supabase from '../../lib/supabase.js';

/**
 * Hapus semua hasil perhitungan lama untuk preferensi tertentu (3 tabel).
 */
export async function hapusHasilLama(idPreferensi: number) {
  await Promise.all([
    supabase.from('hasil_saw').delete().eq('id_preferensi', idPreferensi),
    supabase.from('hasil_wp').delete().eq('id_preferensi', idPreferensi),
    supabase.from('hasil_topsis').delete().eq('id_preferensi', idPreferensi),
  ]);
}

/**
 * Simpan hasil SAW ke database.
 */
export async function simpanHasilSAW(
  idPreferensi: number,
  hasil: { index: number; skor: number; ranking: number }[],
  alternatif: { id_lowongan: number }[],
) {
  if (hasil.length === 0) return;

  const rows = hasil.map((h) => ({
    id_preferensi: idPreferensi,
    id_lowongan: alternatif[h.index].id_lowongan,
    skor: h.skor,
    ranking: h.ranking,
  }));

  const { error } = await supabase.from('hasil_saw').insert(rows);
  if (error) console.error('Gagal menyimpan hasil SAW:', error.message);
}

/**
 * Simpan hasil WP ke database.
 */
export async function simpanHasilWP(
  idPreferensi: number,
  hasil: { index: number; nilai_s: number; nilai_v: number; ranking: number }[],
  alternatif: { id_lowongan: number }[],
) {
  if (hasil.length === 0) return;

  const rows = hasil.map((h) => ({
    id_preferensi: idPreferensi,
    id_lowongan: alternatif[h.index].id_lowongan,
    nilai_s: h.nilai_s,
    nilai_v: h.nilai_v,
    ranking: h.ranking,
  }));

  const { error } = await supabase.from('hasil_wp').insert(rows);
  if (error) console.error('Gagal menyimpan hasil WP:', error.message);
}

/**
 * Simpan hasil TOPSIS ke database.
 */
export async function simpanHasilTOPSIS(
  idPreferensi: number,
  hasil: { index: number; d_plus: number; d_minus: number; nilai_preferensi: number; ranking: number }[],
  alternatif: { id_lowongan: number }[],
) {
  if (hasil.length === 0) return;

  const rows = hasil.map((h) => ({
    id_preferensi: idPreferensi,
    id_lowongan: alternatif[h.index].id_lowongan,
    d_plus: h.d_plus,
    d_minus: h.d_minus,
    nilai_preferensi: h.nilai_preferensi,
    ranking: h.ranking,
  }));

  const { error } = await supabase.from('hasil_topsis').insert(rows);
  if (error) console.error('Gagal menyimpan hasil TOPSIS:', error.message);
}
