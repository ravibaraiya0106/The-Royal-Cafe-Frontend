import { NavLink } from "react-router-dom";
import type { NavItemType } from "@/types/common";
import type { RefObject } from "react";

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
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0 z-40 bg-black/20"
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        ref={menuRef}
        className="md:hidden fixed left-0 top-16 z-50 w-full bg-white border-b border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto"
        aria-label="Mobile navigation"
      >
        <div className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, idx) => (
              <li key={`${item.label}-${idx}`}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-brand text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-brand"
                    }`
                  }
                  onClick={onNavigate}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileNav;

