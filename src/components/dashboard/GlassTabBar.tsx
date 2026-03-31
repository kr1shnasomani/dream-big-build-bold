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
  if (!hasScanned) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      {/* True transparent glass bar */}
      <div
        className="flex items-center gap-1 px-2 py-2 rounded-2xl backdrop-blur-2xl border border-white/[0.25]"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.05)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          backdropFilter: "blur(24px) saturate(1.8)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-body whitespace-nowrap transition-all duration-200",
              activeTab === tab
                ? "bg-brand-primary/80 text-accent-amber font-medium shadow-[0_0_12px_rgba(232,160,32,0.2)]"
                : "text-foreground/60 hover:text-foreground/90 hover:bg-black/[0.06]"
            )}
          >
            {tab}
          </button>
        ))}

        {/* Compact scanner in tab bar after scan */}
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
