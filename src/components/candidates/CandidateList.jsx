import { useState } from 'react';
import CandidateCard from './CandidateCard';
import SearchBar from '../common/SearchBar';

export default function CandidateList({ candidates = [], onSelect }) {
  const [search, setSearch] = useState('');
  const filtered = candidates.filter((c) => {
    const name = `${c.user_detail?.first_name || ''} ${c.user_detail?.last_name || ''} ${c.user_detail?.email || ''}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search candidates..." />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {filtered.map((c) => <CandidateCard key={c.id} candidate={c} onClick={onSelect} />)}
      </div>
      {filtered.length === 0 && <p className="text-center text-gray-400 py-16 text-sm">No candidates found</p>}
    </div>
  );
}
