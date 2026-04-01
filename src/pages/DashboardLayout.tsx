import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useScanContext } from '@/contexts/ScanContext';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import GlassTabBar from '@/components/dashboard/GlassTabBar';
import CommandPalette from '@/components/dashboard/CommandPalette';
import { AnimatePresence, motion } from 'framer-motion';
import { ScanPromptBox } from '@/components/ui/ai-prompt-box';
import RainingLetters from '@/components/ui/raining-letters';
import { GradientText } from '@/components/ui/gradient-text';

const tabs = ['Overview', 'PQC Assessment', 'Remediation Plan', 'NIST Matrix', 'Tri-Mode', 'History', 'Classification', 'Regression'];

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [hasScanned, setHasScanned] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const getActiveNav = () => {
    if (pathname.includes('/discovery')) return 'discovery';
    if (pathname.includes('/inventory')) return 'inventory';
    if (pathname.includes('/cbom')) return 'cbom';
    if (pathname.includes('/pqc')) return 'pqc';
    if (pathname.includes('/rating')) return 'rating';
    if (pathname.includes('/remediation')) return 'remediation';
    if (pathname.includes('/reporting')) return 'reporting';
    if (pathname.includes('/settings')) return 'settings';
    if (pathname.includes('/scan-console')) return 'scan-console';
    return 'dashboard';
  };

  const handleNavClick = (item: string) => {
    const routeMap: Record<string, string> = {
      'dashboard': '/dashboard',
      'discovery': '/dashboard/discovery',
      'discovery:domains': '/dashboard/discovery',
      'discovery:ip subnets': '/dashboard/discovery?tab=ip',
      'discovery:ssl certificates': '/dashboard/discovery?tab=ssl',
      'discovery:software & services': '/dashboard/discovery?tab=software',
      'discovery:network graph': '/dashboard/discovery?tab=network',
      'discovery:shadow it': '/dashboard/discovery?tab=shadow',
      'inventory': '/dashboard/inventory',
      'cbom': '/dashboard/cbom',
      'cbom:overview': '/dashboard/cbom',
      'cbom:per-asset': '/dashboard/cbom/per-asset',
      'cbom:export center': '/dashboard/cbom/export',
      'pqc': '/dashboard/pqc/compliance',
      'pqc:compliance': '/dashboard/pqc/compliance',
      'pqc:hndl intel': '/dashboard/pqc/hndl',
      'pqc:quantum debt': '/dashboard/pqc/quantum-debt',
      'rating': '/dashboard/rating/enterprise',
      'rating:enterprise score': '/dashboard/rating/enterprise',
      'rating:per-asset': '/dashboard/rating/per-asset',
      'rating:tier classification': '/dashboard/rating/tiers',
      'remediation': '/dashboard/remediation/action-plan',
      'remediation:action plan': '/dashboard/remediation/action-plan',
      'remediation:ai patch generator': '/dashboard/remediation/ai-patch',
      'remediation:migration roadmap': '/dashboard/remediation/roadmap',
      'reporting': '/dashboard/reporting/executive',
      'reporting:executive reports': '/dashboard/reporting/executive',
      'reporting:scheduled reports': '/dashboard/reporting/scheduled',
      'reporting:on-demand builder': '/dashboard/reporting/on-demand',
      'scan-console': '/dashboard/scan-console',
      'settings': '/dashboard/settings/scan-config',
    };
    const route = routeMap[item] || '/dashboard';
    navigate(route);
  };

  const handleScan = (domain: string) => {
    console.log('Scanning:', domain);
    setHasScanned(true);
  };

  const handleDemoScan = () => {
    setHasScanned(true);
  };

  const isHome = pathname === '/dashboard';
  const showPrompt = isHome && !hasScanned;

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <DashboardTopBar hasScanned={hasScanned || !isHome} />
      <DashboardSidebar activeItem={getActiveNav()} onItemClick={handleNavClick} />
      <CommandPalette />

      <div className="flex-1 overflow-y-auto pb-24 ml-[3.05rem]">
        <AnimatePresence mode="wait">
          {showPrompt ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative flex flex-col items-center justify-center min-h-screen px-6"
            >
              <RainingLetters />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative z-10 text-center mb-8 bg-background px-6 py-4 rounded-xl">
                <GradientText as="h1" className="font-body font-bold text-3xl lg:text-5xl mb-4">Quantum Readiness Scanner</GradientText>
                <p className="font-body text-base text-muted-foreground max-w-md mx-auto">Enter any domain to generate a complete Cryptographic Bill of Materials and quantum risk assessment.</p>
              </motion.div>
              <div className="relative z-10 w-full max-w-2xl">
                <ScanPromptBox onScan={handleScan} onDemoScan={handleDemoScan} placeholder="Enter domain to scan (e.g. pnb.co.in)" />
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
                {['vpn.pnb.co.in', 'netbanking.pnb.co.in', 'auth.pnb.co.in'].map((domain) => (
                  <button key={domain} onClick={() => handleScan(domain)} className="font-mono text-xs text-muted-foreground px-3 py-1.5 rounded-lg border border-[hsl(var(--border-default))] hover:border-[hsl(var(--border-strong))] hover:text-foreground transition-colors">{domain}</button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-5 pt-14">
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GlassTabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} hasScanned={hasScanned || !isHome} onScan={handleScan} />
    </div>
  );
};

export default DashboardLayout;
