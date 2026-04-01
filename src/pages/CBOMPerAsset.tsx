import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, AlertTriangle, Shield, Check } from 'lucide-react';
import { assets } from '@/data/demoData';
import { cn } from '@/lib/utils';

import SectionTabBar from '@/components/dashboard/SectionTabBar';
import { FileText, Cpu, Package } from 'lucide-react';

const cbomTabs = [
  { id: 'overview', label: 'Overview', icon: FileText, route: '/dashboard/cbom' },
  { id: 'per-asset', label: 'Per-Asset', icon: Cpu, route: '/dashboard/cbom/per-asset' },
  { id: 'export', label: 'Export Center', icon: Package, route: '/dashboard/cbom/export' },
];

const CBOMPerAsset = () => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const toggle = (id: string) => setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-5">
      <SectionTabBar tabs={cbomTabs} />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl italic text-brand-primary">Per-Asset CBOM</h1>
        <Button variant="outline" size="sm" className="text-xs">Export All CycloneDX</Button>
      </div>

      <div className="space-y-2">
        {assets.filter(a => a.cipher !== '--').map(a => {
          const isOpen = expanded.includes(a.id);
          const vulnKex = a.keyExchange === 'RSA' || a.keyExchange === 'ECDHE';
          const vulnCert = a.certInfo.key_type === 'RSA' || a.certInfo.key_type === 'ECDSA';
          const isPqc = a.status === 'elite-pqc';

          return (
            <Card key={a.id} className={cn("shadow-sm transition-all", isOpen && "shadow-[0_8px_30px_-12px_hsl(var(--brand-primary)/0.15)]")}>
              <button onClick={() => toggle(a.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <span className="font-mono text-sm font-medium flex-1">{a.domain}</span>
                <Badge variant="outline" className="text-[10px]">{a.tls}</Badge>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded" style={{ color: isPqc ? 'hsl(var(--status-safe))' : a.qScore <= 40 ? 'hsl(var(--status-critical))' : 'hsl(var(--accent-amber))', backgroundColor: isPqc ? 'hsl(var(--status-safe)/0.1)' : a.qScore <= 40 ? 'hsl(var(--status-critical)/0.1)' : 'hsl(var(--accent-amber)/0.1)' }}>
                  Q-{a.qScore}
                </span>
              </button>

              {isOpen && (
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="ml-7 font-mono text-xs space-y-1 border-l-2 border-[hsl(var(--border-default))] pl-4">
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground">┌─ <span className="text-foreground font-medium">TLS Certificate</span></p>
                      <p className="ml-4">Algorithm: <span className="font-medium">{a.certInfo.signature_algorithm}</span> {vulnCert && !isPqc && <span className="text-[hsl(var(--status-critical))] ml-1">(QUANTUM VULNERABLE)</span>}{isPqc && <span className="text-[hsl(var(--status-safe))] ml-1">(QUANTUM SAFE)</span>}</p>
                      <p className="ml-4">Key Size: <span className="font-medium">{a.certInfo.key_size || 'PQC'} bits</span></p>
                      <p className="ml-4">Issuer: {a.certInfo.issuer}</p>
                      <p className="ml-4">Valid Until: {a.certInfo.valid_until} ({a.certInfo.days_remaining}d remaining)</p>
                    </div>
                    <div className="space-y-0.5 mt-2">
                      <p className="text-muted-foreground">├─ <span className="text-foreground font-medium">Key Exchange</span></p>
                      <p className="ml-4">Method: <span className="font-medium">{a.keyExchange}</span> {vulnKex && !isPqc && <span className="text-[hsl(var(--status-critical))] ml-1">(QUANTUM VULNERABLE)</span>}{isPqc && <span className="text-[hsl(var(--status-safe))] ml-1">(QUANTUM SAFE — ML-KEM-768)</span>}</p>
                      <p className="ml-4">Forward Secrecy: {a.forwardSecrecy ? <span className="text-[hsl(var(--status-safe))]">YES</span> : <span className="text-[hsl(var(--status-critical))]">NO</span>}</p>
                      {!isPqc && <p className="ml-4 text-muted-foreground">PQC Equivalent: ML-KEM-768</p>}
                    </div>
                    <div className="space-y-0.5 mt-2">
                      <p className="text-muted-foreground">├─ <span className="text-foreground font-medium">Cipher Suite</span></p>
                      <p className="ml-4">Current: <span className="font-medium">{a.cipher}</span></p>
                      <p className="ml-4">AES-256: <span className="text-[hsl(var(--status-safe))]">QUANTUM RESISTANT</span> (Grover: 128-bit effective)</p>
                      {!isPqc && <p className="ml-4 text-muted-foreground">Recommended: TLS_MLKEM768_AES256_GCM_SHA384</p>}
                    </div>
                    <div className="space-y-0.5 mt-2">
                      <p className="text-muted-foreground">└─ <span className="text-foreground font-medium">TLS Protocol</span></p>
                      <p className="ml-4">Versions: {a.tlsVersionsSupported.join(', ') || 'None detected'}</p>
                      {a.tlsVersionsSupported.includes('TLS_1_0') && <p className="ml-4 text-[hsl(var(--status-critical))]">⚠ TLS 1.0 negotiable — CRITICAL</p>}
                      {a.tlsVersionsSupported.includes('TLS_1_1') && <p className="ml-4 text-[hsl(var(--status-critical))]">⚠ TLS 1.1 negotiable — should be disabled</p>}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CBOMPerAsset;
