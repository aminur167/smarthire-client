import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const appByMonth = [
  { month: 'Jan', count: 45 }, { month: 'Feb', count: 62 }, { month: 'Mar', count: 58 },
  { month: 'Apr', count: 71 }, { month: 'May', count: 89 }, { month: 'Jun', count: 95 },
  { month: 'Jul', count: 110 }, { month: 'Aug', count: 87 }, { month: 'Sep', count: 103 },
  { month: 'Oct', count: 78 }, { month: 'Nov', count: 92 }, { month: 'Dec', count: 68 },
];

const statusDist = [
  { name: 'Hired', value: 26, color: '#10B981' },
  { name: 'Interviewed', value: 94, color: '#8B5CF6' },
  { name: 'Qualified', value: 135, color: '#3B82F6' },
  { name: 'Rejected', value: 48, color: '#EF4444' },
  { name: 'Pending', value: 234, color: '#F59E0B' },
];

const hireRate = [
  { month: 'Jan', rate: 58 }, { month: 'Feb', rate: 62 }, { month: 'Mar', rate: 55 },
  { month: 'Apr', rate: 68 }, { month: 'May', rate: 72 }, { month: 'Jun', rate: 65 },
];

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Reports & Analytics</h1>
      <p className="text-sm text-gray-500 mb-6">Recruitment performance overview</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Month */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Applications by Month</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={appByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Application Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusDist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusDist.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hire Rate Trend */}
        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">Hire Rate Trend (%)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={hireRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={3} dot={{ r: 5, fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
