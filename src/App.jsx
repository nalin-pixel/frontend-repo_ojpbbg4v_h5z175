import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TrendChart from './components/TrendChart';
import TrafficTable from './components/TrafficTable';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch analytics data from backend if available
  useEffect(() => {
    const base = import.meta.env.VITE_BACKEND_URL;
    if (!base) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${base}/analytics/summary`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (e) {
        console.warn('Analytics API not available, using demo data.');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    if (!sessions.length) {
      return {
        totalVisits: 0,
        avgTime: '0s',
        topLocation: '—',
        topPlatform: '—',
      };
    }
    const total = sessions.length;
    const avgSec = Math.round(
      sessions.reduce((a, b) => a + (b.seconds || 0), 0) / (total || 1)
    );
    const toDur = (s) => {
      const m = Math.floor(s / 60);
      const ss = s % 60;
      return `${m ? m + 'm ' : ''}${ss}s`;
    };
    const locationCount = sessions.reduce((acc, s) => {
      const key = s.location || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const platformCount = sessions.reduce((acc, s) => {
      const key = s.platform || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const top = (obj) => Object.entries(obj).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—';
    return {
      totalVisits: total,
      avgTime: toDur(avgSec),
      topLocation: top(locationCount),
      topPlatform: top(platformCount),
    };
  }, [sessions]);

  const trendPoints = useMemo(() => {
    if (!sessions.length) return [];
    // group by hour
    const buckets = new Map();
    for (const s of sessions) {
      const t = new Date(s.timestamp || s.time).getHours();
      buckets.set(t, (buckets.get(t) || 0) + 1);
    }
    return Array.from({ length: 24 }, (_, h) => ({ x: h, y: buckets.get(h) || 0 }));
  }, [sessions]);

  const tableRows = useMemo(() => {
    if (!sessions.length) return [];
    return sessions.slice(0, 50).map((s) => ({
      time: new Date(s.timestamp || s.time).toLocaleString(),
      duration: `${Math.floor((s.seconds||0)/60)}m ${(s.seconds||0)%60}s`,
      location: s.location || 'Unknown',
      platform: s.platform || 'Unknown',
      referrer: s.referrer || 'Direct',
      path: s.path || '/',
    }));
  }, [sessions]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Header />
        <SummaryCards stats={stats} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <TrendChart points={trendPoints} />
          </div>
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-800 mb-2">Quick Start</h3>
              <ol className="list-decimal list-inside text-slate-600 space-y-1 text-sm">
                <li>Copy the install snippet above.</li>
                <li>Paste it before the closing body tag on your site.</li>
                <li>Set your API base and watch sessions appear here.</li>
              </ol>
            </div>
          </div>
        </div>
        <TrafficTable rows={tableRows} />
        {loading && (
          <div className="text-center text-slate-500">Loading…</div>
        )}
      </div>
    </div>
  );
}
