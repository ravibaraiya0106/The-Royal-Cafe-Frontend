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
import { PROFILE_MENU_ITEMS } from "@/constants/ProfileMenu.ts";
import type { UserInfo } from "@/types/common";

import { PrimaryButton } from "@/components/common/form/Button.tsx";

// MODALS
import LoginModal from "@/components/auth/LoginModal.tsx";
import RegisterModal from "@/components/auth/RegisterModal.tsx";
import { getUser } from "@/utils/storage";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // AUTH MODAL STATE
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const profileMenuId = useId();
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const getInitialUser = (): UserInfo | null => {
    const storedUser = getUser();
    if (!storedUser) return null;

    const name = `${storedUser.first_name} ${storedUser.last_name}`;
    return {
      name,
      email: storedUser.email || "",
      avatar: storedUser.avatar || "",
      initials:
        `${storedUser.first_name[0]}${storedUser.last_name[0]}`.toUpperCase(),
    };
  };

  const [currentUser, setCurrentUser] = useState<UserInfo | null>(
    getInitialUser,
  );

  useEffect(() => {
    const updateUserInfo = () => setCurrentUser(getInitialUser());
    window.addEventListener("authChanged", updateUserInfo);
    return () => window.removeEventListener("authChanged", updateUserInfo);
  }, []);

  const navItems = useMemo<NavItemType[]>(
    () => NAV_ITEMS.map((i) => ({ label: i.label, to: i.to })),
    [],
  );

  /* ================= ESC + CLICK ================= */
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
    <>
      <nav className="bg-white fixed w-full z-[9999] top-0 start-0 border-b border-gray-200 relative">
        <div className="max-w-screen-xl mx-auto h-16 px-4 flex items-center justify-between flex-nowrap">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center space-x-3"
            onClick={() => {
              setMenuOpen(false);
              setProfileOpen(false);
            }}
          >
            <img src={logo} className="h-11 object-contain" />
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center md:order-2 space-x-3 flex-nowrap">
            <CartButton cartCount={3} />

            {!currentUser ? (
              <PrimaryButton label="Login" onClick={() => setLoginOpen(true)} />
            ) : (
              <ProfileMenu
                open={profileOpen}
                setOpen={setProfileOpen}
                profileMenuId={profileMenuId}
                profileButtonRef={profileButtonRef}
                profileMenuRef={profileMenuRef}
                user={currentUser}
                items={PROFILE_MENU_ITEMS}
              />
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 rounded-xl md:hidden hover:bg-gray-100 hover:text-brand"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  className="stroke-brand"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            </button>
          </div>

          {/* DESKTOP NAV */}
          <DesktopNav
            navItems={navItems}
            onNavigate={() => {
              setMenuOpen(false);
              setProfileOpen(false);
            }}
          />

          {/* MOBILE NAV */}
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

      {/* ================= MODALS ================= */}

      {/* LOGIN MODAL */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      {/* REGISTER MODAL */}
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;
