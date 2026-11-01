export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-100">
            {columns.map((col) => (
              <th key={col.key} className="pb-3 pr-4 text-xs font-medium text-gray-400 uppercase tracking-wider">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row, i) => (
            <tr key={row.id || i} onClick={() => onRowClick?.(row)} className="hover:bg-gray-50/70 transition-colors cursor-pointer">
              {columns.map((col) => (
                <td key={col.key} className="py-3 pr-4 text-gray-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No data found</p>}
    </div>
  );
}
