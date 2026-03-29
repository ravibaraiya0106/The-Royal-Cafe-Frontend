import { Link } from "react-router-dom";
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
                <Link
                  to={item.to}
                  className="block py-2 px-3 rounded-lg text-gray-800 hover:bg-brand hover:text-white"
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileNav;

