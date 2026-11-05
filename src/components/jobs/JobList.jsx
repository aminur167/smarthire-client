import { useState } from 'react';
import JobCard from './JobCard';
import SearchBar from '../common/SearchBar';

export default function JobList({ jobs = [], onSelect }) {
  const [search, setSearch] = useState('');
  const filtered = jobs.filter((j) => j.title?.toLowerCase().includes(search.toLowerCase()) || j.location?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search jobs by title or location..." />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {filtered.map((job) => <JobCard key={job.id} job={job} onClick={onSelect} />)}
      </div>
      {filtered.length === 0 && <p className="text-center text-gray-400 py-16 text-sm">No jobs found</p>}
    </div>
  );
}
