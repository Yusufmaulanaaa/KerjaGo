import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs, type Job } from '../context/JobContext';
import { jobService } from '../services/jobService';
import api from '../lib/axios';

interface CareerNote {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { applicants, auth, updateApplicantStatus, deleteApplicant, logout } = useJobs();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [serverTotal, setServerTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [tab, setTab] = useState<'jobs' | 'applicants' | 'artikel'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Semua');

  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formSalary, setFormSalary] = useState('Rp 5 Jt – Rp 10 Jt');
  const [formType, setFormType] = useState('Full-time');
  const [formDescription, setFormDescription] = useState('');
  const [formEducation, setFormEducation] = useState('Sarjana (S1)');
  const [formExperience, setFormExperience] = useState('Fresh Graduate');
  const [formDistance, setFormDistance] = useState('< 15 km');

  const [notes, setNotes] = useState<CareerNote[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<CareerNote | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSlug, setNoteSlug] = useState('');
  const [noteCategory, setNoteCategory] = useState('Karir');
  const [noteContent, setNoteContent] = useState('');
  const [noteExcerpt, setNoteExcerpt] = useState('');
  const [noteImage, setNoteImage] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Admin');

  const mapJob = (item: any): Job => ({
    id: String(item.id_lowongan), id_lowongan: item.id_lowongan,
    title: item.judul_pekerjaan || '', company: item.nama_perusahaan || '',
    companyLogo: (item.nama_perusahaan || '')[0] || '?',
    location: item.jarak || '', salary: item.gaji || '', type: item.tipe_pekerjaan || '',
    description: item.deskripsi || '', category: item.kategori || 'Umum',
    verified: false, featured: false, distance: item.id_jarak ?? 0,
    distance_label: item.jarak || '', education: item.pendidikan || '',
    education_label: item.pendidikan || '', requirements: [],
  });

  // Fetch jobs + stats on mount
  useEffect(() => {
    jobService.getAll({ limit: '100' }).then((res) => {
      if (res.data.success) {
        setJobs(res.data.data.map(mapJob));
        setServerTotal(res.data.total ?? res.data.data.length);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.get('/career-notes').then((res) => {
      if (res.data.success) setNotes(res.data.data);
    }).catch(() => {});
  }, []);

  const refetchNotes = async () => {
    const res = await api.get('/career-notes');
    if (res.data.success) setNotes(res.data.data);
  };

  const openNoteModal = () => {
    setEditingNote(null);
    setNoteTitle(''); setNoteSlug(''); setNoteCategory('Karir');
    setNoteContent(''); setNoteExcerpt(''); setNoteImage(''); setNoteAuthor('Admin');
    setShowNoteModal(true);
  };

  const openEditNoteModal = (note: CareerNote) => {
    setEditingNote(note);
    setNoteTitle(note.title); setNoteSlug(note.slug); setNoteCategory(note.category);
    setNoteContent(note.content); setNoteExcerpt(note.excerpt); setNoteImage(note.image); setNoteAuthor(note.author);
    setShowNoteModal(true);
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteSlug || !noteContent) { alert('Judul, Slug, dan Konten wajib diisi.'); return; }
    const payload = { judul: noteTitle, slug: noteSlug, kategori: noteCategory, konten: noteContent, excerpt: noteExcerpt, gambar: noteImage, penulis: noteAuthor };
    try {
      if (editingNote) {
        await api.put(`/career-notes/${editingNote.id}`, payload);
      } else {
        await api.post('/career-notes', payload);
      }
      await refetchNotes();
      setShowNoteModal(false);
      setEditingNote(null);
    } catch { alert('Gagal menyimpan artikel.'); }
  };

  const handleDeleteNote = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus artikel ini?')) return;
    await api.delete(`/career-notes/${id}`);
    await refetchNotes();
  };

  const stats = useMemo(() => ({
    totalJobs: serverTotal,
    totalApplicants: applicants.length,
    accepted: applicants.filter((a) => a.status === 'diterima').length,
    pending: applicants.filter((a) => a.status === 'pending').length,
  }), [serverTotal, applicants]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch = !searchQuery || job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === 'Semua' || job.type === filterType;
      return matchSearch && matchType;
    });
  }, [jobs, searchQuery, filterType]);

  if (!auth || auth.role !== 'perusahaan') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg-light">
        <div className="text-center">
          <h2 className="text-xl font-bold text-brand-dark mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-4">You need to login as a company to access this page.</p>
          <button onClick={() => navigate('/login')} className="bg-brand-dark text-white px-6 py-2 rounded-full text-sm">Go to Login</button>
        </div>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingJob(null);
    setFormTitle('');
    setFormCompany(auth.companyName || '');
    setFormSalary('Rp 5 Jt – Rp 10 Jt');
    setFormType('Full-time');
    setFormDescription('');
    setFormEducation('Sarjana (S1)');
    setFormExperience('Fresh Graduate');
    setFormDistance('< 15 km');
    setShowModal(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormTitle(job.title);
    setFormCompany(job.company);
    setFormSalary(job.salary || 'Rp 5 Jt – Rp 10 Jt');
    setFormType(job.type || 'Full-time');
    setFormDescription(job.description);
    setFormEducation(job.education_label || 'Sarjana (S1)');
    setFormExperience('Fresh Graduate');
    setFormDistance(job.distance_label || '< 15 km');
    setShowModal(true);
  };

  // Helper: re-fetch jobs after mutation
  const refetchJobs = async () => {
    const res = await jobService.getAll({ limit: '100' });
    if (res.data.success) {
      setJobs(res.data.data.map(mapJob));
      setServerTotal(res.data.total ?? res.data.data.length);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formCompany || !formDescription) {
      alert('Harap isi semua field yang wajib');
      return;
    }
    try {
      const payload = {
        title: formTitle,
        company: formCompany,
        salary: formSalary,
        type: formType,
        description: formDescription,
        education: formEducation,
        experience: formExperience,
        location: formDistance,
      };
      if (editingJob) {
        await jobService.update(editingJob.id, payload);
      } else {
        await jobService.create(payload);
      }
      await refetchJobs();
      setShowModal(false);
      setEditingJob(null);
    } catch {
      alert('Gagal menyimpan data lowongan.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus lowongan ini?')) {
      await jobService.delete(id);
      await refetchJobs();
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-light">
      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-brand-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-lime rounded-md"></div>
            <span className="text-xl font-bold text-brand-dark">Kerjago</span>
            <span className="text-xs bg-brand-lime/30 text-brand-dark px-2 py-0.5 rounded-full ml-2 font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{auth.companyName || auth.name}</span>
            <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-brand-dark transition-colors">View Site</button>
            <button onClick={() => { logout(); navigate('/'); }} className="bg-brand-dark text-white px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Company Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your job listings and applicants</p>
          </div>
          <button onClick={openCreateModal} className="bg-brand-lime text-brand-dark font-semibold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add New Job
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-brand-border p-5">
            <p className="text-gray-500 text-sm">Total Jobs</p>
            <p className="text-3xl font-bold text-brand-dark mt-1">{stats.totalJobs}</p>
          </div>
          <div className="bg-white rounded-xl border border-brand-border p-5">
            <p className="text-gray-500 text-sm">Total Applicants</p>
            <p className="text-3xl font-bold text-brand-dark mt-1">{stats.totalApplicants}</p>
          </div>
          <div className="bg-white rounded-xl border border-brand-border p-5">
            <p className="text-gray-500 text-sm">Diterima</p>
            <p className="text-3xl font-bold text-brand-dark mt-1">{stats.accepted}</p>
          </div>
          <div className="bg-white rounded-xl border border-brand-border p-5">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-3xl font-bold text-brand-dark mt-1">{stats.pending}</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
          {(['jobs', 'applicants', 'artikel'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                tab === t ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-500'
              }`}
            >
              {t === 'jobs' ? `Job Listings (${jobs.length})` : t === 'applicants' ? `Applicants (${applicants.length})` : `Artikel (${notes.length})`}
            </button>
          ))}
        </div>

        {/* ══════════════ JOBS TAB ══════════════ */}
        {tab === 'jobs' && (
          <>
            {/* Search & Filter */}
            <div className="bg-white rounded-xl border border-brand-border p-4 mb-4 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Cari lowongan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border border-brand-border rounded-lg px-4 py-2 text-sm outline-none focus:border-brand-dark transition-colors"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-brand-border rounded-lg px-4 py-2 text-sm outline-none focus:border-brand-dark transition-colors"
              >
                <option value="Semua">Semua Tipe</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Jobs Table */}
            <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
              {filteredJobs.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-gray-500">No jobs yet. Create your first job listing!</p>
                  <button onClick={openCreateModal} className="mt-4 bg-brand-dark text-white px-5 py-2 rounded-full text-sm">+ Add Job</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-brand-border">
                      <tr>
                        <th className="text-left py-3 px-5 font-semibold text-brand-dark">Job Title</th>
                        <th className="text-left py-3 px-5 font-semibold text-brand-dark">Company</th>
                        <th className="text-left py-3 px-5 font-semibold text-brand-dark">Location</th>
                        <th className="text-left py-3 px-5 font-semibold text-brand-dark">Gaji</th>
                        <th className="text-left py-3 px-5 font-semibold text-brand-dark">Type</th>
                        <th className="text-left py-3 px-5 font-semibold text-brand-dark">Category</th>
                        <th className="text-center py-3 px-5 font-semibold text-brand-dark">Pelamar</th>
                        <th className="text-right py-3 px-5 font-semibold text-brand-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => {
                        const count = applicants.filter((a) => a.jobId === job.id).length;
                        return (
                          <tr key={job.id} className="border-b border-brand-border last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-brand-dark shrink-0">
                                  {job.companyLogo || job.company.charAt(0)}
                                </div>
                                <span className="font-medium text-brand-dark">{job.title}</span>
                              </div>
                            </td>
                            <td className="py-3 px-5 text-gray-500">{job.company}</td>
                            <td className="py-3 px-5 text-gray-500">{job.location || '-'}</td>
                            <td className="py-3 px-5 font-medium text-brand-dark">{job.salary}</td>
                            <td className="py-3 px-5">
                              <span className="bg-brand-lime/30 text-brand-dark text-xs font-medium px-2.5 py-1 rounded-full">{job.type}</span>
                            </td>
                            <td className="py-3 px-5 text-gray-500 text-xs">{job.category}</td>
                            <td className="py-3 px-5 text-center text-gray-500">{count}</td>
                            <td className="py-3 px-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openEditModal(job)} className="text-xs font-medium text-blue-600 hover:underline">Edit</button>
                                <button onClick={() => handleDelete(job.id)} className="text-xs font-medium text-red-500 hover:underline">Delete</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="px-5 py-3 border-t border-brand-border text-xs text-gray-400">
                    Showing {filteredJobs.length} of {jobs.length} jobs
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════════ APPLICANTS TAB ══════════════ */}
        {tab === 'applicants' && (
          <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
            {applicants.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-500">No applicants yet. Applications will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-brand-border">
                    <tr>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Name</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Email</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Type</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Job</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Proposal</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Status</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Date</th>
                      <th className="text-right py-3 px-5 font-semibold text-brand-dark">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => {
                      const relatedJob = jobs.find((j) => j.id === app.jobId);
                      return (
                        <tr key={app.id} className="border-b border-brand-border last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-2">
                              {app.avatar ? (
                                <img src={app.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-brand-dark">
                                  {app.name.charAt(0)}
                                </div>
                              )}
                              <span className="font-medium text-brand-dark">{app.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-5 text-gray-500">{app.email}</td>
                          <td className="py-3 px-5">
                            <span className="bg-brand-lime/30 text-brand-dark text-xs font-medium px-2.5 py-1 rounded-full">{app.candidateType}</span>
                          </td>
                          <td className="py-3 px-5 text-gray-500">{relatedJob?.title || 'General'}</td>
                          <td className="py-3 px-5 text-gray-400 max-w-40 truncate">{app.proposal}</td>
                          <td className="py-3 px-5">
                            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                              app.status === 'diterima' ? 'bg-brand-lime/40 text-brand-dark'
                              : app.status === 'ditolak' ? 'bg-gray-200 text-gray-600'
                              : 'bg-brand-lime/20 text-brand-dark'
                            }`}>
                              {app.status === 'diterima' ? 'Diterima' : app.status === 'ditolak' ? 'Ditolak' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-gray-400 text-xs">{new Date(app.appliedAt).toLocaleDateString()}</td>
                          <td className="py-3 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {app.status !== 'diterima' && (
                                <button onClick={() => updateApplicantStatus(app.id, 'diterima')} className="text-xs font-medium text-brand-dark hover:bg-brand-lime/30 px-2 py-1 rounded-md transition-colors">Terima</button>
                              )}
                              {app.status !== 'ditolak' && (
                                <button onClick={() => updateApplicantStatus(app.id, 'ditolak')} className="text-xs font-medium text-gray-500 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors">Tolak</button>
                              )}
                              <button onClick={() => { if (window.confirm(`Hapus lamaran dari ${app.name}?`)) deleteApplicant(app.id); }} className="text-xs font-medium text-gray-400 hover:text-red-500 px-2 py-1 rounded-md transition-colors">Hapus</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ ARTIKEL TAB ══════════════ */}
        {tab === 'artikel' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{notes.length} artikel ditemukan</p>
              <button onClick={openNoteModal} className="bg-brand-lime text-brand-dark font-semibold px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Tambah Artikel
              </button>
            </div>
            <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
              {notes.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-gray-500">Belum ada artikel. Buat artikel pertama Anda!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-brand-border">
                      <tr>
                        <th className="text-left py-3 px-5 font-semibold text-brand-dark">Judul</th>
                        <th className="text-left py-3 px-5 font-semibold text-brand-dark">Kategori</th>
                        <th className="text-left py-3 px-5 font-semibold text-brand-dark">Penulis</th>
                        <th className="text-left py-3 px-5 font-semibold text-brand-dark">Slug</th>
                        <th className="text-right py-3 px-5 font-semibold text-brand-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.map((note) => (
                        <tr key={note.id} className="border-b border-brand-border last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-5 font-medium text-brand-dark max-w-xs truncate">{note.title}</td>
                          <td className="py-3 px-5">
                            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">{note.category}</span>
                          </td>
                          <td className="py-3 px-5 text-gray-500">{note.author}</td>
                          <td className="py-3 px-5 text-gray-400 text-xs">{note.slug}</td>
                          <td className="py-3 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEditNoteModal(note)} className="text-xs font-medium text-blue-600 hover:underline">Edit</button>
                              <button onClick={() => handleDeleteNote(note.id)} className="text-xs font-medium text-red-500 hover:underline">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ══════════════ MODAL ══════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-brand-dark mb-6">{editingJob ? 'Edit Job Listing' : 'Create New Job'}</h3>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Posisi Pekerjaan *</label>
                <input type="text" placeholder="e.g. Frontend Developer" className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Perusahaan *</label>
                <input type="text" placeholder="e.g. PT Telkom Indonesia" className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={formCompany} onChange={(e) => setFormCompany(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Tipe Pekerjaan</label>
                  <select className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={formType} onChange={(e) => setFormType(e.target.value)}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Rentang Gaji</label>
                  <select className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={formSalary} onChange={(e) => setFormSalary(e.target.value)}>
                    <option value="Rp 0 – Rp 5 Jt">Rp 0 – Rp 5 Jt</option>
                    <option value="Rp 5 Jt – Rp 10 Jt">Rp 5 Jt – Rp 10 Jt</option>
                    <option value="Rp 10 Jt – Rp 20 Jt">Rp 10 Jt – Rp 20 Jt</option>
                    <option value="Rp 20 Jt – Rp 40 Jt">Rp 20 Jt – Rp 40 Jt</option>
                    <option value="Rp 40 Jt+">Rp 40 Jt+</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Pendidikan</label>
                  <select className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={formEducation} onChange={(e) => setFormEducation(e.target.value)}>
                    <option value="SMA/SMK Sederajat">SMA/SMK Sederajat</option>
                    <option value="Diploma (D3/D4)">Diploma (D3/D4)</option>
                    <option value="Sarjana (S1)">Sarjana (S1)</option>
                    <option value="Pascasarjana (S2/S3)">Pascasarjana (S2/S3)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Pengalaman</label>
                  <select className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={formExperience} onChange={(e) => setFormExperience(e.target.value)}>
                    <option value="Fresh Graduate">Fresh Graduate</option>
                    <option value="1-2 Tahun">1-2 Tahun</option>
                    <option value="2-3 Tahun">2-3 Tahun</option>
                    <option value="3-5 Tahun">3-5 Tahun</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Jarak Lokasi</label>
                  <select className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={formDistance} onChange={(e) => setFormDistance(e.target.value)}>
                    <option value="< 5 km">&lt; 5 km</option>
                    <option value="< 15 km">&lt; 15 km</option>
                    <option value="< 30 km">&lt; 30 km</option>
                    <option value="< 50 km">&lt; 50 km</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Deskripsi Pekerjaan *</label>
                <textarea placeholder="Jelaskan tanggung jawab, kualifikasi, dan benefit yang ditawarkan..." rows={4} className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors resize-none" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button type="submit" className="bg-brand-dark text-white font-semibold px-8 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity">
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 text-sm font-medium hover:text-brand-dark transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL ARTIKEL ══════════════ */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setShowNoteModal(false)}>
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-brand-dark mb-6">{editingNote ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h3>
            <form onSubmit={handleNoteSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Judul *</label>
                  <input type="text" placeholder="Judul artikel" className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Slug *</label>
                  <input type="text" placeholder="judul-artikel-url" className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={noteSlug} onChange={(e) => setNoteSlug(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Kategori</label>
                  <select className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={noteCategory} onChange={(e) => setNoteCategory(e.target.value)}>
                    <option value="Karir">Karir</option>
                    <option value="Tips CV">Tips CV</option>
                    <option value="Interview">Interview</option>
                    <option value="Tren Industri">Tren Industri</option>
                    <option value="Skill">Skill</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Penulis</label>
                  <input type="text" className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={noteAuthor} onChange={(e) => setNoteAuthor(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Gambar (URL)</label>
                  <input type="text" placeholder="https://..." className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors" value={noteImage} onChange={(e) => setNoteImage(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Excerpt</label>
                <textarea placeholder="Ringkasan singkat artikel..." rows={2} className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors resize-none" value={noteExcerpt} onChange={(e) => setNoteExcerpt(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Konten *</label>
                <textarea placeholder="Isi lengkap artikel..." rows={10} className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors resize-none" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button type="submit" className="bg-brand-dark text-white font-semibold px-8 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity">
                  {editingNote ? 'Update Artikel' : 'Simpan Artikel'}
                </button>
                <button type="button" onClick={() => setShowNoteModal(false)} className="text-gray-500 text-sm font-medium hover:text-brand-dark transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
