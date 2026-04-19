import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Separator from "@/components/common/Seperator";

import ContactHero from "@/components/contact/ContactHero";
import ContactInfoSection from "@/components/contact/ContactInfoSection";
import ContactFormSection from "@/components/contact/ContactFormSection";
import ContactMapSection from "@/components/contact/ContactMapSection";

const Contact = () => {
  return (
    <>
      <Navbar />

      <section className="py-10">
        <ContactHero
          title="We’d love to hear from you "
          description="Whether it’s a question, feedback, or just a hello."
          image="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
        />

        <ContactInfoSection />
      </section>

      <Separator />

      <section className="py-16">
        <ContactFormSection />
      </section>

      <Separator />

      <section className="py-16">
        <ContactMapSection />
      </section>

      <Separator />

      <Footer />
    </>
  );
};

export default Contact;
