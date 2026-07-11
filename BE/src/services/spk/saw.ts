// ============================================================================
// SPK — SAW (Simple Additive Weighting)
// ============================================================================
// Konsep:
//   SAW adalah metode penjumlahan terbobot. Setiap alternatif diberi skor
//   total yang merupakan jumlah dari nilai kriteria yang sudah dinormalisasi
//   dikalikan bobot masing-masing kriteria.
//
// Rumus:
//   1. Normalisasi Matriks X:
//        - Benefit (semakin besar semakin baik):
//            r_ij = X_ij / max_i(X_ij)
//            → nilai dibagi nilai maksimum pada kolom tersebut
//        - Cost (semakin kecil semakin baik):
//            r_ij = min_i(X_ij) / X_ij
//            → nilai minimum kolom dibagi nilai
//
//   2. Skor Total untuk setiap alternatif:
//        V_i = Σ_{j=1}^{n} w_j × r_ij
//        dimana w_j = bobot kriteria ke-j
//
//   3. Ranking: V_i tertinggi = peringkat 1 (terbaik)
//
// Safety: Jika max(X_j) = 0, hasil normalisasi benefit = 0.
//         Jika X_ij = 0 untuk cost, hasil normalisasi cost = 0.
// ============================================================================

/**
 * Hitung SAW (Simple Additive Weighting).
 *
 * @param X Matriks keputusan [alternatif][kriteria]
 * @param bobot Bobot setiap kriteria
 * @param atribut Array 'benefit' | 'cost' untuk setiap kriteria
 * @returns Array { index, skor, ranking } diurutkan peringkat
 */
export function calculateSAW(
  X: number[][],
  bobot: number[],
  atribut: string[],
): { index: number; skor: number; ranking: number }[] {
  const jumlahAlternatif = X.length; // m
  const jumlahKriteria = X[0].length; // n

  // --- Langkah 1: Cari nilai MAX dan MIN untuk setiap kolom (kriteria) ---
  const maxCol = new Array(jumlahKriteria).fill(-Infinity);
  const minCol = new Array(jumlahKriteria).fill(Infinity);

  for (let j = 0; j < jumlahKriteria; j++) {
    for (let i = 0; i < jumlahAlternatif; i++) {
      if (X[i][j] > maxCol[j]) maxCol[j] = X[i][j];
      if (X[i][j] < minCol[j]) minCol[j] = X[i][j];
    }
  }

  // --- Langkah 2: Normalisasi Matriks X menjadi Matriks R ---
  // R[i][j] = nilai ternormalisasi
  const R = X.map((row) =>
    row.map((x, j) => {
      const attr = atribut[j]; // 'benefit' atau 'cost'

      if (attr === 'benefit') {
        // BENEFIT: r_ij = X_ij / max(X_j)
        // Safety: jika maxCol[j] = 0, hasil normalisasi = 0
        return maxCol[j] !== 0 ? x / maxCol[j] : 0;
      } else {
        // COST: r_ij = min(X_j) / X_ij
        // Safety: jika X_ij = 0, hasil normalisasi = 0 (hindari ∞)
        return x !== 0 ? minCol[j] / x : 0;
      }
    }),
  );

  // --- Langkah 3: Hitung Skor Total V_i = Σ w_j × r_ij ---
  const skorTotal = R.map((row) => {
    let total = 0;
    for (let j = 0; j < jumlahKriteria; j++) {
      total += bobot[j] * row[j];
    }
    return total;
  });

  // --- Langkah 4: Buat Ranking (skor tertinggi = ranking 1) ---
  return skorTotal
    .map((skor, i) => ({ index: i, skor }))
    .sort((a, b) => b.skor - a.skor) // urut DESC
    .map((item, rank) => ({
      ...item,
      ranking: rank + 1,
    }));
}
