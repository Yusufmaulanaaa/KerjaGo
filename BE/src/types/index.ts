// ============================================================================
// TIPE DATA — Barrel re-export
// ============================================================================

export type { JobPostingBody, JobUpdateBody, LowonganRow, SubKriteriaRow, KriteriaRow } from './lowongan.js';
export type { KriteriaBobot, PreferensiBody, PreferensiRow, DetailPreferensiRow } from './preferensi.js';
export type { CareerNoteRow, CareerNoteResponse } from './career-notes.js';
export type { LamaranBody, LamaranRow, LamaranWithDetail } from './lamaran.js';

/** Struktur response API standar */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
