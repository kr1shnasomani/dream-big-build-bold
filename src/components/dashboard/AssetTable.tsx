import { useState } from 'react';
import { assets, getStatusLabel, getQScoreColor } from '@/data/demoData';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Asset } from '@/data/demoData';

const AssetTable = () => {
  const [selected, setSelected] = useState<Asset | null>(null);
  const [search, setSearch] = useState('');

  const filtered = assets.filter(a =>
    a.domain.toLowerCase().includes(search.toLowerCase())
  );

  const statusBgColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-status-critical/10 text-status-critical';
      case 'standard': return 'bg-accent-amber/10 text-accent-amber';
      case 'safe': return 'bg-status-safe/10 text-status-safe';
      case 'elite-pqc': return 'bg-status-safe/10 text-status-safe';
      case 'unknown': return 'bg-status-unknown/10 text-status-unknown';
      default: return 'bg-status-unknown/10 text-status-unknown';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[hsl(var(--border-default))] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border-default))]">
          <div className="flex items-center gap-3">
            <h3 className="font-body font-bold text-sm text-foreground">Asset Inventory</h3>
            <span className="font-mono text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded">
              {assets.length} ASSETS
            </span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="font-mono text-xs bg-sunken border border-[hsl(var(--border-default))] rounded-lg px-3 py-1.5 w-48 focus:outline-none focus:border-brand-accent/50"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[hsl(var(--border-default))] bg-sunken/50">
                {['ASSET', 'TYPE', 'TLS', 'CIPHER SUITE', 'KEY EXCHANGE', 'CERTIFICATE', 'Q-SCORE', 'STATUS'].map(h => (
                  <th key={h} className="font-mono text-[10px] text-muted-foreground uppercase px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr
                  key={a.domain}
                  onClick={() => setSelected(a)}
                  className="border-b border-[hsl(var(--border-default))] last:border-0 hover:bg-sunken/30 cursor-pointer transition-colors"
                >
                  <td className="font-mono text-xs text-foreground px-4 py-3">{a.domain}</td>
                  <td className="font-mono text-[10px] text-muted-foreground px-4 py-3 uppercase">{a.type}</td>
                  <td className="font-mono text-xs text-foreground px-4 py-3">{a.tls}</td>
                  <td className="font-mono text-[10px] text-muted-foreground px-4 py-3 max-w-[200px] truncate">{a.cipher}</td>
                  <td className="font-mono text-xs text-foreground px-4 py-3">{a.keyExchange}</td>
                  <td className="font-mono text-xs text-muted-foreground px-4 py-3">{a.certificate}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold" style={{ color: getQScoreColor(a.qScore) }}>
                      {a.qScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded ${statusBgColor(a.status)}`}>
                      {getStatusLabel(a.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-[400px] sm:max-w-[400px] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono text-sm">{selected.domain}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Certification badge */}
                <div className="flex justify-center">
                  <div
                    className="w-24 h-28 rounded-xl flex flex-col items-center justify-center border-2"
                    style={{
                      borderColor: getQScoreColor(selected.qScore),
                      backgroundColor: `${getQScoreColor(selected.qScore)}10`,
                    }}
                  >
                    <span className="text-2xl">🛡</span>
                    <span className="font-mono text-xs font-bold mt-1" style={{ color: getQScoreColor(selected.qScore) }}>
                      {getStatusLabel(selected.status)}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  {[
                    { label: 'URL', value: `https://${selected.domain}:${selected.port}` },
                    { label: 'IP Address', value: selected.ip },
                    { label: 'Type', value: selected.type.toUpperCase() },
                    { label: 'TLS Version', value: selected.tls },
                    { label: 'Cipher Suite', value: selected.cipher },
                    { label: 'Key Exchange', value: selected.keyExchange },
                    { label: 'Certificate', value: selected.certificate },
                  ].map(d => (
                    <div key={d.label} className="flex justify-between items-start">
                      <span className="font-mono text-[10px] text-muted-foreground uppercase">{d.label}</span>
                      <span className="font-mono text-xs text-foreground text-right max-w-[200px]">{d.value}</span>
                    </div>
                  ))}
                </div>

                {/* Q-Score gauge */}
                <div className="flex flex-col items-center">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border-default))" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke={getQScoreColor(selected.qScore)}
                      strokeWidth="6"
                      strokeDasharray={`${(selected.qScore / 100) * 251.3} 251.3`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="54" textAnchor="middle" className="font-mono text-xl font-bold" fill={getQScoreColor(selected.qScore)}>
                      {selected.qScore}
                    </text>
                  </svg>
                  <span className="font-mono text-xs text-muted-foreground mt-1">Q-Score</span>
                </div>

                {/* HNDL */}
                {selected.hndlYears !== null && (
                  <div className="bg-sunken rounded-lg p-4">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">HNDL Timeline</span>
                    <p className="font-body text-sm text-foreground mt-1">
                      Estimated decryptable in <strong className="font-mono text-status-critical">{selected.hndlYears} years</strong>
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full font-body text-sm font-bold bg-accent-amber text-brand-primary py-2.5 rounded-lg">
                    Generate Remediation
                  </button>
                  <button className="w-full font-body text-sm text-brand-primary border border-[hsl(var(--border-default))] py-2.5 rounded-lg">
                    View Full CBOM
                  </button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AssetTable;
