import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import type { UserProfile } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RekomendasiJobs from '../components/profile/RekomendasiJobs';
import QuizKarir from '../components/profile/QuizKarir';

export default function ProfilePage() {
  const { auth, profile, fetchProfile, updateProfile } = useJobs();
  const navigate = useNavigate();

  // Fetch profile from backend on mount
  useEffect(() => {
    if (auth) {
      fetchProfile();
    }
  }, [auth]);

  // If not logged in, redirect to login
  useEffect(() => {
    if (!auth) {
      navigate('/login');
    }
  }, [auth, navigate]);

  const role = auth?.role === 'perusahaan' ? 'recruiter' : 'jobseeker';
  const [simulatedRole, setSimulatedRole] = useState<'jobseeker' | 'recruiter'>(role);

  // Sync simulatedRole when auth (role) changes
  useEffect(() => {
    setSimulatedRole(role);
  }, [role]);

  const toggleRole = () => {
    const nextRole = simulatedRole === 'jobseeker' ? 'recruiter' : 'jobseeker';
    setSimulatedRole(nextRole);
    setForm((prev) => ({
      ...prev,
      role: nextRole,
    }));
    setSaved(false);
  };

  const resetProfile = () => {
    if (window.confirm('Reset profil akan menghapus semua data profil. Lanjutkan?')) {
      localStorage.removeItem('kerjago_profile');
      setForm({
        role: simulatedRole,
        name: auth?.name || '',
        email: auth?.email || '',
        phone: '',
        avatar: '',
        pendidikan: '',
        riwayatKerja: '',
        pengalamanTahun: undefined,
        cvFile: '',
        companyName: auth?.companyName || '',
        companyDesc: '',
        companyLocation: '',
      });
      setSaved(false);
    }
  };

  // Initialize form state from existing profile or defaults
  const [form, setForm] = useState<UserProfile>({
    role: role,
    name: profile?.name || auth?.name || '',
    email: profile?.email || auth?.email || '',
    phone: profile?.phone || '',
    avatar: profile?.avatar || '',
    // Jobseeker fields
    pendidikan: profile?.pendidikan || '',
    riwayatKerja: profile?.riwayatKerja || '',
    pengalamanTahun: profile?.pengalamanTahun || undefined,
    cvFile: profile?.cvFile || '',
    // Recruiter fields
    companyName: profile?.companyName || auth?.companyName || '',
    companyDesc: profile?.companyDesc || '',
    companyLocation: profile?.companyLocation || '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setForm((prev) => ({ ...prev, avatar: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Store just the filename for display, in production would upload
    setForm((prev) => ({ ...prev, cvFile: file.name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Validate required fields
    if (!form.name || !form.email || !form.phone) {
      alert('Harap isi Nama, Email, dan No. HP terlebih dahulu.');
      setSaving(false);
      return;
    }

    if (simulatedRole === 'jobseeker' && !form.pendidikan) {
      alert('Harap pilih Pendidikan Terakhir.');
      setSaving(false);
      return;
    }

    if (simulatedRole === 'recruiter' && (!form.companyName || !form.companyLocation)) {
      alert('Harap isi Nama Perusahaan dan Lokasi Kantor.');
      setSaving(false);
      return;
    }

    try {
      await updateProfile({ ...form, role: simulatedRole });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('Gagal menyimpan profil: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (!auth) return null;

  // Summary helper
  const summaryItems: string[] = [];
  if (simulatedRole === 'jobseeker') {
    if (form.pendidikan) summaryItems.push(`Pendidikan: ${form.pendidikan}`);
    if (form.pengalamanTahun !== undefined && form.pengalamanTahun > 0)
      summaryItems.push(`${form.pengalamanTahun} tahun pengalaman`);
    if (form.cvFile) summaryItems.push('CV siap');
  } else {
    if (form.companyName) summaryItems.push(form.companyName);
    if (form.companyLocation) summaryItems.push(form.companyLocation);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-brand-lime/10 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 bg-brand-lime rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">Profil Saya</h1>
          </div>
          <p className="text-gray-500 text-sm sm:text-base ml-4">
            Lengkapi data diri untuk pengalaman melamar yang lebih cepat
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* ===== LEFT COLUMN ===== */}
            <div className="lg:col-span-4 space-y-6">
              {/* Avatar Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="relative inline-block group mb-4">
                  <div className="w-28 h-28 rounded-full bg-linear-to-br from-brand-lime/50 to-brand-lime/20 flex items-center justify-center overflow-hidden ring-4 ring-brand-lime/30 mx-auto transition-transform group-hover:scale-105 duration-300">
                    {form.avatar ? (
                      <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-brand-dark/50">
                        {form.name ? form.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                  {/* Camera overlay */}
                  <label className="absolute bottom-0 right-4 w-9 h-9 bg-brand-dark text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-700 transition-all hover:scale-110">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-brand-dark">{form.name || 'Belum diisi'}</h2>
                <p className="text-gray-400 text-sm">{form.email}</p>
                <span className={`inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-semibold ${
                  simulatedRole === 'jobseeker'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-purple-50 text-purple-700'
                }`}>
                  {simulatedRole === 'jobseeker' ? '🔍 Job Seeker' : '🏢 Recruiter'}
                </span>
              </div>

              {/* Summary Card */}
              {summaryItems.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-lime" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Ringkasan Profil
                  </h3>
                  <ul className="space-y-2">
                    {summaryItems.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-lime shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Role Toggle + Reset */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
                <button
                  type="button"
                  onClick={toggleRole}
                  className="w-full flex items-center justify-center gap-2 bg-brand-lime/20 hover:bg-brand-lime/40 text-brand-dark font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Toggle ke {simulatedRole === 'jobseeker' ? 'Recruiter' : 'Job Seeker'}
                </button>
                <button
                  type="button"
                  onClick={resetProfile}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2.5 rounded-xl text-sm transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Reset Profil
                </button>
              </div>

              {/* Info Tip */}
              <div className="bg-brand-lime/10 rounded-2xl p-5 border border-brand-lime/20">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-brand-dark shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-brand-dark">Data tersimpan aman</p>
                    <p className="text-xs text-gray-500 mt-0.5">Profilmu disimpan secara lokal di perangkat ini.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== RIGHT COLUMN ===== */}
            <div className="lg:col-span-8 space-y-6">
              {/* Data Diri Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-brand-lime/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-brand-dark">Data Diri</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 md:grid md:grid-cols-2 md:gap-5 space-y-5 md:space-y-0">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email <span className="text-red-400">*</span></label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="email@contoh.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">No. HP <span className="text-red-400">*</span></label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                    <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-100 text-gray-500">
                      {simulatedRole === 'jobseeker' ? 'Job Seeker (Pelamar)' : 'Recruiter (Perusahaan)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== JOBSEEKER FIELDS ===== */}
              {simulatedRole === 'jobseeker' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-brand-dark">Data Karier</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pendidikan Terakhir <span className="text-red-400">*</span></label>
                      <select
                        value={form.pendidikan}
                        onChange={(e) => handleChange('pendidikan', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all"
                      >
                        <option value="">Pilih Pendidikan</option>
                        <option value="SMK">SMK / SMA</option>
                        <option value="D3">D3 / Diploma</option>
                        <option value="D4">D4 / Sarjana Terapan</option>
                        <option value="S1">S1 / Sarjana</option>
                        <option value="S2">S2 / Magister</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pengalaman Kerja</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={form.pengalamanTahun ?? ''}
                        onChange={(e) => handleChange('pengalamanTahun', e.target.value ? Number(e.target.value) : '')}
                        placeholder="Tahun"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Riwayat Pekerjaan</label>
                    <textarea
                      value={form.riwayatKerja}
                      onChange={(e) => handleChange('riwayatKerja', e.target.value)}
                      placeholder="Contoh:&#10;Frontend Developer — GoTo (2022–2025)&#10;Junior Developer — Traveloka (2021–2022)"
                      rows={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-300 resize-none"
                    />
                  </div>

                  {/* CV Upload - Drag & Drop Style */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload CV</label>
                    <div className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer group ${
                      form.cvFile
                        ? 'border-green-300 bg-green-50/30 hover:border-green-400'
                        : 'border-gray-200 bg-gray-50/50 hover:border-brand-lime hover:bg-brand-lime/5'
                    }`}>
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="hidden" id="cv-upload" />
                      <label htmlFor="cv-upload" className="cursor-pointer block">
                        {form.cvFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-green-700 font-medium text-sm">{form.cvFile}</span>
                              <p className="text-gray-400 text-xs mt-0.5">Klik atau tarik file untuk mengganti</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-brand-lime/20 flex items-center justify-center transition-colors">
                              <svg className="w-6 h-6 text-gray-400 group-hover:text-brand-dark transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-medium">Tarik &amp; lepas CV di sini</p>
                              <p className="text-xs text-gray-400 mt-0.5">atau klik untuk browse — PDF, DOC, DOCX (maks. 5MB)</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== RECRUITER FIELDS ===== */}
              {simulatedRole === 'recruiter' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-brand-dark">Data Perusahaan</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Perusahaan <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        value={form.companyName}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                        placeholder="Nama perusahaan Anda"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lokasi Kantor <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        value={form.companyLocation}
                        onChange={(e) => handleChange('companyLocation', e.target.value)}
                        placeholder="Kota, Indonesia"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi Perusahaan</label>
                    <textarea
                      value={form.companyDesc}
                      onChange={(e) => handleChange('companyDesc', e.target.value)}
                      placeholder="Ceritakan tentang perusahaan Anda — bidang industri, visi misi, dan kultur kerja."
                      rows={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all placeholder:text-gray-300 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div>
                  {saved && (
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-sm">Profil berhasil disimpan!</span>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-dark text-white font-semibold px-8 py-3 rounded-xl text-sm hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : saved ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Tersimpan!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>

              {/* Quiz Karir — Preferensi SPK */}
              {simulatedRole === 'jobseeker' && (
                <div className="mt-2">
                  <QuizKarir />
                </div>
              )}

              {/* SPK Rekomendasi Pekerjaan */}
              {simulatedRole === 'jobseeker' && <RekomendasiJobs />}
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
