import { useState, useEffect } from 'react';
import { getProfiles } from '../api/candidates';
import CandidateList from '../components/candidates/CandidateList';
import CandidateProfile from '../components/candidates/CandidateProfile';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function TalentPoolPage() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const { data } = await getProfiles(); setCandidates(data?.results || data || []); }
      catch { toast.error('Failed to load talent pool'); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Talent Pool</h1>
      <p className="text-sm text-gray-500 mb-6">{candidates.length} candidates in pool</p>
      <CandidateList candidates={candidates} onSelect={setSelected} />
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Candidate Profile" size="lg">
        <CandidateProfile profile={selected} />
      </Modal>
    </div>
  );
}
