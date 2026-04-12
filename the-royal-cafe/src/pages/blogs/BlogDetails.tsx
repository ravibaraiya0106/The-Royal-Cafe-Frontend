import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { getBlogById } from "@/services/blogsService";
import { PrimaryButton } from "@/components/common/form/Button";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";
import Badge from "@/components/common/badge/Badge";

type Blog = {
  _id: string;
  title: string;
  content: string;
  image?: string;
  author?: string;
  createdAt?: string;
};

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        if (!id) {
          setLoading(false);
          return;
        }

        const res = await getBlogById(id);
        setBlog(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  /* ================= IMAGE HANDLER ================= */
  const getImageUrl = (image?: string) => {
    if (!image) return "/default.jpg"; // fallback image

    if (image.startsWith("http")) return image;

    return `${import.meta.env.VITE_FILE_URL}${image}`;
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* BACK BUTTON */}
        <div className="mb-6">
          <PrimaryButton
            label="Back to Blogs"
            icon={<FiArrowLeft size={16} />}
            fullWidth={false}
            onClick={() => navigate(-1)}
          />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center text-gray-500">Loading blog...</div>
        ) : blog ? (
          <>
            {/* IMAGE */}
            <div className="w-full h-100 md:h-100 rounded-xl overflow-hidden mb-6 shadow-sm">
              <img
                src={getImageUrl(blog.image)}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {blog.title}
            </h1>

            {/* META */}
            <div className="text-sm text-gray-500 mb-6">
              <Badge
                label={
                  blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date unknown"
                }
                icon={<FiCalendar size={12} />}
                variant="primary"
              />
            </div>

            {/* CONTENT */}
            <div className="text-gray-700 leading-relaxed space-y-4 text-[15px]">
              {blog.content}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400">Blog not found</div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default BlogDetails;
