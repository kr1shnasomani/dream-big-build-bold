import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Shield, Home, Search, Package, ClipboardList, ShieldCheck,
  Star, Wrench, BarChart3, Settings, Plus, LogOut, User,
  Globe, Key, FileText, Server, Cpu, Lock, ChevronRight,
} from 'lucide-react';

interface SubMenuItem {
  label: string;
  icon: React.ElementType;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  sub?: SubMenuItem[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  {
    id: 'discovery', icon: Search, label: 'Asset Discovery',
    sub: [
      { label: 'Domains', icon: Globe },
      { label: 'IP Subnets', icon: Server },
      { label: 'SSL Certificates', icon: Key },
    ],
  },
  { id: 'inventory', icon: Package, label: 'Asset Inventory' },
  {
    id: 'cbom', icon: ClipboardList, label: 'CBOM',
    sub: [
      { label: 'Overview', icon: FileText },
      { label: 'Per-Asset', icon: Cpu },
      { label: 'Export Center', icon: Package },
    ],
  },
  {
    id: 'pqc', icon: ShieldCheck, label: 'PQC Posture',
    sub: [
      { label: 'Compliance', icon: FileText },
      { label: 'HNDL Intel', icon: Lock },
      { label: 'Quantum Debt', icon: BarChart3 },
    ],
  },
  { id: 'rating', icon: Star, label: 'Cyber Rating' },
  { id: 'remediation', icon: Wrench, label: 'Remediation Center' },
  { id: 'reporting', icon: BarChart3, label: 'Reporting' },
];

const sidebarVariants = {
  open: { width: '15rem' },
  closed: { width: '3.05rem' },
};

const transitionProps = {
  type: 'tween' as const,
  ease: 'easeOut',
  duration: 0.2,
};

interface DashboardSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const DashboardSidebar = ({ activeItem, onItemClick }: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.div
      className="fixed left-0 top-0 h-screen z-40 flex flex-col"
      variants={sidebarVariants}
      animate={isCollapsed ? 'closed' : 'open'}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => { setIsCollapsed(true); setHoveredItem(null); }}
      style={{
        background: 'hsl(var(--bg-surface))',
        borderRight: '1px solid hsl(var(--border-default))',
      }}
    >
      {/* Logo */}
      <div className="px-2.5 py-3 flex items-center gap-2 h-14 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 min-w-[24px]">
          <Shield className="w-5 h-5 text-accent-amber fill-accent-amber/20 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-sm font-semibold text-brand-primary whitespace-nowrap"
              >
                AEGIS
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <Separator className="mx-1" />

      {/* Nav items */}
      <ScrollArea className="flex-1 py-2">
        <nav className="px-1.5 space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeItem === item.id;
            const isHovered = hoveredItem === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.sub ? setHoveredItem(item.id) : setHoveredItem(null)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors text-sm',
                    isActive
                      ? 'bg-brand-primary/10 text-brand-primary font-medium'
                      : 'text-foreground/70 hover:bg-sunken hover:text-foreground'
                  )}
                >
                  <Icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-accent-amber')} />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="font-body whitespace-nowrap flex-1"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!isCollapsed && item.sub && (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </button>

                {/* Submenu pop-out (sideways) */}
                <AnimatePresence>
                  {item.sub && isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -8, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-full top-0 ml-1 z-50"
                    >
                      <div className="bg-white rounded-xl shadow-xl border border-[hsl(var(--border-default))] overflow-hidden min-w-[180px] py-1">
                        <div className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                          {item.label}
                        </div>
                        {item.sub.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <button
                              key={sub.label}
                              onClick={() => onItemClick(`${item.id}:${sub.label.toLowerCase()}`)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-body text-foreground/80 hover:bg-sunken hover:text-foreground transition-colors text-left"
                            >
                              <SubIcon className="w-3.5 h-3.5 text-muted-foreground" />
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="mx-1" />

      {/* Bottom: Settings + User */}
      <div className="px-1.5 py-2 space-y-0.5">
        <button
          onClick={() => onItemClick('settings')}
          className={cn(
            'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors text-sm',
            activeItem === 'settings'
              ? 'bg-brand-primary/10 text-brand-primary font-medium'
              : 'text-foreground/70 hover:bg-sunken hover:text-foreground'
          )}
        >
          <Settings className={cn('w-4 h-4 flex-shrink-0', activeItem === 'settings' && 'text-accent-amber')} />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="font-body whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="flex items-center gap-3 px-2.5 py-2 rounded-lg">
          <Avatar className="h-7 w-7 flex-shrink-0">
            <AvatarFallback className="bg-brand-primary text-accent-amber text-xs font-mono">
              A
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-body font-medium text-foreground truncate">Admin</p>
                <p className="text-[10px] font-body text-muted-foreground truncate">admin@pnb.co.in</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardSidebar;
