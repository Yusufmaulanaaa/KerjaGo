import { useJobs } from '../../context/JobContext';
import { useNavigate } from 'react-router-dom';

export default function RekomendasiJobs() {
  const { auth } = useJobs();
  const navigate = useNavigate();

  if (auth?.role !== 'pencari-kerja') return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-dark">Rekomendasi Pekerjaan (SPK)</h2>
          <p className="text-xs text-gray-400">
            3 metode SAW, WP, dan TOPSIS — hasil dihitung otomatis oleh sistem
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-sm text-gray-600 mb-4">
          Fitur rekomendasi pekerjaan sekarang menggunakan 3 metode SPK
          yang bisa kamu akses di halaman terpisah.
        </p>
        <button
          onClick={() => navigate('/spk-rekomendasi')}
          className="bg-brand-lime text-brand-dark font-semibold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
        >
          🔍 Lihat SPK Rekomendasi
        </button>
      </div>
    </div>
  );
}
