import { useEffect, useId, useMemo, useRef, useState } from "react";
import { NAV_ITEMS } from "@/constants/Navigation.ts";
import type { NavItemType } from "@/types/common";
import logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";
import type { RefObject } from "react";
import CartButton from "./CartButton.tsx";
import DesktopNav from "./DesktopNav.tsx";
import MobileNav from "./MobileNav.tsx";
import ProfileMenu from "./ProfileMenu.tsx";
import { useClickOutside } from "@/hooks/useClickOutside";
import { user, PROFILE_MENU_ITEMS } from "@/constants/ProfileMenu.ts";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuId = useId();
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navItems = useMemo<NavItemType[]>(
    () => NAV_ITEMS.map((i) => ({ label: i.label, to: i.to })),
    [],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!profileOpen) return;

      const target = event.target as Node | null;
      const buttonEl = profileButtonRef.current;
      const menuEl = profileMenuRef.current;

      if (!target) return;
      if (buttonEl?.contains(target)) return;
      if (menuEl?.contains(target)) return;

      setProfileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("touchstart", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onPointerDown);
    };
  }, [profileOpen]);

  useClickOutside(
    [
      menuButtonRef as RefObject<HTMLElement | null>,
      menuRef as RefObject<HTMLElement | null>,
    ],
    () => setMenuOpen(false),
  );

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 relative">
      {/* Keep fixed height so the `h-16` spacer in App.tsx always matches */}
      <div className="max-w-screen-xl mx-auto h-16 px-4 flex items-center justify-between flex-nowrap">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          onClick={() => {
            setMenuOpen(false);
            setProfileOpen(false);
          }}
        >
          <img
            src={logo}
            className="h-11 object-contain"
            alt="The Royal Cafe Logo"
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse flex-nowrap">
          <CartButton cartCount={3} />

          <ProfileMenu
            open={profileOpen}
            setOpen={setProfileOpen}
            profileMenuId={profileMenuId}
            profileButtonRef={profileButtonRef}
            profileMenuRef={profileMenuRef}
            user={user}
            items={PROFILE_MENU_ITEMS}
          />

          {/* Mobile menu toggle */}
          <button
            ref={menuButtonRef}
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 rounded-xl md:hidden hover:bg-gray-100 hover:text-brand focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-user"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                className="stroke-brand"
                strokeLinecap="round"
                strokeWidth="2"
                d="M5 7h14M5 12h14M5 17h14"
              />
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <DesktopNav
          navItems={navItems}
          onNavigate={() => {
            setMenuOpen(false);
            setProfileOpen(false);
          }}
        />

        {/* Mobile menu */}
        <MobileNav
          open={menuOpen}
          navItems={navItems}
          menuRef={menuRef}
          onNavigate={() => {
            setMenuOpen(false);
            setProfileOpen(false);
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
