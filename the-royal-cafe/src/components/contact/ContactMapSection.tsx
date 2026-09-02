// components/contact/ContactMapSection.tsx

import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/navigation";

const ContactMapSection = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold text-gray-900">Find us on the map</h2>

      <p className="mt-4 text-gray-600">
        Come visit us and enjoy the royal experience
      </p>

      <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=72.4700%2C23.0100%2C72.6500%2C23.1100&layer=mapnik&marker=23.0400%2C72.5600"
          className="w-full h-[400px]"
        />
      </div>

      <Link
        to={ROUTES.ITEMS}
        className="inline-block mt-6 bg-brand text-white px-6 py-3 rounded-[5px]"
      >
        Explore Menu
      </Link>
    </div>
  );
};

export default ContactMapSection;
