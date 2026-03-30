import { Link, useLocation } from "react-router-dom";
import Tooltip from "../../common/Tooltip";

type Props = {
  label: string;
  to: string;
  Icon: string | React.ComponentType<{ className?: string }>;
  collapsed: boolean;
};

const SidebarItem = ({ label, to, Icon, collapsed }: Props) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  const tooltipId = `tooltip-${label}`;

  return (
    <>
      <Link
        to={to}
        data-tooltip-id={collapsed ? tooltipId : undefined}
        data-tooltip-content={label}
        className={`flex items-center rounded-xl transition ${
          isActive
            ? "bg-brand text-white shadow-sm"
            : "text-gray-700 hover:bg-gray-100 hover:text-brand"
        } ${collapsed ? "justify-center px-2 py-2" : "gap-3 px-4 py-2"}`}
      >
        <Icon className="text-lg" />
        {!collapsed && <span className="text-sm font-medium">{label}</span>}
      </Link>

      {collapsed && <Tooltip id={tooltipId} content={label} place="right" />}
    </>
  );
};

export default SidebarItem;
