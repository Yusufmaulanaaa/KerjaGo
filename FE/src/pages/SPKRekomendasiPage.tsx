import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useJobs } from '../context/JobContext';
import { rekomendasiService, type SPKResultItem } from '../services/rekomendasiService';

type MetodeTab = 'saw' | 'wp' | 'topsis';

interface BobotItem {
  id_kriteria: number;
  label: string;
  bobot: number;
}

const defaultKriteria: BobotItem[] = [
  { id_kriteria: 1, label: 'Tipe Pekerjaan', bobot: 3 },
  { id_kriteria: 2, label: 'Gaji', bobot: 5 },
  { id_kriteria: 3, label: 'Jarak', bobot: 3 },
  { id_kriteria: 4, label: 'Pendidikan', bobot: 4 },
  { id_kriteria: 5, label: 'Pengalaman', bobot: 4 },
];

export default function SPKRekomendasiPage() {
  const { auth } = useJobs();
  const navigate = useNavigate();
  const [metode, setMetode] = useState<MetodeTab>('saw');
  const [results, setResults] = useState<SPKResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jumlahLowongan, setJumlahLowongan] = useState(0);
  const [bobotList, setBobotList] = useState<BobotItem[]>(defaultKriteria);
  const [savingBobot, setSavingBobot] = useState(false);
  const [bobotSaved, setBobotSaved] = useState(false);
  const [bobotError, setBobotError] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<SPKResultItem | null>(null);

  useEffect(() => {
    if (!auth) navigate('/login');
    else if (auth.role !== 'pencari-kerja') navigate('/dashboard');
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
      setError(err.response?.data?.message || err.message || 'Gagal memuat rekomendasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRekomendasi(); }, []);

  const handleBobotChange = (id: number, val: number) => {
    setBobotList((prev) => prev.map((i) => i.id_kriteria === id ? { ...i, bobot: Math.max(1, Math.min(5, val)) } : i));
    setBobotSaved(false);
    setBobotError(null);
  };

  const handleSaveBobot = async () => {
    if (!auth) return;
    setSavingBobot(true);
    setBobotError(null);
    try {
      await rekomendasiService.savePreferensi(bobotList.map((i) => ({ id_kriteria: i.id_kriteria, bobot: i.bobot })));
      setBobotSaved(true);
      fetchRekomendasi();
    } catch (err: any) {
      setBobotError(err.response?.data?.message || err.message || 'Gagal menyimpan');
    } finally {
      setSavingBobot(false);
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    if (metode === 'saw') return a.saw.ranking - b.saw.ranking;
    if (metode === 'wp') return a.wp.ranking - b.wp.ranking;
    return a.topsis.ranking - b.topsis.ranking;
  });

  const getNilai = (item: SPKResultItem, m: MetodeTab) => {
    if (m === 'saw') return { nilai: item.saw.skor, ranking: item.saw.ranking };
    if (m === 'wp') return { nilai: item.wp.nilai_v, ranking: item.wp.ranking };
    return { nilai: item.topsis.nilai_preferensi, ranking: item.topsis.ranking };
  };

  if (!auth || auth.role !== 'pencari-kerja') return null;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-brand-dark">SPK Rekomendasi Pekerjaan</h1>
        <p className="text-gray-500 text-sm mt-1">Analisis lowongan berdasarkan preferensi kriteria menggunakan metode SAW, WP, dan TOPSIS</p>
      </div>

      {/* Method Tabs */}
      <div className="border-b border-brand-border bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {(['saw', 'wp', 'topsis'] as MetodeTab[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetode(m)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  metode === m
                    ? 'border-brand-lime text-brand-dark'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ---- SIDEBAR: Bobot ---- */}
          <div className="lg:w-72 shrink-0">
            <div className="border border-brand-border rounded-xl p-5 sticky top-16">
              <h3 className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-4">Bobot Kriteria</h3>
              <div className="space-y-4">
                {bobotList.map((item) => (
                  <div key={item.id_kriteria}>
                    <p className="text-sm text-brand-dark font-medium mb-2 leading-tight">{item.label}</p>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => handleBobotChange(item.id_kriteria, item.bobot - 1)} disabled={item.bobot <= 1}
                        className="w-7 h-7 border border-brand-border rounded-full flex items-center justify-center text-gray-500 hover:border-brand-dark hover:text-brand-dark disabled:opacity-30 transition-colors text-sm font-medium shrink-0">
                        {'\u2212'}
                      </button>
                      <div className="flex-1">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full">
                          <div className="h-full bg-brand-dark rounded-full transition-all" style={{ width: `${(item.bobot / 5) * 100}%` }} />
                        </div>
                      </div>
                      <button type="button" onClick={() => handleBobotChange(item.id_kriteria, item.bobot + 1)} disabled={item.bobot >= 5}
                        className="w-7 h-7 border border-brand-border rounded-full flex items-center justify-center text-gray-500 hover:border-brand-dark hover:text-brand-dark disabled:opacity-30 transition-colors text-sm font-medium shrink-0">
                        {'+'}
                      </button>
                      <span className="w-5 text-center text-sm font-bold text-brand-dark shrink-0">{item.bobot}</span>
                    </div>
                  </div>
                ))}
              </div>

              {bobotError && <p className="mt-3 text-xs text-red-500">{bobotError}</p>}

              <div className="mt-5 space-y-2">
                <button type="button" onClick={handleSaveBobot} disabled={savingBobot}
                  className="w-full bg-brand-dark text-white font-semibold py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                  {savingBobot ? 'Menyimpan...' : 'Simpan & Hitung Ulang'}
                </button>
                {bobotSaved && <p className="text-center text-xs text-brand-dark font-medium">Tersimpan. Rekomendasi diperbarui.</p>}
              </div>
            </div>
          </div>

          {/* ---- MAIN: Hasil ---- */}
          <div className="flex-1 min-w-0">

            {/* Stats */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {jumlahLowongan > 0 ? `${jumlahLowongan} lowongan dianalisis \u2014 ${sortedResults.length} hasil` : 'Belum ada data'}
              </p>
              <button onClick={fetchRekomendasi} disabled={loading}
                className="text-xs text-gray-400 hover:text-brand-dark transition-colors">
                {loading ? 'Memuat...' : 'Refresh'}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="border border-red-200 rounded-xl p-5 mb-5">
                <p className="text-sm text-red-600 font-medium mb-1">Gagal memuat rekomendasi</p>
                <p className="text-sm text-red-400">{error}</p>
                {error.includes('Preferensi tidak ditemukan') && (
                  <p className="text-xs text-gray-500 mt-2">Isi bobot kriteria di panel kiri lalu klik Simpan & Hitung Ulang.</p>
                )}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-4 border-brand-lime border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Menganalisis lowongan...</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && results.length === 0 && (
              <div className="text-center py-20 border border-brand-border rounded-xl">
                <p className="text-gray-400 text-sm">Belum ada rekomendasi. Isi bobot kriteria lalu klik Simpan.</p>
              </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
              <>
                {/* Table */}
                <div className="border border-brand-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-brand-border">
                          <th className="text-left py-3 px-4 font-semibold text-brand-dark text-xs">#</th>
                          <th className="text-left py-3 px-4 font-semibold text-brand-dark text-xs">Pekerjaan</th>
                          <th className="text-left py-3 px-4 font-semibold text-brand-dark text-xs hidden sm:table-cell">Perusahaan</th>
                          <th className="text-right py-3 px-4 font-semibold text-brand-dark text-xs">Skor {metode.toUpperCase()}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedResults.map((item) => {
                          const { nilai, ranking } = getNilai(item, metode);
                          const isActive = selectedDetail?.id_lowongan === item.id_lowongan;
                          return (
                            <tr
                              key={item.id_lowongan}
                              onClick={() => setSelectedDetail(isActive ? null : item)}
                              className={`border-b border-brand-border last:border-0 cursor-pointer transition-colors ${
                                isActive ? 'bg-brand-lime/10' : 'hover:bg-gray-50'
                              }`}
                            >
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                  ranking === 1 ? 'bg-brand-lime text-brand-dark'
                                  : ranking <= 3 ? 'bg-brand-dark text-white'
                                  : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {ranking}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-semibold text-brand-dark">{item.judul_pekerjaan}</p>
                                <p className="text-xs text-gray-400 sm:hidden">{item.nama_perusahaan}</p>
                              </td>
                              <td className="py-3 px-4 text-gray-500 text-xs hidden sm:table-cell">{item.nama_perusahaan}</td>
                              <td className="py-3 px-4 text-right font-bold text-brand-dark">{nilai.toFixed(4)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Detail */}
                {selectedDetail && (
                  <div className="mt-5 border border-brand-border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-brand-dark">{selectedDetail.judul_pekerjaan}</h3>
                        <p className="text-sm text-gray-500">{selectedDetail.nama_perusahaan}</p>
                      </div>
                      <button onClick={() => setSelectedDetail(null)} className="text-gray-300 hover:text-brand-dark transition-colors text-lg">&times;</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {(['saw', 'wp', 'topsis'] as MetodeTab[]).map((m) => {
                        const { nilai, ranking } = getNilai(selectedDetail, m);
                        return (
                          <div key={m} className={`border rounded-lg p-3 ${metode === m ? 'border-brand-lime bg-brand-lime/5' : 'border-brand-border'}`}>
                            <p className="text-xs font-semibold text-brand-dark mb-1">{m.toUpperCase()}</p>
                            <p className="text-lg font-bold text-brand-dark">{nilai.toFixed(4)}</p>
                            <p className="text-xs text-gray-400">Ranking #{ranking}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <p className="mt-4 text-xs text-gray-400">
                  Ranking 1\u20133 disorot. Klik baris untuk melihat detail skor 3 metode.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
