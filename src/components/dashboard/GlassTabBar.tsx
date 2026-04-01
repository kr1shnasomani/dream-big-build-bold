import { cn } from "@/lib/utils";
import { ScanPromptBox } from "@/components/ui/ai-prompt-box";
import { useNavigate, useLocation } from "react-router-dom";
import { usePinnedPages } from "@/contexts/PinnedPagesContext";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  Home, Search, Package, ClipboardList, ShieldCheck,
  Star, Wrench, BarChart3, Settings,
  Globe, Key, FileText, Server, Cpu, Lock,
  Sparkles, Map, Calendar, PenTool, Terminal, Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Home, Search, Package, ClipboardList, ShieldCheck,
  Star, Wrench, BarChart3, Settings,
  Globe, Key, FileText, Server, Cpu, Lock,
  Sparkles, Map, Calendar, PenTool, Terminal, Shield,
};

interface GlassTabBarProps {
  hasScanned: boolean;
  onScan?: (domain: string) => void;
}

const GlassTabBar = ({ hasScanned, onScan }: GlassTabBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pinnedPages, removePin } = usePinnedPages();

  if (!hasScanned) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      <div
        className="relative flex items-center gap-1 px-3 py-2.5 rounded-[1.5rem]"
        style={{
          /* Apple-style frosted glass — lighter, more translucent */
          background: "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.20) 40%, rgba(255,255,255,0.30) 100%)",
          WebkitBackdropFilter: "blur(60px) saturate(2.0) brightness(1.1)",
          backdropFilter: "blur(60px) saturate(2.0) brightness(1.1)",
          /* Soft outer glow + inner light edges */
          boxShadow: `
            inset 0 1px 0 0 rgba(255,255,255,0.6),
            inset 0 -0.5px 0 0 rgba(255,255,255,0.1),
            inset 1px 0 0 0 rgba(255,255,255,0.25),
            inset -1px 0 0 0 rgba(255,255,255,0.25),
            0 8px 40px -8px rgba(0,0,0,0.12),
            0 2px 12px -4px rgba(0,0,0,0.08),
            0 0 0 0.5px rgba(255,255,255,0.35)
          `,
          border: "0.5px solid rgba(255,255,255,0.35)",
        }}
      >
        {/* Top edge highlight — Apple-style light refraction */}
        <div
          className="absolute inset-x-4 top-0 h-[0.5px] rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.7) 25%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.7) 75%, transparent 95%)",
          }}
        />
        {/* Soft inner glow at top */}
        <div
          className="absolute top-0 left-1/4 w-1/2 h-6 rounded-full pointer-events-none opacity-20"
          style={{
            background: "radial-gradient(ellipse at center top, rgba(255,255,255,0.8) 0%, transparent 70%)",
          }}
        />

        <AnimatePresence mode="popLayout">
          {pinnedPages.map((page) => {
            const isActive = location.pathname === page.route || location.pathname.startsWith(page.route + '/');
            const IconComponent = iconMap[page.icon] || Home;

            return (
              <motion.div
                key={page.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="relative group/pin"
              >
                <button
                  onClick={() => navigate(page.route)}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body whitespace-nowrap transition-all duration-300",
                    isActive
                      ? "text-brand-primary font-semibold"
                      : "text-foreground/60 hover:text-foreground font-medium"
                  )}
                  style={isActive ? {
                    background: "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 100%)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
                  } : {
                    background: "transparent",
                  }}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {page.label}
                </button>
                {/* Remove pin button */}
                <button
                  onClick={(e) => { e.stopPropagation(); removePin(page.id); }}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/pin:opacity-100 transition-opacity hover:bg-foreground/20"
                >
                  <X className="w-2 h-2 text-foreground/60" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {pinnedPages.length > 0 && (
          <div className="mx-1.5 w-px h-5 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }} />
        )}

        <ScanPromptBox compact onScan={onScan} />
      </div>
    </div>
  );
};

export default GlassTabBar;
