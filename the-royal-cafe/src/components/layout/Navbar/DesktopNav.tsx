import { Link } from "react-router-dom";
import type { NavItemType } from "@/types/common";

const DesktopNav = ({
  navItems,
  onNavigate,
}: {
  navItems: NavItemType[];
  onNavigate: () => void;
}) => {
  return (
    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
      <ul className="font-medium flex flex-col p-0 border-0 rounded-xl bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse">
        {navItems.map((item, idx) => (
          <li key={`${item.label}-${idx}`}>
            <Link
              to={item.to}
              className={`block py-2 px-3 rounded-lg md:p-0 text-gray-700 hover:text-brand ${
                item.to === "/" ? "text-brand" : ""
              }`}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesktopNav;

