import { Link } from "react-router-dom";

type Blog = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <Link
      to={`/blog/${blog.id}`}
      className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
    >
      {/* Image */}
      <img
        className="object-cover w-full h-56 md:h-auto md:w-56"
        src={blog.image}
        alt={blog.title}
      />

      {/* Content */}
      <div className="flex flex-col justify-between p-5">
        <h5 className="mb-2 text-xl font-bold text-gray-800">{blog.title}</h5>

        <p className="mb-4 text-gray-600 text-sm">{blog.description}</p>

        <button className="inline-flex items-center w-fit bg-brand text-white px-4 py-2 rounded-lg text-sm hover:bg-brand/90 transition">
          Read more →
        </button>
      </div>
    </Link>
  );
};

export default BlogCard;
