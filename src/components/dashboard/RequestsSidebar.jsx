import { User, Edit3, UserPlus, Gift } from 'lucide-react';

const defaultRequests = [
  { icon: User, count: '03', label: 'Single hiring request', gradient: 'from-blue-400 to-blue-500' },
  { icon: Edit3, count: '03', label: 'Modify hiring request', gradient: 'from-violet-400 to-purple-500' },
  { icon: UserPlus, count: '06', label: 'Assign recruiter', gradient: 'from-emerald-400 to-green-500' },
  { icon: Gift, count: '04', label: 'Referral bonus', gradient: 'from-amber-400 to-yellow-500' },
];

export default function RequestsSidebar({ data }) {
  const items = data
    ? [
        { ...defaultRequests[0], count: String(data.single_hiring ?? 3).padStart(2, '0') },
        { ...defaultRequests[1], count: String(data.modify_hiring ?? 3).padStart(2, '0') },
        { ...defaultRequests[2], count: String(data.assign_recruiter ?? 6).padStart(2, '0') },
        { ...defaultRequests[3], count: String(data.referral_bonus ?? 4).padStart(2, '0') },
      ]
    : defaultRequests;

  const total = data?.total ?? 21;

  return (
    <div className="card h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">Requests</h2>
        <p className="text-xs text-gray-400 mt-0.5">Total request : {total}</p>
      </div>

      <div className="space-y-3">
        {items.map(({ icon: Icon, count, label, gradient }) => (
          <div
            key={label}
            className={`bg-gradient-to-r ${gradient} rounded-2xl p-4 text-white hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none">{count}</p>
                <p className="text-[11px] text-white/80 mt-0.5 font-medium">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
