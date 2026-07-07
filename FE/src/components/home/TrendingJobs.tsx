import { useJobs } from '../../context/JobContext';
import JobCard from '../common/JobCard';
import type { Job } from '../../types';

interface TrendingJobsProps {
  onSelectJob?: (job: Job) => void;
}

export default function TrendingJobs({ onSelectJob }: TrendingJobsProps) {
  const { jobs } = useJobs();
  const trending = jobs.filter((j) => j.featured).slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Trending Jobs</h2>
          <p className="text-gray-500 text-sm mt-1">Hand-picked jobs for you</p>
        </div>
        <a href="#" className="text-sm font-medium text-brand-dark hover:underline">
          View All &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {trending.map((job) => (
          <JobCard key={job.id} {...job} onSelect={onSelectJob ? () => onSelectJob(job) : undefined} />
        ))}
      </div>
    </section>
  );
}
