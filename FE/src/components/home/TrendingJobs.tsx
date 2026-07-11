import { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import JobCard from '../common/JobCard';
import type { Job } from '../../types';

interface TrendingJobsProps {
  onSelectJob?: (job: Job) => void;
}

export default function TrendingJobs({ onSelectJob }: TrendingJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    jobService.getFeatured(3).then((res) => {
      if (res.data.success) {
        setJobs(res.data.data.map((item: any) => ({
          id: String(item.id_lowongan),
          id_lowongan: item.id_lowongan,
          title: item.judul_pekerjaan || '',
          company: item.nama_perusahaan || '',
          companyLogo: (item.nama_perusahaan || '')[0] || '?',
          location: item.jarak || '',
          salary: item.gaji || '',
          type: item.tipe_pekerjaan || '',
          description: item.deskripsi || '',
          category: item.kategori || 'Umum',
          verified: false,
          featured: false,
          distance: item.id_jarak ?? 0,
          distance_label: item.jarak || '',
          education: item.pendidikan || '',
          education_label: item.pendidikan || '',
          requirements: [],
        })));
      }
    }).catch(() => {});
  }, []);

  if (jobs.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Trending Jobs</h2>
          <p className="text-gray-500 text-sm mt-1">Hand-picked jobs for you</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {jobs.map((job) => (
          <JobCard key={job.id} {...job} onSelect={onSelectJob ? () => onSelectJob(job) : undefined} />
        ))}
      </div>
    </section>
  );
}
