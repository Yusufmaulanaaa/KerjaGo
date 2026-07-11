// ============================================================================
// LOWONGAN — Shared Utilities
// ============================================================================

import supabase from '../../lib/supabase.js';
import { BadRequestError } from '../../utils/errors.js';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** Mapping dari nama kolom (di tabel lowongan) → id_kriteria (di tabel kriteria) */
export const KOLOM_SUB_KRITERIA: Record<string, number> = {
  id_tipe: 1,
  id_gaji: 2,
  id_jarak: 3,
  id_pendidikan: 4,
  id_pengalaman: 5,
};

/** Kebalikan: id_kriteria → nama kolom */
export const KOLOM_KE_ID_KRITERIA: Record<number, string> = {
  1: 'id_tipe',
  2: 'id_gaji',
  3: 'id_jarak',
  4: 'id_pendidikan',
  5: 'id_pengalaman',
};

// ---------------------------------------------------------------------------
// Public Helpers
// ---------------------------------------------------------------------------

/**
 * Validasi bahwa setiap id_sub di idSubCandidate benar-benar ada di tabel
 * sub_kriteria dan milik id_kriteria yang sesuai.
 */
export async function validasiSubKriteria(
  idSubCandidate: { kolom: string; nilai: number }[],
): Promise<void> {
  const ids = idSubCandidate.map((c) => c.nilai);

  const { data: subData, error: subError } = await supabase
    .from('sub_kriteria')
    .select('id_sub, id_kriteria')
    .in('id_sub', ids);

  if (subError) {
    throw new Error('Gagal memvalidasi sub_kriteria: ' + subError.message);
  }

  // Map dari DB
  const dbMap = new Map<number, number>();
  (subData ?? []).forEach((row: any) => {
    dbMap.set(row.id_sub, row.id_kriteria);
  });

  // Periksa tiap entry
  for (const { kolom, nilai } of idSubCandidate) {
    const expectedIdKriteria = KOLOM_SUB_KRITERIA[kolom];

    if (expectedIdKriteria === undefined) {
      throw new BadRequestError(`Kolom "${kolom}" tidak memiliki mapping id_kriteria.`);
    }

    const actualIdKriteria = dbMap.get(nilai);

    if (!actualIdKriteria) {
      throw new BadRequestError(
        `id_sub ${nilai} tidak ditemukan di tabel sub_kriteria untuk kolom "${kolom}".`
      );
    }

    if (actualIdKriteria !== expectedIdKriteria) {
      throw new BadRequestError(
        `id_sub ${nilai} bukan milik kriteria "${kolom}". ` +
        `Sub tsb milik id_kriteria ${actualIdKriteria}.`
      );
    }
  }
}

/**
 * Ambil label (sub_kriteria.nama_sub) untuk kombinasi kolom + id_sub.
 */
export function getSubLabel(
  subMap: Record<string, any>,
  kolom: string,
  idSub: number | null,
): string | null {
  if (idSub == null) return null;
  const record = subMap[`${kolom}_${idSub}`];
  return record?.nama_sub || null;
}

/**
 * Tebak kategori lowongan dari judul pekerjaan.
 */
export function getKategoriFromJudul(judul: string): string {
  const j = judul.toLowerCase();

  // UX / UI Design
  if (j.includes('ui') || j.includes('ux') || j.includes('designer'))
    return 'UX/UI Design';

  // Digital Marketing
  if (j.includes('marketer') || j.includes('marketing') || j.includes('seo') || j.includes('content'))
    return 'Digital Marketing';

  // Web Development (Frontend, Backend, Fullstack)
  if (
    j.includes('frontend') ||
    j.includes('front-end') ||
    j.includes('backend') ||
    j.includes('back-end') ||
    j.includes('fullstack') ||
    j.includes('full-stack') ||
    j.includes('full stack') ||
    j.includes('web developer')
  )
    return 'Web Development';

  // Data Science
  if (
    j.includes('data analyst') ||
    j.includes('data scientist') ||
    j.includes('data')
  )
    return 'Data Science';

  // Mobile Development
  if (
    j.includes('mobile') ||
    j.includes('android') ||
    j.includes('ios') ||
    j.includes('flutter') ||
    j.includes('react native')
  )
    return 'Mobile Development';

  // AI / Machine Learning
  if (
    j.includes('ai engineer') ||
    j.includes('machine learning') ||
    j.includes('deep learning') ||
    j.includes('ai') ||
    j.includes('llm') ||
    j.includes('nlp')
  )
    return 'AI / Machine Learning';

  // DevOps
  if (
    j.includes('devops') ||
    j.includes('sysadmin') ||
    j.includes('infra') ||
    j.includes('sre')
  )
    return 'DevOps';

  // Quality Assurance
  if (
    j.includes('quality') ||
    j.includes('assurance') ||
    j.includes('qa') ||
    j.includes('testing')
  )
    return 'Quality Assurance';

  // Product Management
  if (
    j.includes('product manager') ||
    j.includes('product management') ||
    j.includes('product')
  )
    return 'Product Management';

  return 'Lainnya';
}

// ---------------------------------------------------------------------------
// Batch Loader
// ---------------------------------------------------------------------------

/**
 * Muat SEMUA sub_kriteria dari database untuk keperluan mapping.
 *
 * @returns `subMap` — lookup by `${kolom}_${id_sub}` → record
 *          `labelKeId` — lookup label (lowercase) → id_sub
 */
export async function loadSubKriteria(): Promise<{
  subMap: Record<string, any>;
  labelKeId: Record<string, number>;
}> {
  const { data, error } = await supabase
    .from('sub_kriteria')
    .select('id_sub, id_kriteria, nama_sub, nilai');

  if (error) {
    throw new Error('Gagal memuat sub_kriteria: ' + error.message);
  }

  const subMap: Record<string, any> = {};
  const labelKeId: Record<string, number> = {};

  (data ?? []).forEach((row: any) => {
    const kolom = KOLOM_KE_ID_KRITERIA[row.id_kriteria];
    if (kolom) {
      subMap[`${kolom}_${row.id_sub}`] = row;
    }
    labelKeId[row.nama_sub.toLowerCase()] = row.id_sub;
  });

  return { subMap, labelKeId };
}

/**
 * Cari id_sub berdasarkan label sub_kriteria (case-insensitive).
 */
export function cariIdSub(
  label: string,
  labelKeId: Record<string, number>,
): number | undefined {
  return labelKeId[label.toLowerCase().trim()];
}

// ---------------------------------------------------------------------------
// FE → BE label mapping (for DashboardPage addJob / updateJob)
// ---------------------------------------------------------------------------

const TYPE_LABEL_TO_SUB: Record<string, number> = {
  'full-time': 4,
  'part-time': 2,
  contract: 3,
  internship: 1,
};

const SALARY_LABEL_TO_SUB: Record<string, number> = {
  'rp 0 – rp 5 jt': 5,
  'rp 0 - rp 5 jt': 5,
  'rp 5 jt – rp 10 jt': 6,
  'rp 5 jt - rp 10 jt': 6,
  'rp 10 jt – rp 20 jt': 7,
  'rp 10 jt - rp 20 jt': 7,
  'rp 20 jt – rp 40 jt': 8,
  'rp 20 jt - rp 40 jt': 8,
  'rp 40 jt+': 9,
};

const DISTANCE_LABEL_TO_SUB: Record<string, number> = {
  '< 5 km': 10,
  '< 15 km': 11,
  '< 30 km': 12,
  '< 50 km': 13,
};

const EDUCATION_LABEL_TO_SUB: Record<string, number> = {
  'sma/smk sederajat': 14,
  'diploma (d3/d4)': 15,
  'sarjana (s1)': 16,
  'pascasarjana (s2/s3)': 17,
};

const EXPERIENCE_LABEL_TO_SUB: Record<string, number> = {
  'fresh graduate': 18,
  '1-2 tahun': 19,
  '2-3 tahun': 20,
  '3-5 tahun': 21,
};

/**
 * Resolve FE text labels to sub_kriteria IDs.
 * Returns partial object with resolved id_* fields.
 */
export function resolveFEFields(body: Record<string, any>): {
  id_tipe?: number;
  id_gaji?: number;
  id_jarak?: number;
  id_pendidikan?: number;
  id_pengalaman?: number;
  judul_pekerjaan?: string;
  deskripsi?: string;
  id_perusahaan?: number;
} {
  const resolved: Record<string, any> = {};

  // Map title → judul_pekerjaan
  if (body.title && !body.judul_pekerjaan) {
    resolved.judul_pekerjaan = body.title;
  }

  // Map description → deskripsi
  if (body.description && !body.deskripsi) {
    resolved.deskripsi = body.description;
  }

  // Map type → id_tipe
  if (body.type && !body.id_tipe) {
    const id = TYPE_LABEL_TO_SUB[body.type.toLowerCase()];
    if (id) resolved.id_tipe = id;
  }

  // Map salary → id_gaji
  if (body.salary && !body.id_gaji) {
    const id = SALARY_LABEL_TO_SUB[body.salary.toLowerCase()];
    if (id) resolved.id_gaji = id;
  }

  // Map location → id_jarak (default to 12 = < 30 km)
  if (body.location && !body.id_jarak) {
    resolved.id_jarak = 12;
  }

  // Map education → id_pendidikan
  if (body.education && !body.id_pendidikan) {
    const id = EDUCATION_LABEL_TO_SUB[body.education.toLowerCase()];
    if (id) resolved.id_pendidikan = id;
  }

  // Map experience → id_pengalaman
  if (body.experience && !body.id_pengalaman) {
    const id = EXPERIENCE_LABEL_TO_SUB[body.experience.toLowerCase()];
    if (id) resolved.id_pengalaman = id;
  }

  return resolved;
}

/**
 * Find or create perusahaan by name. Returns id_perusahaan.
 */
export async function resolvePerusahaan(companyName: string): Promise<number> {
  if (!companyName) return 1; // default

  const { data } = await supabase
    .from('perusahaan')
    .select('id_perusahaan')
    .ilike('nama_perusahaan', `%${companyName}%`)
    .limit(1)
    .maybeSingle();

  if (data) return (data as any).id_perusahaan;

  // Create new perusahaan
  const { data: inserted, error } = await supabase
    .from('perusahaan')
    .insert({ nama_perusahaan: companyName })
    .select('id_perusahaan')
    .single();

  if (error) return 1; // fallback
  return (inserted as any).id_perusahaan;
}
