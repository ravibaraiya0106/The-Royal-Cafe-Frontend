import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const BRAND = "#6b0f0f";

type NavItem = {
  label: string;
  to: string;
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuId = useId();

  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Items", to: "/item" },
      { label: "Blog", to: "/blog" },
      { label: "Contact", to: "/contact" },
    ],
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

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
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
          {/* <span className="self-center text-xl font-semibold whitespace-nowrap text-[var(--brand, #6b0f0f)]">
            The Royal Cafe
          </span> */}
        </Link>

        {/* Right side */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* Profile button + dropdown */}
          <div className="relative">
            <button
              ref={profileButtonRef}
              type="button"
              className="flex text-sm bg-gray-50 rounded-full focus:ring-4 focus:ring-gray-200 border border-gray-200"
              aria-expanded={profileOpen}
              aria-controls={profileMenuId}
              onClick={() => setProfileOpen((v) => !v)}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="https://i.pravatar.cc/40"
                alt="User profile"
              />
            </button>

            {profileOpen && (
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
                      className="block w-full p-2 rounded-lg hover:bg-gray-100 hover:text-[#6b0f0f]"
                      onClick={() => setProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      role="menuitem"
                      className="block w-full p-2 rounded-lg hover:bg-gray-100 hover:text-[#6b0f0f]"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/earnings"
                      role="menuitem"
                      className="block w-full p-2 rounded-lg hover:bg-gray-100 hover:text-[#6b0f0f]"
                      onClick={() => setProfileOpen(false)}
                    >
                      Earnings
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full text-left p-2 rounded-lg hover:bg-gray-100 hover:text-[#6b0f0f]"
                      onClick={() => {
                        // TODO: wire to your real auth/logout handler.
                        setProfileOpen(false);
                      }}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 rounded-xl md:hidden hover:bg-gray-100 hover:text-[#6b0f0f] focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                stroke={BRAND}
                strokeLinecap="round"
                strokeWidth="2"
                d="M5 7h14M5 12h14M5 17h14"
              />
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div
          id="navbar-user"
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        >
          <ul className="font-medium flex flex-col p-0 border-0 rounded-xl bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse">
            {navItems.map((item, idx) => (
              <li key={`${item.label}-${idx}`}>
                <Link
                  to={item.to}
                  className="block py-2 px-3 rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 text-gray-700"
                  style={item.to === "/" ? { color: BRAND } : undefined}
                  onClick={() => {
                    setMenuOpen(false);
                    setProfileOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile menu */}
        {/* {menuOpen && (
          <div className="md:hidden w-full" aria-label="Mobile navigation">
            <ul className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-2">
              {navItems.map((item, idx) => (
                <li key={`${item.label}-${idx}`}>
                  <Link
                    to={item.to}
                    className="block py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                      setMenuOpen(false);
                      setProfileOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </nav>
  );
};

export default Navbar;
