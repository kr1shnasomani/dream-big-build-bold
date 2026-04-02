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

const DashboardHome = () => {
  return (
    <>
      <KPIStrip />
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
  );
};

export default DashboardHome;
