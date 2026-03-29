import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Separator from "@/components/common/Seperator";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section>
        <div className="max-w-screen-xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 items-center gap-10">
            {/* Text */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Good food choices are good investment.
              </h1>

              <p className="mt-4 text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque,
                pariatur. Modi alias omnis sint sapiente ea ad blanditiis ipsum
                architecto.
              </p>

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/fooditem"
                  className="bg-brand text-white px-6 py-3 rounded-xl shadow hover:opacity-90"
                >
                  Order Now
                </Link>

                <Link
                  to="/specialitem"
                  className="border border-brand text-brand px-6 py-3 rounded-xl shadow hover:bg-brand hover:text-white"
                >
                  Order Our Special
                </Link>
              </div>
            </div>

            {/* Image */}
            <div>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                alt="Food"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <Footer />
    </>
  );
};

export default Home;
