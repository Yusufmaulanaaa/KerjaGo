// ============================================================================
// PREFERENSI SERVICE (TypeScript)
// ============================================================================
// Manajemen preferensi & bobot kriteria pelamar.
// Alur:
//   1. Cek apakah user sudah punya preferensi. Jika belum → INSERT.
//   2. DELETE semua detail_preferensi lama.
//   3. BULK INSERT data bobot baru.
// ============================================================================

import supabase from '../lib/supabase.js';
import { BadRequestError } from '../utils/errors.js';
import type { KriteriaBobot } from '../types/index.js';

/**
 * Simpan atau perbarui preferensi & bobot kriteria untuk seorang user.
 *
 * @param userId - UUID user (dari auth middleware).
 * @param kriteriaBobot - Array of { id_kriteria, id_sub_terpilih, bobot }.
 * @returns Data preferensi yang tersimpan.
 */
export async function savePreferensi(userId: string, kriteriaBobot: KriteriaBobot[]) {
  // -------------------------------------------------------------------
  // VALIDASI INPUT
  // -------------------------------------------------------------------
  if (!userId) {
    throw new BadRequestError('User tidak terautentikasi.');
  }

  if (!Array.isArray(kriteriaBobot) || kriteriaBobot.length === 0) {
    throw new BadRequestError(
      'Field "kriteria_bobot" wajib berupa array dan tidak boleh kosong.'
    );
  }

  // Validasi tiap entry
  kriteriaBobot.forEach((item, index) => {
    if (!item.id_kriteria) {
      throw new BadRequestError(
        `Entry ke-${index + 1}: "id_kriteria" wajib diisi.`
      );
    }
    if (item.bobot == null || isNaN(Number(item.bobot)) || Number(item.bobot) <= 0) {
      throw new BadRequestError(
        `Entry ke-${index + 1} (id_kriteria=${item.id_kriteria}): "bobot" harus angka positif.`
      );
    }
  });

  // -------------------------------------------------------------------
  // VALIDASI SUB_KRITERIA
  // -------------------------------------------------------------------
  const subIds = kriteriaBobot
    .filter((item) => item.id_sub_terpilih != null)
    .map((item) => item.id_sub_terpilih);

  if (subIds.length > 0) {
    const { data: subData, error: subError } = await supabase
      .from('sub_kriteria')
      .select('id_sub, id_kriteria')
      .in('id_sub', subIds);

    if (subError) {
      throw new Error('Gagal memvalidasi sub_kriteria: ' + subError.message);
    }

    const subMap = new Map<number, number>();
    (subData ?? []).forEach((row: any) => {
      subMap.set(row.id_sub, row.id_kriteria);
    });

    kriteriaBobot.forEach((item, index) => {
      if (item.id_sub_terpilih != null) {
        const expectedKriteria = subMap.get(item.id_sub_terpilih);

        if (!expectedKriteria) {
          throw new BadRequestError(
            `Entry ke-${index + 1}: id_sub_terpilih=${item.id_sub_terpilih} tidak ditemukan di database.`
          );
        }

        if (expectedKriteria !== item.id_kriteria) {
          throw new BadRequestError(
            `Entry ke-${index + 1}: id_sub_terpilih=${item.id_sub_terpilih} bukan milik ` +
            `id_kriteria=${item.id_kriteria}. Sub tsb milik id_kriteria=${expectedKriteria}.`
          );
        }
      }
    });
  }

  // -------------------------------------------------------------------
  // CEK / CREATE PREFERENSI
  // -------------------------------------------------------------------
  let idPreferensi: number;

  const { data: existingPref, error: prefError } = await supabase
    .from('preferensi')
    .select('id_preferensi')
    .eq('id_user', userId)
    .maybeSingle();

  if (prefError) {
    throw new Error('Gagal mengecek preferensi: ' + prefError.message);
  }

  if (existingPref) {
    idPreferensi = (existingPref as any).id_preferensi;
  } else {
    const { data: newPref, error: createError } = await supabase
      .from('preferensi')
      .insert({ id_user: userId })
      .select('id_preferensi')
      .single();

    if (createError) {
      throw new Error('Gagal membuat preferensi baru: ' + createError.message);
    }

    idPreferensi = (newPref as any).id_preferensi;
  }

  // -------------------------------------------------------------------
  // HAPUS DATA LAMA
  // -------------------------------------------------------------------
  const { error: deleteError } = await supabase
    .from('detail_preferensi')
    .delete()
    .eq('id_preferensi', idPreferensi);

  if (deleteError) {
    throw new Error('Gagal menghapus detail_preferensi lama: ' + deleteError.message);
  }

  // -------------------------------------------------------------------
  // BULK INSERT
  // -------------------------------------------------------------------
  // Default id_sub per kriteria (first sub for each kriteria) when FE doesn't provide one
  const defaultSubPerKriteria: Record<number, number> = {
    1: 1, 2: 5, 3: 10, 4: 14, 5: 18,
  };

  const detailRows = kriteriaBobot.map((item) => ({
    id_preferensi: idPreferensi,
    id_kriteria: item.id_kriteria,
    id_sub: item.id_sub_terpilih ?? item.id_sub ?? defaultSubPerKriteria[item.id_kriteria] ?? 1,
    bobot: Number(item.bobot),
  }));

  const { data: insertedDetails, error: insertError } = await supabase
    .from('detail_preferensi')
    .insert(detailRows)
    .select();

  if (insertError) {
    throw new Error('Gagal menyimpan detail_preferensi: ' + insertError.message);
  }

  // -------------------------------------------------------------------
  // RESPONSE
  // -------------------------------------------------------------------
  return {
    id_preferensi: idPreferensi,
    jumlah_kriteria: (insertedDetails ?? []).length,
    detail_preferensi: insertedDetails,
  };
}
