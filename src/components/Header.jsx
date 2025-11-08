import { useState } from 'react';
import { Rocket, Copy, Check } from 'lucide-react';

export default function Header() {
  const [copied, setCopied] = useState(false);

  const embedCode = `<!-- Flames Track: drop this before </body> -->\n<script>(function(){\n  const s=document.createElement('script');\n  s.async=true;\n  s.src=(window.location.protocol==='https:'?'https://':'http://')+ (window.FLAMES_TRACK_URL||'YOUR_BACKEND_URL') + '/track.js';\n  document.body.appendChild(s);\n})();</script>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-500 text-white shadow-lg">
      <div className="absolute inset-0 opacity-30" style={{backgroundImage:'radial-gradient(circle at 20% 20%, rgba(255,255,255,.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,.2), transparent 40%)'}} />
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/15 backdrop-blur">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Flames Track — Realtime Website Analytics
            </h1>
            <p className="text-white/90 mt-1 text-sm sm:text-base">
              Lightweight, privacy-aware tracking. Drop a single snippet to start collecting insights.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-black/20 rounded-xl p-4 sm:p-5 backdrop-blur border border-white/15">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-white/90">Installation snippet</span>
            <button onClick={copy} className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition">
              {copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-white/90 overflow-x-auto">
            {embedCode}
          </pre>
          <p className="text-xs text-white/80 mt-3">
            Replace <span className="font-semibold">YOUR_BACKEND_URL</span> with your API base (set VITE_BACKEND_URL when you go live).
          </p>
        </div>
      </div>
    </div>
  );
}
