import { cn } from "@/lib/utils";
import { ScanPromptBox } from "@/components/ui/ai-prompt-box";
import { useNavigate, useLocation } from "react-router-dom";

interface GlassTabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasScanned: boolean;
  onScan?: (domain: string) => void;
}

const tabRouteMap: Record<string, string> = {
  'Overview': '/dashboard',
  'PQC Assessment': '/dashboard/pqc/compliance',
  'Remediation Plan': '/dashboard/remediation/action-plan',
  'NIST Matrix': '/dashboard/cbom',
  'Tri-Mode': '/dashboard/rating/enterprise',
  'History': '/dashboard/reporting/executive',
  'Classification': '/dashboard/rating/tiers',
  'Regression': '/dashboard/pqc/quantum-debt',
};

const GlassTabBar = ({ tabs, activeTab, onTabChange, hasScanned, onScan }: GlassTabBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!hasScanned) return null;

  // Derive active tab from current route
  const routeTabMap = Object.entries(tabRouteMap).reduce((acc, [tab, route]) => {
    acc[route] = tab;
    return acc;
  }, {} as Record<string, string>);

  const currentTab = routeTabMap[location.pathname] || activeTab;

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    const route = tabRouteMap[tab];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      <div
        className="flex items-center gap-1 px-2 py-2 rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          WebkitBackdropFilter: "blur(2px)",
          backdropFilter: "blur(2px)",
          boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.08)",
          borderRadius: "1rem",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-body whitespace-nowrap transition-all duration-200",
              currentTab === tab
                ? "bg-brand-primary/80 text-accent-amber font-semibold shadow-[0_0_12px_rgba(232,160,32,0.2)]"
                : "text-foreground/80 hover:text-foreground font-medium hover:bg-black/[0.04]"
            )}
          >
            {tab}
          </button>
        ))}

        {hasScanned && (
          <div className="ml-1 border-l border-black/10 pl-2">
            <ScanPromptBox compact onScan={onScan} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlassTabBar;
