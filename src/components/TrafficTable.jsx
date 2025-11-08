import { useMemo } from 'react';

export default function TrafficTable({ rows }) {
  const data = useMemo(() => rows ?? [], [rows]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 className="font-semibold text-slate-800">Recent Sessions</h3>
        <p className="text-sm text-slate-500">Each session includes entry time, duration, location, platform and referrer.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 bg-slate-50/60">
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Platform</th>
              <th className="px-4 py-3 font-medium">Referrer</th>
              <th className="px-4 py-3 font-medium">Path</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={6}>No sessions yet. Add the install snippet to your site and come back.</td>
              </tr>
            )}
            {data.map((r, i) => (
              <tr key={r.id || i} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-3">{r.time || r.timestamp || '-'}</td>
                <td className="px-4 py-3">{r.duration || '-'}</td>
                <td className="px-4 py-3">{r.location || '-'}</td>
                <td className="px-4 py-3">{r.platform || '-'}</td>
                <td className="px-4 py-3">{r.referrer || '-'}</td>
                <td className="px-4 py-3">{r.path || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
