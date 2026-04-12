import type { NavItemType } from "@/types/common";
import type { RefObject } from "react";
import { NavLink, useLocation } from "react-router-dom";

const MobileNav = ({
  open,
  navItems,
  onNavigate,
  menuRef,
}: {
  open: boolean;
  navItems: NavItemType[];
  onNavigate: () => void;
  menuRef: RefObject<HTMLDivElement | null>;
}) => {
  const { pathname } = useLocation();

  if (!open) return null;

  return (
    <>
      <div className="md:hidden fixed inset-0 z-40 bg-black/20" />

      <div
        ref={menuRef}
        className="md:hidden fixed left-0 top-16 z-50 w-full bg-white border-b border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto"
      >
        <div className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, idx) => {
              const isActive =
                item.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.to);

              return (
                <li key={`${item.label}-${idx}`}>
                  <NavLink
                    to={item.to}
                    onClick={onNavigate}
                    className={() =>
                      `block py-2 px-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-brand text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-brand"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
