import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Shield, Home, Search, Package, ClipboardList, ShieldCheck,
  Star, Wrench, BarChart3, Settings,
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
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  duration: 0.25,
};

interface DashboardSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const DashboardSidebar = ({ activeItem, onItemClick }: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<{ top: number; left: number } | null>(null);

  const openSubmenu = useMemo(
    () => navItems.find((item) => item.id === openSubmenuId && item.sub),
    [openSubmenuId],
  );

  const closeSubmenu = () => {
    setOpenSubmenuId(null);
    setSubmenuPosition(null);
  };

  const setSubmenuAnchor = (target: HTMLButtonElement, subItemsCount: number) => {
    const rect = target.getBoundingClientRect();
    const estimatedHeight = subItemsCount * 40 + 34;
    const top = Math.max(10, Math.min(rect.top, window.innerHeight - estimatedHeight - 10));
    setSubmenuPosition({
      top,
      left: rect.right + 10,
    });
  };

  const handleNavItemClick = (item: NavItem, event: MouseEvent<HTMLButtonElement>) => {
    onItemClick(item.id);

    if (!item.sub) {
      closeSubmenu();
      return;
    }

    setSubmenuAnchor(event.currentTarget, item.sub.length);
    setOpenSubmenuId((previous) => (previous === item.id ? null : item.id));
  };

  useEffect(() => {
    if (!openSubmenuId) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-sidebar-menu-button]') || target.closest('[data-sidebar-submenu]')) return;
      closeSubmenu();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSubmenu();
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', closeSubmenu);
    window.addEventListener('scroll', closeSubmenu, true);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', closeSubmenu);
      window.removeEventListener('scroll', closeSubmenu, true);
    };
  }, [openSubmenuId]);

  return (
    <motion.div
      className="fixed left-0 top-0 h-screen z-[60] flex flex-col overflow-visible"
      variants={sidebarVariants}
      animate={isCollapsed ? 'closed' : 'open'}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => {
        if (openSubmenuId) return;
        setIsCollapsed(true);
      }}
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
      <ScrollArea className="flex-1 py-2 overflow-visible">
        <nav className="px-1.5 space-y-0.5 overflow-visible">
          {navItems.map((item) => {
            const isActive = activeItem === item.id;
            const Icon = item.icon;

            return (
              <div key={item.id} className="relative">
                <button
                  data-sidebar-menu-button
                  onClick={(event) => handleNavItemClick(item, event)}
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
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      <AnimatePresence>
        {openSubmenu && submenuPosition && typeof document !== 'undefined' && createPortal(
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed z-[120]"
            style={{ top: submenuPosition.top, left: submenuPosition.left }}
          >
            <div
              data-sidebar-submenu
              className="bg-popover rounded-xl border border-border overflow-hidden min-w-[180px] py-1 shadow-[0_20px_48px_-28px_hsl(var(--brand-primary)/0.5)]"
            >
              <div className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {openSubmenu.label}
              </div>
              {openSubmenu.sub?.map((sub, index) => {
                const SubIcon = sub.icon;
                return (
                  <motion.button
                    key={sub.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.15 }}
                    onClick={() => {
                      onItemClick(`${openSubmenu.id}:${sub.label.toLowerCase()}`);
                      closeSubmenu();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-body text-foreground/80 hover:bg-sunken hover:text-foreground transition-colors text-left"
                  >
                    <SubIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    {sub.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>,
          document.body,
        )}
      </AnimatePresence>

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

        <div className={cn(
          'w-full flex items-center py-2 rounded-lg',
          isCollapsed ? 'justify-center' : 'gap-3 px-2.5'
        )}>
          <Avatar className={cn('h-7 w-7 flex-shrink-0', isCollapsed && 'mx-auto')}>
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
