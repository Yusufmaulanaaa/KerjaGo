// ============================================================================
// AUTH SERVICE (TypeScript) — Login, Register, Profile via Supabase
// ============================================================================

import supabase from '../lib/supabase.js';
import { BadRequestError } from '../utils/errors.js';
import { attachProfile } from './auth-profile.service.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthUser {
  id_user: string;
  email: string;
  nama: string;
  role: 'pelamar' | 'perusahaan';
  phone?: string;
  avatar?: string;
  // Jobseeker
  pendidikan?: string;
  riwayat_kerja?: string;
  pengalaman_tahun?: number;
  cv_file?: string;
  keahlian?: string; // JSON array string, e.g. '["JavaScript","React"]'
  // Perusahaan (recruiter)
  company_name?: string;
  company_desc?: string;
  company_location?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  nama: string;
  role: 'pelamar' | 'perusahaan';
}

export interface UpdateProfilePayload {
  nama?: string;
  phone?: string;
  avatar?: string;
  pendidikan?: string;
  riwayat_kerja?: string;
  pengalaman_tahun?: number;
  cv_file?: string;
  keahlian?: string; // JSON array string
  company_name?: string;
  company_desc?: string;
  company_location?: string;
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const { email, password } = payload;

  if (!email || !password) {
    throw new BadRequestError('Email dan password wajib diisi.');
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    throw new Error('Gagal mengambil data user: ' + error.message);
  }

  if (!data) {
    throw new BadRequestError('Email tidak terdaftar.');
  }

  if (data.password !== password) {
    throw new BadRequestError('Password salah.');
  }

  return attachProfile(data);
}

// ---------------------------------------------------------------------------
// REGISTER
// ---------------------------------------------------------------------------

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const { email, password, nama, role } = payload;

  if (!email || !password || !nama || !role) {
    throw new BadRequestError('Semua field wajib diisi (email, password, nama, role).');
  }

  // Cek duplikat email
  const { data: existing } = await supabase
    .from('users')
    .select('id_user')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    throw new BadRequestError('Email sudah terdaftar.');
  }

  // Insert user
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      email,
      password,
      nama,
      role,
    })
    .select()
    .single();

  if (insertError) {
    throw new Error('Gagal mendaftarkan user: ' + insertError.message);
  }

  // Buat profile row (graceful jika tabel profile belum ada)
  try {
    await supabase.from('profile').insert({
      id_user: newUser.id_user,
    });
  } catch {
    console.warn('[AUTH] Tabel profile belum tersedia — profile row dibuat nanti.');
  }

  return attachProfile(newUser);
}

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------
