import JobCard from './JobCard';

export default function JobList({ jobs = [], onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => <JobCard key={job.id} job={job} onClick={onSelect} />)}
      </div>
  );
}
