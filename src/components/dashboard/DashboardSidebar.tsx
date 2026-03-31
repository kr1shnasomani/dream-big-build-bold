import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, Search, Package, ClipboardList, ShieldCheck, Star, Wrench, BarChart3, Settings } from 'lucide-react';

interface DashboardSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'discovery', icon: Search, label: 'Asset Discovery' },
  { id: 'inventory', icon: Package, label: 'Asset Inventory' },
  { id: 'cbom', icon: ClipboardList, label: 'CBOM', sub: ['Overview', 'Per-Asset', 'Export Center'] },
  { id: 'pqc', icon: ShieldCheck, label: 'PQC Posture', sub: ['Compliance', 'HNDL Intel', 'Quantum Debt'] },
  { id: 'rating', icon: Star, label: 'Cyber Rating' },
  { id: 'remediation', icon: Wrench, label: 'Remediation Center' },
  { id: 'reporting', icon: BarChart3, label: 'Reporting' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const DashboardSidebar = ({ activeItem, onItemClick }: DashboardSidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['cbom', 'pqc']);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-[240px] bg-brand-primary min-h-screen flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent-amber fill-accent-amber/20" />
          <span className="font-mono text-sm font-semibold text-accent-amber">AEGIS</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const isExpanded = expandedGroups.includes(item.id);

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  onItemClick(item.id);
                  if (item.sub) toggleGroup(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm ${
                  isActive
                    ? 'bg-white/10 text-accent-amber border-l-[3px] border-accent-amber'
                    : 'text-white/70 hover:bg-white/5 border-l-[3px] border-transparent'
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-accent-amber' : ''}`} />
                <span className="font-body">{item.label}</span>
              </button>

              {item.sub && isExpanded && (
                <div className="ml-10 mt-0.5 space-y-0.5">
                  {item.sub.map((sub) => (
                    <button
                      key={sub}
                      className="w-full text-left px-2 py-1.5 text-xs text-white/50 hover:text-white/80 font-body transition-colors"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
