import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import type { UserProfile } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const SKILL_OPTIONS = [
  // Programming & Tech
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js',
  'Express.js', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C#', '.NET',
  'PHP', 'Laravel', 'Go', 'Rust', 'Ruby', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
  'HTML/CSS', 'Tailwind CSS', 'SASS', 'Bootstrap',
  // DevOps & Cloud
  'Git', 'GitHub', 'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure',
  'CI/CD', 'Linux', 'Nginx', 'Terraform',
  // Data & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas',
  'NumPy', 'Data Analysis', 'Data Visualization', 'Power BI', 'Tableau',
  'Excel', 'R', 'NLP', 'Computer Vision',
  // Design
  'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX Design',
  'Wireframing', 'Prototyping', 'Design System',
  // Soft Skills
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
  'Critical Thinking', 'Project Management', 'Agile', 'Scrum',
  'Time Management', 'Public Speaking', 'Negotiation', 'Adaptability',
  // Business & Marketing
  'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing',
  'Content Writing', 'Copywriting', 'Google Analytics', 'Email Marketing',
  'Product Management', 'Business Analysis', 'Financial Modeling',
  // Others
  'Cybersecurity', 'Blockchain', 'IoT', 'Embedded Systems',
  'Quality Assurance', 'Manual Testing', 'Automation Testing', 'Selenium',
];

export default function ProfilePage() {
  const { auth, profile, fetchProfile, updateProfile } = useJobs();
  const navigate = useNavigate();

  useEffect(() => { if (auth) fetchProfile(); }, [auth]);
  useEffect(() => { if (!auth) navigate('/login'); }, [auth, navigate]);

  const isJobseeker = auth?.role !== 'perusahaan';

  const [form, setForm] = useState<UserProfile>({
    role: isJobseeker ? 'jobseeker' : 'recruiter',
    name: profile?.name || auth?.name || '',
    email: profile?.email || auth?.email || '',
    phone: profile?.phone || '',
    avatar: profile?.avatar || '',
    pendidikan: profile?.pendidikan || '',
    riwayatKerja: profile?.riwayatKerja || '',
    pengalamanTahun: profile?.pengalamanTahun || undefined,
    cvFile: profile?.cvFile || '',
    companyName: profile?.companyName || auth?.companyName || '',
    companyDesc: profile?.companyDesc || '',
    companyLocation: profile?.companyLocation || '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skills, setSkills] = useState<string[]>(profile?.keahlian || []);
  const [skillInput, setSkillInput] = useState('');
  const [showSug, setShowSug] = useState(false);

  // Sync skills when profile loads from backend
  useEffect(() => {
    if (profile?.keahlian) setSkills(profile.keahlian);
  }, [profile?.keahlian]);

  const resetProfile = () => {
    if (!window.confirm('Reset profil akan menghapus semua data profil. Lanjutkan?')) return;
    localStorage.removeItem('kerjago_profile');
    setForm({ role: isJobseeker ? 'jobseeker' : 'recruiter', name: auth?.name || '', email: auth?.email || '', phone: '', avatar: '', pendidikan: '', riwayatKerja: '', pengalamanTahun: undefined, cvFile: '', companyName: auth?.companyName || '', companyDesc: '', companyLocation: '' });
    setSkills([]);
    setSaved(false);
  };

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setForm((p) => ({ ...p, [field]: value }));
    setSaved(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, avatar: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm((p) => ({ ...p, cvFile: file.name }));
  };

  const addSkill = (s: string) => {
    const t = s.trim();
    if (t && !skills.includes(t) && skills.length < 20) {
      setSkills((prev) => [...prev, t]);
      setSaved(false);
    }
    setSkillInput('');
    setShowSug(false);
  };

  const removeSkill = (s: string) => {
    setSkills((prev) => prev.filter((x) => x !== s));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (!form.name || !form.email || !form.phone) { alert('Harap isi Nama, Email, dan No. HP.'); setSaving(false); return; }
    if (isJobseeker && !form.pendidikan) { alert('Harap pilih Pendidikan Terakhir.'); setSaving(false); return; }
    if (!isJobseeker && (!form.companyName || !form.companyLocation)) { alert('Harap isi Nama Perusahaan dan Lokasi.'); setSaving(false); return; }
    try { await updateProfile({ ...form, role: isJobseeker ? 'jobseeker' : 'recruiter', keahlian: skills }); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    catch (err: any) { alert('Gagal menyimpan: ' + (err.message || '')); }
    finally { setSaving(false); }
  };

  const completeness = useMemo(() => {
    let filled = 0, total = 0;
    const checks = isJobseeker
      ? [!!form.name, !!form.email, !!form.phone, !!form.avatar, !!form.pendidikan, !!form.pengalamanTahun, !!form.riwayatKerja, !!form.cvFile, skills.length > 0]
      : [!!form.name, !!form.email, !!form.phone, !!form.companyName, !!form.companyLocation, !!form.companyDesc, !!form.avatar];
    checks.forEach((c) => { total++; if (c) filled++; });
    return Math.round((filled / total) * 100);
  }, [form, isJobseeker, skills]);

  const filteredSug = SKILL_OPTIONS.filter((s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s));

  if (!auth) return null;

  const stats = isJobseeker
    ? [
        { label: 'Pendidikan', value: form.pendidikan || '\u2014' },
        { label: 'Pengalaman', value: form.pengalamanTahun ? `${form.pengalamanTahun} tahun` : '\u2014' },
        { label: 'CV', value: form.cvFile || '\u2014' },
        { label: 'Keahlian', value: skills.length > 0 ? `${skills.length}` : '\u2014' },
      ]
    : [
        { label: 'Perusahaan', value: form.companyName || '\u2014' },
        { label: 'Lokasi', value: form.companyLocation || '\u2014' },
      ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ===== PROFILE CARD ===== */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-6">
              <div className="relative border border-brand-border rounded-2xl p-8 flex flex-col items-center text-center bg-white">
                {/* Avatar */}
                <div className="relative mb-5">
                  <div className="w-28 h-28 rounded-full border-2 border-brand-border overflow-hidden bg-gray-50">
                    {form.avatar ? (
                      <img src={form.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-200">
                        {form.name ? form.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-brand-dark text-white rounded-full flex items-center justify-center cursor-pointer text-sm font-bold shadow hover:bg-gray-800 transition-colors">
                    +
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                {/* Name & Role */}
                <h2 className="text-xl font-bold text-brand-dark leading-tight">{form.name || 'Belum diisi'}</h2>
                <p className="text-gray-400 text-sm mt-1">{form.email}</p>
                <span className="inline-block mt-3 bg-brand-lime text-brand-dark text-xs font-semibold px-4 py-1 rounded-full">
                  {isJobseeker ? 'Pelamar' : 'Perusahaan'}
                </span>

                {/* Bio line */}
                <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                  {isJobseeker
                    ? (form.pendidikan ? `Lulusan ${form.pendidikan}` : 'Lengkapi profilmu untuk mulai melamar.')
                    : (form.companyName ? `Bergabung di ${form.companyName}` : 'Lengkapi data perusahaan.')}
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-brand-border my-6" />

                {/* Stats */}
                <div className="w-full space-y-3">
                  {stats.map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="font-medium text-brand-dark">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                {isJobseeker && (
                  <>
                    <div className="w-full h-px bg-brand-border my-5" />
                    <div className="w-full">
                      <p className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-3 text-left">Keahlian</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {skills.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1 bg-brand-lime/30 text-brand-dark px-2.5 py-1 rounded-full text-xs font-medium">
                            {s}
                            <button type="button" onClick={() => removeSkill(s)} className="text-gray-400 hover:text-red-500 ml-0.5">&times;</button>
                          </span>
                        ))}
                        {skills.length === 0 && <span className="text-xs text-gray-300 italic">Belum ada</span>}
                      </div>
                      <div className="relative">
                        <input
                          type="text" value={skillInput}
                          onChange={(e) => { setSkillInput(e.target.value); setShowSug(true); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                          onFocus={() => setShowSug(true)}
                          onBlur={() => setTimeout(() => setShowSug(false), 200)}
                          placeholder="Tambah keahlian..."
                          className="w-full border border-brand-border rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-dark transition-colors"
                        />
                        {showSug && skillInput && filteredSug.length > 0 && (
                          <div className="absolute z-10 bottom-full mb-1 w-full bg-white border border-brand-border rounded-xl shadow-lg max-h-36 overflow-y-auto">
                            {filteredSug.slice(0, 6).map((s) => (
                              <button key={s} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => addSkill(s)}
                                className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-brand-lime/20 transition-colors">
                                + {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Completeness */}
                <div className="w-full h-px bg-brand-border my-5" />
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Kelengkapan Profil</span>
                    <span className="text-sm font-bold text-brand-dark">{completeness}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full">
                    <div className="h-full bg-brand-dark rounded-full transition-all" style={{ width: `${completeness}%` }} />
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full mt-6 space-y-2">
                  {isJobseeker && (
                    <Link to="/spk-rekomendasi"
                      className="block w-full text-center bg-brand-dark text-white font-semibold py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity">
                      SPK Rekomendasi
                    </Link>
                  )}
                  <button type="button" onClick={resetProfile}
                    className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors py-1">
                    Reset Profil
                  </button>
                </div>
              </div>

              {/* Shadow glow */}
              <div className="absolute inset-0 rounded-2xl -z-10 blur-2xl opacity-10 bg-brand-dark" />
            </div>
          </div>

          {/* ===== FORMS ===== */}
          <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-6">

            {/* Data Diri */}
            <div className="border border-brand-border rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-brand-dark mb-6">Informasi Pribadi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">Nama Lengkap <span className="text-red-400">*</span></label>
                  <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Nama lengkap"
                    className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="email@contoh.com"
                    className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">No. HP <span className="text-red-400">*</span></label>
                  <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="08xxxxxxxxxx"
                    className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">Role</label>
                  <div className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-sm bg-gray-50 text-gray-500">
                    {isJobseeker ? 'Pelamar' : 'Perusahaan'}
                  </div>
                </div>
              </div>
            </div>

            {/* Karier / Perusahaan */}
            {isJobseeker ? (
              <div className="border border-brand-border rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-brand-dark mb-6">Data Karier</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">Pendidikan Terakhir <span className="text-red-400">*</span></label>
                    <select value={form.pendidikan} onChange={(e) => handleChange('pendidikan', e.target.value)}
                      className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors">
                      <option value="">Pilih</option>
                      <option value="SMK">SMK / SMA</option>
                      <option value="D3">D3</option>
                      <option value="D4">D4</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">Pengalaman (tahun)</label>
                    <input type="number" min="0" max="50" value={form.pengalamanTahun ?? ''} onChange={(e) => handleChange('pengalamanTahun', e.target.value ? Number(e.target.value) : '')} placeholder="0"
                      className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">Riwayat Pekerjaan</label>
                  <textarea value={form.riwayatKerja} onChange={(e) => handleChange('riwayatKerja', e.target.value)} rows={4}
                    placeholder={"Frontend Developer \u2014 GoTo (2022\u20132025)\nJunior Developer \u2014 Traveloka (2021\u20132022)"}
                    className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors resize-none" />
                </div>
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">Upload CV</label>
                  <label htmlFor="cv-upload" className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    form.cvFile ? 'border-brand-lime bg-brand-lime/5' : 'border-brand-border hover:border-brand-dark'
                  }`}>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="hidden" id="cv-upload" />
                    {form.cvFile ? (
                      <div>
                        <p className="text-sm font-semibold text-brand-dark">{form.cvFile}</p>
                        <p className="text-xs text-gray-400 mt-1">Klik untuk mengganti</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500">Tarik & lepas CV atau klik untuk browse</p>
                        <p className="text-xs text-gray-300 mt-1">PDF, DOC, DOCX (maks. 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            ) : (
              <div className="border border-brand-border rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-brand-dark mb-6">Data Perusahaan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">Nama Perusahaan <span className="text-red-400">*</span></label>
                    <input type="text" value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} placeholder="PT Contoh"
                      className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">Lokasi Kantor <span className="text-red-400">*</span></label>
                    <input type="text" value={form.companyLocation} onChange={(e) => handleChange('companyLocation', e.target.value)} placeholder="Jakarta"
                      className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-brand-dark mb-1.5">Deskripsi Perusahaan</label>
                  <textarea value={form.companyDesc} onChange={(e) => handleChange('companyDesc', e.target.value)} rows={4} placeholder="Tentang perusahaan Anda..."
                    className="w-full border border-brand-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors resize-none" />
                </div>
              </div>
            )}

            {/* Pengaturan */}
            <div className="border border-brand-border rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-brand-dark mb-6">Pengaturan</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-brand-dark">Role Akun</p>
                  <p className="text-xs text-gray-400 mt-0.5">{isJobseeker ? 'Akun Pelamar Kerja' : 'Akun Perusahaan'}</p>
                </div>
                <span className="bg-brand-lime text-brand-dark text-xs font-semibold px-3 py-1 rounded-full">
                  {isJobseeker ? 'Pelamar' : 'Perusahaan'}
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              {saved && (
                <span className="text-sm text-brand-dark font-medium flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-brand-lime" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Tersimpan
                </span>
              )}
              <button type="submit" disabled={saving}
                className="bg-brand-dark text-white font-semibold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
