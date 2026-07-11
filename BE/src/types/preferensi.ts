// ============================================================================
// TIPE DATA — Preferensi
// ============================================================================

/** Satu entry bobot kriteria dalam array kriteria_bobot */
export interface KriteriaBobot {
  id_kriteria: number;
  id_sub_terpilih?: number | null;
  id_sub?: number | null; // alias untuk id_sub_terpilih (digunakan internal)
  bobot: number;
}

/** Request body untuk POST /api/preferensi */
export interface PreferensiBody {
  kriteria_bobot: KriteriaBobot[];
}

/** Data preferensi + detail_preferensi dari database */
export interface PreferensiRow {
  id_preferensi: number;
  id_user: string;
  detail_preferensi: DetailPreferensiRow[];
}

/** Data detail_preferensi dari database */
export interface DetailPreferensiRow {
  id_detail: number;
  id_preferensi: number;
  id_kriteria: number;
  id_sub: number | null;
  bobot: number;
}
