import { enterpriseScore, maxScore, getTierLabel } from '@/data/demoData';

const CyberRating = () => {
  const score = enterpriseScore;
  const tier = getTierLabel(score);
  const pct = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (pct / 100) * circumference;

  const assetScores = [
    { name: 'auth.pnb.co.in', score: 100, color: 'hsl(var(--status-safe))' },
    { name: 'pqc-api.pnb.co.in', score: 100, color: 'hsl(var(--status-safe))' },
    { name: 'swift.pnb.co.in', score: 71, color: 'hsl(var(--accent-amber))' },
    { name: 'vpn.pnb.co.in', score: 24, color: 'hsl(var(--status-critical))' },
    { name: 'reporting.pnb.co.in', score: 24, color: 'hsl(var(--status-critical))' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[hsl(var(--border-default))] p-5">
      <h3 className="font-body font-bold text-sm text-foreground mb-4">Cyber Rating</h3>

      {/* Score gauge */}
      <div className="flex flex-col items-center mb-6">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="60" fill="none" stroke="hsl(var(--border-default))" strokeWidth="8" />
          <circle
            cx="75" cy="75" r="60" fill="none"
            stroke="hsl(var(--status-critical))"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 75 75)"
          />
          <text x="75" y="70" textAnchor="middle" className="font-mono text-3xl font-bold" fill="hsl(var(--status-critical))">
            {score}
          </text>
          <text x="75" y="88" textAnchor="middle" className="font-mono text-xs" fill="hsl(var(--text-muted))">
            / {maxScore}
          </text>
        </svg>
        <span className="font-body font-bold text-lg text-status-critical mt-2">{tier}</span>
        <span className="font-body text-xs text-muted-foreground">Remediation required</span>
      </div>

      {/* Asset scores */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-muted-foreground uppercase">Asset Scores</span>
        {assetScores.map(a => (
          <div key={a.name} className="flex items-center justify-between">
            <span className="font-mono text-xs text-foreground">{a.name}</span>
            <span className="font-mono text-xs font-bold" style={{ color: a.color }}>{a.score}</span>
          </div>
        ))}
      </div>

      {/* Tier reference */}
      <div className="mt-4 pt-4 border-t border-[hsl(var(--border-default))]">
        <span className="font-mono text-[10px] text-muted-foreground uppercase block mb-2">Tier Reference</span>
        <div className="grid grid-cols-2 gap-1">
          {[
            { label: 'Critical', range: '< 200', color: 'bg-status-critical' },
            { label: 'Legacy', range: '200–400', color: 'bg-status-vuln' },
            { label: 'Standard', range: '400–700', color: 'bg-accent-amber' },
            { label: 'Elite-PQC', range: '> 700', color: 'bg-status-safe' },
          ].map(t => (
            <div key={t.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${t.color}`} />
              <span className="font-mono text-[10px] text-muted-foreground">{t.label} ({t.range})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CyberRating;
