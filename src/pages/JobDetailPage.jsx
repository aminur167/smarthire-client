import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob } from '../api/jobs';
import { applyForJob } from '../api/candidates';
import { getApplications } from '../api/candidates';
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
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await getJob(id);
        if (active) setJob(data);
      } catch { toast.error('Job not found'); navigate('/jobs'); return; }
      if (user?.role === 'CANDIDATE') {
        try { const { data } = await getApplications({ job: id, page_size: 1 }); if (active) setAlreadyApplied((data?.results || data || []).length > 0); }
        catch { if (active) toast.error('Could not check your application history.'); }
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [id, user?.role, navigate]);

  const handleApply = async (job) => {
    try {
      await applyForJob({ job: job.id, cover_letter: `I am excited to apply for the ${job.title} position.` });
      setAlreadyApplied(true);
      toast.success('Application submitted!');
    } catch (err) { toast.error(err.response?.data?.non_field_errors?.[0] || err.response?.data?.job?.[0] || 'Failed to apply'); }
  };

  if (loading) return <Loader />;
  return <JobDetail job={job} alreadyApplied={alreadyApplied} onBack={() => navigate('/jobs')} onApply={user?.role === 'CANDIDATE' ? handleApply : null} />;
}
