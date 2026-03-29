import logo from "@/assets/images/logo1.png";
import { QUICK_LINKS } from "@/constants/navigation";
import FooterLink from "./FooterLink";
import FooterSection from "./FooterSection";
import FooterSocialIcons from "./FooterSocialIcons";
import FooterContactItems from "./FooterContactItems";

const Footer = () => {
  return (
    <footer className="mt-10 bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 text-center sm:text-left">
          {/* Logo + Description */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
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
            <FooterSocialIcons />
          </div>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <ul className="mt-4 space-y-2 text-sm flex flex-col items-center sm:items-start">
              {QUICK_LINKS.map((item) => (
                <li key={item.to}>
                  <FooterLink {...item} />
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Contact */}
          <FooterSection title="Contact">
            <FooterContactItems />
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
