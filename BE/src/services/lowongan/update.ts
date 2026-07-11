// ============================================================================
// LOWONGAN — Update
// ============================================================================

import supabase from '../../lib/supabase.js';
import { BadRequestError } from '../../utils/errors.js';
import type { JobUpdateBody, LowonganRow } from '../../types/index.js';
import { validasiSubKriteria, resolveFEFields, resolvePerusahaan } from './utils.js';

const KRITERIA_FIELDS: { key: keyof Pick<JobUpdateBody, 'id_tipe' | 'id_gaji' | 'id_jarak' | 'id_pendidikan' | 'id_pengalaman'>; kolom: string }[] = [
  { key: 'id_tipe', kolom: 'id_tipe' },
  { key: 'id_gaji', kolom: 'id_gaji' },
  { key: 'id_jarak', kolom: 'id_jarak' },
  { key: 'id_pendidikan', kolom: 'id_pendidikan' },
  { key: 'id_pengalaman', kolom: 'id_pengalaman' },
];

/**
 * Update lowongan berdasarkan id_lowongan.
 * Hanya kolom yang dikirim (tidak undefined) yang akan diubah.
 */
export async function updateLowongan(
  id_lowongan: number,
  data: JobUpdateBody
): Promise<LowonganRow> {
  // --- Cek keberadaan lowongan ---
  const { data: existing, error: existError } = await supabase
    .from('lowongan')
    .select('id_lowongan')
    .eq('id_lowongan', id_lowongan)
    .single();

  if (existError || !existing) {
    throw new BadRequestError(`Lowongan dengan id ${id_lowongan} tidak ditemukan.`);
  }

  // Resolve FE fields if needed
  const resolved = resolveFEFields(data as Record<string, any>);

  // --- Bangun object update ---
  const updateData: Record<string, any> = {};

  // judul_pekerjaan (accept both 'judul_pekerjaan' and 'title')
  const judul = data.judul_pekerjaan || resolved.judul_pekerjaan || (data as any).title;
  if (judul !== undefined) {
    if (typeof judul !== 'string' || judul.trim() === '') {
      throw new BadRequestError('judul_pekerjaan harus berupa string tidak kosong.');
    }
    updateData.judul_pekerjaan = judul.trim();
  }

  // deskripsi (accept both 'deskripsi' and 'description')
  const desc = data.deskripsi || resolved.deskripsi || (data as any).description;
  if (desc !== undefined) {
    updateData.deskripsi = desc;
  }

  if (data.deadline !== undefined) {
    if (data.deadline && isNaN(Date.parse(data.deadline))) {
      throw new BadRequestError('Format deadline tidak valid.');
    }
    updateData.deadline = data.deadline || null;
  }
  if (data.status !== undefined) {
    if (!['aktif', 'nonaktif'].includes(data.status)) {
      throw new BadRequestError('Status harus "aktif" atau "nonaktif".');
    }
    updateData.status = data.status;
  }

  // Kolom kriteria — accept both id_* and FE labels
  for (const field of KRITERIA_FIELDS) {
    const val = data[field.key] ?? resolved[field.key as keyof typeof resolved];
    if (val !== undefined) {
      updateData[field.kolom] = val;
    }
  }

  // Handle FE label fields for type, salary, etc.
  if ((data as any).type && !updateData.id_tipe) {
    const r = resolveFEFields({ type: (data as any).type });
    if (r.id_tipe) updateData.id_tipe = r.id_tipe;
  }
  if ((data as any).salary && !updateData.id_gaji) {
    const r = resolveFEFields({ salary: (data as any).salary });
    if (r.id_gaji) updateData.id_gaji = r.id_gaji;
  }
  if ((data as any).education && !updateData.id_pendidikan) {
    const r = resolveFEFields({ education: (data as any).education });
    if (r.id_pendidikan) updateData.id_pendidikan = r.id_pendidikan;
  }

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('Tidak ada field yang dikirim untuk diupdate.');
  }

  // Validasi sub_kriteria
  const idSubToValidate: { kolom: string; nilai: number }[] = [];
  for (const field of KRITERIA_FIELDS) {
    const val = updateData[field.kolom];
    if (val !== undefined && typeof val === 'number') {
      idSubToValidate.push({ kolom: field.kolom, nilai: val });
    }
  }

  if (idSubToValidate.length > 0) {
    await validasiSubKriteria(idSubToValidate);
  }

  const { data: updated, error: updateError } = await supabase
    .from('lowongan')
    .update(updateData)
    .eq('id_lowongan', id_lowongan)
    .select()
    .single();

  if (updateError) {
    throw new Error('Gagal mengupdate lowongan: ' + updateError.message);
  }

  return updated as LowonganRow;
}
