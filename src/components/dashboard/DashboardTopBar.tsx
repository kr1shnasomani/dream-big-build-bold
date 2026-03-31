import { Link } from 'react-router-dom';
import { Shield, Bell } from 'lucide-react';
import ExportDropdown from './ExportDropdown';

interface DashboardTopBarProps {
  hasScanned?: boolean;
}

const DashboardTopBar = ({ hasScanned = false }: DashboardTopBarProps) => {
  return (
    <header className="h-14 bg-surface border-b border-[hsl(var(--border-default))] flex items-center justify-between px-5 flex-shrink-0">
      {/* Left: Logo + breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-amber fill-accent-amber/20" />
          <span className="font-mono text-sm font-semibold text-brand-primary">AEGIS</span>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-body text-sm text-foreground font-medium">Dashboard</span>
      </div>

      {/* Right: Export + Notifications (only when relevant) */}
      <div className="flex items-center gap-2">
        {hasScanned && <ExportDropdown />}
        <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-sunken transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default DashboardTopBar;
