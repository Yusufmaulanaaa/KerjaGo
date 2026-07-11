// ============================================================================
// SPK — Repository Layer (Data Fetching via Supabase)
// ============================================================================

import supabase from '../../lib/supabase.js';

// ---------------------------------------------------------------------------
// Nama-nama kolom pada tabel `lowongan` yang mereferensi ke `sub_kriteria`
// Kelima kolom ini menjadi 5 kriteria dalam SPK.
// ---------------------------------------------------------------------------
export const KOLOM_KRITERIA_LOWONGAN = [
  'id_tipe',
  'id_gaji',
  'id_jarak',
  'id_pendidikan',
  'id_pengalaman',
];

/**
 * Ambil preferensi user beserta detail_preferensi (bobot kriteria).
 */
export async function getPreferensi(userId: string) {
  const { data, error } = await supabase
    .from('preferensi')
    .select('*, detail_preferensi(*)')
    .eq('id_user', userId)
    .single();

  if (error || !data) {
    throw new Error(
      'Preferensi tidak ditemukan untuk user ini. Silakan buat preferensi terlebih dahulu.'
    );
  }
  return data;
}

/**
 * Ambil semua kriteria (id, nama, atribut).
 */
export async function getKriteriaList() {
  const { data, error } = await supabase.from('kriteria').select('*');
  if (error) throw new Error('Gagal mengambil data kriteria: ' + error.message);
  if (!data || data.length === 0) {
    throw new Error('Belum ada data kriteria. Silakan isi tabel kriteria terlebih dahulu.');
  }
  return data;
}

/**
 * Ambil semua lowongan aktif beserta data perusahaan.
 */
export async function getLowonganAktif() {
  const { data, error } = await supabase
    .from('lowongan')
    .select(`*, perusahaan:perusahaan(id_perusahaan, nama_perusahaan)`)
    .eq('status', 'aktif');

  if (error) throw new Error('Gagal mengambil data lowongan: ' + error.message);
  return data ?? [];
}

/**
 * Ambil data sub_kriteria berdasarkan kumpulan id_sub.
 */
export async function getSubKriteriaList(idSubSet: Set<number>) {
  if (idSubSet.size === 0) return [];

  const { data, error } = await supabase
    .from('sub_kriteria')
    .select('*')
    .in('id_sub', [...idSubSet]);

  if (error) throw new Error('Gagal mengambil data sub_kriteria: ' + error.message);
  return data ?? [];
}
