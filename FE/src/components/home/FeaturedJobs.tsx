import { useState } from 'react';
import { useJobs } from '../../context/JobContext';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import JobCard from '../common/JobCard';
import type { Job } from '../../types';

interface FeaturedJobsProps {
  categoryFilter?: string;
  onSelectJob?: (job: Job) => void;
}

export default function FeaturedJobs({ categoryFilter, onSelectJob }: FeaturedJobsProps) {
  const { jobs } = useJobs();
  const featured = categoryFilter
    ? jobs.filter((j) => j.featured && j.category === categoryFilter)
    : jobs.filter((j) => j.featured);
  const [visibleCount, setVisibleCount] = useState(6);

  const { ref, isVisible } = useRevealOnScroll({ threshold: 0.08 });

  const displayed = featured.slice(0, visibleCount);

  return (
    <section id="featured-jobs" className="max-w-6xl mx-auto px-4 py-16">
      <div
        ref={ref}
        className={`transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-2xl font-bold text-brand-dark text-center mb-2">Featured Job Circulars</h2>
        <p className="text-gray-500 text-sm text-center mb-10">
          {categoryFilter
            ? `Top ${categoryFilter} jobs matching your skills`
            : 'Top jobs matching your skills and preferences'}
        </p>
      </div>

      {displayed.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          No featured jobs in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map((job, idx) => (
            <div
              key={job.id}
              className={`transition-all ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDuration: '600ms', transitionDelay: `${idx * 80}ms`, transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <JobCard {...job} onSelect={onSelectJob ? () => onSelectJob(job) : undefined} />
            </div>
          ))}
        </div>
      )}

      {visibleCount < featured.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="bg-brand-lime text-brand-dark font-semibold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
          >
            Find More Jobs
          </button>
        </div>
      )}
    </section>
  );
}
