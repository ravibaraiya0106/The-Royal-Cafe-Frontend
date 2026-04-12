import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import BlogCard from "@/components/blog/BlogCard";
import Filter from "@/components/Admin/common/Filter";
import Pagination from "@/components/Admin/common/Pagination";
import { blogList } from "@/services/blogsService";

type Blog = {
  _id: string;
  title: string;
  content: string;
  image?: string;
};

type FilterField = {
  key: string;
  label: string;
  type: "text";
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
    title: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  /* ================= FETCH BLOGS ================= */
  const fetchBlogs = useCallback(
    async (params = filters) => {
      try {
        setLoading(true);

        const res = await blogList(params);

        setBlogs(res.data || []);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          totalItems: res.total,
        });
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetchBlogs(filters);
  }, [fetchBlogs, filters]);

  /* ================= FILTER ================= */
  const handleFilterChange = (values: Record<string, unknown>) => {
    if (Object.keys(values).length === 0) {
      setFilters({
        page: 1,
        limit: 6,
        title: "",
      });
      return;
    }

    setFilters((prev) => ({
      ...prev,
      ...values,
      page: 1,
    }));
  };

  /* ================= PAGE CHANGE ================= */
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  /* ================= IMAGE ================= */
  const getImageUrl = (image?: string) => {
    if (!image) return "/default.jpg";
    if (image.startsWith("http")) return image;
    return `${import.meta.env.VITE_FILE_URL}${image}`;
  };

  /* ================= FILTER FIELDS ================= */
  const filterFields: FilterField[] = [
    { key: "title", label: "Search Blog", type: "text" },
  ];

  return (
    <>
      <Navbar />

      <div className="mt-10 mb-10 max-w-screen-xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-brand mb-6">
          Our Blogs
        </h1>

        {/* FILTER */}
        <Filter filters={filterFields} onChange={handleFilterChange} />

        {/* LOADING */}
        {loading && (
          <div className="text-center text-gray-500 mt-4">Loading blogs...</div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {!loading && blogs.length > 0
            ? blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={{
                    id: blog._id,
                    title: blog.title,
                    description:
                      blog.content.length > 120
                        ? blog.content.slice(0, 120) + "..."
                        : blog.content,
                    image: getImageUrl(blog.image),
                  }}
                />
              ))
            : !loading && (
                <div className="text-center col-span-2 text-gray-400">
                  No blogs found
                </div>
              )}
        </div>

        {/* PAGINATION */}
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          limit={filters.limit}
          onPageChange={handlePageChange}
        />
      </div>

      <Footer />
    </>
  );
};

export default Blogs;
