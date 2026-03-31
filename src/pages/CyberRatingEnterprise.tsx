import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { assets, enterpriseScore, maxScore, getTierLabel } from '@/data/demoData';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const avgDims = {
  'TLS Version': Math.round(assets.reduce((s, a) => s + a.dimensionScores.tls_version, 0) / assets.length),
  'Key Exchange': Math.round(assets.reduce((s, a) => s + a.dimensionScores.key_exchange, 0) / assets.length),
  'Cipher Strength': Math.round(assets.reduce((s, a) => s + a.dimensionScores.cipher_strength, 0) / assets.length),
  'Certificate': Math.round(assets.reduce((s, a) => s + a.dimensionScores.certificate_algo, 0) / assets.length),
  'Forward Secrecy': Math.round(assets.reduce((s, a) => s + a.dimensionScores.forward_secrecy, 0) / assets.length),
  'PQC Readiness': Math.round(assets.reduce((s, a) => s + a.dimensionScores.pqc_readiness, 0) / assets.length),
};

const radarData = Object.entries(avgDims).map(([k, v]) => ({ dimension: k, score: v, fullMark: 100 }));

const scoreHistory = [
  { week: 'W1', score: 280 }, { week: 'W2', score: 290 }, { week: 'W3', score: 305 },
  { week: 'W4', score: 310 }, { week: 'W5', score: 320 }, { week: 'W6', score: 325 },
  { week: 'W7', score: 330 }, { week: 'W8', score: 370 }, { week: 'W9', score: 365 },
  { week: 'W10', score: 368 }, { week: 'W11', score: 370 }, { week: 'W12', score: 370 },
];

const tierThresholds = [
  { status: '⭕ Legacy', range: '0–399', desc: 'Immediate remediation required', color: 'hsl(var(--status-critical))' },
  { status: '⚡ Standard', range: '400–699', desc: 'Acceptable but improvement needed', color: 'hsl(var(--accent-amber))' },
  { status: '✅ Elite-PQC', range: '700–1000', desc: 'PQC-ready, maintain and monitor', color: 'hsl(var(--status-safe))' },
];

const tierLabel = getTierLabel(enterpriseScore);
const tierColor = enterpriseScore >= 700 ? 'hsl(var(--status-safe))' : enterpriseScore >= 400 ? 'hsl(var(--accent-amber))' : 'hsl(var(--status-critical))';

const CyberRatingEnterprise = () => (
  <div className="space-y-5">
    <h1 className="font-display text-2xl italic text-brand-primary">Enterprise Cyber Rating</h1>

    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
      {/* Hero score */}
      <Card className="shadow-[0_8px_30px_-12px_hsl(var(--brand-primary)/0.15)]">
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--bg-sunken))" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={tierColor} strokeWidth="8" strokeDasharray={`${(enterpriseScore / maxScore) * 327} 327`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-mono font-bold text-foreground">{enterpriseScore}</span>
              <span className="text-xs text-muted-foreground font-body">/ {maxScore}</span>
            </div>
          </div>
          <Badge className="mt-4 text-sm px-4 py-1" style={{ backgroundColor: tierColor, color: 'white' }}>{tierLabel}</Badge>
          <p className="text-[11px] text-muted-foreground mt-3 text-center font-body max-w-xs">
            Indicates a stronger security posture than 28% of Indian banking institutions
          </p>
        </CardContent>
      </Card>

      {/* Radar chart */}
      <Card className="shadow-[0_8px_30px_-12px_hsl(var(--brand-primary)/0.15)]">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-body">Score Breakdown (6 Dimensions)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} outerRadius={90}>
              <PolarGrid stroke="hsl(var(--border-default))" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: 'hsl(var(--text-secondary))' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
              <Radar name="Score" dataKey="score" stroke="hsl(var(--accent-amber))" fill="hsl(var(--accent-amber))" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    {/* Score history */}
    <Card className="shadow-[0_8px_30px_-12px_hsl(var(--brand-primary)/0.15)]">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-body">Score History (Last 12 Weeks)</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={scoreHistory}>
            <XAxis dataKey="week" tick={{ fontSize: 10 }} />
            <YAxis domain={[200, 500]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--accent-amber))" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--accent-amber))' }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-muted-foreground text-center mt-2 font-body">Week 8: Removed TLS 1.0 from 3 assets (+45 points)</p>
      </CardContent>
    </Card>

    {/* Tier thresholds */}
    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-body">Tier Thresholds</CardTitle></CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs font-body">
          <thead><tr className="border-b border-border bg-[hsl(var(--bg-sunken))]">
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Status</th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Score Range</th>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Description</th>
          </tr></thead>
          <tbody>
            {tierThresholds.map(t => (
              <tr key={t.status} className="border-b border-border/50">
                <td className="px-3 py-2 font-semibold" style={{ color: t.color }}>{t.status}</td>
                <td className="px-3 py-2 font-mono">{t.range}</td>
                <td className="px-3 py-2 text-muted-foreground">{t.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>

    {/* Benchmark comparison */}
    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-body">Benchmark Comparison</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {[{ label: 'Your Score', score: enterpriseScore, max: 1000 }, { label: 'Indian Banking Average', score: 420, max: 1000 }, { label: 'RBI Recommended Baseline', score: 550, max: 1000 }, { label: 'NIST Ideal Posture', score: 850, max: 1000 }].map(b => (
          <div key={b.label} className="space-y-1">
            <div className="flex justify-between text-xs font-body">
              <span className="text-muted-foreground">{b.label}</span>
              <span className="font-mono font-semibold">{b.score}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[hsl(var(--bg-sunken))]">
              <div className="h-full rounded-full" style={{ width: `${(b.score / b.max) * 100}%`, backgroundColor: b.score >= 700 ? 'hsl(var(--status-safe))' : b.score >= 400 ? 'hsl(var(--accent-amber))' : 'hsl(var(--status-critical))' }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default CyberRatingEnterprise;
