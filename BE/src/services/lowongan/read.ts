// ============================================================================
// LOWONGAN — Read (list with filters & enrichment)
// ============================================================================

import supabase from '../../lib/supabase.js';
import type { LowonganRow } from '../../types/index.js';
import {
  loadSubKriteria,
  cariIdSub,
  getSubLabel,
  getKategoriFromJudul,
} from './utils.js';

/**
 * Ambil semua lowongan aktif, dilengkapi nama perusahaan dan nilai sub_kriteria.
 * Mendukung filter opsional via query params.
 */
export async function getAllLowongan(
  filters?: Record<string, any>
): Promise<{ data: LowonganRow[]; total: number }> {
  // ── Muat semua sub_kriteria untuk mapping label ↔ ID ──
  const { subMap, labelKeId } = await loadSubKriteria();

  // ── Normalisasi parameter filter ──
  const f: Record<string, any> = { ...filters };

  // Mapping: nama param dari frontend → kolom database
  if (f.tipe_pekerjaan && !f.id_tipe) f.id_tipe = cariIdSub(f.tipe_pekerjaan, labelKeId);
  if (f.rentang_gaji && !f.id_gaji) f.id_gaji = cariIdSub(f.rentang_gaji, labelKeId);
  if (f.jarak && !f.id_jarak) f.id_jarak = cariIdSub(f.jarak, labelKeId);
  if (f.pendidikan && !f.id_pendidikan) f.id_pendidikan = cariIdSub(f.pendidikan, labelKeId);
  if (f.pengalaman && !f.id_pengalaman) f.id_pengalaman = cariIdSub(f.pengalaman, labelKeId);
  if (f.id_kategori && !f.kategori) f.kategori = f.id_kategori;
  // FE sends `type=Full-time` etc
  if (f.type && !f.id_tipe) f.id_tipe = cariIdSub(f.type, labelKeId);

  // ── Pagination ──
  const limit = f.limit ? Math.min(Number(f.limit), 100) : undefined;
  const offset = f.offset ? Number(f.offset) : 0;

  // ── Bangun query ──
  let query = supabase
    .from('lowongan')
    .select(`*, perusahaan:perusahaan!inner(id_perusahaan, nama_perusahaan)`, { count: 'exact' })
    .eq('status', 'aktif')
    .order('id_lowongan', { ascending: false });

  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  // Filter: id_tipe (dari ?tipe_pekerjaan= atau ?id_tipe=)
  if (f.id_tipe != null) {
    query = query.eq('id_tipe', Number(f.id_tipe));
  }
  // Filter: id_gaji (dari ?rentang_gaji= atau ?id_gaji=)
  if (f.id_gaji != null) {
    query = query.eq('id_gaji', Number(f.id_gaji));
  }
  // Filter: id_jarak (dari ?jarak= atau ?id_jarak=)
  if (f.id_jarak != null) {
    query = query.eq('id_jarak', Number(f.id_jarak));
  }
  // Filter: id_pendidikan (dari ?pendidikan= atau ?id_pendidikan=)
  if (f.id_pendidikan != null) {
    query = query.eq('id_pendidikan', Number(f.id_pendidikan));
  }
  // Filter: id_pengalaman (dari ?pengalaman= atau ?id_pengalaman=)
  if (f.id_pengalaman != null) {
    query = query.eq('id_pengalaman', Number(f.id_pengalaman));
  }
  // Filter: id_perusahaan (dari ?id_perusahaan=)
  if (f.id_perusahaan != null) {
    query = query.eq('id_perusahaan', Number(f.id_perusahaan));
  }
  // Filter: pencarian teks (judul_pekerjaan) via ilike
  if (f.search) {
    query = query.ilike('judul_pekerjaan', `%${f.search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error('Gagal mengambil data lowongan: ' + error.message);
  }

  if (!data || data.length === 0) return { data: [], total: count ?? 0 };

  // ── Enrich response ──
  const enriched = (data as any[]).map((row) => {
    const kategori = getKategoriFromJudul(row.judul_pekerjaan);

    return {
      id_lowongan: row.id_lowongan,
      judul_pekerjaan: row.judul_pekerjaan,
      deskripsi: row.deskripsi,
      deadline: row.deadline,
      status: row.status,
      id_perusahaan: row.id_perusahaan,
      nama_perusahaan: row.perusahaan?.nama_perusahaan || null,
      kategori,
      tipe_pekerjaan: getSubLabel(subMap, 'id_tipe', row.id_tipe),
      gaji: getSubLabel(subMap, 'id_gaji', row.id_gaji),
      jarak: getSubLabel(subMap, 'id_jarak', row.id_jarak),
      pendidikan: getSubLabel(subMap, 'id_pendidikan', row.id_pendidikan),
      pengalaman: getSubLabel(subMap, 'id_pengalaman', row.id_pengalaman),
      id_tipe: row.id_tipe,
      id_gaji: row.id_gaji,
      id_jarak: row.id_jarak,
      id_pendidikan: row.id_pendidikan,
      id_pengalaman: row.id_pengalaman,
      created_at: row.created_at,
    };
  });

  // ── Post-filter: kategori (dihitung dari judul, bukan kolom DB) ──
  let hasil = enriched as unknown as LowonganRow[];
  if (f.kategori) {
    const katNorm = String(f.kategori).toLowerCase().trim();
    hasil = hasil.filter((item: any) =>
      item.kategori?.toLowerCase() === katNorm
    );
  }

  return { data: hasil, total: count ?? hasil.length };
}
