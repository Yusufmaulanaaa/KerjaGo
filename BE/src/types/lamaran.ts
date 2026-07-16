// ============================================================================
// TIPE DATA — Lamaran (Job Application)
// ============================================================================

export interface LamaranBody {
  id_lowongan: number;
  pesan?: string;
}

export interface LamaranRow {
  id_lamaran: number;
  id_user: string;
  id_lowongan: number;
  status: 'pending' | 'diterima' | 'ditolak';
  pesan: string | null;
  created_at: string;
}

export interface LamaranWithDetail extends LamaranRow {
  judul_pekerjaan?: string;
  nama_perusahaan?: string;
}
