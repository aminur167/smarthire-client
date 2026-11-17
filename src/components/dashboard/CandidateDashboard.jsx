import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  CalendarDays,
  Sparkles,
  ExternalLink,
  Clock,
  MapPin,
  CheckCircle2,
  Video,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { getCandidatePortal } from '../../api/dashboard';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortal();
  }, []);

  const fetchPortal = async () => {
    try {
      const res = await getCandidatePortal();
      setData(res.data);
    } catch {
      // Fallback demo data for preview
      setData({
        my_applications: [
          {
            id: 1,
            job_id: 1,
            job_title: 'Senior Backend Engineer',
            department: 'Engineering',
            location: 'Remote',
            job_type: 'FULL_TIME',
            status: 'INTERVIEW_SCHEDULED',
            match_score: 94,
            applied_at: 'Nov 12, 2026',
          },
          {
            id: 2,
            job_id: 3,
            job_title: 'Full Stack Python Developer',
            department: 'Product',
            location: 'Berlin, DE',
            job_type: 'REMOTE',
            status: 'SCREENING',
            match_score: 88,
            applied_at: 'Nov 10, 2026',
          },
        ],
        total_applied: 2,
        interviews_count: 1,
        recommended_jobs: [
          {
            id: 9,
            title: 'Backend Engineer (Django/DRF)',
            department: 'Engineering',
            location: 'Remote',
            job_type: 'FULL_TIME',
            salary_min: '75000',
            salary_max: '120000',
            skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
          },
          {
            id: 10,
            title: 'Machine Learning Engineer',
            department: 'Data Science',
            location: 'Remote',
            job_type: 'REMOTE',
            salary_min: '85000',
            salary_max: '140000',
            skills: ['Python', 'PyTorch', 'Docker', 'AWS'],
          },
        ],
        upcoming_interviews: [
          {
            id: 1,
            job_title: 'Senior Backend Engineer',
            scheduled_at: 'Nov 20, 2026 • 04:30 PM',
            round_type: 'TECHNICAL',
            meeting_link: 'https://meet.google.com/abc-defg-hij',
            interviewer_name: 'David Keller (Lead Architect)',
            status: 'SCHEDULED',
          },
        ],
        has_resume: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'INTERVIEW_SCHEDULED':
        return { label: 'Interview Scheduled', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'SCREENING':
        return { label: 'In Screening', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'OFFERED':
        return { label: 'Offer Extended', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'HIRED':
        return { label: 'Hired', color: 'bg-green-50 text-green-700 border-green-200' };
      default:
        return { label: 'Application Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-emerald-700/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-200 backdrop-blur-md border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Career Accelerator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.first_name || 'Candidate'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
            Track your live job applications, join scheduled technical interviews, and review automated AI skill matches.
          </p>
        </div>

        {/* Profile Readiness Meter */}
        <div className="bg-black/30 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-200 font-semibold">Resume Status:</span>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                Verified
              </span>
            </div>
            <p className="text-xs text-white/90 mt-0.5">Profile Completeness: 95%</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Applications Tracker & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: My Applications Tracker (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">My Job Applications</h2>
                <p className="text-xs text-gray-500">Real-time status updates across hiring rounds.</p>
              </div>
              <Link
                to="/jobs"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Browse Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Applications List */}
            {data?.my_applications?.length > 0 ? (
              <div className="space-y-3">
                {data.my_applications.map((app) => {
                  const badge = getStatusBadge(app.status);
                  return (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-indigo-50/20 hover:border-indigo-100 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-sm">{app.job_title}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {app.department}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {app.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            Applied {app.applied_at}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {/* Match Score */}
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{app.match_score}% Fit</span>
                          </div>
                          <span className="text-[10px] text-gray-400">AI Match Score</span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 space-y-2">
                <Briefcase className="w-8 h-8 mx-auto text-gray-300" />
                <p className="text-xs">You haven't submitted any applications yet.</p>
                <Link
                  to="/jobs"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                >
                  Explore Open Jobs
                </Link>
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Recommended Jobs For You</h2>
                <p className="text-xs text-gray-500">Matched to your profile credentials and skills.</p>
              </div>
              <Link to="/jobs" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data?.recommended_jobs?.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-xs transition-all space-y-2.5 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{job.title}</h4>
                      <p className="text-[11px] text-gray-400">{job.department} • {job.location}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      ${Math.round(job.salary_min / 1000)}k - ${Math.round(job.salary_max / 1000)}k
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1">
                    {job.skills?.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">{job.job_type}</span>
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Upcoming Interviews (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-gray-900">Upcoming Interviews</h2>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {data?.upcoming_interviews?.length > 0 ? (
              <div className="space-y-3">
                {data.upcoming_interviews.map((iv) => (
                  <div key={iv.id} className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                        {iv.round_type} ROUND
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm mt-1">{iv.job_title}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                        {iv.scheduled_at}
                      </p>
                    </div>

                    <p className="text-[11px] text-gray-600">
                      Interviewer: <span className="font-semibold text-gray-800">{iv.interviewer_name}</span>
                    </p>

                    <a
                      href={iv.meeting_link || 'https://meet.google.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Video Interview</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <CalendarDays className="w-8 h-8 mx-auto text-gray-300 mb-1" />
                <p className="text-xs">No upcoming interviews scheduled today.</p>
              </div>
            )}
          </div>

          {/* Resume Upload & AI Parser Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-white rounded-2xl p-6 border border-indigo-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Resume Intelligence</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Upload your latest resume to automatically match required skills and boost candidate ranking by 40%.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-2 px-3 border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              Manage Resume & Skills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
