// ---------------------------------------------------------------------------
// SEEDER HELPERS — Utility functions for generating lowongan and career notes
// ---------------------------------------------------------------------------

/** Ambil angka acak dalam rentang [min, max] (inklusif). */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pilih elemen acak dari array. */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Buat tanggal ISO acak antara 10–30 hari ke depan. */
export function randomFutureDate(): string {
  const daysAhead = randInt(10, 30);
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/** Generate satu data lowongan acak dengan deskripsi spesifik sesuai judul dan perusahaan. */
export function generateLowongan(
  judulPool: string[],
  perusahaanPool: { id: number; nama: string }[],
  deskripsiPerJudul: Record<string, { id_perusahaan: number; deskripsi: string }[]>,
  deskripsiFallback: string[]
) {
  const judul = pickRandom(judulPool);
  const deskripsiPool = deskripsiPerJudul[judul];

  let id_perusahaan: number;
  let deskripsi: string;

  if (deskripsiPool && deskripsiPool.length > 0) {
    const entry = pickRandom(deskripsiPool);
    id_perusahaan = entry.id_perusahaan;
    deskripsi = entry.deskripsi;
  } else {
    id_perusahaan = pickRandom(perusahaanPool).id;
    deskripsi = pickRandom(deskripsiFallback);
  }

  return {
    id_perusahaan,
    judul_pekerjaan: judul,
    deskripsi,
    deadline: randomFutureDate(),
    status: 'aktif',
    id_tipe: randInt(1, 4),
    id_gaji: randInt(5, 9),
    id_jarak: randInt(10, 13),
    id_pendidikan: randInt(14, 17),
    id_pengalaman: randInt(18, 21),
  };
}

/** Generate batch data lowongan — pastikan setiap judul muncul minimal 1x. */
export function generateLowonganBatch(
  judulPool: string[],
  perusahaanPool: { id: number; nama: string }[],
  deskripsiPerJudul: Record<string, { id_perusahaan: number; deskripsi: string }[]>,
  batchSize: number,
  deskripsiFallback: string[]
) {
  // Pastikan setiap judul pekerjaan muncul minimal 1x
  const guaranteed: ReturnType<typeof generateLowongan>[] = judulPool.map((judul) => {
    const deskripsiPool = deskripsiPerJudul[judul];
    let id_perusahaan: number;
    let deskripsi: string;

    if (deskripsiPool && deskripsiPool.length > 0) {
      const entry = pickRandom(deskripsiPool);
      id_perusahaan = entry.id_perusahaan;
      deskripsi = entry.deskripsi;
    } else {
      id_perusahaan = pickRandom(perusahaanPool).id;
      deskripsi = pickRandom(deskripsiFallback);
    }

    return {
      id_perusahaan,
      judul_pekerjaan: judul,
      deskripsi,
      deadline: randomFutureDate(),
      status: 'aktif',
      id_tipe: randInt(1, 4),
      id_gaji: randInt(5, 9),
      id_jarak: randInt(10, 13),
      id_pendidikan: randInt(14, 17),
      id_pengalaman: randInt(18, 21),
    };
  });

  // Sisa batch sisanya diacak
  const remaining = Math.max(0, batchSize - guaranteed.length);
  const randomOnes = Array.from({ length: remaining }, () =>
    generateLowongan(judulPool, perusahaanPool, deskripsiPerJudul, deskripsiFallback)
  );

  return [...guaranteed, ...randomOnes];
}