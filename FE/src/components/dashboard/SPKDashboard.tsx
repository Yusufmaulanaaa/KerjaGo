import { useState, useEffect } from 'react';
import { rekomendasiService, type SPKResultItem } from '../../services/rekomendasiService';

export default function SPKDashboard() {
  const [results, setResults] = useState<SPKResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRekomendasi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rekomendasiService.getRekomendasi();
      if (res.data.success) {
        setResults(res.data.data.results);
      } else {
        setError(res.data.message || 'Gagal menghitung');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghitung rekomendasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekomendasi();
  }, []);

  const getRankingColor = (ranking: number) => {
    if (ranking === 1) return 'bg-purple-600';
    if (ranking === 2) return 'bg-purple-400';
    if (ranking === 3) return 'bg-purple-300';
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-dark">SPK — Analisis Lowongan</h2>
          <p className="text-xs text-gray-400">
            3 metode SAW, WP, TOPSIS — hasil dihitung otomatis berdasarkan preferensi pelamar
          </p>
        </div>
      </div>

      {/* Tombol Refresh */}
      <div className="mb-5 flex justify-end">
        <button
          onClick={fetchRekomendasi}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memuat...
            </>
          ) : (
            '🔄 Refresh'
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="text-center text-red-500 text-sm py-3 bg-red-50 rounded-xl mb-4">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-400 text-sm py-6">
          <div className="animate-pulse">Menganalisis lowongan dengan 3 metode SPK...</div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !loading && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-brand-dark">
              🏆 Hasil Rekomendasi ({results.length} lowongan)
            </h3>
            <span className="text-[10px] text-gray-400">Ranking SAW / WP / TOPSIS</span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {results.slice(0, 15).map((job) => {
              const rankingSAW = job.saw.ranking;
              const isTop3 = rankingSAW <= 3;
              return (
                <div
                  key={job.id_lowongan}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    isTop3
                      ? 'border-purple-300 bg-purple-50/40'
                      : 'border-gray-100 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0 ${getRankingColor(rankingSAW)}`}>
                      {rankingSAW}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-brand-dark truncate">{job.judul_pekerjaan}</p>
                      <p className="text-xs text-gray-400 truncate">{job.nama_perusahaan}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        WP: #{job.wp.ranking} | TOPSIS: #{job.topsis.ranking}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-xl font-bold text-purple-600">{job.saw.skor.toFixed(4)}</div>
                    <div className="text-[9px] text-gray-400">skor SAW</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && results.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-8">
          <p className="mb-1">📋 Belum ada data rekomendasi</p>
          <p className="text-xs">Pastikan pelamar sudah mengisi preferensi kriteria di Quiz Karir</p>
        </div>
      )}
    </div>
  );
}
