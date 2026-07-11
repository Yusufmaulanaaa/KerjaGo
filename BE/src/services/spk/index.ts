// ============================================================================
// SPK ENGINE — Orchestrator
// ============================================================================
// Menerapkan 3 metode komparasi sekaligus: SAW, WP, TOPSIS.
// Memberikan rekomendasi lowongan pekerjaan berdasarkan preferensi user.
// ============================================================================

import { calculateSAW } from './saw.js';
import { calculateWP } from './wp.js';
import { calculateTOPSIS } from './topsis.js';
import {
  KOLOM_KRITERIA_LOWONGAN,
  getPreferensi,
  getKriteriaList,
  getLowonganAktif,
  getSubKriteriaList,
} from './repository.js';
import {
  hapusHasilLama,
  simpanHasilSAW,
  simpanHasilWP,
  simpanHasilTOPSIS,
} from './persistence.js';

/**
 * Berikan rekomendasi lowongan untuk user berdasarkan preferensi.
 */
export async function getRekomendasi(userId: string) {
  // =====================================================================
  // TAHAP 1 — Ambil Preferensi & Bobot Kriteria
  // =====================================================================
  const preferensi = await getPreferensi(userId);
  const idPreferensi = preferensi.id_preferensi;

  const bobotUserMap: Record<number, number> = {};
  preferensi.detail_preferensi.forEach((dp: any) => {
    bobotUserMap[dp.id_kriteria] = parseFloat(dp.bobot);
  });

  // =====================================================================
  // TAHAP 2 — Ambil Daftar Kriteria & Atribut
  // =====================================================================
  const kriteriaList = await getKriteriaList();

  kriteriaList.forEach((k: any) => {
    if (bobotUserMap[k.id_kriteria] === undefined) {
      throw new Error(
        `Bobot untuk kriteria "${k.nama_kriteria}" (id=${k.id_kriteria}) belum diisi.`
      );
    }
  });

  // =====================================================================
  // TAHAP 3 — Ambil Semua Lowongan Aktif
  // =====================================================================
  const lowonganList = await getLowonganAktif();

  if (lowonganList.length === 0) {
    return {
      id_preferensi: idPreferensi,
      jumlah_lowongan: 0,
      message: 'Tidak ada lowongan aktif yang tersedia.',
      results: [],
    };
  }

  // =====================================================================
  // TAHAP 4 — Ambil Nilai Numerik Sub-Kriteria
  // =====================================================================
  const semuaIdSub = new Set<number>();
  lowonganList.forEach((low: any) => {
    KOLOM_KRITERIA_LOWONGAN.forEach((col) => {
      if (low[col]) semuaIdSub.add(low[col]);
    });
  });

  const subKriteriaList = await getSubKriteriaList(semuaIdSub);

  const subMap: Record<number, any> = {};
  (subKriteriaList || []).forEach((sub: any) => {
    subMap[sub.id_sub] = sub;
  });

  // =====================================================================
  // TAHAP 5 — Bangun Matriks Keputusan X[i][j]
  // =====================================================================
  kriteriaList.sort((a: any, b: any) => a.id_kriteria - b.id_kriteria);
  const idKriteriaList = kriteriaList.map((k: any) => k.id_kriteria);

  const alternatif: any[] = [];
  const X: Record<number, number>[] = [];

  lowonganList.forEach((low: any) => {
    const row: Record<number, number> = {};
    const meta = {
      id_lowongan: low.id_lowongan,
      judul_pekerjaan: low.judul_pekerjaan,
      nama_perusahaan: low.perusahaan?.nama_perusahaan || '',
    };

    KOLOM_KRITERIA_LOWONGAN.forEach((col) => {
      const idSub = low[col];
      const sub = subMap[idSub];
      if (sub) {
        row[sub.id_kriteria] = parseFloat(sub.nilai) || 0;
      }
    });

    alternatif.push(meta);
    X.push(row);
  });

  const X_num = X.map((row) => idKriteriaList.map((idKriteria) => row[idKriteria] ?? 0));
  const atributArray = idKriteriaList.map(
    (id) => kriteriaList.find((k: any) => k.id_kriteria === id).atribut,
  );
  const bobotArray = idKriteriaList.map((id) => bobotUserMap[id]);

  // =====================================================================
  // TAHAP 6 — Jalankan 3 Metode Paralel
  // =====================================================================
  const [hasilSAW, hasilWP, hasilTOPSIS] = await Promise.all([
    calculateSAW(X_num, bobotArray, atributArray),
    calculateWP(X_num, bobotArray, atributArray),
    calculateTOPSIS(X_num, bobotArray, atributArray),
  ]);

  // =====================================================================
  // TAHAP 7 — Simpan Hasil ke Database
  // =====================================================================
  await hapusHasilLama(idPreferensi);
  await Promise.all([
    simpanHasilSAW(idPreferensi, hasilSAW, alternatif),
    simpanHasilWP(idPreferensi, hasilWP, alternatif),
    simpanHasilTOPSIS(idPreferensi, hasilTOPSIS, alternatif),
  ]);

  // =====================================================================
  // TAHAP 8 — Bentuk Response
  // =====================================================================
  const results = alternatif.map((alt: any, i: number) => {
    const saw = hasilSAW.find((h: any) => h.index === i);
    const wp = hasilWP.find((h: any) => h.index === i);
    const topsis = hasilTOPSIS.find((h: any) => h.index === i);

    return {
      id_lowongan: alt.id_lowongan,
      judul_pekerjaan: alt.judul_pekerjaan,
      nama_perusahaan: alt.nama_perusahaan,
      saw: {
        skor: saw ? Math.round(saw.skor * 1e6) / 1e6 : 0,
        ranking: saw ? saw.ranking : 0,
      },
      wp: {
        nilai_s: wp ? Math.round(wp.nilai_s * 1e6) / 1e6 : 0,
        nilai_v: wp ? Math.round(wp.nilai_v * 1e6) / 1e6 : 0,
        ranking: wp ? wp.ranking : 0,
      },
      topsis: {
        d_plus: topsis ? Math.round(topsis.d_plus * 1e6) / 1e6 : 0,
        d_minus: topsis ? Math.round(topsis.d_minus * 1e6) / 1e6 : 0,
        nilai_preferensi: topsis ? Math.round(topsis.nilai_preferensi * 1e6) / 1e6 : 0,
        ranking: topsis ? topsis.ranking : 0,
      },
    };
  });

  results.sort((a, b) => a.id_lowongan - b.id_lowongan);

  return {
    id_preferensi: idPreferensi,
    jumlah_lowongan: results.length,
    results,
  };
}
