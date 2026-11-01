import { APPLICATION_STATUSES } from '../../utils/constants';

export default function StatusBadge({ status }) {
  const info = APPLICATION_STATUSES[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${info.color}`}>{info.label}</span>;
}
