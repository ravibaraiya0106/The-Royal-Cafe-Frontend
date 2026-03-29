import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import BlogCard from "@/components/blog/BlogCard";

const blogs = [
  {
    id: 1,
    title: "The Secret Behind Perfect Coffee ☕",
    description:
      "Discover how we brew the perfect cup using premium beans and expert techniques.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
  },
  {
    id: 2,
    title: "Top 5 Cafe Snacks You Must Try 🍰",
    description:
      "From chocolate cake to sandwiches, explore our most loved cafe snacks.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
  },
  {
    id: 3,
    title: "Why Fresh Ingredients Matter 🥗",
    description:
      "We use only fresh ingredients to maintain taste, quality, and health.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f",
  },
];

const Blog = () => {
  return (
    <>
      <Navbar />

      <div className="mt-10 max-w-screen-xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-brand mb-10">
          Our Blog 📝
        </h1>

        {/* ✅ 2 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Blog;
