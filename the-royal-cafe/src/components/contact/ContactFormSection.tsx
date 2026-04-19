// components/contact/ContactFormSection.tsx

import { useState } from "react";
import { toastSuccess, toastError } from "@/utils/toast";
import { PrimaryButton } from "@/components/common/form/Button";

import InputField from "@/components/common/form/InputField";
import TextAreaField from "@/components/common/form/TextAreaField";
import { createContact } from "@/services/contactsService";

const ContactFormSection = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.includes("@")) newErrors.email = "Invalid email";

    if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Enter valid 10 digit number";

    if (!form.subject.trim()) newErrors.subject = "Subject is required";

    if (form.message.trim().length < 10)
      newErrors.message = "Minimum 10 characters required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      /* ================= FORM DATA ================= */
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("subject", form.subject);
      formData.append("message", form.message);

      /* ================= API CALL ================= */
      const message = await createContact(formData);

      toastSuccess(message || "Message sent successfully");

      /* ================= RESET ================= */
      setForm({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-gray-900">
        Send us a message
      </h2>

      <p className="text-gray-600 text-center mt-2">
        We’ll get back to you as soon as possible
      </p>

      <div className="mt-8 bg-white p-8 rounded-2xl shadow-md border space-y-4">
        {/* ROW */}
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="Your Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />

          <InputField
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />
        </div>

        <InputField
          label="Email Address"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <InputField
          label="Subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          error={errors.subject}
        />

        <TextAreaField
          label="Message"
          name="message"
          value={form.message}
          onChange={handleChange}
          error={errors.message}
          row={4}
        />

        <div className="pt-2">
          <PrimaryButton
            label="Send Message"
            loading={loading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactFormSection;
