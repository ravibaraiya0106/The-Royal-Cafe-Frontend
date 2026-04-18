import { useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiMapPin,
} from "react-icons/fi";
import { PrimaryButton } from "@/components/common/form/Button";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // TODO: connect your API here
      console.log(form);

      alert("Message sent successfully ☕");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="mt-16 bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* LEFT - INFO */}
          <div className="bg-gradient-to-br from-[#6b0f0f] to-[#8b1a1a] text-white p-8 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4">Let’s Talk ☕</h1>

              <p className="text-sm opacity-90 mb-8">
                Have questions about your order or want to connect with us?
                We’re here to help you anytime.
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <FiMapPin />
                  <span>Ahmedabad, Gujarat</span>
                </div>

                <div className="flex items-center gap-3">
                  <FiPhone />
                  <span>+91 9876543210</span>
                </div>

                <div className="flex items-center gap-3">
                  <FiMail />
                  <span>support@royalcafe.com</span>
                </div>
              </div>
            </div>

            <p className="text-xs opacity-70 mt-10">
              We usually respond within 24 hours ⏳
            </p>
          </div>

          {/* RIGHT - FORM */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Send Message
            </h2>

            <div className="space-y-5">
              {/* NAME */}
              <div className="relative">
                <FiUser className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                />
              </div>

              {/* EMAIL */}
              <div className="relative">
                <FiMail className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                />
              </div>

              {/* PHONE */}
              <div className="relative">
                <FiPhone className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                />
              </div>

              {/* SUBJECT */}
              <input
                type="text"
                value={form.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                placeholder="Subject"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none"
              />

              {/* MESSAGE */}
              <div className="relative">
                <FiMessageCircle className="absolute top-3 left-3 text-gray-400" />
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Write your message..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                />
              </div>

              {/* BUTTON */}
              <PrimaryButton
                label="Send Message 🚀"
                loading={loading}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
