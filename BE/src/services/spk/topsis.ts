// ============================================================================
// SPK — TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
// ============================================================================
// Konsep:
//   TOPSIS memilih alternatif yang terdekat dengan Solusi Ideal Positif (A+)
//   dan terjauh dari Solusi Ideal Negatif (A-).
//
// Rumus:
//   1. Normalisasi Matriks Keputusan:
//        r_ij = X_ij / √( Σ_{i=1}^{m} X_ij² )
//        (setiap nilai dibagi akar jumlah kuadrat sekolom)
//
//   2. Matriks Ternormalisasi Terbobot:
//        y_ij = w_j × r_ij
//
//   3. Solusi Ideal:
//        A+_j = max_i(y_ij)  jika benefit
//             = min_i(y_ij)  jika cost
//        A-_j = min_i(y_ij)  jika benefit
//             = max_i(y_ij)  jika cost
//
//   4. Jarak Solusi (Euclidean Distance):
//        D+_i = √( Σ_{j=1}^{n} (y_ij - A+_j)² )
//        D-_i = √( Σ_{j=1}^{n} (y_ij - A-_j)² )
//
//   5. Nilai Preferensi Relatif:
//        V_i = D-_i / (D+_i + D-_i)
//        Semakin besar V_i, semakin dekat ke solusi ideal.
//
//   6. Ranking: V_i tertinggi = peringkat 1 (terbaik)
//
// Safety: Jika D+_i + D-_i = 0 (alternatif = A+ = A-), set V_i = 1.
//         Jika penyebut normalisasi = 0, r_ij = 0.
// ============================================================================

/**
 * Hitung TOPSIS (Technique for Order Preference by Similarity to Ideal Solution).
 *
 * @param X Matriks keputusan [alternatif][kriteria]
 * @param bobot Bobot setiap kriteria
 * @param atribut Array 'benefit' | 'cost' untuk setiap kriteria
 * @returns Array { index, d_plus, d_minus, nilai_preferensi, ranking } diurutkan peringkat
 */
export function calculateTOPSIS(
  X: number[][],
  bobot: number[],
  atribut: string[],
): {
  index: number;
  d_plus: number;
  d_minus: number;
  nilai_preferensi: number;
  ranking: number;
}[] {
  const jumlahAlternatif = X.length;
  const jumlahKriteria = X[0].length;

  // --- Langkah 1: Normalisasi Matriks ---
  // r_ij = X_ij / √( Σ X_ij² )
  // Hitung dulu akar jumlah kuadrat tiap kolom
  const sqrtSumSquareCol = new Array(jumlahKriteria).fill(0);
  for (let j = 0; j < jumlahKriteria; j++) {
    let sumSquare = 0;
    for (let i = 0; i < jumlahAlternatif; i++) {
      sumSquare += X[i][j] * X[i][j];
    }
    sqrtSumSquareCol[j] = Math.sqrt(sumSquare);
  }

  // Matriks ternormalisasi R
  const R = X.map((row) =>
    row.map((x, j) => {
      // Safety: jika sqrtSumSquare = 0, r_ij = 0
      return sqrtSumSquareCol[j] !== 0 ? x / sqrtSumSquareCol[j] : 0;
    }),
  );

  // --- Langkah 2: Matriks Ternormalisasi Terbobot Y ---
  // y_ij = w_j × r_ij
  const Y = R.map((row) => row.map((r, j) => r * bobot[j]));

  // --- Langkah 3: Tentukan Solusi Ideal Positif (A+) dan Negatif (A-) ---
  const A_plus = new Array(jumlahKriteria);
  const A_minus = new Array(jumlahKriteria);

  for (let j = 0; j < jumlahKriteria; j++) {
    // Ambil semua nilai pada kolom j
    const colValues = Y.map((row) => row[j]);
    const maxVal = Math.max(...colValues);
    const minVal = Math.min(...colValues);

    if (atribut[j] === 'benefit') {
      // Benefit: max = ideal positif, min = ideal negatif
      A_plus[j] = maxVal;
      A_minus[j] = minVal;
    } else {
      // Cost: min = ideal positif, max = ideal negatif
      A_plus[j] = minVal;
      A_minus[j] = maxVal;
    }
  }

  // --- Langkah 4: Hitung Jarak D+ dan D- (Euclidean Distance) ---
  const D_plus = Y.map((row) => {
    let sum = 0;
    for (let j = 0; j < jumlahKriteria; j++) {
      sum += (row[j] - A_plus[j]) ** 2;
    }
    return Math.sqrt(sum);
  });

  const D_minus = Y.map((row) => {
    let sum = 0;
    for (let j = 0; j < jumlahKriteria; j++) {
      sum += (row[j] - A_minus[j]) ** 2;
    }
    return Math.sqrt(sum);
  });

  // --- Langkah 5: Hitung Nilai Preferensi ---
  // V_i = D-_i / (D+_i + D-_i)
  // Safety: jika D+ + D- = 0 (alternatif = A+ = A-), set V = 1
  const V = D_minus.map((dm, i) => {
    const denom = D_plus[i] + dm;
    if (denom === 0) {
      // Alternatif ini identik dengan solusi ideal (biasanya hanya 1 alt)
      return 1;
    }
    return dm / denom;
  });

  // --- Langkah 6: Buat Ranking (V tertinggi = ranking 1) ---
  return D_plus.map((dp, i) => ({
    index: i,
    d_plus: dp,
    d_minus: D_minus[i],
    nilai_preferensi: V[i],
  }))
    .sort((a, b) => b.nilai_preferensi - a.nilai_preferensi)
    .map((item, rank) => ({
      ...item,
      ranking: rank + 1,
    }));
}
