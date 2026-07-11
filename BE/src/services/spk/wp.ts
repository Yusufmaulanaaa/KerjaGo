// ============================================================================
// SPK — WP (Weighted Product)
// ============================================================================
// Konsep:
//   WP menggunakan perkalian (product) untuk menghubungkan nilai kriteria,
//   dimana setiap nilai dipangkatkan dengan bobot yang telah dinormalisasi.
//
// Rumus:
//   1. Normalisasi Bobot:
//        w_j = bobot_j / Σ_{j=1}^{n} bobot_j
//        sehingga Σ w_j = 1
//
//   2. Vektor S (Preferensi):
//        S_i = ∏_{j=1}^{n} X_{ij}^{w_j'}
//        dimana:
//          - Benefit: w_j' = +w_j (pangkat positif — nilai besar lebih baik)
//          - Cost:    w_j' = -w_j (pangkat negatif — nilai kecil lebih baik)
//
//   3. Vektor V (Normalisasi S):
//        V_i = S_i / Σ_{i=1}^{m} S_i
//        sehingga total V = 1
//
//   4. Ranking: V_i tertinggi = peringkat 1 (terbaik)
//
// Safety: Jika X_ij = 0, kita substitusi dengan 1×10⁻¹⁰ agar tidak
//         menghasilkan 0^w = 0 yang menghilangkan pengaruh alternatif.
// ============================================================================

/**
 * Hitung WP (Weighted Product).
 *
 * @param X Matriks keputusan [alternatif][kriteria]
 * @param bobot Bobot setiap kriteria
 * @param atribut Array 'benefit' | 'cost' untuk setiap kriteria
 * @returns Array { index, nilai_s, nilai_v, ranking } diurutkan peringkat
 */
export function calculateWP(
  X: number[][],
  bobot: number[],
  atribut: string[],
): { index: number; nilai_s: number; nilai_v: number; ranking: number }[] {
  const jumlahAlternatif = X.length;
  const jumlahKriteria = X[0].length;

  // --- Langkah 1: Normalisasi Bobot (Σ w = 1) ---
  const totalBobot = bobot.reduce((a, b) => a + b, 0);
  if (totalBobot === 0) {
    throw new Error('Total bobot kriteria tidak boleh 0.');
  }
  const wNorm = bobot.map((b) => b / totalBobot);

  // --- Langkah 2: Hitung Vektor S ---
  // S_i = ∏ X_ij^{w_j}
  //   - benefit → pangkat positif (+w_j)
  //   - cost    → pangkat negatif (-w_j)
  const S = X.map((row) => {
    let product = 1;
    for (let j = 0; j < jumlahKriteria; j++) {
      const attr = atribut[j];
      const exponent = attr === 'benefit' ? wNorm[j] : -wNorm[j];

      if (row[j] === 0) {
        // Safety: hindari 0^negatif = ∞ atau 0^positif = 0
        // Gunakan nilai sangat kecil sebagai pengganti
        // Untuk cost: exponent negatif → (1e-10)^{-w} = sangat besar (benar, 0 = biaya terbaik)
        // Untuk benefit: exponent positif → (1e-10)^{+w} = sangat kecil (benar, 0 = buruk)
        product *= Math.pow(1e-10, exponent);
        continue;
      }

      product *= Math.pow(row[j], exponent);
    }
    return product;
  });

  // --- Langkah 3: Hitung Vektor V (Normalisasi S) ---
  const totalS = S.reduce((a, b) => a + b, 0);
  // Safety: jika totalS = 0, semua V_i = 0 (tidak ada preferensi)
  const V = S.map((s) => (totalS !== 0 ? s / totalS : 0));

  // --- Langkah 4: Buat Ranking (V tertinggi = ranking 1) ---
  return S.map((nilai_s, i) => ({ index: i, nilai_s, nilai_v: V[i] }))
    .sort((a, b) => b.nilai_v - a.nilai_v) // urut DESC berdasarkan V
    .map((item, rank) => ({
      ...item,
      ranking: rank + 1,
    }));
}
