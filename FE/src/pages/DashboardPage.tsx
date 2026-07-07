import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs, type Job } from '../context/JobContext';
import SPKDashboard from '../components/dashboard/SPKDashboard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { jobs, applicants, auth, addJob, updateJob, deleteJob, updateApplicantStatus, deleteApplicant, logout } = useJobs();

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [tab, setTab] = useState<'jobs' | 'applicants' | 'spk'>('jobs');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formSalary, setFormSalary] = useState('');
  const [formType, setFormType] = useState('Full-time');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('UX/UI Design');

  if (!auth || auth.role !== 'perusahaan') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg-light">
        <div className="text-center">
          <h2 className="text-xl font-bold text-brand-dark mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-4">You need to login as a company to access this page.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-brand-dark text-white px-6 py-2 rounded-full text-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingJob(null);
    setFormTitle('');
    setFormCompany(auth.companyName || '');
    setFormLocation('');
    setFormSalary('');
    setFormType('Full-time');
    setFormDescription('');
    setFormCategory('UX/UI Design');
    setShowModal(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormTitle(job.title);
    setFormCompany(job.company);
    setFormLocation(job.location);
    setFormSalary(job.salary);
    setFormType(job.type);
    setFormDescription(job.description);
    setFormCategory(job.category);
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formCompany || !formLocation || !formSalary || !formDescription) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingJob) {
        await updateJob(editingJob.id, {
          title: formTitle,
          company: formCompany,
          location: formLocation,
          salary: formSalary,
          type: formType,
          description: formDescription,
          category: formCategory,
        });
        alert('Job updated successfully!');
      } else {
        await addJob({
          title: formTitle,
          company: formCompany,
          companyLogo: formCompany.charAt(0).toUpperCase(),
          location: formLocation,
          salary: formSalary,
          type: formType,
          description: formDescription,
          category: formCategory,
          verified: true,
          featured: true,
          distance: 0,
          distance_label: '',
          education: 'Sarjana (S1)',
          education_label: 'Sarjana (S1)',
          id_lowongan: 0,
          requirements: [],
        });
        alert('Job created successfully!');
      }

      setShowModal(false);
      setEditingJob(null);
    } catch (err) {
      alert('Gagal menyimpan data lowongan. Silakan coba lagi.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        alert('Job deleted successfully!');
      } catch (err) {
        alert('Gagal menghapus lowongan. Silakan coba lagi.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-bg-light">
      {/* Dashboard Navbar */}
      <nav className="bg-white border-b border-brand-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-lime rounded-md"></div>
            <span className="text-xl font-bold text-brand-dark">Kerjago</span>
            <span className="text-xs bg-brand-lime/30 text-brand-dark px-2 py-0.5 rounded-full ml-2 font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{auth.companyName || auth.name}</span>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-brand-dark transition-colors"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="bg-brand-dark text-white px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Company Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your job listings and applicants</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-brand-lime text-brand-dark font-semibold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Job
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-brand-border p-6">
            <p className="text-gray-500 text-sm">Total Jobs</p>
            <p className="text-3xl font-bold text-brand-dark mt-1">{jobs.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-brand-border p-6">
            <p className="text-gray-500 text-sm">Total Applicants</p>
            <p className="text-3xl font-bold text-brand-dark mt-1">{applicants.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-brand-border p-6">
            <p className="text-gray-500 text-sm">Active Jobs</p>
            <p className="text-3xl font-bold text-brand-dark mt-1">
              {jobs.filter((j) => j.featured).length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
          <button
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
              tab === 'jobs' ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-500'
            }`}
            onClick={() => setTab('jobs')}
          >
            Job Listings
          </button>
          <button
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
              tab === 'applicants' ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-500'
            }`}
            onClick={() => setTab('applicants')}
          >
            Applicants ({applicants.length})
          </button>
          <button
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
              tab === 'spk' ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-500'
            }`}
            onClick={() => setTab('spk')}
          >
            SPK Analysis
          </button>
        </div>

        {/* Jobs Table */}
        {tab === 'jobs' && (
          <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
            {jobs.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-500">No jobs yet. Create your first job listing!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-brand-border">
                    <tr>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Job Title</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Company</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Location</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Gaji (Rp)</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Type</th>
                      <th className="text-left py-3 px-5 font-semibold text-brand-dark">Applicants</th>
                      <th className="text-right py-3 px-5 font-semibold text-brand-dark">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => {
                      const jobApplicants = applicants.filter((a) => a.jobId === job.id);
                      return (
                        <tr key={job.id} className="border-b border-brand-border last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-5 font-medium text-brand-dark">{job.title}</td>
                          <td className="py-4 px-5 text-gray-500">{job.company}</td>
                          <td className="py-4 px-5 text-gray-500">{job.location}</td>
                          <td className="py-4 px-5 text-brand-dark font-medium">{job.salary}</td>
                          <td className="py-4 px-5">
                            <span className="bg-brand-lime/30 text-brand-dark text-xs font-medium px-2.5 py-1 rounded-full">
                              {job.type}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-gray-500">{jobApplicants.length}</td>
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(job)}
                                className="text-xs font-medium text-blue-600 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(job.id)}
                                className="text-xs font-medium text-red-500 hover:underline"
                              >
                                Delete
                              </button>
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

        {/* Applicants Table */}
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
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              {app.avatar ? (
                                <img src={app.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-brand-lime/40 flex items-center justify-center text-xs font-bold text-brand-dark">
                                  {app.name.charAt(0)}
                                </div>
                              )}
                              <span className="font-medium text-brand-dark">{app.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-gray-500">{app.email}</td>
                          <td className="py-4 px-5">
                            <span className="bg-brand-lime/30 text-brand-dark text-xs font-medium px-2.5 py-1 rounded-full">
                              {app.candidateType}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-gray-500">{relatedJob?.title || 'General'}</td>
                          <td className="py-4 px-5 text-gray-400 max-w-40 truncate">{app.proposal}</td>
                          <td className="py-4 px-5">
                            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                              app.status === 'diterima'
                                ? 'bg-green-50 text-green-700'
                                : app.status === 'ditolak'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-yellow-50 text-yellow-700'
                            }`}>
                              {app.status === 'diterima' ? 'Diterima' : app.status === 'ditolak' ? 'Ditolak' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-gray-400 text-xs">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {app.status !== 'diterima' && (
                                <button
                                  onClick={() => updateApplicantStatus(app.id, 'diterima')}
                                  className="text-xs font-medium text-green-600 hover:bg-green-50 px-2 py-1 rounded-md transition-colors"
                                >
                                  Terima
                                </button>
                              )}
                              {app.status !== 'ditolak' && (
                                <button
                                  onClick={() => updateApplicantStatus(app.id, 'ditolak')}
                                  className="text-xs font-medium text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                                >
                                  Tolak
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (window.confirm(`Hapus lamaran dari ${app.name}?`)) {
                                    deleteApplicant(app.id);
                                  }
                                }}
                                className="text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                              >
                                Hapus
                              </button>
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

        {/* SPK Analysis */}
        {tab === 'spk' && (
          <SPKDashboard />
        )}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-xl p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-brand-dark mb-6">
              {editingJob ? 'Edit Job Listing' : 'Create New Job'}
            </h3>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior UI Designer"
                  className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g. GoTo"
                  className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Jakarta Selatan, Indonesia"
                  className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Gaji (Rp) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rp 20.000.000"
                    className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Job Type</label>
                  <select
                    className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Category</label>
                <select
                  className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  <option value="UX/UI Design">UX/UI Design</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Description *</label>
                <textarea
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={4}
                  className="w-full border border-brand-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-dark transition-colors resize-none"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  className="bg-brand-dark text-white font-semibold px-8 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
                >
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 text-sm font-medium hover:text-brand-dark transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
