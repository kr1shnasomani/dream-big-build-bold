import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { assets } from '@/data/demoData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '@/lib/utils';
import SectionTabBar from '@/components/dashboard/SectionTabBar';
import { FileText, Lock, BarChart3 } from 'lucide-react';

const pqcTabs = [
  { id: 'compliance', label: 'Compliance', icon: FileText, route: '/dashboard/pqc/compliance' },
  { id: 'hndl', label: 'HNDL Intel', icon: Lock, route: '/dashboard/pqc/hndl' },
  { id: 'quantum-debt', label: 'Quantum Debt', icon: BarChart3, route: '/dashboard/pqc/quantum-debt' },
];

const hndlAssets = assets.filter(a => a.hndlBreakYear !== null).sort((a, b) => (a.hndlBreakYear || 0) - (b.hndlBreakYear || 0));

const timelineData = Array.from({ length: 11 }, (_, i) => {
  const year = 2026 + i;
  return {
    year: year.toString(),
    decryptable: hndlAssets.filter(a => (a.hndlBreakYear || 9999) <= year).length,
    ibmQubits: year <= 2029 ? Math.round(1000 * Math.pow(2, (year - 2025) * 0.8)) : year <= 2033 ? Math.round(100000 * Math.pow(2, (year - 2029) * 0.6)) : 1000000,
  };
});

const riskColors: Record<string, string> = {
  critical: 'hsl(var(--status-critical))',
  high: 'hsl(var(--status-vuln))',
  medium: 'hsl(var(--accent-amber))',
  low: 'hsl(var(--status-safe))',
};

const PQCHndl = () => (
  <div className="space-y-5">
    <h1 className="font-display text-2xl italic text-brand-primary">HNDL Intelligence</h1>
    <SectionTabBar tabs={pqcTabs} />

    {/* Explanatory header */}
    <Card className="shadow-[0_8px_30px_-12px_hsl(var(--brand-primary)/0.15)] border-l-4 border-l-[hsl(var(--status-critical))]">
      <CardContent className="p-5">
        <h2 className="text-sm font-body font-bold text-foreground">Harvest Now, Decrypt Later (HNDL)</h2>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-body">
          Adversaries are archiving your encrypted traffic <strong className="text-foreground">TODAY</strong>. When cryptographically-relevant quantum computers (CRQC) arrive, all intercepted data encrypted with classical algorithms becomes readable. This page shows per-asset exposure and estimated break years based on IBM and Google qubit roadmaps.
        </p>
        <div className="flex gap-6 mt-4 text-[10px] font-mono">
          <div><span className="text-muted-foreground">IBM Target:</span> <span className="text-foreground font-semibold">100K qubits by 2029</span></div>
          <div><span className="text-muted-foreground">Google Target:</span> <span className="text-foreground font-semibold">Fault-tolerant CRQC by 2030</span></div>
          <div><span className="text-muted-foreground">CRQC Threshold:</span> <span className="text-[hsl(var(--status-critical))] font-semibold">~1M qubits (2031-2035)</span></div>
        </div>
      </CardContent>
    </Card>

    {/* HNDL Timeline */}
    <Card className="shadow-[0_8px_30px_-12px_hsl(var(--brand-primary)/0.15)]">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-body">HNDL Timeline — Assets Becoming Decryptable</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={timelineData}>
            <defs>
              <linearGradient id="decryptGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--status-critical))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--status-critical))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <ReferenceLine x="2031" stroke="hsl(var(--status-critical))" strokeDasharray="3 3" label={{ value: 'RSA-2048 break', position: 'top', fontSize: 9, fill: 'hsl(var(--status-critical))' }} />
            <Area type="monotone" dataKey="decryptable" stroke="hsl(var(--status-critical))" fill="url(#decryptGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* HNDL risk table */}
    <Card className="shadow-[0_8px_30px_-12px_hsl(var(--brand-primary)/0.15)]">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-body">HNDL Risk by Asset</CardTitle></CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead><tr className="border-b border-border bg-[hsl(var(--bg-sunken))]">
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Asset</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Algorithm</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Key Size</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Break Year</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Sensitivity</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">HNDL Risk</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Days Until Risk</th>
            </tr></thead>
            <tbody>
              {hndlAssets.map((a, i) => {
                const daysUntil = a.hndlBreakYear ? Math.round((new Date(`${a.hndlBreakYear}-01-01`).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                return (
                  <tr key={a.id} className={cn("border-b border-border/50 hover:bg-[hsl(var(--bg-sunken))]", i % 2 === 0 && "bg-[hsl(var(--bg-sunken)/0.3)]")}>
                    <td className="px-3 py-2 font-mono font-medium">{a.domain}</td>
                    <td className="px-3 py-2 font-mono">{a.certInfo.key_type}</td>
                    <td className="px-3 py-2 font-mono">{a.certInfo.key_size || 'PQC'}</td>
                    <td className="px-3 py-2 font-mono font-semibold">~{a.hndlBreakYear}</td>
                    <td className="px-3 py-2"><Badge variant="outline" className="text-[10px]">{a.businessCriticality.replace('_', ' ')}</Badge></td>
                    <td className="px-3 py-2"><span className="font-mono font-semibold text-[10px] px-1.5 py-0.5 rounded" style={{ color: riskColors[a.hndlRiskLevel], backgroundColor: `${riskColors[a.hndlRiskLevel]}15` }}>{a.hndlRiskLevel.toUpperCase()}</span></td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{daysUntil !== null && daysUntil > 0 ? `${daysUntil.toLocaleString()}d` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    {/* Qubit Roadmap */}
    <Card className="shadow-sm">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-body">Qubit Roadmap Sources</CardTitle></CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-[hsl(var(--bg-sunken))]">
          <p className="text-xs font-body font-semibold">IBM Quantum</p>
          <p className="text-[10px] text-muted-foreground mt-1 font-body">Eagle (127q) → Heron (133q) → Condor (1121q) → Target: 100K qubits by 2029</p>
        </div>
        <div className="p-3 rounded-lg bg-[hsl(var(--bg-sunken))]">
          <p className="text-xs font-body font-semibold">Google Quantum AI</p>
          <p className="text-[10px] text-muted-foreground mt-1 font-body">Sycamore → Willow → Target: Fault-tolerant CRQC by 2030</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default PQCHndl;
