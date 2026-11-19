import { useEffect, useMemo, useState } from 'react';
import { Activity, BriefcaseBusiness, Download, FileText, UserRoundCheck } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getReports } from '../api/dashboard';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const STAGES = [
  ['NEW', 'New'], ['SCREENING', 'Screening'], ['QUALIFIED', 'Qualified'], ['INTERVIEW_SCHEDULED', 'Interview'],
  ['INTERVIEWED', 'Interviewed'], ['OFFERED', 'Offer'], ['HIRED', 'Hired'], ['REJECTED', 'Declined'],
];
const COLORS = ['#94a3b8', '#38bdf8', '#6366f1', '#f59e0b', '#8b5cf6', '#10b981', '#15803d', '#fb7185'];

export default function ReportsPage() {
  const [months, setMonths] = useState(6);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    getReports({ months }).then(({ data }) => { if (active) setReport(data); }).catch(() => { if (active) { setReport(null); toast.error('Could not load hiring analytics. Please try again.'); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [months]);

  const statusData = useMemo(() => STAGES.map(([key, name]) => ({ name, applications: report?.status_counts?.[key] || 0 })).filter((item) => item.applications > 0), [report]);
  const exportCsv = () => {
    if (!report) return;
    const lines = [['Hiring overview', 'Value'], ['Applications', report.summary.applications], ['Hires', report.summary.hires], ['Active roles', report.summary.active_jobs], ['Hire rate (%)', report.summary.hire_rate], [], ['Status', 'Applications'], ...STAGES.map(([key, label]) => [label, report.status_counts[key] || 0]), [], ['Month', 'Applications'], ...report.monthly_applications.map((row) => [row.month, row.applications])];
    const csv = lines.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `smarthire-hiring-report-${months}m.csv`; anchor.click(); URL.revokeObjectURL(url);
  };

  if (loading) return <Loader/>;
  if (!report) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center"><h1 className="text-lg font-bold text-slate-900">Analytics are unavailable</h1><p className="mt-2 text-sm text-slate-500">Check your connection and reload this page to try again.</p></div>;
  const summary = report.summary;
  const cards = [
    { label: 'Applications', value: summary.applications, note: `Across the selected ${months}-month window`, icon: FileText },
    { label: 'Hires', value: summary.hires, note: 'Applications marked as hired', icon: UserRoundCheck },
    { label: 'Active roles', value: summary.active_jobs, note: 'Currently published positions', icon: BriefcaseBusiness },
    { label: 'Hire rate', value: `${summary.hire_rate}%`, note: 'Hires divided by all applications', icon: Activity },
  ];

  return <div className="space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-800">Hiring insights</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Reports & analytics</h1><p className="mt-2 text-sm text-slate-500">A live view of your application funnel and recruiting activity.</p></div><div className="flex items-center gap-2"><select aria-label="Report period" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="input-field h-10 w-auto min-w-36"><option value={3}>Last 3 months</option><option value={6}>Last 6 months</option><option value={12}>Last 12 months</option></select><button onClick={exportCsv} className="btn-secondary h-10 px-3 text-xs"><Download className="h-4 w-4"/>Export CSV</button></div></header>
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, note, icon: Icon }) => <article key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-sm font-medium text-slate-500">{label}<span className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf7e2] text-[#47713a]"><Icon className="h-4 w-4"/></span></div><p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p><p className="mt-2 text-xs text-slate-400">{note}</p></article>)}</section>
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-2"><article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="text-base font-bold text-slate-900">Applications over time</h2><p className="mt-1 text-xs text-slate-500">Applications received in each month</p></div><ResponsiveContainer width="100%" height={280}><BarChart data={report.monthly_applications} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}><CartesianGrid vertical={false} stroke="#eef2f6"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }}/><Tooltip cursor={{ fill: '#f8fafc' }}/><Bar dataKey="applications" name="Applications" fill="#176b50" radius={[7, 7, 0, 0]} maxBarSize={40}/></BarChart></ResponsiveContainer></article>
      <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="text-base font-bold text-slate-900">Pipeline by stage</h2><p className="mt-1 text-xs text-slate-500">Current application status distribution</p></div>{statusData.length ? <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={statusData} dataKey="applications" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={3}>{statusData.map((entry, index) => <Cell key={entry.name} fill={COLORS[STAGES.findIndex(([, label]) => label === entry.name)] || COLORS[index]}/>)}</Pie><Tooltip/><Legend verticalAlign="bottom" height={42} iconType="circle" wrapperStyle={{ fontSize: 11 }}/></PieChart></ResponsiveContainer> : <div className="grid h-[280px] place-items-center text-sm text-slate-400">No application activity yet</div>}</article></section>
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-[.85fr_1.15fr]"><article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="text-base font-bold text-slate-900">Applications by team</h2><p className="mt-1 text-xs text-slate-500">Where candidate activity is concentrated</p></div>{report.applications_by_department.length ? <div className="space-y-4">{report.applications_by_department.map((team) => { const max = Math.max(...report.applications_by_department.map((row) => row.applications), 1); return <div key={team.department}><div className="mb-1.5 flex justify-between text-xs"><span className="font-semibold text-slate-700">{team.department}</span><span className="text-slate-500">{team.applications}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-700" style={{ width: `${team.applications / max * 100}%` }}/></div></div>; })}</div> : <div className="py-12 text-center text-sm text-slate-400">No department activity yet</div>}</article>
      <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div className="px-5 py-4 sm:px-6"><h2 className="text-base font-bold text-slate-900">Roles with the most activity</h2><p className="mt-1 text-xs text-slate-500">Applications and hires by opening</p></div>{report.top_jobs.length ? <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left"><thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Role</th><th className="px-4 py-3 text-right">Applications</th><th className="px-5 py-3 text-right">Hires</th></tr></thead><tbody className="divide-y divide-slate-100">{report.top_jobs.map((job) => <tr key={job.id}><td className="px-5 py-3.5 text-sm font-semibold text-slate-800">{job.title}</td><td className="px-4 py-3.5 text-right text-sm text-slate-600">{job.applications}</td><td className="px-5 py-3.5 text-right text-sm font-semibold text-emerald-800">{job.hires}</td></tr>)}</tbody></table></div> : <div className="px-5 py-12 text-center text-sm text-slate-400">No job activity yet</div>}</article></section>
    <p className="text-[11px] leading-5 text-slate-400">Analytics are calculated from the applications and job records currently available to your account. Hire rate is descriptive and should not be used as a standalone measure of hiring quality.</p>
  </div>;
}
