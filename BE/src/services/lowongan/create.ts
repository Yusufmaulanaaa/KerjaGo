// ============================================================================
// LOWONGAN — Create
// ============================================================================

import supabase from '../../lib/supabase.js';
import { BadRequestError } from '../../utils/errors.js';
import type { JobPostingBody, LowonganRow } from '../../types/index.js';
import { validasiSubKriteria, resolveFEFields, resolvePerusahaan } from './utils.js';

/**
 * Buat lowongan pekerjaan baru.
 */
export async function createLowongan(
  payload: JobPostingBody
): Promise<LowonganRow> {
  // Resolve FE field names → BE fields
  const resolved = resolveFEFields(payload as Record<string, any>);

  const judul_pekerjaan = payload.judul_pekerjaan || resolved.judul_pekerjaan;
  const deskripsi = payload.deskripsi || resolved.deskripsi;
  const deadline = payload.deadline;
  const id_tipe = payload.id_tipe ?? resolved.id_tipe;
  const id_gaji = payload.id_gaji ?? resolved.id_gaji;
  const id_jarak = payload.id_jarak ?? resolved.id_jarak;
  const id_pendidikan = payload.id_pendidikan ?? resolved.id_pendidikan;
  const id_pengalaman = payload.id_pengalaman ?? resolved.id_pengalaman;

  // Resolve perusahaan
  let id_perusahaan = payload.id_perusahaan ?? resolved.id_perusahaan;
  if (!id_perusahaan && payload.company) {
    id_perusahaan = await resolvePerusahaan(payload.company);
  }
  if (!id_perusahaan) id_perusahaan = 1; // fallback default

  // --- Validasi wajib ---
  if (!judul_pekerjaan || typeof judul_pekerjaan !== 'string' || judul_pekerjaan.trim() === '') {
    throw new BadRequestError('Field "judul_pekerjaan" (atau "title") wajib diisi.');
  }
  if (deadline && isNaN(Date.parse(deadline))) {
    throw new BadRequestError('Format "deadline" tidak valid. Gunakan format YYYY-MM-DD.');
  }

  // --- Kumpulkan id_sub yang dikirim ---
  const idSubCandidate: { kolom: string; nilai: number }[] = [];
  if (id_tipe != null) idSubCandidate.push({ kolom: 'id_tipe', nilai: id_tipe });
  if (id_gaji != null) idSubCandidate.push({ kolom: 'id_gaji', nilai: id_gaji });
  if (id_jarak != null) idSubCandidate.push({ kolom: 'id_jarak', nilai: id_jarak });
  if (id_pendidikan != null) idSubCandidate.push({ kolom: 'id_pendidikan', nilai: id_pendidikan });
  if (id_pengalaman != null) idSubCandidate.push({ kolom: 'id_pengalaman', nilai: id_pengalaman });

  if (idSubCandidate.length > 0) {
    await validasiSubKriteria(idSubCandidate);
  }

  // --- INSERT ---
  const { data: inserted, error: insertError } = await supabase
    .from('lowongan')
    .insert({
      id_perusahaan,
      judul_pekerjaan: judul_pekerjaan.trim(),
      deskripsi: deskripsi || null,
      deadline: deadline || null,
      status: 'aktif',
      id_tipe: id_tipe ?? null,
      id_gaji: id_gaji ?? null,
      id_jarak: id_jarak ?? null,
      id_pendidikan: id_pendidikan ?? null,
      id_pengalaman: id_pengalaman ?? null,
    })
    .select()
    .single();

  if (insertError) {
    throw new Error('Gagal menyimpan lowongan: ' + insertError.message);
  }

  return inserted as LowonganRow;
}
