// ============================================================================
// LAMARAN SERVICE (TypeScript) — CRUD lamaran kerja via Supabase
// ============================================================================

import supabase from '../lib/supabase.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import type { LamaranBody, LamaranRow, LamaranWithDetail } from '../types/lamaran.js';

export async function createLamaran(userId: string, payload: LamaranBody): Promise<LamaranRow> {
  if (!userId) throw new BadRequestError('User tidak terautentikasi.');
  if (!payload.id_lowongan) throw new BadRequestError('id_lowongan wajib diisi.');

  const { data: lowongan, error: lowErr } = await supabase
    .from('lowongan')
    .select('id_lowongan, status')
    .eq('id_lowongan', payload.id_lowongan)
    .maybeSingle();

  if (lowErr || !lowongan) throw new BadRequestError('Lowongan tidak ditemukan.');
  if (lowongan.status !== 'aktif') throw new BadRequestError('Lowongan sudah tidak aktif.');

  const { data: existing } = await supabase
    .from('lamaran')
    .select('id_lamaran')
    .eq('id_user', userId)
    .eq('id_lowongan', payload.id_lowongan)
    .maybeSingle();

  if (existing) throw new BadRequestError('Anda sudah melamar di lowongan ini.');

  const { data, error } = await supabase
    .from('lamaran')
    .insert({
      id_user: userId,
      id_lowongan: payload.id_lowongan,
      pesan: payload.pesan || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw new Error('Gagal membuat lamaran: ' + error.message);
  return data as LamaranRow;
}

export async function getLamaranByUser(userId: string): Promise<LamaranWithDetail[]> {
  if (!userId) throw new BadRequestError('User tidak terautentikasi.');

  const { data, error } = await supabase
    .from('lamaran')
    .select('*, lowongan:lowongan(id_lowongan, judul_pekerjaan, perusahaan:perusahaan(nama_perusahaan))')
    .eq('id_user', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Gagal mengambil data lamaran: ' + error.message);

  return (data ?? []).map((row: any) => ({
    id_lamaran: row.id_lamaran,
    id_user: row.id_user,
    id_lowongan: row.id_lowongan,
    status: row.status,
    pesan: row.pesan,
    created_at: row.created_at,
    judul_pekerjaan: row.lowongan?.judul_pekerjaan || null,
    nama_perusahaan: row.lowongan?.perusahaan?.nama_perusahaan || null,
  }));
}

export async function getLamaranByLowongan(idLowongan: number): Promise<LamaranWithDetail[]> {
  const { data, error } = await supabase
    .from('lamaran')
    .select('*, users:users(nama, email)')
    .eq('id_lowongan', idLowongan)
    .order('created_at', { ascending: false });

  if (error) throw new Error('Gagal mengambil data lamaran: ' + error.message);

  return (data ?? []).map((row: any) => ({
    id_lamaran: row.id_lamaran,
    id_user: row.id_user,
    id_lowongan: row.id_lowongan,
    status: row.status,
    pesan: row.pesan,
    created_at: row.created_at,
    nama_perusahaan: row.users?.nama || null,
    judul_pekerjaan: row.users?.email || null,
  }));
}

export async function updateStatusLamaran(
  idLamaran: number,
  status: 'pending' | 'diterima' | 'ditolak'
): Promise<LamaranRow> {
  if (!['pending', 'diterima', 'ditolak'].includes(status)) {
    throw new BadRequestError('Status harus "pending", "diterima", atau "ditolak".');
  }

  const { data, error } = await supabase
    .from('lamaran')
    .update({ status })
    .eq('id_lamaran', idLamaran)
    .select()
    .single();

  if (error) throw new Error('Gagal update status lamaran: ' + error.message);
  if (!data) throw new NotFoundError('Lamaran tidak ditemukan.');
  return data as LamaranRow;
}

export async function deleteLamaran(idLamaran: number): Promise<void> {
  const { error } = await supabase
    .from('lamaran')
    .delete()
    .eq('id_lamaran', idLamaran);

  if (error) throw new Error('Gagal menghapus lamaran: ' + error.message);
}
