export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smarthire-api-6dew.onrender.com/api/v1';

export const USER_ROLES = { ADMIN: 'ADMIN', RECRUITER: 'RECRUITER', CANDIDATE: 'CANDIDATE' };

export const APPLICATION_STATUSES = {
  NEW: { label: 'New', color: 'bg-blue-100 text-blue-700' },
  SCREENING: { label: 'Screening', color: 'bg-purple-100 text-purple-700' },
  QUALIFIED: { label: 'Qualified', color: 'bg-indigo-100 text-indigo-700' },
  INTERVIEW_SCHEDULED: { label: 'Scheduled', color: 'bg-amber-100 text-amber-700' },
  INTERVIEWED: { label: 'Interviewed', color: 'bg-cyan-100 text-cyan-700' },
  OFFERED: { label: 'Offered', color: 'bg-emerald-100 text-emerald-700' },
  HIRED: { label: 'Hired', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
};

export const JOB_STATUSES = {
  PUBLISHED: { label: 'In progress', color: 'bg-green-100 text-green-700' },
  ON_HOLD: { label: 'Hold', color: 'bg-amber-100 text-amber-700' },
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  CLOSED: { label: 'Closed', color: 'bg-red-100 text-red-700' },
};

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Request', path: '/requests' },
  { label: 'Applications', path: '/applications' },
  { label: 'Job', path: '/jobs' },
  { label: 'Talent pool', path: '/talent-pool' },
  { label: 'Interviews', path: '/interviews' },
  { label: 'Reports', path: '/reports' },
];
