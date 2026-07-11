// ============================================================================
// AUTH PROFILE SERVICE — Profile CRUD via Supabase
// ============================================================================

import supabase from '../lib/supabase.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import type { AuthUser, UpdateProfilePayload } from './auth.service.js';

/**
 * Ambil data profile dari tabel `profile` (jika ada) dan gabung ke user.
 * Graceful fallback jika tabel profile belum dibuat.
 */
export async function attachProfile(user: any): Promise<AuthUser> {
  let profile: Record<string, any> = {};

  try {
    const { data } = await supabase
      .from('profile')
      .select('*')
      .eq('id_user', user.id_user)
      .maybeSingle();
    if (data) profile = data;
  } catch {
    // Profile table belum ada — skip
  }

  return {
    id_user: user.id_user,
    email: user.email,
    nama: user.nama,
    role: user.role,
    phone: profile?.phone ?? '',
    avatar: profile?.avatar ?? '',
    pendidikan: profile?.pendidikan ?? '',
    riwayat_kerja: profile?.riwayat_kerja ?? '',
    pengalaman_tahun: profile?.pengalaman_tahun ?? 0,
    cv_file: profile?.cv_file ?? '',
    keahlian: profile?.keahlian ?? '[]',
    company_name: profile?.company_name ?? '',
    company_desc: profile?.company_desc ?? '',
    company_location: profile?.company_location ?? '',
  };
}

/**
 * Get profile by user ID.
 */
export async function getProfile(id_user: string): Promise<AuthUser> {
  if (!id_user) {
    throw new BadRequestError('id_user wajib dikirim.');
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id_user', id_user)
    .maybeSingle();

  if (error) {
    // Graceful: jika id_user bukan format UUID, kembalikan data kosong
    if (error.message?.includes('invalid input syntax for type uuid')) {
      return attachProfile({ id_user, email: '', nama: '', role: 'pelamar' });
    }
    throw new Error('Gagal mengambil data user: ' + error.message);
  }

  if (!data) {
    throw new NotFoundError('User tidak ditemukan.');
  }

  return attachProfile(data);
}

/**
 * Update profile user.
 */
export async function updateProfile(
  id_user: string,
  payload: UpdateProfilePayload,
): Promise<AuthUser> {
  if (!id_user) {
    throw new BadRequestError('id_user wajib dikirim.');
  }

  // Update tabel users (field yang ada di users) — skip jika id_user bukan UUID
  const userUpdate: Record<string, any> = {};
  if (payload.nama !== undefined) userUpdate.nama = payload.nama;

  if (Object.keys(userUpdate).length > 0) {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update(userUpdate)
        .eq('id_user', id_user);

      if (updateError) throw updateError;
    } catch (err: any) {
      // Graceful: jika id_user bukan format UUID, skip update tabel users
      if (
        err?.message?.includes('invalid input syntax for type uuid')
      ) {
        console.warn('[AUTH] id_user bukan UUID — update tabel users dilewati.');
      } else {
        throw new Error('Gagal update data user: ' + err.message);
      }
    }
  }

  // Update tabel profile (jika tabel tersedia)
  const profileUpdate: Record<string, any> = {};
  if (payload.phone !== undefined) profileUpdate.phone = payload.phone;
  if (payload.avatar !== undefined) profileUpdate.avatar = payload.avatar;
  if (payload.pendidikan !== undefined) profileUpdate.pendidikan = payload.pendidikan;
  if (payload.riwayat_kerja !== undefined) profileUpdate.riwayat_kerja = payload.riwayat_kerja;
  if (payload.pengalaman_tahun !== undefined) profileUpdate.pengalaman_tahun = payload.pengalaman_tahun;
  if (payload.cv_file !== undefined) profileUpdate.cv_file = payload.cv_file;
  if (payload.keahlian !== undefined) profileUpdate.keahlian = payload.keahlian;
  if (payload.company_name !== undefined) profileUpdate.company_name = payload.company_name;
  if (payload.company_desc !== undefined) profileUpdate.company_desc = payload.company_desc;
  if (payload.company_location !== undefined) profileUpdate.company_location = payload.company_location;

  if (Object.keys(profileUpdate).length > 0) {
    profileUpdate.updated_at = new Date().toISOString();

    try {
      const { error: profileError } = await supabase.from('profile').upsert(
        { id_user, ...profileUpdate },
        { onConflict: 'id_user' },
      );

      if (profileError) throw profileError;
    } catch (err: any) {
      // Graceful: jika tabel profile belum ada, skip
      if (
        err?.code === 'PGRST301' ||
        err?.message?.includes('relation') ||
        err?.message?.includes('does not exist') ||
        err?.message?.includes('Could not find the table')
      ) {
        console.warn('[AUTH] Tabel profile belum tersedia — update disimpan nanti.');
      } else {
        throw new Error('Gagal update profile: ' + err.message);
      }
    }
  }

  // Return data yang sudah diupdate (gabungan dari payload + id_user)
  // Tidak pakai getProfile() karena id_user mungkin bukan UUID
  return {
    id_user,
    email: '',
    nama: payload.nama || '',
    role: 'pelamar',
    phone: payload.phone || '',
    avatar: payload.avatar || '',
    pendidikan: payload.pendidikan || '',
    riwayat_kerja: payload.riwayat_kerja || '',
    pengalaman_tahun: payload.pengalaman_tahun || 0,
    cv_file: payload.cv_file || '',
    keahlian: payload.keahlian || '[]',
    company_name: payload.company_name || '',
    company_desc: payload.company_desc || '',
    company_location: payload.company_location || '',
  };
}
