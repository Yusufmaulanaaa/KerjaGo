import api from '../lib/axios';

// ============================================================================
// Types for SPK API Response (Backend: services/spk/index.ts)
// ============================================================================

export interface SPKResultSAW {
  skor: number;
  ranking: number;
}

export interface SPKResultWP {
  nilai_s: number;
  nilai_v: number;
  ranking: number;
}

export interface SPKResultTOPSIS {
  d_plus: number;
  d_minus: number;
  nilai_preferensi: number;
  ranking: number;
}

export interface SPKResultItem {
  id_lowongan: number;
  judul_pekerjaan: string;
  nama_perusahaan: string;
  saw: SPKResultSAW;
  wp: SPKResultWP;
  topsis: SPKResultTOPSIS;
}

export interface SPKResponseData {
  id_preferensi: number;
  jumlah_lowongan: number;
  results: SPKResultItem[];
}

// ============================================================================
// Service
// ============================================================================

export const rekomendasiService = {
  /** GET /api/spk/rekomendasi — Hitung & ambil rekomendasi SPK (3 metode) */
  getRekomendasi: async () => {
    return api.get<{ success: boolean; data: SPKResponseData; message?: string }>(
      '/spk/rekomendasi'
    );
  },

  /** POST /api/preferensi — Simpan bobot preferensi kriteria user */
  savePreferensi: async (kriteriaBobot: { id_kriteria: number; bobot: number }[]) => {
    return api.post<{ success: boolean; message: string; data: any }>(
      '/preferensi',
      { kriteria_bobot: kriteriaBobot }
    );
  },
};
