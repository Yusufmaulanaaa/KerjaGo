import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../../context/JobContext';
import { rekomendasiService } from '../../services/rekomendasiService';

interface BobotItem {
  id_kriteria: number;
  label: string;
  icon: string;
  deskripsi: string;
  bobot: number;
}

const kriteriaList: BobotItem[] = [
  {
    id_kriteria: 1,
    label: 'Tipe Pekerjaan',
    icon: '💼',
    deskripsi: 'Full-time, Part-time, Contract, Internship',
    bobot: 3,
  },
  {
    id_kriteria: 2,
    label: 'Gaji',
    icon: '💰',
    deskripsi: 'Range gaji yang diharapkan',
    bobot: 5,
  },
  {
    id_kriteria: 3,
    label: 'Jarak',
    icon: '📍',
    deskripsi: 'Jarak lokasi pekerjaan dari domisili',
    bobot: 3,
  },
  {
    id_kriteria: 4,
    label: 'Pendidikan',
    icon: '🎓',
    deskripsi: 'Tingkat pendidikan minimal',
    bobot: 4,
  },
  {
    id_kriteria: 5,
    label: 'Pengalaman',
    icon: '📅',
    deskripsi: 'Tahun pengalaman kerja',
    bobot: 4,
  },
];

export default function QuizKarir() {
  const { auth } = useJobs();
  const navigate = useNavigate();
  const [bobotList, setBobotList] = useState<BobotItem[]>(kriteriaList);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBobotChange = (id_kriteria: number, value: number) => {
    setBobotList((prev) =>
      prev.map((item) =>
        item.id_kriteria === id_kriteria ? { ...item, bobot: Math.max(1, Math.min(5, value)) } : item
      )
    );
    setSaved(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!auth) return;
    setSaving(true);
    setError(null);

    try {
      const payload = bobotList.map((item) => ({
        id_kriteria: item.id_kriteria,
        bobot: item.bobot,
      }));

      await rekomendasiService.savePreferensi(payload);
      setSaved(true);

      // Auto-redirect to SPK page after 1.5s
      setTimeout(() => {
        navigate('/spk-rekomendasi');
      }, 1500);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Gagal menyimpan preferensi');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <span className="text-lg">📋</span>
        </div>
        <h2 className="text-lg font-bold text-brand-dark">Quiz Karir — Preferensi Kriteria</h2>
      </div>
      <p className="text-gray-400 text-sm mb-6 ml-11">
        Atur tingkat kepentingan setiap kriteria untuk rekomendasi pekerjaan (skala 1–5)
      </p>

      {/* Bobot Sliders */}
      <div className="space-y-5">
        {bobotList.map((item) => (
          <div key={item.id_kriteria}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  <span className="text-xs text-gray-400 ml-2">{item.deskripsi}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBobotChange(item.id_kriteria, item.bobot - 1)}
                  disabled={item.bobot <= 1}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center text-sm font-bold text-gray-500 transition-all"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold text-brand-dark text-sm">{item.bobot}</span>
                <button
                  type="button"
                  onClick={() => handleBobotChange(item.id_kriteria, item.bobot + 1)}
                  disabled={item.bobot >= 5}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center text-sm font-bold text-gray-500 transition-all"
                >
                  +
                </button>
              </div>
            </div>
            {/* Progress bar visual */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  item.bobot <= 2
                    ? 'bg-red-400'
                    : item.bobot <= 3
                    ? 'bg-yellow-400'
                    : item.bobot <= 4
                    ? 'bg-lime-400'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${(item.bobot / 5) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-300">Tidak penting</span>
              <span className="text-[10px] text-gray-300">Sangat penting</span>
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <p className="font-semibold mb-1">Gagal menyimpan</p>
          <p>{error}</p>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {saved && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Preferensi tersimpan! Mengarahkan ke hasil SPK...
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || saved}
          className="bg-brand-dark hover:opacity-90 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </>
          ) : saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tersimpan ✓
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Simpan & Hitung Rekomendasi
            </>
          )}
        </button>
      </div>
    </div>
  );
}
