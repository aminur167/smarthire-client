export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smarthire-api-6dew.onrender.com/api/v1';
export const API_ORIGIN = new URL(API_BASE_URL).origin;
export const getMediaUrl = (value) => {
  if (!value) return null;
  try { return new URL(value, `${API_ORIGIN}/`).toString(); }
  catch { return value; }
};

export const USER_ROLES = { ADMIN: 'ADMIN', RECRUITER: 'RECRUITER', CANDIDATE: 'CANDIDATE' };

export const APPLICATION_STATUSES = {
  NEW: { label: 'New', color: 'bg-slate-100 text-slate-700' },
  SCREENING: { label: 'Screening', color: 'bg-sky-50 text-sky-800' },
  QUALIFIED: { label: 'Qualified', color: 'bg-indigo-50 text-indigo-800' },
  INTERVIEW_SCHEDULED: { label: 'Interview scheduled', color: 'bg-amber-50 text-amber-800' },
  INTERVIEWED: { label: 'Interviewed', color: 'bg-violet-50 text-violet-800' },
  OFFERED: { label: 'Offer extended', color: 'bg-emerald-50 text-emerald-800' },
  HIRED: { label: 'Hired', color: 'bg-green-50 text-green-800' },
  REJECTED: { label: 'Declined', color: 'bg-rose-50 text-rose-800' },
};

export const JOB_STATUSES = {
  PUBLISHED: { label: 'Published', color: 'bg-emerald-50 text-emerald-800' },
  ON_HOLD: { label: 'On hold', color: 'bg-amber-50 text-amber-800' },
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
