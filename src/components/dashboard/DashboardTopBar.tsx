import { NotificationInboxPopover } from '@/components/ui/notification-inbox-popover';
import ExportDropdown from './ExportDropdown';

interface DashboardTopBarProps {
  hasScanned?: boolean;
}

const DashboardTopBar = ({ hasScanned = false }: DashboardTopBarProps) => {
  return (
    <header className="absolute top-3 right-4 z-30 flex items-center gap-2">
      {hasScanned && <ExportDropdown />}
      <NotificationInboxPopover />
    </header>
  );
};

export default DashboardTopBar;
