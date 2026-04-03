import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { scanHistory } from '@/data/demoData';
import { useScanContext } from '@/contexts/ScanContext';

const DataContextBadge = () => {
  const { rootDomain } = useScanContext();
  const latestScan = scanHistory[0];
  if (!latestScan) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--bg-sunken))] border border-[hsl(var(--border-default))] w-fit mb-4">
      <span className="text-sm">📡</span>
      <span className="text-[11px] font-body text-muted-foreground">
        Data from: <span className="font-mono font-semibold text-foreground">{latestScan.id}</span> · {rootDomain || latestScan.target} · {latestScan.started}
      </span>
      <button className="text-[11px] text-brand-primary hover:underline flex items-center gap-1 font-body">
        <RefreshCw className="w-3 h-3" /> Refresh
      </button>
    </div>
  );
};

export default DataContextBadge;
