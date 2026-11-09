import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getInterviews, createInterview } from '../api/interviews';
import { getApplications } from '../api/candidates';
import InterviewList from '../components/interviews/InterviewList';
import ScheduleInterview from '../components/interviews/ScheduleInterview';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'RECRUITER';

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [intRes, appRes] = await Promise.all([getInterviews(), getApplications()]);
      setInterviews(intRes.data?.results || intRes.data || []);
      setApplications(appRes.data?.results || appRes.data || []);
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  };

  const handleSchedule = async (data) => {
    setSubmitting(true);
    try { await createInterview({ ...data, interviewer: user.id }); toast.success('Interview scheduled!'); setShowForm(false); loadData(); }
    catch (err) { toast.error('Failed to schedule interview'); }
    setSubmitting(false);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Interviews</h1>
          <p className="text-sm text-gray-500 mt-1">{interviews.length} scheduled</p>
        </div>
        {isStaff && <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Schedule Interview</Button>}
      </div>
      <InterviewList interviews={interviews} />
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Schedule Interview">
        <ScheduleInterview applications={applications} onSubmit={handleSchedule} loading={submitting} />
      </Modal>
    </div>
  );
}
