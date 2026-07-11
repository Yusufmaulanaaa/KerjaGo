// ============================================================================
// MASTER DATA SEEDER — kriteria, sub_kriteria, perusahaan
// ============================================================================

import supabase from '../../lib/supabase.js';

const KRITERIA_DATA = [
  { id_kriteria: 1, nama_kriteria: 'Tipe Pekerjaan', atribut: 'benefit', bobot_default: 3 },
  { id_kriteria: 2, nama_kriteria: 'Gaji', atribut: 'benefit', bobot_default: 5 },
  { id_kriteria: 3, nama_kriteria: 'Jarak', atribut: 'cost', bobot_default: 3 },
  { id_kriteria: 4, nama_kriteria: 'Pendidikan', atribut: 'benefit', bobot_default: 4 },
  { id_kriteria: 5, nama_kriteria: 'Pengalaman', atribut: 'benefit', bobot_default: 4 },
];

const SUB_KRITERIA_DATA = [
  // Tipe Pekerjaan (id_kriteria: 1)
  { id_sub: 1, id_kriteria: 1, nama_sub: 'Internship', nilai: 1 },
  { id_sub: 2, id_kriteria: 1, nama_sub: 'Part-time', nilai: 2 },
  { id_sub: 3, id_kriteria: 1, nama_sub: 'Contract', nilai: 3 },
  { id_sub: 4, id_kriteria: 1, nama_sub: 'Full-time', nilai: 4 },
  // Gaji (id_kriteria: 2)
  { id_sub: 5, id_kriteria: 2, nama_sub: 'Rp 0 – Rp 5 Jt', nilai: 1 },
  { id_sub: 6, id_kriteria: 2, nama_sub: 'Rp 5 Jt – Rp 10 Jt', nilai: 2 },
  { id_sub: 7, id_kriteria: 2, nama_sub: 'Rp 10 Jt – Rp 20 Jt', nilai: 3 },
  { id_sub: 8, id_kriteria: 2, nama_sub: 'Rp 20 Jt – Rp 40 Jt', nilai: 4 },
  { id_sub: 9, id_kriteria: 2, nama_sub: 'Rp 40 Jt+', nilai: 5 },
  // Jarak (id_kriteria: 3)
  { id_sub: 10, id_kriteria: 3, nama_sub: '< 5 km', nilai: 1 },
  { id_sub: 11, id_kriteria: 3, nama_sub: '< 15 km', nilai: 2 },
  { id_sub: 12, id_kriteria: 3, nama_sub: '< 30 km', nilai: 3 },
  { id_sub: 13, id_kriteria: 3, nama_sub: '< 50 km', nilai: 4 },
  // Pendidikan (id_kriteria: 4)
  { id_sub: 14, id_kriteria: 4, nama_sub: 'SMA/SMK Sederajat', nilai: 1 },
  { id_sub: 15, id_kriteria: 4, nama_sub: 'Diploma (D3/D4)', nilai: 2 },
  { id_sub: 16, id_kriteria: 4, nama_sub: 'Sarjana (S1)', nilai: 3 },
  { id_sub: 17, id_kriteria: 4, nama_sub: 'Pascasarjana (S2/S3)', nilai: 4 },
  // Pengalaman (id_kriteria: 5)
  { id_sub: 18, id_kriteria: 5, nama_sub: 'Fresh Graduate', nilai: 1 },
  { id_sub: 19, id_kriteria: 5, nama_sub: '1-2 Tahun', nilai: 2 },
  { id_sub: 20, id_kriteria: 5, nama_sub: '2-3 Tahun', nilai: 3 },
  { id_sub: 21, id_kriteria: 5, nama_sub: '3-5 Tahun', nilai: 4 },
];

const PERUSAHAAN_DATA = [
  { id_perusahaan: 1, nama_perusahaan: 'PT Telkom Indonesia (Persero) Tbk', email: 'hr@telkom.co.id', kota: 'Jakarta', deskripsi: 'Badan Usaha Milik Negara di bidang telekomunikasi.' },
  { id_perusahaan: 3, nama_perusahaan: 'PT Bank Negara Indonesia (Persero) Tbk', email: 'hr@bni.co.id', kota: 'Jakarta', deskripsi: 'Bank BUMN terkemuka di Indonesia.' },
  { id_perusahaan: 4, nama_perusahaan: 'PT Bank Mandiri (Persero) Tbk', email: 'hr@mandiri.co.id', kota: 'Jakarta', deskripsi: 'Bank terbesar di Indonesia berdasarkan aset.' },
  { id_perusahaan: 5, nama_perusahaan: 'PT Pertamina (Persero)', email: 'hr@pertamina.co.id', kota: 'Jakarta', deskripsi: 'Perusahaan energi nasional.' },
  { id_perusahaan: 6, nama_perusahaan: 'PT Bank Rakyat Indonesia (Persero) Tbk', email: 'hr@bri.co.id', kota: 'Jakarta', deskripsi: 'Bank BUMN dengan jaringan terluas.' },
  { id_perusahaan: 7, nama_perusahaan: 'PT PLN (Persero)', email: 'hr@pln.co.id', kota: 'Jakarta', deskripsi: 'Perusahaan listrik negara.' },
  { id_perusahaan: 8, nama_perusahaan: 'PT Garuda Indonesia (Persero) Tbk', email: 'hr@garuda.co.id', kota: 'Jakarta', deskripsi: 'Maskapai penerbangan nasional.' },
  { id_perusahaan: 9, nama_perusahaan: 'PT Perusahaan Listrik Negara (Persero)', email: 'hr@pln.co.id', kota: 'Jakarta', deskripsi: 'Penyedia listrik nasional.' },
  { id_perusahaan: 10, nama_perusahaan: 'PT Angkasa Pura I (Persero)', email: 'hr@angkasapura1.co.id', kota: 'Jakarta', deskripsi: 'Pengelola bandar udara.' },
  { id_perusahaan: 11, nama_perusahaan: 'PT Bio Farma (Persero)', email: 'hr@biofarma.co.id', kota: 'Bandung', deskripsi: 'Produsen vaksin dan farmasi.' },
];

const DEMO_USERS = [
  { email: 'pelamar@gmail.com', password: '123', nama: 'Pelamar Demo', role: 'pelamar' },
  { email: 'rekruter@gmail.com', password: '123', nama: 'Rekruter Demo', role: 'perusahaan' },
];

export async function seedDemoUsers(): Promise<void> {
  for (const user of DEMO_USERS) {
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('email', user.email);

    if ((count ?? 0) === 0) {
      console.log(`[MASTER SEED] Inserting demo user: ${user.email}...`);
      const { data, error } = await supabase.from('users').insert(user).select().single();
      if (error) {
        console.error(`[MASTER SEED] Gagal insert user ${user.email}:`, error.message);
      } else {
        await supabase.from('profile').insert({ id_user: data.id_user }).select();
        console.log(`[MASTER SEED] ✅ Demo user ${user.email} inserted.`);
      }
    } else {
      console.log(`[MASTER SEED] User ${user.email} sudah ada — skip.`);
    }
  }
}

export async function seedMasterData(): Promise<void> {
  // ── Seed perusahaan ──
  const { count: cntPerusahaan } = await supabase
    .from('perusahaan')
    .select('*', { count: 'exact', head: true });

  if ((cntPerusahaan ?? 0) === 0) {
    console.log('[MASTER SEED] Inserting 10 perusahaan...');
    const { error } = await supabase.from('perusahaan').insert(PERUSAHAAN_DATA);
    if (error) {
      console.error('[MASTER SEED] Gagal insert perusahaan:', error.message);
    } else {
      console.log('[MASTER SEED] ✅ 10 perusahaan inserted.');
    }
  } else {
    console.log(`[MASTER SEED] Perusahaan sudah ada ${cntPerusahaan} — skip.`);
  }

  // ── Seed kriteria ──
  const { count: cntKriteria } = await supabase
    .from('kriteria')
    .select('*', { count: 'exact', head: true });

  if ((cntKriteria ?? 0) === 0) {
    console.log('[MASTER SEED] Inserting 5 kriteria...');
    const { error } = await supabase.from('kriteria').insert(KRITERIA_DATA);
    if (error) {
      console.error('[MASTER SEED] Gagal insert kriteria:', error.message);
    } else {
      console.log('[MASTER SEED] ✅ 5 kriteria inserted.');
    }
  } else {
    console.log(`[MASTER SEED] Kriteria sudah ada ${cntKriteria} — skip.`);
  }

  // ── Seed sub_kriteria ──
  const { count: cntSub } = await supabase
    .from('sub_kriteria')
    .select('*', { count: 'exact', head: true });

  if ((cntSub ?? 0) === 0) {
    console.log('[MASTER SEED] Inserting 21 sub_kriteria...');
    const { error } = await supabase.from('sub_kriteria').insert(SUB_KRITERIA_DATA);
    if (error) {
      console.error('[MASTER SEED] Gagal insert sub_kriteria:', error.message);
    } else {
      console.log('[MASTER SEED] ✅ 21 sub_kriteria inserted.');
    }
  } else {
    console.log(`[MASTER SEED] Sub_kriteria sudah ada ${cntSub} — skip.`);
  }
}
