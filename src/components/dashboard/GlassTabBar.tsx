import { cn } from "@/lib/utils";
import { ScanPromptBox } from "@/components/ui/ai-prompt-box";

interface GlassTabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasScanned: boolean;
  onScan?: (domain: string) => void;
}

const GlassTabBar = ({ tabs, activeTab, onTabChange, hasScanned, onScan }: GlassTabBarProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      {/* Glass tab bar */}
      <div
        className="flex items-center gap-1 px-2 py-2 rounded-2xl backdrop-blur-xl border border-white/[0.18]"
        style={{
          background: "linear-gradient(135deg, rgba(30,21,53,0.85), rgba(30,21,53,0.75))",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-body whitespace-nowrap transition-all duration-200",
              activeTab === tab
                ? "bg-accent-amber/20 text-accent-amber font-medium shadow-[0_0_12px_rgba(232,160,32,0.15)]"
                : "text-white/60 hover:text-white/90 hover:bg-white/[0.08]"
            )}
          >
            {tab}
          </button>
        ))}

        {/* Compact scanner in tab bar after scan */}
        {hasScanned && (
          <div className="ml-1 border-l border-white/10 pl-2">
            <ScanPromptBox compact onScan={onScan} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlassTabBar;
