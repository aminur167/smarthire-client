import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob } from '../api/jobs';
import { applyForJob } from '../api/candidates';
import JobDetail from '../components/jobs/JobDetail';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const { data } = await getJob(id); setJob(data); }
      catch { toast.error('Job not found'); navigate('/jobs'); }
      setLoading(false);
    })();
  }, [id]);

  const handleApply = async (job) => {
    try {
      await applyForJob({ job: job.id, cover_letter: `I am excited to apply for the ${job.title} position.` });
      toast.success('Application submitted!');
    } catch (err) { toast.error(err.response?.data?.non_field_errors?.[0] || err.response?.data?.job?.[0] || 'Failed to apply'); }
  };

  if (loading) return <Loader />;
  return <JobDetail job={job} onBack={() => navigate('/jobs')} onApply={user?.role === 'CANDIDATE' ? handleApply : null} />;
}
