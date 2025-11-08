import { useEffect, useRef } from 'react';

// Minimal canvas line chart to avoid extra deps and evoke a PowerBI vibe
export default function TrendChart({ points }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#4f46e5');
    grad.addColorStop(1, '#06b6d4');

    ctx.clearRect(0, 0, rect.width, rect.height);

    const data = points && points.length ? points : Array.from({ length: 24 }, (_, i) => ({ x: i, y: Math.random() * 100 }));

    const padding = 16;
    const maxX = Math.max(...data.map(p => p.x));
    const maxY = Math.max(...data.map(p => p.y), 1);

    const toX = v => padding + (rect.width - padding * 2) * (v / (maxX || 1));
    const toY = v => rect.height - padding - (rect.height - padding * 2) * (v / maxY);

    // Grid lines
    ctx.strokeStyle = 'rgba(100,116,139,0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + ((rect.height - padding * 2) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
      ctx.stroke();
    }

    // Area fill
    ctx.beginPath();
    data.forEach((p, i) => {
      const x = toX(p.x);
      const y = toY(p.y);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(toX(data[data.length - 1].x), rect.height - padding);
    ctx.lineTo(toX(data[0].x), rect.height - padding);
    ctx.closePath();
    const areaGrad = ctx.createLinearGradient(0, 0, 0, rect.height);
    areaGrad.addColorStop(0, 'rgba(79,70,229,0.35)');
    areaGrad.addColorStop(1, 'rgba(6,182,212,0.05)');
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Line stroke
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = grad;
    data.forEach((p, i) => {
      const x = toX(p.x);
      const y = toY(p.y);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    ctx.fillStyle = '#0ea5e9';
    data.forEach((p) => {
      const x = toX(p.x);
      const y = toY(p.y);
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [points]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 className="font-semibold text-slate-800">Traffic Trend</h3>
        <p className="text-sm text-slate-500">Visits over time</p>
      </div>
      <div className="p-2">
        <div className="h-56 sm:h-72">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
