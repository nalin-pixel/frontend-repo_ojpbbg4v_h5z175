import { BarChart2, Clock, Globe2, MonitorSmartphone } from 'lucide-react';

export default function SummaryCards({ stats }) {
  const cards = [
    { title: 'Total Visits', value: stats.totalVisits ?? 0, icon: BarChart2, color: 'from-indigo-500 to-sky-500' },
    { title: 'Avg. Time on Site', value: stats.avgTime ?? '0s', icon: Clock, color: 'from-amber-500 to-rose-500' },
    { title: 'Top Location', value: stats.topLocation ?? '—', icon: Globe2, color: 'from-emerald-500 to-teal-500' },
    { title: 'Top Platform', value: stats.topPlatform ?? '—', icon: MonitorSmartphone, color: 'from-fuchsia-500 to-pink-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(({ title, value, icon: Icon, color }) => (
        <div key={title} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
          <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(80% 80% at 120% -20%, rgba(255,255,255,.65), transparent)'}} />
          <div className="relative p-5 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-black/20 backdrop-blur">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-white/80 text-sm">{title}</p>
              <p className="text-2xl font-semibold mt-1">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
