// components/contact/ContactInfoSection.tsx

import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

const ContactInfoSection = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 mt-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* TEXT */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Visit us or drop a message anytime
          </h2>

          <p className="mt-4 text-gray-600">
            You can reach us through phone, email, or visit our cafe.
          </p>

          {/* CONTACT LIST */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <FiMapPin className="text-[#6b0f0f] text-lg" />
              <span>Ahmedabad, Gujarat</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FiPhone className="text-[#6b0f0f] text-lg" />
              <span>+91 9876543210</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FiMail className="text-[#6b0f0f] text-lg" />
              <span>support@royalcafe.com</span>
            </div>
          </div>
        </div>

        {/* IMAGE */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24"
            className="rounded-2xl shadow-lg w-full object-cover h-[400px]"
            alt="Cafe"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
