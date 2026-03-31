import { useState } from 'react';
import { Shield } from 'lucide-react';

const DashboardTopBar = () => {
  const [domain, setDomain] = useState('');

  return (
    <header className="h-14 bg-brand-primary flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-4">
        <span className="font-body text-sm text-white/80">Dashboard</span>
      </div>

      {/* Domain input */}
      <div className="flex items-center gap-2 flex-1 max-w-md mx-6">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain to scan (e.g. pnb.co.in)"
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/40 font-mono focus:outline-none focus:border-accent-amber/50"
        />
        <button className="font-body text-xs font-bold bg-accent-amber text-brand-primary px-4 py-1.5 rounded-lg hover:brightness-105 transition-all whitespace-nowrap">
          Scan Domain
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="font-body text-xs font-bold bg-accent-amber text-brand-primary px-4 py-1.5 rounded-lg">
          ▶ Run Demo Scan
        </button>
        <span className="font-body text-xs text-white/50 hidden lg:inline">Export PDF</span>
        <span className="font-body text-xs text-white/50 hidden lg:inline">Export CBOM</span>
        <span className="font-body text-xs text-white/50 hidden lg:inline">Export CDXA</span>
      </div>
    </header>
  );
};

export default DashboardTopBar;
