import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScanContext } from '@/contexts/ScanContext';

const RecentActivityFeed = () => {
  const navigate = useNavigate();
  const { rootDomain } = useScanContext();
  const d = rootDomain || 'pnb.co.in';

  const entries = [
    { icon: '✅', text: `Scan completed: 21 assets scanned for ${d}`, time: '10 min ago', route: '' },
    { icon: '⚠️', text: `Weak cipher detected: vpn.${d} (TLS_RSA_WITH_AES_128_CBC_SHA)`, time: '10 min ago', route: '' },
    { icon: '❌', text: `Certificate expiring in 1 day: vpn.${d}`, time: '10 min ago', route: '/dashboard/discovery?tab=ssl' },
    { icon: '🆕', text: `Shadow IT asset discovered: dev-api.${d}`, time: '10 min ago', route: '/dashboard/discovery?tab=shadow' },
    { icon: '🔒', text: 'CBOM generated: aegis-cbom-20260401.json', time: '9 min ago', route: '/dashboard/cbom' },
    { icon: '📋', text: `PQC label issued: pqc-api.${d} — Fully Quantum Safe`, time: '8 min ago', route: '' },
  ];

  return (
    <Card className="shadow-[0_8px_30px_-12px_hsl(var(--brand-primary)/0.15)]">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-body">Recent Activity</CardTitle></CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[260px] overflow-y-auto">
          {entries.map((e, i) => (
            <button
              key={i}
              onClick={() => e.route && navigate(e.route)}
              className="w-full flex items-start gap-2.5 px-4 py-2.5 text-left hover:bg-[hsl(var(--bg-sunken))] transition-colors border-b border-border/30 last:border-0"
            >
              <span className="text-sm flex-shrink-0 mt-0.5">{e.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-foreground leading-relaxed">{e.text}</p>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{e.time}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
