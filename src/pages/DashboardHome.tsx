import KPIStrip from '@/components/dashboard/KPIStrip';
import NetworkGraph from '@/components/dashboard/NetworkGraph';
import CyberRating from '@/components/dashboard/CyberRating';
import AssetTable from '@/components/dashboard/AssetTable';
import QScoreOverview from '@/components/dashboard/QScoreOverview';
import EnterpriseIntel from '@/components/dashboard/EnterpriseIntel';

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <QScoreOverview />
        <EnterpriseIntel />
      </div>
    </>
  );
};

export default DashboardHome;
