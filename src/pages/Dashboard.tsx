import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import KPIStrip from '@/components/dashboard/KPIStrip';
import NetworkGraph from '@/components/dashboard/NetworkGraph';
import CyberRating from '@/components/dashboard/CyberRating';
import AssetTable from '@/components/dashboard/AssetTable';
import QScoreOverview from '@/components/dashboard/QScoreOverview';
import EnterpriseIntel from '@/components/dashboard/EnterpriseIntel';

const tabs = ['Overview', 'PQC Assessment', 'Remediation Plan', 'NIST Matrix', 'Tri-Mode', 'History', 'Classification & Agility', 'Regression & Certification'];

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar activeItem={activeNav} onItemClick={setActiveNav} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar />

        {/* Tab strip */}
        <div className="bg-white border-b border-[hsl(var(--border-default))] px-5 flex gap-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-body text-xs px-4 py-3 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-accent-amber text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <KPIStrip />

          {/* Two column: graph + rating */}
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-5 mb-5">
            <NetworkGraph />
            <CyberRating />
          </div>

          {/* Asset table */}
          <div className="mb-5">
            <AssetTable />
          </div>

          {/* Bottom strip */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <QScoreOverview />
            <EnterpriseIntel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
