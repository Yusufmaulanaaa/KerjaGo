// ============================================================================
// TIPE DATA — Lowongan
// ============================================================================

/** Request body untuk POST /api/lowongan */
export interface JobPostingBody {
  id_perusahaan?: number;
  judul_pekerjaan?: string;
  deskripsi?: string;
  deadline?: string;
  id_tipe?: number;
  id_gaji?: number;
  id_jarak?: number;
  id_pendidikan?: number;
  id_pengalaman?: number;
  // FE-compatible field names (mapped internally)
  title?: string;
  company?: string;
  description?: string;
  type?: string;
  salary?: string;
  location?: string;
}

/** Request body untuk UPDATE /api/lowongan/:id (semua opsional) */
export interface JobUpdateBody {
  judul_pekerjaan?: string;
  deskripsi?: string;
  deadline?: string;
  status?: 'aktif' | 'nonaktif';
  id_tipe?: number;
  id_gaji?: number;
  id_jarak?: number;
  id_pendidikan?: number;
  id_pengalaman?: number;
  // FE-compatible field names
  title?: string;
  company?: string;
  description?: string;
  type?: string;
  salary?: string;
  location?: string;
}

/** Data lowongan dari database */
export interface LowonganRow {
  id_lowongan: number;
  id_perusahaan: number;
  judul_pekerjaan: string;
  deskripsi: string | null;
  deadline: string | null;
  status: string;
  id_tipe: number | null;
  id_gaji: number | null;
  id_jarak: number | null;
  id_pendidikan: number | null;
  id_pengalaman: number | null;
  nama_perusahaan?: string | null;
  kategori?: string | null;
  tipe_pekerjaan?: string | null;
  gaji?: string | null;
  jarak?: string | null;
  pendidikan?: string | null;
  pengalaman?: string | null;
  perusahaan?: { id_perusahaan: number; nama_perusahaan: string } | null;
}

/** Data sub_kriteria dari database */
export interface SubKriteriaRow {
  id_sub: number;
  id_kriteria: number;
  nama_sub: string;
  nilai: number;
}

/** Data kriteria dari database */
export interface KriteriaRow {
  id_kriteria: number;
  nama_kriteria: string;
  atribut: 'benefit' | 'cost';
  bobot_default: number;
}
