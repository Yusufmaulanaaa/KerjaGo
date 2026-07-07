import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useJobs } from '../context/JobContext';
import { rekomendasiService, type SPKResultItem } from '../services/rekomendasiService';

type MetodeTab = 'saw' | 'wp' | 'topsis';

const metodeInfo: Record<MetodeTab, { label: string; icon: string; color: string; bgColor: string; desc: string }> = {
  saw: {
    label: 'SAW',
    icon: '📊',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    desc: 'Simple Additive Weighting — Penjumlahan terbobot',
  },
  wp: {
    label: 'WP',
    icon: '🔢',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    desc: 'Weighted Product — Perkalian terbobot',
  },
  topsis: {
    label: 'TOPSIS',
    icon: '🎯',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    desc: 'Technique for Order Preference by Similarity to Ideal Solution',
  },
};

export default function SPKRekomendasiPage() {
  const { auth } = useJobs();
  const navigate = useNavigate();
  const [metode, setMetode] = useState<MetodeTab>('saw');
  const [results, setResults] = useState<SPKResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jumlahLowongan, setJumlahLowongan] = useState(0);

  // Redirect if not logged in as job seeker
  useEffect(() => {
    if (!auth) {
      navigate('/login');
    } else if (auth.role !== 'pencari-kerja') {
      navigate('/dashboard');
    }
  }, [auth, navigate]);

  const fetchRekomendasi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rekomendasiService.getRekomendasi();
      if (res.data.success) {
        const data = res.data.data;
        setResults(data.results || []);
        setJumlahLowongan(data.jumlah_lowongan || 0);
      } else {
        setError(res.data.message || 'Gagal memuat rekomendasi');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Gagal memuat rekomendasi');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekomendasi();
  }, []);

  // Sorting results berdasarkan metode yang aktif
  const sortedResults = [...results].sort((a, b) => {
    if (metode === 'saw') return a.saw.ranking - b.saw.ranking;
    if (metode === 'wp') return a.wp.ranking - b.wp.ranking;
    return a.topsis.ranking - b.topsis.ranking;
  });

  // Ambil nilai & ranking sesuai metode
  const getNilai = (item: SPKResultItem, metode: MetodeTab) => {
    switch (metode) {
      case 'saw':
        return { nilai: item.saw.skor, ranking: item.saw.ranking };
      case 'wp':
        return { nilai: item.wp.nilai_v, ranking: item.wp.ranking };
      case 'topsis':
        return { nilai: item.topsis.nilai_preferensi, ranking: item.topsis.ranking };
    }
  };

  const getRankingColor = (ranking: number) => {
    if (ranking === 1) return 'bg-yellow-400 text-yellow-900 ring-yellow-300';
    if (ranking === 2) return 'bg-gray-300 text-gray-700 ring-gray-200';
    if (ranking === 3) return 'bg-amber-700 text-white ring-amber-500';
    return 'bg-gray-100 text-gray-500';
  };

  if (!auth || auth.role !== 'pencari-kerja') return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-brand-lime/10 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 bg-brand-lime rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              SPK Rekomendasi Pekerjaan
            </h1>
          </div>
          <p className="text-gray-500 text-sm sm:text-base ml-4">
            Hasil rekomendasi lowongan menggunakan 3 metode SAW, WP, dan TOPSIS
          </p>
        </div>

        {/* Metode Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(Object.keys(metodeInfo) as MetodeTab[]).map((key) => {
            const info = metodeInfo[key];
            return (
              <button
                key={key}
                onClick={() => setMetode(key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                  metode === key
                    ? `${info.bgColor} ${info.color} shadow-sm`
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                }`}
              >
                <span className="text-lg">{info.icon}</span>
                <div className="text-left">
                  <p>{info.label}</p>
                  <p className="text-[10px] font-normal opacity-70">{info.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info + Tombol Hitung Ulang */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {jumlahLowongan > 0
              ? `📋 ${jumlahLowongan} lowongan dianalisis — ${results.length} hasil rekomendasi`
              : 'Belum ada data rekomendasi'}
          </p>
          <button
            onClick={fetchRekomendasi}
            disabled={loading}
            className="bg-brand-dark hover:opacity-90 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menghitung...
              </>
            ) : (
              '🔄 Hitung Ulang'
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm mb-6">
            <p className="font-semibold mb-1">Gagal memuat rekomendasi</p>
            <p>{error}</p>
            {error.includes('Preferensi tidak ditemukan') && (
              <div className="mt-3 bg-white/60 rounded-lg p-3">
                <p className="text-sm">📝 Kamu belum mengisi preferensi kriteria. Silakan isi <strong>Quiz Karir</strong> di halaman <button onClick={() => navigate('/profile')} className="text-brand-dark font-bold underline">Profile</button> terlebih dahulu.</p>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-brand-lime border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Menganalisis lowongan dengan metode {metodeInfo[metode].label}...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && results.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">Belum Ada Rekomendasi</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Isi <strong>Quiz Karir</strong> di halaman Profile untuk mengatur preferensi kriteria, lalu hitung rekomendasi.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-brand-lime text-brand-dark font-semibold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              ✏️ Isi Quiz Karir di Profile
            </button>
          </div>
        )}

        {/* Results Table */}
        {!loading && results.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${metode === 'saw' ? 'bg-blue-50' : metode === 'wp' ? 'bg-emerald-50' : 'bg-purple-50'}`}>
                    <th className="text-left py-4 px-5 font-semibold text-brand-dark">Ranking</th>
                    <th className="text-left py-4 px-5 font-semibold text-brand-dark">Pekerjaan</th>
                    <th className="text-left py-4 px-5 font-semibold text-brand-dark">Perusahaan</th>
                    <th className="text-right py-4 px-5 font-semibold text-brand-dark">
                      Skor ({metodeInfo[metode].label})
                    </th>
                    <th className="text-center py-4 px-5 font-semibold text-brand-dark">
                      SAW
                    </th>
                    <th className="text-center py-4 px-5 font-semibold text-brand-dark">
                      WP
                    </th>
                    <th className="text-center py-4 px-5 font-semibold text-brand-dark">
                      TOPSIS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((item, idx) => {
                    const { nilai, ranking } = getNilai(item, metode);
                    return (
                      <tr
                        key={item.id_lowongan}
                        className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${
                          ranking <= 3 ? 'bg-yellow-50/30' : ''
                        }`}
                      >
                        {/* Ranking */}
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ring-2 ${getRankingColor(ranking)}`}>
                            {ranking}
                          </span>
                        </td>

                        {/* Pekerjaan */}
                        <td className="py-4 px-5">
                          <p className="font-semibold text-brand-dark">{item.judul_pekerjaan}</p>
                        </td>

                        {/* Perusahaan */}
                        <td className="py-4 px-5 text-gray-500">{item.nama_perusahaan}</td>

                        {/* Skor metode aktif */}
                        <td className="py-4 px-5 text-right">
                          <span className={`text-lg font-bold ${
                            metode === 'saw' ? 'text-blue-600' :
                            metode === 'wp' ? 'text-emerald-600' : 'text-purple-600'
                          }`}>
                            {nilai.toFixed(4)}
                          </span>
                        </td>

                        {/* Ranking di 3 metode */}
                        <td className="py-4 px-5 text-center">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            item.saw.ranking <= 3 ? 'bg-blue-50 text-blue-700' : 'text-gray-400'
                          }`}>
                            #{item.saw.ranking}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            item.wp.ranking <= 3 ? 'bg-emerald-50 text-emerald-700' : 'text-gray-400'
                          }`}>
                            #{item.wp.ranking}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            item.topsis.ranking <= 3 ? 'bg-purple-50 text-purple-700' : 'text-gray-400'
                          }`}>
                            #{item.topsis.ranking}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Footer */}
        {!loading && results.length > 0 && (
          <div className="mt-6 bg-white/60 rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Peringkat 1-3 diberi sorotan warna.
              <span className="w-2 h-2 rounded-full bg-blue-100 ml-2"></span>
              Setiap metode menggunakan bobot kriteria dari preferensi yang kamu isi di Quiz Karir.
              Hasil disimpan otomatis di database.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
