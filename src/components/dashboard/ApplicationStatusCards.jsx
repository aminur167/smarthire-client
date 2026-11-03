import { FileText, CheckCircle2, CalendarCheck, UserCheck, Star } from 'lucide-react';

const cards = [
  { label: 'New applications', value: 234, icon: FileText, bg: 'bg-gradient-to-br from-rose-400 to-rose-500', iconBg: 'bg-rose-300/40' },
  { label: 'Qualified', value: 135, icon: CheckCircle2, bg: 'bg-gradient-to-br from-blue-400 to-blue-500', iconBg: 'bg-blue-300/40' },
  { label: 'Scheduled', value: 112, icon: CalendarCheck, bg: 'bg-gradient-to-br from-emerald-400 to-emerald-500', iconBg: 'bg-emerald-300/40' },
  { label: 'Interviewed', value: 94, icon: UserCheck, bg: 'bg-gradient-to-br from-violet-400 to-violet-500', iconBg: 'bg-violet-300/40' },
  { label: 'Joined', value: 26, icon: Star, bg: 'bg-gradient-to-br from-pink-400 to-pink-500', iconBg: 'bg-pink-300/40' },
];

export default function ApplicationStatusCards({ stats }) {
  const data = stats ? [
    { ...cards[0], value: stats.new_applications ?? 234 },
    { ...cards[1], value: stats.qualified ?? 135 },
    { ...cards[2], value: stats.scheduled ?? 112 },
    { ...cards[3], value: stats.interviewed ?? 94 },
    { ...cards[4], value: stats.joined ?? 26 },
  ] : cards;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Application status</h2>
      <div className="grid grid-cols-5 gap-3">
        {data.map(({ label, value, icon: Icon, bg, iconBg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 text-white relative overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer`}>
            <div className={`${iconBg} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-[18px] h-[18px] text-white" />
            </div>
            <p className="text-2xl font-extrabold leading-none">{value}</p>
            <p className="text-[11px] text-white/80 mt-1 font-medium">{label}</p>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
