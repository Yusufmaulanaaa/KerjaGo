// ============================================================================
// TIPE DATA — Career Notes
// ============================================================================

/** Data career_notes dari database */
export interface CareerNoteRow {
  id_note: number;
  judul: string;
  slug: string;
  kategori: string;
  konten: string;
  excerpt: string;
  gambar: string;
  penulis: string;
  created_at: string;
  updated_at: string;
}

/** Response career note untuk FE */
export interface CareerNoteResponse {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}
