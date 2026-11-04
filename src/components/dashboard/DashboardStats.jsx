import { TrendingUp, Users, Briefcase, CalendarDays } from 'lucide-react';

const stats = [
  { label: 'Total Jobs', value: '48', change: '+12%', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Total Candidates', value: '1,240', change: '+8%', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Interviews Today', value: '12', change: '+3', icon: CalendarDays, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Hire Rate', value: '68%', change: '+5%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value, change, icon: Icon, color, bg }) => (
        <div key={label} className="card flex items-center gap-4">
          <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
            <p className="text-[11px] text-emerald-500 font-semibold">{change} this month</p>
          </div>
        </div>
      ))}
    </div>
  );
}
