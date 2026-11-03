import { useState } from 'react';
import { Search, Settings, ArrowUpDown, MoreVertical } from 'lucide-react';
import { JOB_STATUSES } from '../../utils/constants';

const demoJobs = [
  { id: 1, title: 'Software Developer', deadline: 'Jan 15, 2023', status: 'PUBLISHED', openings: 3, closed: 1, timeToHire: '10 days' },
  { id: 2, title: 'Systems Administrator', deadline: 'Mar 7, 2023', status: 'ON_HOLD', openings: 4, closed: 3, timeToHire: '07 days' },
  { id: 3, title: 'Cybersecurity Analyst', deadline: 'May 22, 2023', status: 'PUBLISHED', openings: 2, closed: 1, timeToHire: '12 days' },
  { id: 4, title: 'Data Scientist', deadline: 'Jul 14, 2023', status: 'PUBLISHED', openings: 5, closed: 4, timeToHire: '09 days' },
  { id: 5, title: 'DevOps Engineer', deadline: 'Sep 30, 2023', status: 'ON_HOLD', openings: 5, closed: 3, timeToHire: '07 days' },
];

export default function JobsOverview({ jobs }) {
  const [activeTab, setActiveTab] = useState('ongoing');
  const data = jobs?.length ? jobs : demoJobs;

  return (
    <div className="card mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Jobs overview</h2>
        <div className="flex items-center gap-2">
          {[Search, Settings, ArrowUpDown, MoreVertical].map((Icon, i) => (
            <button key={i} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeTab === 'ongoing' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          Ongoing
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeTab === 'review' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          Review & publish
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 text-xs font-medium">
              <th className="pb-3 pr-4">Job role <span className="inline-block ml-0.5">▾</span></th>
              <th className="pb-3 pr-4">Deadline <span className="inline-block ml-0.5">▾</span></th>
              <th className="pb-3 pr-4">Status <span className="inline-block ml-0.5">▾</span></th>
              <th className="pb-3 pr-4 text-center">Openings</th>
              <th className="pb-3 pr-4 text-center">Closed</th>
              <th className="pb-3 text-center">Time to hire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((job) => {
              const statusKey = job.status || 'PUBLISHED';
              const statusInfo = JOB_STATUSES[statusKey] || JOB_STATUSES.PUBLISHED;
              return (
                <tr key={job.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  <td className="py-3 pr-4 font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{job.title}</td>
                  <td className="py-3 pr-4 text-gray-500">{job.deadline}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-center text-gray-600">{String(job.openings).padStart(2, '0')}</td>
                  <td className="py-3 pr-4 text-center text-gray-600">{String(job.closed ?? job.closed_count ?? 0).padStart(2, '0')}</td>
                  <td className="py-3 text-center text-gray-600">{job.timeToHire || job.time_to_hire || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
