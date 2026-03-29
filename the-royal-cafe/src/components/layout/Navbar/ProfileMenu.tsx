import type { Dispatch, RefObject, SetStateAction } from "react";
import { Link } from "react-router-dom";

type ProfileMenuProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  profileMenuId: string;
  profileButtonRef: RefObject<HTMLButtonElement | null>;
  profileMenuRef: RefObject<HTMLDivElement | null>;
};

const ProfileMenu = ({
  open,
  setOpen,
  profileMenuId,
  profileButtonRef,
  profileMenuRef,
}: ProfileMenuProps) => {
  return (
    <div className="relative">
      <button
        ref={profileButtonRef}
        type="button"
        className="flex text-sm bg-gray-50 rounded-full focus:ring-4 focus:ring-gray-200 border border-gray-200"
        aria-expanded={open}
        aria-controls={profileMenuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="w-8 h-8 rounded-full"
          src="https://i.pravatar.cc/40"
          alt="User profile"
        />
      </button>

      {open && (
        <div
          ref={profileMenuRef}
          id={profileMenuId}
          className="z-50 absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          role="menu"
          aria-label="User menu"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="block text-sm font-semibold text-gray-900">
              Joseph McFall
            </span>
            <span className="block text-xs text-gray-500 truncate">
              name@flowbite.com
            </span>
          </div>

          <ul className="p-2 text-sm text-gray-700 font-medium">
            <li>
              <Link
                to="/dashboard"
                role="menuitem"
                className="block w-full p-2 rounded-lg hover:bg-brand hover:text-white"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                role="menuitem"
                className="block w-full p-2 rounded-lg hover:bg-brand hover:text-white"
                onClick={() => setOpen(false)}
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="/earnings"
                role="menuitem"
                className="block w-full p-2 rounded-lg hover:bg-brand hover:text-white"
                onClick={() => setOpen(false)}
              >
                Earnings
              </Link>
            </li>
            <li>
              <button
                type="button"
                role="menuitem"
                className="block w-full text-left p-2 rounded-lg hover:bg-brand hover:text-white"
                onClick={() => setOpen(false)}
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;

