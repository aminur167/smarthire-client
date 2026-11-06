import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getJobs, createJob, getDepartments } from '../api/jobs';
import JobList from '../components/jobs/JobList';
import JobForm from '../components/jobs/JobForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'RECRUITER';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, deptRes] = await Promise.all([getJobs(), getDepartments()]);
      setJobs(jobsRes.data?.results || jobsRes.data || []);
      setDepartments(deptRes.data?.results || deptRes.data || []);
    } catch { toast.error('Failed to load jobs'); }
    setLoading(false);
  };

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await createJob(data);
      toast.success('Job posted successfully!');
      setShowForm(false);
      loadData();
    } catch (err) { toast.error('Failed to create job'); }
    setSubmitting(false);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Job Postings</h1>
          <p className="text-sm text-gray-500 mt-1">{jobs.length} total positions</p>
        </div>
        {isStaff && <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Post New Job</Button>}
      </div>

      <JobList jobs={jobs} onSelect={(job) => navigate(`/jobs/${job.id}`)} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Post New Job" size="lg">
        <JobForm onSubmit={handleCreate} departments={departments} loading={submitting} />
      </Modal>
    </div>
  );
}
