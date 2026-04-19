import type { Dispatch, RefObject, SetStateAction } from "react";
import { Link } from "react-router-dom";
import type { DropdownItem, UserInfo } from "@/types/common";

type ProfileMenuProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  profileMenuId: string;
  profileButtonRef: RefObject<HTMLButtonElement | null>;
  profileMenuRef: RefObject<HTMLDivElement | null>;
  user: UserInfo;
  items: DropdownItem[];
};

const ProfileMenu = ({
  open,
  setOpen,
  profileMenuId,
  profileButtonRef,
  profileMenuRef,
  user,
  items,
}: ProfileMenuProps) => {
  return (
    <div className="relative">
      {/* Button */}
      <button
        ref={profileButtonRef}
        type="button"
        className="flex text-sm bg-gray-50 rounded-full border border-gray-200"
        aria-expanded={open}
        aria-controls={profileMenuId}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-semibold">
          {user.initials}
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={profileMenuRef}
          id={profileMenuId}
          className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-[9999]"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Menu Items */}
          <ul className="p-2 text-sm">
            {items.map((item, index) => (
              <li key={index}>
                {item.to ? (
                  <Link
                    to={item.to}
                    className="block p-2 rounded hover:bg-brand hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-brand hover:text-white"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
