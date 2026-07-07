import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import TrendingJobs from '../components/home/TrendingJobs';
import CategorySection from '../components/home/CategorySection';
import FeaturedJobs from '../components/home/FeaturedJobs';
import Testimonials from '../components/home/Testimonials';
import GetMatched from '../components/home/GetMatched';
import Newsletter from '../components/common/Newsletter';
import Footer from '../components/layout/Footer';
import JobCard from '../components/common/JobCard';
import { useJobs, type Job } from '../context/JobContext';

export default function LandingPage() {
  const { jobs, auth } = useJobs();
  const navigate = useNavigate();

  // Redirect perusahaan ke dashboard
  useEffect(() => {
    if (auth?.role === 'perusahaan') {
      navigate('/dashboard', { replace: true });
    }
  }, [auth, navigate]);

  const [keyword, setKeyword] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [location, setLocation] = useState('');
  const [activeCategory, setActiveCategory] = useState('UX/UI Design');

  const handleSearch = (kw: string, loc: string) => {
    setKeyword(kw);
    setLocation(loc);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchKeyword =
      !keyword ||
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(keyword.toLowerCase());
    const matchLocation =
      !location ||
      job.location.toLowerCase().includes(location.toLowerCase());
    return matchKeyword && matchLocation;
  });

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <HeroSection jobCount={jobs.length} onSearch={handleSearch} />

      {/* If search is active, show filtered results */}
      {(keyword || location) && (
        <section id="find-jobs" className="max-w-6xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-bold text-brand-dark mb-6">
            Search Results ({filteredJobs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job.id} {...job} onSelect={() => setSelectedJob(job)} />)
            ) : (
              <p className="text-gray-500 col-span-full text-center py-10">
                No jobs found matching your criteria.
              </p>
            )}
          </div>
        </section>
      )}

      <TrendingJobs onSelectJob={(job) => setSelectedJob(job)} />
      <CategorySection
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <FeaturedJobs categoryFilter={activeCategory} onSelectJob={(job) => setSelectedJob(job)} />
      <Testimonials />
      <GetMatched />
      <Newsletter />
      <Footer />

      {/* ── Modal Detail Lowongan ── */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-brand-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-bold text-lg text-brand-dark">{selectedJob.title}</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Info perusahaan */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-brand-dark text-sm shrink-0">
                  {selectedJob.companyLogo}
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">{selectedJob.company}</p>
                  <p className="text-gray-500 text-sm">{selectedJob.location} {selectedJob.distance ? `• ${selectedJob.distance} km` : ''}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="bg-brand-lime/30 text-brand-dark text-xs font-medium px-3 py-1 rounded-full">
                      {selectedJob.type}
                    </span>
                    <span className="font-bold text-brand-dark text-sm">{selectedJob.salary}</span>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <h3 className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">Deskripsi Pekerjaan</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Persyaratan Kerja */}
              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
                    Persyaratan Kerja
                  </h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 mt-0.5 text-lime-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Info tambahan */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-brand-border">
                <div>
                  <p className="text-xs text-gray-400">Jarak Lokasi</p>
                  <p className="text-sm font-medium text-brand-dark">{selectedJob.distance ? `${selectedJob.distance} km` : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Pendidikan</p>
                  <p className="text-sm font-medium text-brand-dark">{selectedJob.education || '-'}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-brand-border px-6 py-4 rounded-b-2xl">
              <button
                onClick={() => { setSelectedJob(null); }}
                className="w-full bg-brand-dark text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
