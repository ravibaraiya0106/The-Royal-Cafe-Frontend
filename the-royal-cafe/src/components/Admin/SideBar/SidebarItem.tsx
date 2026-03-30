import { Link, useLocation } from "react-router-dom";

type Props = {
  label: string;
  to: string;
  Icon: string | React.ComponentType<{ className?: string }>;
};

const SidebarItem = ({ label, to, Icon }: Props) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
        isActive
          ? "bg-brand text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100 hover:text-brand"
      }`}
    >
      <Icon className="text-lg" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export default SidebarItem;
