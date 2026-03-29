import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const BRAND = "#6b0f0f";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-10 bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="The Royal Cafe Logo"
                className="h-10 w-10 object-contain"
              />
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  The Royal Cafe
                </p>
                <p className="text-sm text-gray-500">
                  Fresh coffee. Royal flavor.
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-gray-600 leading-relaxed">
              We roast for flavor, brew for comfort, and serve every cup with
              care. Come by today and taste the difference.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-300 hover:shadow-sm"
                aria-label="Facebook"
              >
                <span style={{ color: BRAND, fontWeight: 800 }}>f</span>
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-300 hover:shadow-sm"
                aria-label="Instagram"
              >
                <span style={{ color: BRAND, fontWeight: 800 }}>⌁</span>
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-300 hover:shadow-sm"
                aria-label="X / Twitter"
              >
                <span style={{ color: BRAND, fontWeight: 800 }}>X</span>
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Quick Links
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/fooditem"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Items
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5" aria-hidden="true">
                  📍
                </span>
                <span>123 Royal Street, Your City</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" aria-hidden="true">
                  ☎
                </span>
                <span>(+00) 123 456 789</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" aria-hidden="true">
                  ✉
                </span>
                <span>hello@theroyalcafe.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-raw sm:flex-row items-center sm:items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} The Royal Cafe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
