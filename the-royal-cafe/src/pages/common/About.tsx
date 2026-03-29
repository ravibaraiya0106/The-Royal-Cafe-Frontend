import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";

const About = () => {
  return (
    <>
      <Navbar />

      <div className="mt-16">
        {/* ================= ABOUT SECTION ================= */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Image */}
              <div>
                <img
                  src="https://wallpapers.com/images/hd/food-4k-c2aqw4pepnjbu34p.jpg"
                  className="rounded-2xl shadow-lg w-full"
                  alt="Food"
                />
              </div>

              {/* Text */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  We pride ourselves on making real food from the best
                  ingredients.
                </h2>
                <p className="mt-4 text-gray-600">
                  At The Royal Cafe, we believe in quality over everything.
                  Every dish is crafted with fresh ingredients to bring you the
                  best taste and experience.
                </p>
              </div>
            </div>
          </div>

          {/* SECOND ROW */}
          <div className="max-w-screen-xl mx-auto px-4 mt-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Text */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  We make everything by hand with love & care.
                </h2>

                <p className="mt-4 text-gray-600">
                  Our chefs prepare everything fresh daily. From coffee to
                  desserts, we ensure every bite brings happiness and
                  satisfaction.
                </p>

                <ul className="mt-6 space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">
                    ✓ Fresh ingredients every day
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ Premium quality coffee beans
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ Hygienic and cozy environment
                  </li>
                </ul>
              </div>

              {/* Image */}
              <div>
                <img
                  src="https://images4.alphacoders.com/131/1311047.jpg"
                  className="rounded-2xl shadow-lg w-full"
                  alt="Cafe"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= STORY SECTION ================= */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              When your stomach is full, everything feels better ☕
            </h2>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              At The Royal Cafe, we don’t just serve food — we create
              experiences. Whether you're here for a quick coffee or a relaxing
              evening, we promise comfort, taste, and quality in every moment.
            </p>

            <Link
              to="/contact"
              className="inline-block mt-6 bg-brand text-white px-6 py-3 rounded-xl hover:opacity-90"
            >
              Visit Us
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;
