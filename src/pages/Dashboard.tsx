import { useState } from 'react';
import { Home, Search, Package, ClipboardList, ShieldCheck, Star, Wrench, BarChart3, Settings } from 'lucide-react';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import GlassTabBar from '@/components/dashboard/GlassTabBar';
import FloatingActionMenu from '@/components/ui/floating-action-menu';
import { ScanPromptBox } from '@/components/ui/ai-prompt-box';
import { GradientText } from '@/components/ui/gradient-text';
import KPIStrip from '@/components/dashboard/KPIStrip';
import NetworkGraph from '@/components/dashboard/NetworkGraph';
import CyberRating from '@/components/dashboard/CyberRating';
import AssetTable from '@/components/dashboard/AssetTable';
import QScoreOverview from '@/components/dashboard/QScoreOverview';
import EnterpriseIntel from '@/components/dashboard/EnterpriseIntel';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = ['Overview', 'PQC Assessment', 'Remediation Plan', 'NIST Matrix', 'Tri-Mode', 'History', 'Classification', 'Regression'];

const navItems = [
  { id: 'dashboard', icon: <Home className="w-4 h-4" />, label: 'Dashboard' },
  { id: 'discovery', icon: <Search className="w-4 h-4" />, label: 'Asset Discovery' },
  { id: 'inventory', icon: <Package className="w-4 h-4" />, label: 'Asset Inventory' },
  { id: 'cbom', icon: <ClipboardList className="w-4 h-4" />, label: 'CBOM' },
  { id: 'pqc', icon: <ShieldCheck className="w-4 h-4" />, label: 'PQC Posture' },
  { id: 'rating', icon: <Star className="w-4 h-4" />, label: 'Cyber Rating' },
  { id: 'remediation', icon: <Wrench className="w-4 h-4" />, label: 'Remediation' },
  { id: 'reporting', icon: <BarChart3 className="w-4 h-4" />, label: 'Reporting' },
  { id: 'settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [hasScanned, setHasScanned] = useState(false);

  const handleScan = (domain: string) => {
    console.log('Scanning:', domain);
    setHasScanned(true);
  };

  const handleDemoScan = () => {
    setHasScanned(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardTopBar hasScanned={hasScanned} />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {!hasScanned ? (
            /* Pre-scan: centered prompt */
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <GradientText
                  as="h1"
                  className="font-body font-bold text-3xl lg:text-5xl mb-4"
                >
                  Quantum Readiness Scanner
                </GradientText>
                <p className="font-body text-base text-muted-foreground max-w-md mx-auto">
                  Enter any domain to generate a complete Cryptographic Bill of Materials and quantum risk assessment.
                </p>
              </motion.div>

              <ScanPromptBox
                onScan={handleScan}
                onDemoScan={handleDemoScan}
                placeholder="Enter domain to scan (e.g. pnb.co.in)"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
              >
                {['vpn.pnb.co.in', 'netbanking.pnb.co.in', 'auth.pnb.co.in'].map((domain) => (
                  <button
                    key={domain}
                    onClick={() => handleScan(domain)}
                    className="font-mono text-xs text-muted-foreground px-3 py-1.5 rounded-lg border border-[hsl(var(--border-default))] hover:border-[hsl(var(--border-strong))] hover:text-foreground transition-colors"
                  >
                    {domain}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            /* Post-scan: dashboard content */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-5"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating action menu (bottom-left) */}
      <div className="fixed bottom-6 left-6 z-50">
        <FloatingActionMenu
          options={navItems.map((item) => ({
            label: item.label,
            Icon: item.icon,
            onClick: () => console.log(`Navigate to ${item.id}`),
          }))}
        />
      </div>

      {/* Glass tab bar (bottom center) */}
      <GlassTabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasScanned={hasScanned}
        onScan={handleScan}
      />
    </div>
  );
};

export default Dashboard;
