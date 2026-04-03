import { useState } from 'react';
import KPIStrip from '@/components/dashboard/KPIStrip';
import NetworkGraph from '@/components/dashboard/NetworkGraph';
import CyberRating from '@/components/dashboard/CyberRating';
import AssetTable from '@/components/dashboard/AssetTable';
import QScoreOverview from '@/components/dashboard/QScoreOverview';
import EnterpriseIntel from '@/components/dashboard/EnterpriseIntel';
import CertExpiryTimeline from '@/components/dashboard/CertExpiryTimeline';
import AssetRiskDistribution from '@/components/dashboard/AssetRiskDistribution';
import CryptoSecurityOverview from '@/components/dashboard/CryptoSecurityOverview';
import RecentActivityFeed from '@/components/dashboard/RecentActivityFeed';
import DataContextBadge from '@/components/dashboard/DataContextBadge';
import SinceLastScanStrip from '@/components/dashboard/SinceLastScanStrip';
import ViewRoleToggle from '@/components/dashboard/ViewRoleToggle';
import CompliancePackageModal from '@/components/dashboard/CompliancePackageModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText } from 'lucide-react';
import { assets, getStatusColor, getStatusLabel } from '@/data/demoData';

type ViewRole = 'executive' | 'analyst' | 'compliance';

const DashboardHome = () => {
  const [activeRole, setActiveRole] = useState<ViewRole>('analyst');
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <DataContextBadge />
        <ViewRoleToggle activeRole={activeRole} onRoleChange={setActiveRole} />
      </div>

      <KPIStrip />
      <SinceLastScanStrip />

      {activeRole === 'analyst' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-5 mb-5">
            <NetworkGraph />
            <CyberRating />
          </div>
          <div className="mb-5">
            <AssetTable />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <QScoreOverview />
            <EnterpriseIntel />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <CertExpiryTimeline />
            <AssetRiskDistribution />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CryptoSecurityOverview />
            <RecentActivityFeed />
          </div>
        </>
      )}

      {activeRole === 'executive' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5 mb-5">
            <CyberRating />
            <CertExpiryTimeline />
          </div>
          <RecentActivityFeed />
        </>
      )}

      {activeRole === 'compliance' && (
        <>
          <Card className="mb-5">
            <CardContent className="p-0">
              <table className="w-full text-xs font-body">
                <thead>
                  <tr className="border-b border-border bg-[hsl(var(--bg-sunken))]">
                    <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Asset</th>
                    <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">PQC Status</th>
                    <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Certificate Validity</th>
                    <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">TLS Version</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(a => (
                    <tr key={a.id} className="border-b border-border/50">
                      <td className="px-3 py-2 font-mono">{a.domain}</td>
                      <td className="px-3 py-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: getStatusColor(a.status), backgroundColor: `${getStatusColor(a.status)}15` }}>
                          {getStatusLabel(a.status)}
                        </span>
                        {(a.status === 'elite-pqc') && <Shield className="w-3 h-3 text-[hsl(var(--status-safe))] inline ml-1" />}
                      </td>
                      <td className="px-3 py-2 font-mono">
                        <span className={a.certInfo.days_remaining <= 30 ? 'text-[hsl(var(--status-critical))]' : 'text-muted-foreground'}>
                          {a.certInfo.days_remaining > 0 ? `${a.certInfo.days_remaining}d remaining` : 'Expired'}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono">{a.tls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="flex justify-center mb-5">
            <Button onClick={() => setComplianceModalOpen(true)} className="gap-1.5 text-sm px-8 py-3">
              <FileText className="w-4 h-4" /> Generate Compliance Evidence Package
            </Button>
          </div>

          <RecentActivityFeed />
          <CompliancePackageModal open={complianceModalOpen} onOpenChange={setComplianceModalOpen} />
        </>
      )}
    </>
  );
};

export default DashboardHome;
