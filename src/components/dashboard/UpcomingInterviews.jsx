import { useState } from 'react';

const demoInterviews = [
  { id: 1, day: '21', month: 'Jan', time: '9:00 - 10:30 am', title: 'Software developer L1 - Marketing', borderColor: 'border-l-blue-400' },
  { id: 2, day: '21', month: 'Jan', time: '9:00 - 10:30 am', title: 'Software developer L1 - Marketing', borderColor: 'border-l-emerald-400' },
  { id: 3, day: '25', month: 'Jan', time: '9:00 - 10:30 am', title: 'Software developer L1 - Marketing', borderColor: 'border-l-amber-400' },
  { id: 4, day: '28', month: 'Jan', time: '9:00 - 10:30 am', title: 'Software developer L1 - Marketing', borderColor: 'border-l-rose-400' },
];

export default function UpcomingInterviews({ interviews }) {
  const [tab, setTab] = useState('assigned');
  const data = interviews?.length ? interviews : demoInterviews;

  return (
    <div className="card h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-800">Upcoming interview</h2>
        <button className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors">View all</button>
      </div>
      <p className="text-xs text-gray-400 mb-4">Total interview : 13</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('assigned')}
          className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${tab === 'assigned' ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          Assigned to me
        </button>
        <button
          onClick={() => setTab('scheduled')}
          className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${tab === 'scheduled' ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          Scheduled by me
        </button>
      </div>

      {/* Interview Cards */}
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100 border-l-[3px] ${item.borderColor || 'border-l-blue-400'} transition-all cursor-pointer hover:shadow-sm`}
          >
            {/* Date Circle */}
            <div className="text-center min-w-[44px]">
              <p className="text-[10px] text-gray-400 font-medium leading-none">{item.month || 'Jan'}</p>
              <p className="text-xl font-extrabold text-gray-700 leading-tight">{item.day || '21'}</p>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700">{item.time || '9:00 - 10:30 am'}</p>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.title || 'Software developer L1 - Marketing'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
