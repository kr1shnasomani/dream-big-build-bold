import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandShortcut,
} from '@/components/ui/command';
import {
  Home, Search, Package, ClipboardList, ShieldCheck, Star,
  Wrench, BarChart3, Terminal, Settings, Globe, Key, FileText,
  Cpu, Lock, Sparkles, Map, Calendar, PenTool, Bell, Plug,
} from 'lucide-react';

interface SearchRoute {
  label: string;
  path: string;
  icon: React.ElementType;
  group: string;
  keywords: string[];
}

const searchRoutes: SearchRoute[] = [
  { label: 'Dashboard Home', path: '/dashboard', icon: Home, group: 'Navigation', keywords: ['home', 'overview', 'main'] },
  { label: 'Asset Discovery', path: '/dashboard/discovery', icon: Search, group: 'Navigation', keywords: ['domains', 'discover', 'find'] },
  { label: 'Asset Inventory', path: '/dashboard/inventory', icon: Package, group: 'Navigation', keywords: ['assets', 'inventory', 'list'] },
  { label: 'CBOM Overview', path: '/dashboard/cbom', icon: ClipboardList, group: 'CBOM', keywords: ['cbom', 'cryptographic', 'bill of materials'] },
  { label: 'CBOM Per-Asset', path: '/dashboard/cbom/per-asset', icon: Cpu, group: 'CBOM', keywords: ['cbom', 'asset', 'detail'] },
  { label: 'CBOM Export', path: '/dashboard/cbom/export', icon: FileText, group: 'CBOM', keywords: ['export', 'download', 'cbom'] },
  { label: 'PQC Compliance', path: '/dashboard/pqc/compliance', icon: ShieldCheck, group: 'PQC Posture', keywords: ['pqc', 'compliance', 'quantum'] },
  { label: 'HNDL Intel', path: '/dashboard/pqc/hndl', icon: Lock, group: 'PQC Posture', keywords: ['hndl', 'harvest', 'now decrypt later'] },
  { label: 'Quantum Debt', path: '/dashboard/pqc/quantum-debt', icon: BarChart3, group: 'PQC Posture', keywords: ['quantum', 'debt', 'risk'] },
  { label: 'Enterprise Rating', path: '/dashboard/rating/enterprise', icon: Star, group: 'Cyber Rating', keywords: ['rating', 'score', 'enterprise'] },
  { label: 'Per-Asset Rating', path: '/dashboard/rating/per-asset', icon: FileText, group: 'Cyber Rating', keywords: ['rating', 'asset'] },
  { label: 'Tier Classification', path: '/dashboard/rating/tiers', icon: Globe, group: 'Cyber Rating', keywords: ['tier', 'classification'] },
  { label: 'Action Plan', path: '/dashboard/remediation/action-plan', icon: Wrench, group: 'Remediation', keywords: ['remediation', 'action', 'fix'] },
  { label: 'AI Patch Generator', path: '/dashboard/remediation/ai-patch', icon: Sparkles, group: 'Remediation', keywords: ['ai', 'patch', 'config', 'fix'] },
  { label: 'Migration Roadmap', path: '/dashboard/remediation/roadmap', icon: Map, group: 'Remediation', keywords: ['roadmap', 'migration', 'timeline'] },
  { label: 'Executive Reports', path: '/dashboard/reporting/executive', icon: Key, group: 'Reporting', keywords: ['report', 'executive', 'summary'] },
  { label: 'Scheduled Reports', path: '/dashboard/reporting/scheduled', icon: Calendar, group: 'Reporting', keywords: ['schedule', 'report', 'automated'] },
  { label: 'On-Demand Builder', path: '/dashboard/reporting/on-demand', icon: PenTool, group: 'Reporting', keywords: ['report', 'custom', 'build'] },
  { label: 'Scan Console', path: '/dashboard/scan-console', icon: Terminal, group: 'Navigation', keywords: ['scan', 'terminal', 'console'] },
  { label: 'Scan History', path: '/dashboard/history', icon: Home, group: 'Navigation', keywords: ['scan', 'history', 'past', 'previous'] },
  { label: 'Scan Configuration', path: '/dashboard/settings/scan-config', icon: Settings, group: 'Settings', keywords: ['settings', 'config', 'scan'] },
  { label: 'Notifications', path: '/dashboard/settings/notifications', icon: Bell, group: 'Settings', keywords: ['notifications', 'alerts', 'email'] },
  { label: 'Integrations', path: '/dashboard/settings/integrations', icon: Plug, group: 'Settings', keywords: ['integrations', 'jira', 'slack', 'connect'] },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const groups = Array.from(new Set(searchRoutes.map(r => r.group)));

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, assets, settings..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map(group => (
          <CommandGroup key={group} heading={group}>
            {searchRoutes.filter(r => r.group === group).map(route => {
              const Icon = route.icon;
              return (
                <CommandItem
                  key={route.path}
                  value={`${route.label} ${route.keywords.join(' ')}`}
                  onSelect={() => handleSelect(route.path)}
                  className="cursor-pointer"
                >
                  <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-body text-sm">{route.label}</span>
                  {route.group === 'Navigation' && <CommandShortcut className="font-mono text-[10px]">→</CommandShortcut>}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
