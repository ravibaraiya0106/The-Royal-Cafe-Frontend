import { Link } from "react-router-dom";
import logo from "../../assets/images/logo1.png";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhone,
  FaMailBulk,
  FaMapMarked,
} from "react-icons/fa";

/* ================= DATA ================= */

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Items", to: "/fooditem" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const socialLinks = [
  { label: "Facebook", icon: <FaFacebookF />, url: "https://facebook.com" },
  { label: "Instagram", icon: <FaInstagram />, url: "https://instagram.com" },
  { label: "Twitter", icon: <FaTwitter />, url: "https://twitter.com" },
];

/* ================= REUSABLE COMPONENTS ================= */

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="text-gray-600  hover:text-brand hover:font-semibold transition-all duration-200"
  >
    {label}
  </Link>
);

const SocialIcon = ({
  icon,
  label,
  url,
}: {
  icon: React.ReactNode;
  label: string;
  url: string;
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group h-10 w-10 rounded-full border border-brand/20 flex items-center justify-center hover:border-brand hover:bg-brand transition duration-200"
  >
    <span className="text-brand group-hover:text-white text-sm">{icon}</span>
  </a>
);

const FooterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-sm font-semibold text-brand uppercase tracking-wide">
      {title}
    </p>
    {children}
  </div>
);

/* ================= MAIN FOOTER ================= */

const Footer = () => {
  return (
    <footer className="mt-10 bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Logo + Description */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="The Royal Cafe Logo"
                className="h-11 w-11 object-contain"
              />
              <div>
                <p className="text-lg font-semibold text-brand">
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

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((item, i) => (
                <SocialIcon
                  key={i}
                  icon={item.icon}
                  label={item.label}
                  url={item.url}
                />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <ul className="mt-4 space-y-3 text-sm">
              {quickLinks.map((item, i) => (
                <li key={i}>
                  <FooterLink to={item.to} label={item.label} />
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Contact */}
          <FooterSection title="Contact">
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <FaMapMarked className="text-brand mt-1" />
                <span>123 Royal Street, Your City</span>
              </li>

              <li className="flex items-start gap-3">
                <FaPhone className="text-brand mt-1" />
                <span>(+00) 123 456 789</span>
              </li>

              <li className="flex items-start gap-3">
                <FaMailBulk className="text-brand mt-1" />
                <span>hello@theroyalcafe.com</span>
              </li>
            </ul>
          </FooterSection>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-200 pt-6 flex justify-center text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} The Royal Cafe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
